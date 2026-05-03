'use client';

/**
 * AlphaTabHost — pure mount point for the AlphaTab notation engine.
 *
 * # Why this file exists (Step 2 of the cockpit redesign)
 *
 * Lift-and-shift of the AlphaTab init `useEffect` from the original
 * `AlphaTabPlayer.tsx`. The host owns ONE responsibility: construct the
 * `AlphaTabApi`, wrap it in an `AccordionPlayer`, wire the lifecycle
 * (loop drag-to-set, visual highlight clear, `playerReady` → readiness
 * callback), load the inline alphaTex sample, and tear everything down
 * cleanly on unmount.
 *
 * No layout JSX. No header chrome. No transport controls. Just a single
 * ref'd `<div style={{ width: '100%', height: '100%' }}>` that AlphaTab
 * takes over and renders into. The parent gives this div real pixels via
 * its own flex/grid sizing — no viewport assumptions live here.
 *
 * # Boundary with the parent (callbacks)
 *
 *  1. `onWrapperReady(wrapper, api)` — fires SYNCHRONOUSLY inside the
 *     mount effect, immediately after `wrapper.instance = api` succeeds
 *     and before `api.tex(...)` is called. Parent uses this to capture
 *     refs (`apiRef.current = api; playerRef.current = wrapper`) so it
 *     can wire the video-backing-track + clear-loop UI against a live
 *     wrapper. Fires at most once per mount; cleared on unmount because
 *     the parent's refs get nulled when its own `readyForPlayback` flips
 *     back to false.
 *
 *  2. `onReadyForPlayback()` — fires ASYNCHRONOUSLY when AlphaTab's
 *     `playerReady` event lands (after the synth + soundfont finish
 *     loading). Wired through the wrapper's `readyForPlayback` callback
 *     slot, which `AccordionPlayer` synthesizes from `api.playerReady`.
 *     Parent flips a `readyForPlayback` state on receipt, which gates
 *     the mount of `<PlayerControls />` and `<VideoBackingTrack />`.
 *
 * # Callback identity stability
 *
 * Both callbacks are stored in refs (`onWrapperReadyRef`,
 * `onReadyForPlaybackRef`) and read off those refs from inside the
 * effect. This lets parent components pass inline arrow functions
 * without re-running the entire AlphaTab init effect — the effect
 * dependency array stays `[]`, the host mounts AlphaTab once per
 * lifecycle, and callback identity changes are absorbed silently.
 *
 * # What's NOT in this file (and why)
 *
 *  - Header / glow / page chrome → owned by the cockpit / lab page.
 *  - Transport controls → owned by `<PlayerControls />`, mounted by parent
 *    only after `onReadyForPlayback` fires.
 *  - Video pane → owned by `<VideoBackingTrack />`, mounted by parent
 *    only after `onReadyForPlayback` fires.
 *  - Outer card surface (`--brand-dark3`, border, padding, shadow) →
 *    owned by the parent. The host's div is bare so it can sit cleanly
 *    inside any pane the cockpit hands it.
 *
 * # See also
 *
 *  - Original implementation source: this file is a 1:1 lift of
 *    `AlphaTabPlayer.tsx`'s `useEffect` (lines ~169-378 in the pre-Step-2
 *    revision). See that file's header comment for the full rationale on
 *    Turbopack worker classification, `scriptFile` requirement,
 *    `useWorkers: false`, and `enableLazyLoading: false`.
 *  - `AccordionPlayer.ts` — buffered facade over `AlphaTabApi`.
 *  - `lib/player/themeResources.ts` — runtime palette → AlphaTab resources.
 *  - `lib/player/sample.alphatex.ts` — the inline notation source.
 */

import { useEffect, useRef } from 'react';
import {
    AlphaTabApi,
    LayoutMode,
    LogLevel,
    ScrollMode,
    StaveProfile,
} from '@coderline/alphatab';
import AccordionPlayer from './AccordionPlayer';
import { sampleAlphaTex } from '@/lib/player/sample.alphatex';
import { buildThemeResources } from '@/lib/player/themeResources';

interface AlphaTabHostProps {
    /**
     * Fires synchronously once `wrapper.instance = api` has completed,
     * before `api.tex(...)` is called. The parent should capture both
     * references here — they remain valid for the lifetime of this host
     * mount and are cleared by the host's own cleanup before unmount.
     */
    onWrapperReady?: (wrapper: AccordionPlayer, api: AlphaTabApi) => void;
    /**
     * Fires asynchronously when AlphaTab's `playerReady` event lands —
     * the synth + soundfont have loaded and playback would actually do
     * something. Parent typically uses this to flip a state that gates
     * the mount of transport / video components.
     */
    onReadyForPlayback?: () => void;
}

export default function AlphaTabHost({
    onWrapperReady,
    onReadyForPlayback,
}: AlphaTabHostProps) {
    // The DOM node AlphaTab renders into. Single ref'd <div>.
    const containerRef = useRef<HTMLDivElement | null>(null);
    // Local handle to the api so the cleanup in this effect can call
    // `api.destroy()`. NOT exposed externally — the parent gets its own
    // copy via `onWrapperReady` and is responsible for nulling its own
    // refs from its own cleanup. Storing a local copy avoids reading
    // through the parent's ref, which could already be cleared by React's
    // unmount ordering.
    const apiRef = useRef<AlphaTabApi | null>(null);
    const playerRef = useRef<AccordionPlayer | null>(null);

    // Stash callbacks behind refs so the effect deps can stay `[]`.
    // Parent components frequently pass inline arrow functions; without
    // this indirection, every parent re-render would tear down and
    // re-create the entire AlphaTab instance (workers, soundfont fetch,
    // notation render — multi-second cost). The refs are updated on
    // every render so the latest closures are always called.
    const onWrapperReadyRef = useRef(onWrapperReady);
    const onReadyForPlaybackRef = useRef(onReadyForPlayback);
    onWrapperReadyRef.current = onWrapperReady;
    onReadyForPlaybackRef.current = onReadyForPlayback;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        // StrictMode double-invokes the effect in dev; the guard makes the
        // second invocation a no-op so we don't end up with two AlphaTabApis.
        if (apiRef.current) return;

        // Wrapper is allocation-only — safe to construct before AlphaTab.
        const wrapper = playerRef.current ?? new AccordionPlayer();
        playerRef.current = wrapper;

        // Build the settings object. Use the JSON-shaped (`SettingsJson`)
        // form — AlphaTab's constructor accepts `SettingsJson | Settings`.
        const api = new AlphaTabApi(container, {
            core: {
                // Point AlphaTab at the classical UMD bundle we ship to
                // public/alphatab/. Required for the synth worker's classical
                // bootstrap to succeed under Turbopack — see the original
                // AlphaTabPlayer.tsx header comment "Synth-worker bootstrap
                // fix (Step 6.5)" for the full rationale. The Blob worker
                // AlphaTab spawns runs `importScripts(scriptFile)` as its
                // body; pointing at this UMD file makes that call succeed.
                //
                // The URL MUST be absolute. Blob workers are spawned from a
                // `blob:` URL with no document origin, so `importScripts`
                // can't resolve a path-relative URL — we prefix with
                // `window.location.origin`. Server-side render is guarded
                // by `'use client'` + `useEffect`, so `window` is always
                // available at this point.
                scriptFile: `${window.location.origin}/alphatab/alphaTab.min.js`,
                // `fontDirectory` MUST be set: auto-detect only works for
                // classic <script src> includes, not ESM imports.
                fontDirectory: '/alphatab/font/',
                logLevel: LogLevel.None,
                // Force synchronous in-thread rendering for the RENDER path.
                // Turbopack misclassifies AlphaTab's WebPlatform as
                // `Browser` (classical) instead of `BrowserModule` (ESM), so
                // the render path falls back to the same classical-worker
                // bootstrap as the synth (importScripts on a Blob worker).
                // Step 6.5 verified empirically that flipping to true with
                // `scriptFile` set works; we keep it false here to preserve
                // the known-good Step 5 render behavior.
                useWorkers: false,
                // Render the entire score eagerly into the DOM. AlphaTab's
                // default lazy-loading uses an IntersectionObserver per
                // placeholder; the observer is unreliable in headless test
                // browsers and during scroll-driven layouts.
                enableLazyLoading: false,
            },
            player: {
                enablePlayer: true,
                enableCursor: true,
                // OFF: in video-master mode the video clock drives position
                // via RVFC and we do NOT want AlphaTab's internal RAF
                // fighting it. Toggled back to true only on the tab-only
                // fallback path (no video present).
                enableAnimatedBeatCursor: false,
                scrollMode: ScrollMode.OffScreen,
                scrollSpeed: 300,
                soundFont: '/alphatab/sonivox.sf3',
            },
            display: {
                layoutMode: LayoutMode.Page,
                staveProfile: StaveProfile.Score, // notation only — NO tab
                scale: 1.0,
                // Psefitone palette → AlphaTab's six color knobs in
                // `RenderingResourcesJson`. Tokens are read live from the
                // CSS custom properties on `<html>` so a future palette
                // tweak in `globals.css` propagates automatically. Cursor
                // and selection colors live in `globals.css` (CSS classes,
                // not part of the resources API).
                resources: buildThemeResources(),
            },
        });

        apiRef.current = api;
        // Flush buffered settings + wire forwarded events.
        wrapper.instance = api;

        // Hand the live wrapper + api to the parent SYNCHRONOUSLY, before
        // we touch any other lifecycle slot. Parent uses this to capture
        // refs for video attach, clear-loop UI, etc. The parent's refs are
        // valid the moment this call returns.
        onWrapperReadyRef.current?.(wrapper, api);

        // ── Loop drag-to-set ─────────────────────────────────────────────
        // mousedown on beat A, mouseup on beat B → loop[min..max].
        //
        // Closure-scoped (per useEffect mount), not on the wrapper or
        // module: the buffer holds at most one beat between a press and
        // release, never crosses re-mounts, and `api.destroy()` cleans up
        // the AlphaTab event subscriptions automatically — no need to
        // manually `.off()` them.
        //
        // Type derivation: pull the parameter type of
        // `api.highlightPlaybackRange` so the buffered start beat is
        // structurally compatible with both the tick math we do AND the
        // visual-highlight call below. This resolves to `Beat`.
        //
        // `beatMouseUp` emits `Beat | null` — null means the user released
        // over empty space outside any beat. We treat that as "cancel
        // pending loop start" with no further action, matching the natural
        // drag UX (release outside the score = abort).
        let loopStartBeat: Parameters<
            typeof api.highlightPlaybackRange
        >[0] | null = null;

        api.beatMouseDown.on((beat) => {
            loopStartBeat = beat;
        });

        api.beatMouseUp.on((beat) => {
            const start = loopStartBeat;
            // Always clear the pending start, even on null release / abort.
            loopStartBeat = null;
            if (!start || !beat) return;

            const startTick = Math.min(
                start.absolutePlaybackStart,
                beat.absolutePlaybackStart,
            );
            const endTick = Math.max(
                start.absolutePlaybackStart + start.playbackDuration,
                beat.absolutePlaybackStart + beat.playbackDuration,
            );

            // Paint the visual loop range. AlphaTab separates the *audio*
            // loop (`api.playbackRange` + `isLooping`) from the *visible*
            // selection wash (`api.highlightPlaybackRange(...)`). The
            // latter writes blocks into AlphaTab's internal
            // `selectionWrapper` (the `.at-selection` div). Without this
            // call, the audio would loop but no wash would be drawn.
            //
            // Order: paint highlight first, then set the audio range.
            // Doing visual first ensures the user sees the range at the
            // same moment the toolbar's clear-loop button appears.
            api.highlightPlaybackRange(start, beat);

            // Order matters: set the range first, then enable looping.
            // The wrapper's `playbackRange` setter triggers AlphaTab's
            // `playbackRangeChanged` event. Setting the range first means
            // the consumer fires once with the new (non-null) range;
            // enabling loop afterward doesn't re-fire the event. Reversed
            // order would emit a transient "loop on, no range" state.
            wrapper.playbackRange = { startTick, endTick };
            wrapper.isLooping = true;
        });

        // When PlayerControls clears the loop (its Clear Loop button writes
        // `playbackRange = null` on the wrapper), AlphaTab's audio stops
        // looping — but the `.at-selection` wash remains painted because
        // `highlightPlaybackRange` and `playbackRange` are independent
        // surfaces. Subscribe directly to AlphaTab's own event (separate
        // from the wrapper's single-subscriber slot, which PlayerControls
        // owns) and clear the visual highlight in lockstep with the audio
        // range. Keeps the two surfaces synchronized without the wrapper
        // or PlayerControls needing to reach into the api.
        api.playbackRangeChanged.on((args) => {
            if (args.playbackRange === null) {
                api.clearPlaybackRangeHighlight();
            }
        });

        // Subscribe to readyForPlayback BEFORE calling tex() — the wrapper
        // synthesizes this callback from AlphaTab's single `playerReady`
        // event, which fires asynchronously after the synth + soundfont
        // finish loading. Forward the event to the parent so it can mount
        // <PlayerControls /> + <VideoBackingTrack />.
        wrapper.readyForPlayback = () => {
            onReadyForPlaybackRef.current?.();
        };

        // Render the inline alphaTex sample. No network call — pure string.
        api.tex(sampleAlphaTex);

        return () => {
            // Order matters: destroy the api first (releases workers, clears
            // its DOM, unsubscribes its internal listeners), then the wrapper
            // (drops references + clears the consumer-facing handler bag).
            api.destroy();
            apiRef.current = null;
            wrapper.destroy();
            playerRef.current = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
