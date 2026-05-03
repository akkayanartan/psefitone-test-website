'use client';

/**
 * AlphaTabPlayer — orchestrator for the `/lab/player` cockpit (pre-redesign shape).
 *
 * # What this file does (post-Step-2 of the cockpit redesign)
 *
 * Owns the page-level chrome: section header, atmospheric glow, the floating
 * card frame, the video sibling, and the transport-controls slot. All of
 * the AlphaTab init lifecycle (api construction, beat-event wiring, sample
 * load, teardown) lives in `<AlphaTabHost />` — this file consumes the host
 * via two callbacks:
 *
 *  1. `handleWrapperReady(wrapper, api)` — fires synchronously inside the
 *     host's mount effect. We capture both refs here so the rest of the
 *     player tree can target the live wrapper (video attach, clear-loop
 *     UI, future controls).
 *  2. `handleReadyForPlayback()` — fires asynchronously when the synth +
 *     soundfont finish loading. Flips `readyForPlayback` state, which
 *     mounts `<VideoBackingTrack />` and `<PlayerControls />`.
 *
 * # Why two refs persist at this layer
 *
 *  - `playerRef` is consumed by `<VideoBackingTrack player={playerRef.current} />`
 *    and `<PlayerControls player={playerRef.current} />` — both gate their
 *    mount on `readyForPlayback && playerRef.current` so the wrapper is
 *    guaranteed live before the children touch it.
 *  - `apiRef` is held for symmetry + future direct-api needs (loop UI
 *    extensions, debug overlays). Not currently dereffed in JSX, but kept
 *    populated so the cockpit redesign's Step 5+ work can reach the api
 *    without re-plumbing the host callback.
 *
 * Both refs are fully owned by this component — the host populates them via
 * `handleWrapperReady` and nulls them via the `readyForPlayback` flip on
 * unmount (the host's own cleanup tears down the api/wrapper, this layer
 * just stops referencing them).
 *
 * # Layout / chrome rationale
 *
 * Header / glow / outer card / video sibling JSX is **unchanged** from the
 * pre-Step-2 shape — Step 2 is a pure refactor and the cockpit redesign
 * (Steps 5–7) will replace this whole layout layer with PlayerCockpit +
 * pane components. Until then, the visual must look identical.
 *
 * The notation card surface (`--brand-dark3`, border, padding, layered
 * shadow) and the inner notation well (`--brand-dark2`, 4 px radius,
 * `60vh` min-height) stay in this file. The only structural change is
 * that the inner well's `<div ref={containerRef}>` is now
 * `<AlphaTabHost ... />` — same outer dimensions, AlphaTab still renders
 * into the same surface, just behind a component boundary that the
 * cockpit redesign will leverage.
 */

import { useRef, useState } from 'react';
import type { AlphaTabApi } from '@coderline/alphatab';
import AccordionPlayer from './AccordionPlayer';
import AlphaTabHost from './AlphaTabHost';
import PlayerControls from './PlayerControls';
import FpsMeter from './FpsMeter';
import VideoBackingTrack from './VideoBackingTrack';

export default function AlphaTabPlayer() {
    // The live AlphaTabApi instance. Populated by the host via
    // `handleWrapperReady`, nulled when `readyForPlayback` flips back to
    // false (the host's own cleanup destroys the api itself).
    const apiRef = useRef<AlphaTabApi | null>(null);
    // The buffered facade that decouples AlphaTab from React lifecycle.
    // Same population/null pattern as `apiRef`.
    const playerRef = useRef<AccordionPlayer | null>(null);

    // Drives whether <PlayerControls /> and <VideoBackingTrack /> mount.
    // Flipped true by `handleReadyForPlayback` when the host's wrapper
    // fires its `readyForPlayback` callback (which the wrapper synthesizes
    // from AlphaTab's `playerReady` event).
    //
    // We delay mounting the children (rather than just disabling them)
    // for two reasons:
    //  1. Each child needs a non-null wrapper. Mounting them only after
    //     ready guarantees `playerRef.current` is set, sidestepping React
    //     19 StrictMode's double-invoke window where the ref could
    //     transiently be null between cleanup and re-mount.
    //  2. The children own the wrapper's `positionChanged` and
    //     `stateChanged` event slots (single-subscriber). Mounting them
    //     only after the wrapper is wired to the api means there's never
    //     a moment where events fire into an unmounted listener.
    const [readyForPlayback, setReadyForPlayback] = useState(false);

    /**
     * Fires synchronously inside the AlphaTabHost mount effect, right
     * after `wrapper.instance = api` succeeds. Capture both refs so the
     * children can target the live wrapper as soon as their mount gate
     * (`readyForPlayback`) flips. The host owns destruction; we just
     * forget the references when the host tells us readiness has reset.
     */
    const handleWrapperReady = (
        wrapper: AccordionPlayer,
        api: AlphaTabApi,
    ) => {
        playerRef.current = wrapper;
        apiRef.current = api;
    };

    /**
     * Fires asynchronously when the host's wrapper reports
     * `readyForPlayback` (which it synthesizes from AlphaTab's single
     * `playerReady` event after synth + soundfont finish loading).
     * Flipping this state mounts the video + controls children.
     *
     * The host's own cleanup destroys the api/wrapper on unmount; this
     * effect's only job during teardown (handled in the cleanup below)
     * is to drop the refs and reset the readiness flag so a re-mount
     * starts from a clean state.
     */
    const handleReadyForPlayback = () => {
        setReadyForPlayback(true);
    };

    // Note: refs are nulled implicitly on unmount because React drops the
    // entire component instance. The host's cleanup runs FIRST (children
    // unmount before parents), so by the time this layer is torn down,
    // `apiRef.current` and `playerRef.current` already point to objects
    // whose `destroy()` has been called. No explicit cleanup effect is
    // needed at this layer — the host owns the lifecycle.

    return (
        <div
            style={{
                position: 'relative',
                minHeight: '100vh',
                padding: 'var(--section-pad-v) var(--section-pad-h)',
                background: 'var(--brand-dark)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {/* Atmospheric glow — soft violet wash, low alpha, decorative only.
                Mirrors the LoadingCard background so the transition from
                fallback → mounted player feels continuous. */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(ellipse 60% 40% at 50% 18%, rgba(134,41,255,0.12), transparent 70%)',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 'var(--max-width)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                {/* Section header — gold tag + Playfair display title.
                    Same anatomy as the marketing sections (psefitone-design
                    skill: section-tag + section-title + lavender italic). */}
                <header style={{ textAlign: 'center' }}>
                    <span
                        style={{
                            display: 'inline-block',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: 'var(--brand-accent)',
                            marginBottom: '1rem',
                        }}
                    >
                        PSEFITONE LAB
                    </span>
                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                            fontWeight: 500,
                            lineHeight: 1.22,
                            letterSpacing: '-0.015em',
                            color: '#fff',
                            margin: 0,
                        }}
                    >
                        <em
                            style={{
                                fontStyle: 'italic',
                                color: 'var(--brand-primary)',
                            }}
                        >
                            Oynatıcı
                        </em>{' '}
                        Önizleme
                    </h1>
                </header>

                {/* Video backing track (Step 9).

                    Mounted as a sibling above the notation card so the visual
                    flow reads top-down: video master → notation slave →
                    transport. Same `--brand-dark3` floating-surface frame as
                    the notation card so the two stack as a single composition,
                    not as two unrelated panels.

                    The component handles BOTH the with-video and missing-file
                    paths internally — when `public/sample-lesson.mp4` is
                    absent or unplayable, it renders the Psefitone-themed
                    empty card and never calls `attachVideo()`, leaving the
                    AlphaTab player in tab-only mode.

                    We gate on `readyForPlayback && playerRef.current` to
                    match the same gate `PlayerControls` uses — both depend
                    on a live wrapper, and mounting them simultaneously
                    avoids an intermediate frame where the video is wired
                    but the controls aren't (or vice versa). */}
                {readyForPlayback && playerRef.current && (
                    <VideoBackingTrack player={playerRef.current} />
                )}

                {/* Notation shell.
                    Outer card = Level-2 surface (`--brand-dark3`) — the
                    floating frame, with whisper-thin border and a
                    color-tinted layered shadow per the design skill's
                    shadow system. The inner notation surface is recessed
                    onto Level-1 (`--brand-dark2`), which reads as an inset
                    display panel within the card frame — a "well" pattern
                    that gives the score its own visible surface boundary
                    without competing with the floating card. Both
                    surfaces are darker than the page-void background, so
                    the elevation hierarchy still reads correctly.
                    AlphaTab itself injects no background color (verified
                    in `alphaTab.core.mjs` — its surface element is
                    transparent), so the dark2 fill below shows through
                    every rendered SVG.
                    `min-height` is required because AlphaTab needs a
                    sized container or the page-layout pass collapses to
                    height: 0 before the renderer can lay anything out. */}
                <div
                    style={{
                        position: 'relative',
                        background: 'var(--brand-dark3)',
                        border: '1px solid var(--brand-border)',
                        borderRadius: '4px',
                        padding: '1.5rem',
                        boxShadow:
                            '0 4px 20px rgba(134, 41, 255, 0.12), 0 1px 6px rgba(0, 0, 0, 0.35)',
                    }}
                >
                    {/* Notation well — Level-1 surface (`--brand-dark2`),
                        a touch lighter than the page void, a touch darker
                        than the card. The score reads as an inset display.
                        AlphaTabHost's inner ref'd <div> fills this well at
                        100% × 100% — the well's `minHeight: 60vh` is what
                        actually gives AlphaTab pixels to render into. */}
                    <div
                        style={{
                            minHeight: '60vh',
                            width: '100%',
                            background: 'var(--brand-dark2)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <AlphaTabHost
                            onWrapperReady={handleWrapperReady}
                            onReadyForPlayback={handleReadyForPlayback}
                        />
                    </div>

                    {/*
                        Transport controls — mount only after the underlying
                        AlphaTabApi is ready for playback. This guarantees
                        `playerRef.current` is non-null when PlayerControls
                        runs its effect, and it sidesteps the React 19
                        StrictMode double-invoke ref-clearing window. The
                        small UI flash (notation paints, toolbar appears
                        ~100-300 ms later as the synth finishes loading)
                        is acceptable; the LoadingCard fallback covers the
                        longer pre-mount wait.
                    */}
                    {readyForPlayback && playerRef.current && (
                        <PlayerControls
                            player={playerRef.current}
                            isReadyForPlayback={readyForPlayback}
                        />
                    )}
                </div>
            </div>

            {/*
                Step 8 — debug FPS overlay. Conditional on the `?fps`
                querystring; renders null otherwise (zero DOM cost). Mounted
                outside the notation card so it always pins to the viewport
                corner regardless of scroll, and so its absolute positioning
                doesn't interfere with the card's relative layout.

                FpsMeter does not need access to the AlphaTabApi or wrapper —
                it measures the main thread directly via rAF and the browser
                long-task observer. It's purely visual.
            */}
            <FpsMeter />
        </div>
    );
}
