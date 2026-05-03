// Step 10 — 60-fps verification harness for /lab/player.
// Runs both Run A (video-master) and Run B (tab-only) in headless Chromium with the tab
// emulated as visible+focused so rAF/setInterval are NOT throttled.
//
// Usage:
//   node scripts/perf-step10.mjs          # both runs
//   node scripts/perf-step10.mjs A        # run A only
//   node scripts/perf-step10.mjs B        # run B only

import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(projectRoot, '..');
const samplePath = path.join(projectRoot, 'public', 'sample-lesson.mp4');
const samplePathBackup = path.join(projectRoot, 'public', 'sample-lesson.mp4.bak');

const chromePath = 'C:/Users/psefi/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe';

const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}/lab/player?fps`;

const which = (process.argv[2] || 'AB').toUpperCase();

async function runProtocol(label) {
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--autoplay-policy=no-user-gesture-required',
            '--mute-audio',
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Force focus + visibility
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
        Object.defineProperty(document, 'hasFocus', { configurable: true, value: () => true });
    });

    const ua = await browser.userAgent();
    console.log(`[${label}] launching ${URL} (UA=${ua})`);

    // Capture console
    const consoleLogs = [];
    page.on('console', (msg) => {
        const text = msg.text();
        if (text.includes('[longtask]')) {
            consoleLogs.push({ type: msg.type(), text, t: Date.now() });
        }
    });

    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for player ready
    await page.waitForFunction(
        () => {
            const playBtn = document.querySelector('.psef-controls__playbtn');
            const meter = document.querySelector('[aria-hidden="true"][style*="position: fixed"]');
            return !!playBtn && !playBtn.disabled && !!meter;
        },
        { timeout: 30000 },
    );

    // Locate AlphaTab + wrapper via fiber walk
    const beats = await page.evaluate(() => {
        const found = { api: null, wrapper: null };
        const seen = new WeakSet();
        function check(v) {
            if (!v || typeof v !== 'object' || seen.has(v)) return;
            try { seen.add(v); } catch (e) { return; }
            if (typeof v.tex === 'function' && v.beatMouseDown && v.settings) found.api = v;
            if (typeof v.attachVideo === 'function') found.wrapper = v;
        }
        function walk(fiber, depth) {
            if (!fiber || depth > 250 || (found.api && found.wrapper)) return;
            if (fiber.memoizedState && typeof fiber.memoizedState === 'object') {
                let h = fiber.memoizedState; let i = 0;
                while (h && i < 20) {
                    const ms = h.memoizedState;
                    if (ms && typeof ms === 'object' && !Array.isArray(ms)) {
                        try { if ('current' in ms) check(ms.current); } catch (e) {}
                    }
                    h = h.next; i++;
                }
            }
            if (fiber.child) walk(fiber.child, depth + 1);
            if (fiber.sibling) walk(fiber.sibling, depth + 1);
        }
        for (const d of document.querySelectorAll('div')) {
            const fk = Object.keys(d).find((k) => k.startsWith('__reactFiber'));
            if (fk) { walk(d[fk], 0); if (found.api && found.wrapper) break; }
        }
        window.__atApi = found.api;
        window.__atWrapper = found.wrapper;
        let b1 = null, b2 = null;
        if (found.api && found.api._score) {
            const tracks = found.api._score.tracks;
            if (tracks && tracks[0] && tracks[0].staves && tracks[0].staves[0]) {
                const bars = tracks[0].staves[0].bars;
                if (bars && bars[0] && bars[0].voices && bars[0].voices[0]) b1 = bars[0].voices[0].beats[0];
                if (bars && bars[1] && bars[1].voices && bars[1].voices[0]) b2 = bars[1].voices[0].beats[0];
            }
        }
        window.__beat1 = b1;
        window.__beat2 = b2;
        return {
            apiFound: !!found.api,
            wrapperFound: !!found.wrapper,
            hasBeat1: !!b1,
            hasBeat2: !!b2,
            videoPresent: !!document.querySelector('video'),
        };
    });

    console.log(`[${label}] state probe:`, beats);

    // Run the 12.5s protocol inside the page
    const result = await page.evaluate(async (label) => {
        return new Promise((resolve) => {
            const v = document.querySelector('video');
            const api = window.__atApi;
            const wrap = window.__atWrapper;

            // Reset
            if (v) { try { v.pause(); v.currentTime = 0; v.playbackRate = 1.0; } catch (e) {} }
            if (wrap) { try { wrap.isLooping = false; wrap.playbackRange = null; } catch (e) {} }
            try { api.clearPlaybackRangeHighlight(); } catch (e) {}

            const t0 = performance.now();
            const samples = [];
            const longtasks = [];
            const markers = [];
            const mark = (lbl) => markers.push({ tRel: (performance.now() - t0) / 1000, label: lbl });
            mark('idle-start');

            // FPS counter via rAF
            let frames = 0;
            let lastFpsT = t0;
            let liveFps = null;
            let done = false;
            function fpsTick(now) {
                frames++;
                if (now - lastFpsT >= 500) {
                    liveFps = (frames * 1000) / (now - lastFpsT);
                    frames = 0;
                    lastFpsT = now;
                }
                if (!done) requestAnimationFrame(fpsTick);
            }
            requestAnimationFrame(fpsTick);

            // Long-task observer
            try {
                const obs = new PerformanceObserver((list) => {
                    for (const e of list.getEntries()) {
                        longtasks.push({
                            tRel: (e.startTime - t0) / 1000,
                            duration: e.duration,
                            name: e.name,
                        });
                    }
                });
                obs.observe({ entryTypes: ['longtask'] });
            } catch (e) {}

            // Sampler ~250ms
            let lastSampleT = t0;
            function sampler(now) {
                if (now - lastSampleT >= 250) {
                    lastSampleT = now;
                    const meter = document.querySelector('[aria-hidden="true"][style*="position: fixed"]');
                    const text = meter ? meter.innerText : '';
                    const m = text.match(/FPS\s+(\d+\.\d+|\d+|—)\s*LongTasks\s+(\d+)\s*RVFC\s+(\w+)/);
                    samples.push({
                        tRel: (now - t0) / 1000,
                        liveFps,
                        meterFps: m && m[1] !== '—' ? parseFloat(m[1]) : null,
                        meterLongTasks: m ? parseInt(m[2]) : null,
                        meterRvfc: m ? m[3] : null,
                        videoTime: v ? v.currentTime : null,
                        videoPaused: v ? v.paused : null,
                        videoRate: v ? v.playbackRate : null,
                    });
                }
                if (!done) requestAnimationFrame(sampler);
            }
            requestAnimationFrame(sampler);

            // Phases
            const phases = label === 'A' ? [
                { at: 2000, fn: () => { mark('t=2: play'); v.play().catch(() => {}); } },
                { at: 6000, fn: () => { mark('t=6: scrub'); v.currentTime = 5; } },
                { at: 8000, fn: () => { mark('t=8: rate=0.5'); v.playbackRate = 0.5; } },
                { at: 8500, fn: () => { mark('t=8.5: rate=2.0'); v.playbackRate = 2.0; } },
                { at: 10500, fn: () => {
                    mark('t=10.5: loop-set');
                    const b1 = window.__beat1, b2 = window.__beat2;
                    if (b1 && b2 && wrap) {
                        const startTick = Math.min(b1.absolutePlaybackStart, b2.absolutePlaybackStart);
                        const endTick = Math.max(b1.absolutePlaybackStart + b1.playbackDuration, b2.absolutePlaybackStart + b2.playbackDuration);
                        try { api.highlightPlaybackRange(b1, b2); } catch (e) {}
                        wrap.playbackRange = { startTick, endTick };
                        wrap.isLooping = true;
                    }
                    if (v) v.currentTime = 0.5;
                } },
                { at: 12500, fn: () => { mark('t=12.5: pause'); v && v.pause(); done = true; resolve({ samples, longtasks, markers }); } },
            ] : [
                // Run B — tab-only, no video. Use api.play()/pause()/tickPosition.
                { at: 2000, fn: () => { mark('t=2: play'); try { api.play(); } catch (e) { mark('play-err:' + e.message); } } },
                { at: 6000, fn: () => {
                    mark('t=6: scrub');
                    try {
                        // Mid-song scrub via tickPosition
                        const endTick = api.tickCache ? api.tickCache.endTick : 7680;
                        api.tickPosition = Math.floor(endTick / 2);
                    } catch (e) { mark('scrub-err:' + e.message); }
                } },
                { at: 8000, fn: () => { mark('t=8: rate=0.5'); try { api.playbackSpeed = 0.5; } catch (e) {} } },
                { at: 8500, fn: () => { mark('t=8.5: rate=2.0'); try { api.playbackSpeed = 2.0; } catch (e) {} } },
                { at: 10500, fn: () => {
                    mark('t=10.5: loop-set');
                    const b1 = window.__beat1, b2 = window.__beat2;
                    if (b1 && b2 && wrap) {
                        const startTick = Math.min(b1.absolutePlaybackStart, b2.absolutePlaybackStart);
                        const endTick = Math.max(b1.absolutePlaybackStart + b1.playbackDuration, b2.absolutePlaybackStart + b2.playbackDuration);
                        try { api.highlightPlaybackRange(b1, b2); } catch (e) {}
                        wrap.playbackRange = { startTick, endTick };
                        wrap.isLooping = true;
                    }
                } },
                { at: 12500, fn: () => { mark('t=12.5: pause'); try { api.pause(); } catch (e) {} done = true; resolve({ samples, longtasks, markers }); } },
            ];
            let nextIdx = 0;
            function scheduler(now) {
                const elapsed = now - t0;
                while (nextIdx < phases.length && elapsed >= phases[nextIdx].at) {
                    try { phases[nextIdx].fn(); } catch (e) { mark('phase-err:' + e.message); }
                    nextIdx++;
                }
                if (nextIdx < phases.length && !done) requestAnimationFrame(scheduler);
            }
            requestAnimationFrame(scheduler);
        });
    }, label);

    // Take a screenshot of the FpsMeter overlay during steady play if possible (pre-stop)
    let screenshotPath = null;
    try {
        const meterHandle = await page.$('[aria-hidden="true"][style*="position: fixed"]');
        if (meterHandle) {
            screenshotPath = path.join(repoRoot, 'docs', 'superpowers', 'specs', `player-preview-perf-step10-${label}-overlay.jpg`);
            await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
            await meterHandle.screenshot({ path: screenshotPath, type: 'jpeg', quality: 85 });
        }
    } catch (e) {
        screenshotPath = null;
    }

    await browser.close();
    return { ...result, consoleLogs, ua, screenshotPath };
}

async function ensureMp4Present() {
    try {
        await fs.access(samplePath);
    } catch (e) {
        // Restore from backup if exists
        try {
            await fs.access(samplePathBackup);
            await fs.copyFile(samplePathBackup, samplePath);
        } catch {}
    }
}

async function removeMp4() {
    try {
        await fs.access(samplePath);
        // Move to backup
        await fs.copyFile(samplePath, samplePathBackup);
        await fs.unlink(samplePath);
    } catch (e) {}
}

async function restoreMp4() {
    try {
        await fs.access(samplePathBackup);
        await fs.copyFile(samplePathBackup, samplePath);
    } catch {}
}

const allResults = {};

if (which.includes('A')) {
    await ensureMp4Present();
    console.log('=== RUN A: video-master path ===');
    allResults.A = await runProtocol('A');
    console.log(`[A] samples=${allResults.A.samples.length} longtasks=${allResults.A.longtasks.length} markers=${allResults.A.markers.length}`);
}

if (which.includes('B')) {
    console.log('=== RUN B: tab-only path (removing MP4) ===');
    await removeMp4();
    allResults.B = await runProtocol('B');
    console.log(`[B] samples=${allResults.B.samples.length} longtasks=${allResults.B.longtasks.length} markers=${allResults.B.markers.length}`);
}

// Write raw json artifacts
const outDir = path.join(repoRoot, 'docs', 'superpowers', 'specs');
await fs.mkdir(outDir, { recursive: true });
const jsonOut = path.join(outDir, 'player-preview-perf-step10-raw.json');
await fs.writeFile(jsonOut, JSON.stringify(allResults, null, 2));
console.log('Raw artifacts:', jsonOut);

// Restore MP4 to absent at the end? Plan says "Restore public/sample-lesson.mp4 to absent at the end (default per the project)."
// But Run A needs it present. We'll leave it absent at the very end of the run.
if (which.includes('B')) {
    // already absent
} else {
    await removeMp4();
}
// Clean up backup
try { await fs.unlink(samplePathBackup); } catch {}
