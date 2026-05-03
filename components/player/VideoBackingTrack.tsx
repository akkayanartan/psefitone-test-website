'use client';

/**
 * VideoBackingTrack — the `<video>` master clock for the AlphaTab player (Step 9).
 *
 * # What this file does
 *
 * Renders a `<video>` element that, when present, becomes the **master clock**
 * for the AlphaTab notation engine. AlphaTab's internal synth is bypassed; the
 * video provides audio. A `requestVideoFrameCallback` (RVFC) loop runs once per
 * video frame and pushes `video.currentTime` into AlphaTab via
 * `api.player.output.updatePosition(timeMs)`, which moves the cursor in lockstep
 * with the video — without forcing any React re-render.
 *
 * If `public/sample-lesson.mp4` is missing (or fails to decode), this component
 * renders a Psefitone-themed empty card *in place of* the `<video>`, does NOT
 * call `attachVideo()`, and the AlphaTab player stays in tab-only mode (its own
 * synth + animated cursor).
 *
 * The component is intentionally minimal — no scrub bar, no fullscreen, no
 * source picker, no offset/trim UI. The plan calls those out as v2 polish that
 * GuitarBear-referencing later passes will redo. We only build the surface
 * that proves the sync architecture works.
 *
 * # Architecture (per plan §"Video-master sync (the 60-fps risk surface)")
 *
 *   <video> element  ─────────────────►  video.currentTime = master truth
 *          │
 *          │ requestVideoFrameCallback — fires once per video frame, in
 *          │ sync with the compositor (cannot drift from what's painted)
 *          ▼
 *   syncFrame() {
 *     tabMs = (video.currentTime - trimStart) / effectiveDuration * tabDurationMs
 *     api.player.output.updatePosition(tabMs)   // pure DOM/SVG poke, no setState
 *     window.dispatchEvent(new CustomEvent('psefitone:rvfc-tick'))  // FpsMeter hook
 *     video.requestVideoFrameCallback(syncFrame)  // re-arm
 *   }
 *
 * Mirrored events go video → AlphaTab:
 *   play       → api.play()
 *   pause      → api.pause()
 *   seeked     → one immediate syncFrame() call so the cursor snaps
 *   ratechange → api.playbackSpeed = video.playbackRate
 *
 * AlphaTab is purely the slave — every transport surface a user touches must
 * eventually round-trip through the <video> for both surfaces to stay aligned.
 *
 * # Why RVFC (not rAF)
 *
 * `requestAnimationFrame` fires once per *display* frame. `requestVideoFrameCallback`
 * fires once per *video* frame, with metadata about the exact composited frame.
 * For sync this matters: rAF can fire before the next video frame is
 * composited, producing visible lag. RVFC guarantees we read `video.currentTime`
 * after the frame the user is actually seeing has been painted. On Chrome/Edge,
 * Safari ≥15.4, Firefox 122+ — supported. On older Safari it doesn't exist;
 * we fall back to `setInterval(syncFrame, 16)` which is what the spec calls out
 * (plan §6 / GuitarBear PSEFITONE-PLAYER-PLAN.md §8).
 *
 * # Empty-state philosophy
 *
 * The default state is "no MP4 in `public/`". The empty card has to look
 * intentional, not stubby — a developer dropping into the preview cold should
 * understand immediately what's missing and how to fix it. Surface-elevation
 * Level-2 (`--brand-dark3`) with a whisper border, gold section-tag header,
 * Playfair display title with a lavender-italic key phrase, an inline `<code>`
 * showing the exact path the file goes at, and a muted captions line that
 * confirms tab-only mode is live (not broken). No buttons, no CTAs — this is a
 * status read, not an action.
 *
 * # Lifecycle ordering (subtle but matters)
 *
 *  1. Mount: build a `BackingTrackHandler` proxy bound to the <video>. Wait
 *     for `loadedmetadata` (so `video.duration` is real). Once metadata fires:
 *     `player.attachVideo(handler)` + `player.setAnimatedCursor(false)` +
 *     `player.setVideoSpeedSetter((v) => video.playbackRate = v)`. Begin RVFC
 *     loop.
 *  2. Unmount / file-error: cancel RVFC, clear video listeners, clear the
 *     speed setter slot, restore animated cursor, `player.detachVideo()`.
 *
 * `player.attachVideo()` writes through to `output.handler` AND remembers
 * the handler in the wrapper, so even if the api hadn't been ready at mount
 * time, the handler installs as soon as it is — no extra glue here.
 */

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type AccordionPlayer from './AccordionPlayer';
import type { BackingTrackHandler } from '@/lib/player/types';

/**
 * `requestVideoFrameCallback` is in the lib.dom type surface for the TS
 * version this project uses (`HTMLVideoElement.requestVideoFrameCallback`
 * + `VideoFrameCallback`). We probe at runtime via `typeof === 'function'`
 * before calling, since older Safari (≤15.3) lacks it.
 */

export type VideoBackingTrackProps = {
    /** The wrapper. May be null transiently (HMR / pre-mount); we no-op. */
    player: AccordionPlayer | null;
    /** Source URL for the video. Defaults to /sample-lesson.mp4 served from
     *  `public/`. Plumbed as a prop so a future lesson route can pass a per-
     *  lesson URL with no surgery here. */
    src?: string;
    /** Trim hooks plumbed for the future lesson API. Default 0 / unset means
     *  "use the whole video". When the lesson API ships, the lesson record
     *  will pass real values and the math below picks them up automatically. */
    videoTrimStart?: number;
    videoTrimEnd?: number;
    videoOffset?: number;
    originalBpm?: number;
    /** Whether playback is currently playing — drives the play-overlay
     *  fade. Visible while paused, fades out while playing. */
    playing: boolean;
    /** Click on the video surface toggles playback. PlayerCockpit owns
     *  the click → playPause() flow. */
    onSurfaceClick: () => void;
    /** Mirrored from VideoPane so PlayerCockpit can hand the live
     *  HTMLVideoElement to TransportProgressBar / SyncEditor without
     *  threading refs back through the cockpit body. */
    frameRef: React.RefObject<HTMLDivElement | null>;
    videoElRef?: React.RefObject<HTMLVideoElement | null>;
};

const DEFAULT_SRC = '/sample-lesson.mp4';
/** Fallback sync interval for browsers without RVFC (Safari ≤15.3). 16 ms ≈
 *  60 Hz which is the same target rate as RVFC on a 60 Hz display. */
const FALLBACK_SYNC_INTERVAL_MS = 16;

export default function VideoBackingTrack({
    player,
    src = DEFAULT_SRC,
    videoTrimStart = 0,
    videoTrimEnd,
    videoOffset = 0,
    originalBpm = 0,
    playing,
    onSurfaceClick,
    frameRef,
    videoElRef,
}: VideoBackingTrackProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    /** True the moment the video element fires `error` with a code that
     *  indicates the file is missing or unplayable. Drives the empty-state
     *  fork of the render. We render the <video> first (so the browser can
     *  attempt the fetch and report success/failure) and only swap in the
     *  empty card after the failure is observed. This means a transient
     *  network blip on a real file shows the card briefly and then
     *  disappears — acceptable, and matches the natural browser semantics. */
    const [missing, setMissing] = useState(false);
    /** Variant-swap currentTime preservation. When the `<video>` is
     *  replaced (variant change), cleanup runs FIRST and stashes the
     *  previous currentTime here; the new video's `loadedmetadata`
     *  consumes and clears it so the user keeps their place. */
    const pendingSeekRef = useRef<number | null>(null);

    // Keep the future-hook props in refs so the RVFC loop reads them without
    // re-binding the effect on every prop change. (For the v1 preview these
    // are constant, but the seam is here.)
    const trimStartRef = useRef(videoTrimStart);
    const trimEndRef = useRef<number | undefined>(videoTrimEnd);
    const offsetRef = useRef(videoOffset);
    const bpmRef = useRef(originalBpm);
    useEffect(() => {
        trimStartRef.current = videoTrimStart;
        trimEndRef.current = videoTrimEnd;
        offsetRef.current = videoOffset;
        bpmRef.current = originalBpm;
    }, [videoTrimStart, videoTrimEnd, videoOffset, originalBpm]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !player || missing) return;

        // The handler proxy. AlphaTab's `IExternalMediaHandler` interface
        // (alphaTab.d.ts line 9419) is a six-method surface AlphaTab calls
        // when it needs to control the external media. We bind every call to
        // the live <video> element. Reads come from `video` directly (not
        // cached), so any external mutation to the video is reflected.
        const handler: BackingTrackHandler = {
            // Total media duration in ms. AlphaTab uses this to compute its
            // own internal end-of-track. NaN before metadata loads — guarded
            // below by waiting for `loadedmetadata` before attach.
            get backingTrackDuration() {
                const trimEnd = trimEndRef.current ?? video.duration;
                const dur = (trimEnd - trimStartRef.current) * 1000;
                return Number.isFinite(dur) && dur > 0 ? dur : 0;
            },
            // Mirror the video's playbackRate (read both ways).
            get playbackRate() {
                return video.playbackRate;
            },
            set playbackRate(v: number) {
                video.playbackRate = v;
            },
            // Mirror the video's volume.
            get masterVolume() {
                return video.volume;
            },
            set masterVolume(v: number) {
                video.volume = Math.max(0, Math.min(1, v));
            },
            // AlphaTab seeks → translate from "song ms" back to absolute
            // video seconds, write currentTime, the `seeked` event triggers
            // an immediate syncFrame() to repaint the cursor.
            seekTo(timeMs: number) {
                const t = trimStartRef.current + timeMs / 1000;
                if (Number.isFinite(t)) video.currentTime = t;
            },
            play() {
                void video.play();
            },
            pause() {
                video.pause();
            },
        };

        // ── Sync loop ───────────────────────────────────────────────────
        // The math: video time → AlphaTab time. With trimStart=0 and trimEnd
        // unset the formula simplifies to a 1:1 ms mapping (just *1000).
        // The trim seams are wired here so the future lesson API can pass
        // per-lesson trims with zero further changes in this file.
        let rvfcId = 0;
        let intervalId: ReturnType<typeof setInterval> | null = null;
        const syncFrame = () => {
            // Bail if the api went away mid-frame (HMR window).
            if (!player.instance) return;
            const trimStart = trimStartRef.current;
            const offset = offsetRef.current;
            const tabMs = (video.currentTime - trimStart + offset) * 1000;
            // Push position into AlphaTab. This is a pure DOM/SVG cursor
            // mutation inside the api — no React state, no re-render.
            player.updateExternalPosition(tabMs);
            // Tell the FpsMeter we ticked. The meter reads this from a ref
            // and only re-renders once per second — adding listeners here
            // does not perturb the 60-fps measurement.
            window.dispatchEvent(new CustomEvent('psefitone:rvfc-tick'));
        };

        const rvfcLoop: VideoFrameRequestCallback = () => {
            syncFrame();
            if (typeof video.requestVideoFrameCallback === 'function') {
                rvfcId = video.requestVideoFrameCallback(rvfcLoop);
            }
        };

        // Start the loop. Prefer RVFC; fall back to setInterval for older
        // Safari. The fallback won't be frame-locked so the cursor can drift
        // by up to one frame, but the architecture still works.
        const startSync = () => {
            if (typeof video.requestVideoFrameCallback === 'function') {
                rvfcId = video.requestVideoFrameCallback(rvfcLoop);
            } else {
                intervalId = setInterval(syncFrame, FALLBACK_SYNC_INTERVAL_MS);
            }
        };

        // Wait for metadata before attaching — `video.duration` is NaN
        // until `loadedmetadata` fires, and a NaN backingTrackDuration on
        // the handler will trip AlphaTab's slave-mode bookkeeping.
        let attached = false;
        const attach = () => {
            if (attached) return;
            attached = true;
            player.attachVideo(handler);
            player.setAnimatedCursor(false); // video drives cursor, not RAF
            player.setVideoSpeedSetter((v: number) => {
                video.playbackRate = v;
            });
            startSync();
        };

        // Mirror video → AlphaTab events.
        const onPlay = () => {
            player.instance?.play();
        };
        const onPause = () => {
            player.instance?.pause();
        };
        const onSeeked = () => {
            // Snap cursor to the new time immediately rather than waiting
            // for the next RVFC fire (which can be up to ~16 ms away).
            syncFrame();
        };
        const onRateChange = () => {
            // Mirror rate into AlphaTab. Skip the wrapper's branching
            // setter — that would fire BACK into the video and loop.
            const api = player.instance;
            if (api) api.playbackSpeed = video.playbackRate;
        };
        const onLoadedMetadata = () => {
            // Stamp the natural aspect ratio onto the frame so the wrapper
            // collapses to the video's intrinsic shape (no letterbox bands).
            if (frameRef.current && video.videoWidth && video.videoHeight) {
                frameRef.current.style.setProperty(
                    '--video-ratio',
                    `${video.videoWidth} / ${video.videoHeight}`,
                );
            }
            // Restore any currentTime stashed during a prior cleanup
            // (variant swap). Clamped to the new video's duration.
            if (pendingSeekRef.current != null) {
                const dur = Number.isFinite(video.duration) ? video.duration : 0;
                const target = Math.max(
                    0,
                    Math.min(pendingSeekRef.current, dur),
                );
                video.currentTime = target;
                pendingSeekRef.current = null;
            }
            attach();
        };
        const onError = () => {
            // MEDIA_ERR_SRC_NOT_SUPPORTED (4) covers the most common cases
            // (file missing, wrong container, decode fail). We treat any
            // error as "not playable" → empty state. Less surface area than
            // trying to interpret each code, and the empty card's copy is
            // accurate either way ("drop a video at...").
            // Slice 3 review fix: drop any stashed pending seek — it must
            // not carry into a future remount on a different (working) src.
            pendingSeekRef.current = null;
            setMissing(true);
        };

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('seeked', onSeeked);
        video.addEventListener('ratechange', onRateChange);
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', onError);

        // Mirror the live <video> into the cockpit-owned ref so
        // TransportProgressBar / SyncEditor can read currentTime / duration
        // without threading a ref back through every level.
        if (videoElRef) videoElRef.current = video;

        // If metadata is already loaded by the time this effect runs (cached
        // file, HMR remount), `loadedmetadata` won't re-fire. Detect that
        // and attach immediately.
        if (video.readyState >= 1 /* HAVE_METADATA */) {
            attach();
        }

        return () => {
            // Cancel the sync loop first so it can't fire into a torn-down
            // wrapper while the rest of the cleanup runs.
            if (
                rvfcId &&
                typeof video.cancelVideoFrameCallback === 'function'
            ) {
                video.cancelVideoFrameCallback(rvfcId);
            }
            if (intervalId !== null) {
                clearInterval(intervalId);
            }

            // Detach AlphaTab from slave mode. Order matters:
            //  1. Clear the video-speed-setter slot so future PlayerControls
            //     writes go directly to AlphaTab again.
            //  2. detachVideo() restores `output.handler = undefined`.
            //  3. Re-enable the animated beat cursor — AlphaTab's RAF takes
            //     over again now that no external clock is driving position.
            if (attached) {
                player.setVideoSpeedSetter(null);
                player.detachVideo();
                player.setAnimatedCursor(true);
            }

            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('seeked', onSeeked);
            video.removeEventListener('ratechange', onRateChange);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);

            // Capture currentTime from the same `video` node the listeners
            // were bound to — not from `videoRef.current`, which a future
            // refactor could swap mid-effect. A variant swap fires this
            // cleanup, then a fresh effect with the new src restores the
            // user's place once new metadata loads.
            pendingSeekRef.current = video.currentTime;
            // Only clear if it still points at OUR video — guards against
            // racing with a later effect that already mirrored a new element.
            if (videoElRef && videoElRef.current === video) {
                videoElRef.current = null;
            }
        };
    }, [player, missing, src, frameRef, videoElRef]);

    if (missing) {
        return <EmptyState src={src} />;
    }

    return (
        <button
            type="button"
            className="player-pane__video-surface"
            onClick={onSurfaceClick}
            aria-label={playing ? 'Duraklat' : 'Oynat'}
            aria-pressed={playing}
        >
            <video
                ref={videoRef}
                src={src}
                preload="metadata"
                playsInline
                // `decoding="async"` is a hint to the browser to pick the
                // lowest-overhead decode pipeline — keeps the main thread
                // free for the cursor + UI re-renders. AlphaTab's notation
                // worker is off-thread, but anything we can shave from the
                // video pipeline helps the 60-fps gate (Step 10).
                style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                }}
            >
                <track kind="captions" />
            </video>
            <span
                className="player-pane__play-overlay"
                aria-hidden="true"
                data-playing={playing ? 'true' : 'false'}
            >
                <Play size={48} />
            </span>
        </button>
    );
}

/**
 * EmptyState — the default visible result when `public/sample-lesson.mp4` is
 * absent or unplayable. Designed per the psefitone-design skill: Level-2
 * surface with whisper border + color-tinted layered shadow, gold section-tag
 * header, Playfair display title with lavender italic key phrase, muted
 * caption confirming the fallback mode is active. No interactive elements —
 * this is a status read.
 */
function EmptyState({ src }: { src: string }) {
    return (
        <div
            role="status"
            aria-live="polite"
            style={{
                position: 'relative',
                width: '100%',
                padding: '2rem 1.75rem',
                background: 'var(--brand-dark3)',
                border: '1px solid var(--brand-border)',
                borderRadius: '4px',
                boxShadow:
                    '0 4px 20px rgba(134, 41, 255, 0.12), 0 1px 6px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                overflow: 'hidden',
            }}
        >
            {/* Atmospheric glow — mirrors the page-level vignette so the
                empty card feels like part of the same composition, not a
                stubby placeholder bolted on. Pointer-events none, decorative. */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(134,41,255,0.10), transparent 60%)',
                }}
            />

            <div style={{ position: 'relative' }}>
                <span
                    style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--brand-accent)',
                        marginBottom: '0.55rem',
                    }}
                >
                    Video Backing Track
                </span>
                <h2
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
                        fontWeight: 500,
                        lineHeight: 1.28,
                        letterSpacing: '-0.015em',
                        color: 'var(--brand-text)',
                        margin: 0,
                    }}
                >
                    <em
                        style={{
                            fontStyle: 'italic',
                            color: 'var(--brand-primary)',
                        }}
                    >
                        Tab-only
                    </em>{' '}
                    mode active
                </h2>
            </div>

            <p
                style={{
                    position: 'relative',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: 'var(--brand-muted)',
                    margin: 0,
                    maxWidth: '52ch',
                }}
            >
                Drop a video at{' '}
                <code
                    style={{
                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                        fontSize: '0.78rem',
                        padding: '0.12rem 0.4rem',
                        borderRadius: '3px',
                        background: 'var(--brand-dark2)',
                        border: '1px solid var(--brand-border)',
                        color: 'var(--brand-text)',
                    }}
                >
                    public{src}
                </code>{' '}
                to enable video-master sync. Until then, AlphaTab plays through its own
                synth and drives the cursor on its internal RAF.
            </p>
        </div>
    );
}
