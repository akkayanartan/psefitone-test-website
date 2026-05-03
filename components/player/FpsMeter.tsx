'use client';

/**
 * FpsMeter — debug overlay for the AlphaTab player (Step 8).
 *
 * # What this file does
 *
 * Renders a small fixed-corner overlay that shows three live debug metrics
 * while the player runs:
 *
 *   FPS:        rolling 1-second frame rate computed from `requestAnimationFrame`
 *   LongTasks:  count of `PerformanceObserver` entries with `duration > 50ms`
 *   RVFC:       literal "pending" — wired in Step 9 by `VideoBackingTrack`
 *
 * Mounted only when the URL contains the `?fps` querystring. Without the flag
 * the component renders `null` — zero DOM cost, zero rAF / observer cost.
 *
 * # Why two independent measurement streams
 *
 *  1. **rAF tick → rolling-1s FPS.** `requestAnimationFrame` fires once per
 *     compositor frame on the main thread. Counting how many fire in a 1-second
 *     window gives the actual frame rate the user sees, including jank from
 *     long tasks that delay the next paint. We accumulate `frames++` every tick
 *     and only call `setFps` when the 1-second window closes — so React
 *     re-renders the readout exactly once per second, not 60×/sec.
 *
 *  2. **PerformanceObserver({ entryTypes: ['longtask'] }).** Browser-native
 *     observer for tasks that block the main thread for >50ms (the W3C Long
 *     Tasks API threshold). Each long task is a frame budget violation and a
 *     direct cause of dropped frames. We `console.warn` each one with its
 *     duration so the developer can attribute it in DevTools, AND increment a
 *     counter shown in the overlay for at-a-glance "did anything jank?"
 *
 *     `longtask` is not supported on every browser — Safari notably lacks it
 *     in older versions. The `observer.observe(...)` call is wrapped in
 *     try/catch and degrades silently to "0 long tasks ever" rather than
 *     throwing.
 *
 * # The 60-fps gate this component is the harness for
 *
 * Plan §60-fps-strategy demands median ≥58 fps and zero long-tasks >50ms
 * during steady-state play. This overlay IS the in-browser readout for both
 * gates. Step 10 escalates to DevTools Performance recordings; Step 8 is
 * just the always-on visual indicator.
 *
 * # Why ?fps gating, not a build flag
 *
 * Same code path in dev and prod. Adding `?fps` to any preview URL flips it
 * on. Removing the flag flips it off — no rebuild. No cookie. No global
 * state. The overlay is a developer tool, not a feature; it should be
 * trivially toggleable from the address bar.
 *
 * # Why a fixed top-right overlay
 *
 * `PlayerControls` mounts at the BOTTOM of the notation card (toolbar pinned
 * under the score). Fixed top-right keeps the meter clear of that surface
 * while still being visible without scrolling. The overlay is a tiny, low-
 * opacity card with backdrop blur — readable on any background, impossible
 * to mistake for a real UI affordance.
 *
 * # Style language (psefitone-design skill compliance)
 *
 * - Surface: Level-2 (`--brand-dark3`) at 70% alpha, with `backdrop-filter:
 *   blur(8px)` so the page colour underneath bleeds through softly. Matches
 *   the "floating surface" tier from the design system.
 * - Border: `--brand-border` (whisper-thin lavender at 15% alpha).
 * - Type: `var(--font-body)` (Montserrat) for the labels, `tabular-nums`
 *   for the FPS number so it doesn't shift width when the digit count
 *   changes (e.g., 60 → 9 mid-jank).
 * - Color hierarchy: section-tag (gold) for the "FPS METER" header,
 *   `--brand-text` for the live values, `--brand-muted` for the labels.
 * - No hover / focus / active states — the overlay is purely informational
 *   and not interactive (no click target).
 * - Animation: none. Steady, calm readout. The whole point is to NOT add
 *   any frame-cost theatre to the very thing we're measuring.
 *
 * # State throttling
 *
 * The rAF tick increments a closure counter every frame (cheap — one number).
 * `setFps` is called at most once per second (when the rolling window closes).
 * `setLongTasks` is called only when the PerformanceObserver fires, which is
 * by definition rare. So the FPS readout itself contributes effectively zero
 * to the metric it measures — Heisenberg-safe.
 */

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function FpsMeter() {
    // `useSearchParams` returns a `URLSearchParams`-shaped object. `.has('fps')`
    // is true for both `?fps` (no value) and `?fps=1` (any value) — the flag
    // is presence-only. Returns `null` during the initial server snapshot of
    // a Suspense boundary; we treat null as "flag absent" and bail.
    //
    // This component is rendered inside `AlphaTabPlayer`, which is itself
    // dynamically imported with `ssr: false` from a `'use client'` island —
    // so by the time this code runs, we're definitively client-side and
    // `useSearchParams` works without any extra Suspense wrapper.
    const searchParams = useSearchParams();
    const enabled = searchParams?.has('fps') ?? false;

    // Live readouts. Both update at low frequency:
    //   fps:       once per second (rAF rolling window)
    //   longTasks: only when the observer fires (rare by definition)
    const [fps, setFps] = useState<number | null>(null);
    const [longTasks, setLongTasks] = useState<number>(0);

    // RVFC status tri-state: "pending" before the first tick is ever observed,
    // "firing" while ticks are arriving (last seen <500 ms ago), "idle" if the
    // sync loop has gone quiet (e.g. video paused / unmounted). Pushed once
    // per second from inside the rAF tick — never from the per-frame event
    // itself — so the meter can't measurably perturb the very thing it's
    // measuring.
    const [rvfcStatus, setRvfcStatus] = useState<
        'pending' | 'firing' | 'idle'
    >('pending');
    /** Wall-clock timestamp of the most recent `psefitone:rvfc-tick` we saw,
     *  written in the event handler, read once per second from the rAF loop.
     *  Number(0) means "never ticked yet". */
    const lastRvfcTickAtRef = useRef<number>(0);

    useEffect(() => {
        // No-op when the flag isn't set — the early `return null` below also
        // handles this, but we guard the effect explicitly so we don't even
        // schedule a rAF / start an observer when the meter is off.
        if (!enabled) return;

        // ── rAF tick → rolling-1s FPS ────────────────────────────────────
        let rafId = 0;
        let frames = 0;
        let last = performance.now();

        const tick = (now: number) => {
            frames++;
            const elapsed = now - last;
            if (elapsed >= 1000) {
                // Compute fps over the elapsed window — using `elapsed`
                // rather than the literal 1000 keeps the math correct even
                // if the browser delayed the tick past the 1s mark (which
                // happens during heavy jank — exactly the case we want to
                // measure accurately).
                setFps((frames * 1000) / elapsed);

                // RVFC staleness check. Read the ref written by the event
                // handler below. 500 ms is ~30 missed video frames at 60 fps —
                // a generous threshold that doesn't flicker between firing /
                // idle when the page tab is briefly throttled. The state
                // setter only flips when the bucket changes, so React doesn't
                // re-render on every 1 Hz tick.
                const lastRvfc = lastRvfcTickAtRef.current;
                let nextStatus: 'pending' | 'firing' | 'idle';
                if (lastRvfc === 0) {
                    nextStatus = 'pending';
                } else if (now - lastRvfc < 500) {
                    nextStatus = 'firing';
                } else {
                    nextStatus = 'idle';
                }
                setRvfcStatus((prev) =>
                    prev === nextStatus ? prev : nextStatus,
                );

                frames = 0;
                last = now;
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        // ── RVFC tick listener ───────────────────────────────────────────
        // VideoBackingTrack dispatches `psefitone:rvfc-tick` on `window` from
        // inside its requestVideoFrameCallback (see Step 9). We do NOT call
        // `setState` here — that would render at the video's frame rate
        // (60 Hz), defeating the whole point. Instead we just stamp a ref
        // with the current performance.now() and let the 1 Hz rAF tick above
        // derive the firing / idle bucket from it.
        const onRvfcTick = () => {
            lastRvfcTickAtRef.current = performance.now();
        };
        window.addEventListener('psefitone:rvfc-tick', onRvfcTick);

        // ── PerformanceObserver → long-task counter + console warning ────
        // We use a ref-style local accumulator (closure variable) because
        // multiple observer entries can arrive in a single batch; updating
        // state from each individual entry would cause N re-renders for an
        // N-entry batch. Instead we compute the new total once per batch.
        let observer: PerformanceObserver | null = null;
        try {
            observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                let added = 0;
                for (const entry of entries) {
                    if (entry.duration > 50) {
                        added++;
                        // Attribution-friendly warning. Fixed-precision so
                        // the message is greppable in the console transcript.
                        // eslint-disable-next-line no-console
                        console.warn(
                            `[longtask] ${entry.duration.toFixed(1)}ms`,
                            entry,
                        );
                    }
                }
                if (added > 0) {
                    setLongTasks((prev) => prev + added);
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch {
            // `longtask` is not supported on every browser — Safari notably
            // lacks it in older versions. Degrade silently: the counter just
            // stays at 0 forever, FPS still works.
            observer = null;
        }

        return () => {
            cancelAnimationFrame(rafId);
            if (observer) observer.disconnect();
            window.removeEventListener('psefitone:rvfc-tick', onRvfcTick);
        };
    }, [enabled]);

    // Render nothing when the flag isn't set — zero DOM cost.
    if (!enabled) return null;

    return (
        <div
            // `aria-hidden` because this is a developer-only debug overlay,
            // not user-facing UI. We don't want screen readers announcing
            // "FPS 60 LongTasks 0" on the lesson page.
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 9000,
                // Level-2 surface at 70% alpha → soft floating chip on top
                // of any backdrop. backdrop-blur softens the underlying
                // notation so the meter is always readable.
                background: 'rgba(35, 27, 53, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid var(--brand-border)',
                borderRadius: '4px',
                padding: '0.6rem 0.85rem',
                minWidth: '140px',
                fontFamily:
                    'var(--font-body), ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '0.72rem',
                lineHeight: 1.5,
                color: 'var(--brand-text)',
                // Subtle layered shadow per design system — color-tinted +
                // grounding pair, kept low so it doesn't dominate.
                boxShadow:
                    '0 4px 16px rgba(134, 41, 255, 0.18), 0 1px 4px rgba(0, 0, 0, 0.4)',
                // No transitions — the overlay is informational, not
                // interactive. Avoids any animation cost on the very thing
                // we're measuring.
                pointerEvents: 'none',
                userSelect: 'none',
            }}
        >
            {/* Header — section-tag pattern (ALL-CAPS, gold, tight tracking).
                Marks the chip as a developer tool, distinct from any
                in-product label. */}
            <div
                style={{
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--brand-accent)',
                    fontSize: '0.62rem',
                    marginBottom: '0.35rem',
                }}
            >
                FPS METER
            </div>

            {/* FPS row — tabular-nums on the value so 60 → 9 jank doesn't
                shift the layout width. Show one decimal of precision; the
                rolling-1s window already smooths sub-second noise. */}
            <Row label="FPS">
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {fps === null ? '—' : fps.toFixed(1)}
                </span>
            </Row>

            <Row label="LongTasks">
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {longTasks}
                </span>
            </Row>

            {/* RVFC row — live status of the video-master sync loop.
                "pending"  → no tick observed yet (no <video> attached, or
                              attached but not playing through a frame yet).
                "firing"   → ticks arriving (last <500 ms ago). Green for
                              quick-glance health.
                "idle"     → ticks have stopped (paused / unmounted / video
                              ended). The sync loop is alive on the page but
                              not currently advancing.
                Color cue uses brand tokens — gold for firing (warm "active"
                color, mirrors the section-tag), muted lavender for the two
                inactive states. */}
            <Row label="RVFC">
                <span
                    style={{
                        color:
                            rvfcStatus === 'firing'
                                ? 'var(--brand-accent)'
                                : 'var(--brand-muted)',
                    }}
                >
                    {rvfcStatus}
                </span>
            </Row>
        </div>
    );
}

/**
 * Small layout helper for the three label/value rows. Consistent two-column
 * grid with the value right-aligned for readable scanning.
 */
function Row({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '0.75rem',
            }}
        >
            <span style={{ color: 'var(--brand-muted)' }}>{label}</span>
            <span>{children}</span>
        </div>
    );
}
