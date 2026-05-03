'use client';

/**
 * PlayerCockpit — orchestrator for the Psefitone Player Cockpit (Step 5).
 *
 * # What this component does
 *
 * Replaces `AlphaTabPlayer.tsx` as the top-level player surface. Owns the
 * splitter layout state (`usePlayerLayout`), composes the two pane wrappers
 * (`<VideoPane>` + `<NotationPane>`) inside a `<SplitPane>`, and renders the
 * unified bottom toolbar (`<ControlBar>`).
 *
 * The cockpit is **embeddable**: it sizes itself to its parent, with a default
 * `aspect-ratio: 16/9` and `min-height: 480px`. Parents that want explicit
 * height control can opt in via `data-fit="parent"` (Step 7+ usage).
 *
 * # State ownership
 *
 *  - `playerRef` (`AccordionPlayer | null`) and `apiRef` (`AlphaTabApi | null`)
 *    are populated synchronously by `<NotationPane>`'s `<AlphaTabHost>` mount
 *    via `onWrapperReady`. Children read off these refs only after the
 *    `readyForPlayback` flag flips true.
 *  - `readyForPlayback: boolean` — flipped true asynchronously when AlphaTab
 *    finishes loading the synth + soundfont. Gates the mount of `<VideoPane>`
 *    (which needs to call `attachVideo` on a live wrapper) AND `<ControlBar>`
 *    (which subscribes to wrapper events).
 *  - Layout state (`mode | splitPct | collapsed`) lives in the
 *    `usePlayerLayout` hook with localStorage persistence at the prefix passed
 *    via `storageKey`.
 *
 * # Why two refs persist at this layer
 *
 * Same rationale as the pre-Step-5 `AlphaTabPlayer.tsx`: child mounts are
 * gated on `readyForPlayback && playerRef.current` so the wrapper is
 * guaranteed live before any child touches it. The host's own cleanup
 * destroys the api/wrapper on unmount; we only forget the references.
 *
 * # Layout / orientation translation
 *
 * `usePlayerLayout` exposes mode as `'side-by-side' | 'stacked'`; `<SplitPane>`
 * wants `orientation: 'horizontal' | 'vertical'`. The translation is direct:
 * side-by-side → horizontal (left/right children), stacked → vertical
 * (top/bottom children). The first child is always the video pane regardless
 * of orientation, which means `collapsed: 'first'` always means "video pane
 * collapsed" and `'second'` always means "notation pane collapsed".
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AlphaTabApi } from '@coderline/alphatab';
import AccordionPlayer from './AccordionPlayer';
import VideoPane from './VideoPane';
import NotationPane from './NotationPane';
import ControlBar from './ControlBar';
import SplitPane from './SplitPane';
import SyncEditor from './SyncEditor';
import { usePlayerLayout } from './usePlayerLayout';
import type { LessonPlayerRecord } from '@/lib/player/lesson';

interface PlayerCockpitProps {
    /** Forwarded to `usePlayerLayout` — composes the localStorage key as
     *  `psf:player:layout:<storageKey>`. v1 always passes `'lab'`. */
    storageKey: string;
    /** The lesson data record. Owns the variant list, default variant, and
     *  any per-lesson trim/offset hooks. Slice 3 made this the source of
     *  truth for video src — the cockpit picks `activeVariantId` and derives
     *  `activeSrc` for the video pane. */
    lesson: LessonPlayerRecord;
    /** Slice 4: when true, renders `<SyncEditor />` below the cockpit body
     *  for live tuning of the trim/offset/BPM values. Admin-gated server-
     *  side (see `app/lab/player/page.tsx`). */
    isAdmin?: boolean;
}

export default function PlayerCockpit({
    storageKey,
    lesson,
    isAdmin = false,
}: PlayerCockpitProps) {
    // The buffered facade. Populated by AlphaTabHost (via NotationPane) on its
    // mount effect, before the host returns to the React reconciler.
    /**
     * Stale-ref invariant: `handleWrapperReady` is called at most once per
     * ready cycle; HMR remount triggers a full unmount/remount via NotationPane,
     * so stale refs cannot persist across host lifecycles.
     */
    const playerRef = useRef<AccordionPlayer | null>(null);
    // The live AlphaTabApi instance. Held for symmetry / future direct-api needs
    // (debug overlays, advanced loop UI). Not currently dereffed in JSX.
    const apiRef = useRef<AlphaTabApi | null>(null);

    // Drives whether <VideoPane> (its internal VideoBackingTrack) and
    // <ControlBar> (PlayerControls inside) actually mount their AlphaTab-
    // dependent children. The notation pane mounts AlphaTabHost regardless
    // because that's the source of the readiness signal.
    const [readyForPlayback, setReadyForPlayback] = useState(false);

    // Slice 1: `playing` is owned here (lifted from PlayerControls) so the
    // click-to-play surface in `<VideoPane>` and any other consumer can
    // share one source of truth. Driven by the `psf:state` window event
    // dispatched from the wrapper's stateChanged slot below.
    const [playing, setPlaying] = useState(false);

    // Live `<video>` element ref. Mirrored from VideoBackingTrack's internal
    // `videoRef` once the video element mounts. TransportProgressBar reads
    // `currentTime`/`duration` here for drag-to-seek in video-master mode.
    const videoElRef = useRef<HTMLVideoElement | null>(null);

    // Slice 3: variant selection state. The default-flagged variant wins on
    // first mount; falls back to the first variant if no default is set so
    // the cockpit never starts with an undefined src.
    const [activeVariantId, setActiveVariantId] = useState<string>(
        () =>
            lesson.variants.find((v) => v.isDefault)?.id ??
            lesson.variants[0].id,
    );

    // Slice 4: lift trim/offset/BPM into cockpit-local state so the
    // `<SyncEditor>` can mutate them and the change propagates immediately
    // to `<VideoBackingTrack>` for live preview without a save round-trip.
    // Initial values come from the lesson record; SyncEditor's own initial
    // GET fetch overlays any persisted values from SQLite/fallback.
    const [videoTrimStart, setVideoTrimStart] = useState<number>(
        lesson.videoTrimStart ?? 0,
    );
    const [videoTrimEnd, setVideoTrimEnd] = useState<number | null>(
        lesson.videoTrimEnd ?? null,
    );
    const [videoOffset, setVideoOffset] = useState<number>(
        lesson.videoOffset ?? 0,
    );
    const [originalBpm, setOriginalBpm] = useState<number | null>(null);

    /**
     * Slice 4: callback handed down to `<SyncEditor>` so it can mutate the
     * cockpit's trim/offset/BPM state without owning it. Only the keys
     * present in `partial` are written; the rest stay untouched.
     */
    const handleSyncChange = useCallback(
        (partial: {
            videoTrimStart?: number;
            videoTrimEnd?: number | null;
            videoOffset?: number;
            originalBpm?: number | null;
        }) => {
            if (partial.videoTrimStart !== undefined) {
                setVideoTrimStart(partial.videoTrimStart);
            }
            if (partial.videoTrimEnd !== undefined) {
                setVideoTrimEnd(partial.videoTrimEnd);
            }
            if (partial.videoOffset !== undefined) {
                setVideoOffset(partial.videoOffset);
            }
            if (partial.originalBpm !== undefined) {
                setOriginalBpm(partial.originalBpm);
            }
        },
        [],
    );
    // Derive the active src from the id. Plain expression — `find` over a
    // 2-element array is cheaper than memo bookkeeping, and downstream string
    // `===` comparisons are already free. The fallback to the first variant is
    // paranoia — `activeVariantId` is always sourced from the list.
    const activeSrc =
        lesson.variants.find((v) => v.id === activeVariantId)?.src ??
        lesson.variants[0].src;

    const layout = usePlayerLayout({ storageKey });
    const {
        state: layoutState,
        setMode,
        setSplitPct,
        setCollapsed,
        setTransport,
    } = layout;

    /**
     * Captures the wrapper + api references from the AlphaTabHost mount.
     * Called synchronously inside the host's mount effect, BEFORE
     * `api.tex(...)` runs. Stable identity — uses `useCallback([])` so the
     * host's effect dependency array stays empty across cockpit re-renders.
     */
    const handleWrapperReady = useCallback(
        (wrapper: AccordionPlayer, api: AlphaTabApi) => {
            playerRef.current = wrapper;
            apiRef.current = api;
        },
        [],
    );

    /**
     * Fires when AlphaTab's `playerReady` event lands (synth + soundfont
     * loaded). Flips the mount gate for video + controls. Stable identity.
     */
    const handleReadyForPlayback = useCallback(() => {
        setReadyForPlayback(true);
    }, []);

    /**
     * Click-to-play handler for the `<VideoPane>` surface. Toggles the
     * wrapper. The wrapper either no-ops (pre-ready) or calls
     * `api.playPause()`. AlphaTab fires `playerStateChanged` afterward,
     * which our slot below re-broadcasts as `psf:state` and the listener
     * a few lines down updates `playing` state.
     */
    const handleSurfaceClick = useCallback(() => {
        playerRef.current?.playPause();
    }, []);

    /**
     * Slice 1 ownership lift: install the wrapper's three single-subscriber
     * event slots HERE and re-broadcast each as a `psf:*` window CustomEvent.
     * PlayerControls + TransportProgressBar (and any future consumer) listen
     * to those events instead of writing into the wrapper slots — the
     * wrapper is now a single-publisher surface owned by the cockpit.
     */
    useEffect(() => {
        if (!readyForPlayback) return;
        const player = playerRef.current;
        if (!player) return;

        player.positionChanged = (p) => {
            window.dispatchEvent(new CustomEvent('psf:position', { detail: p }));
        };
        player.stateChanged = (s) => {
            window.dispatchEvent(new CustomEvent('psf:state', { detail: s }));
        };
        player.playbackRangeChanged = (r) => {
            window.dispatchEvent(new CustomEvent('psf:range', { detail: r }));
        };

        return () => {
            player.positionChanged = undefined;
            player.stateChanged = undefined;
            player.playbackRangeChanged = undefined;
        };
    }, [readyForPlayback]);

    // Listen to our own broadcast for the `playing` flag. State change is
    // fine here — fires at most a few times per session (play/pause/stop).
    useEffect(() => {
        const onState = (e: Event) => {
            const detail = (e as CustomEvent).detail as
                | { state: 0 | 1; stopped: boolean }
                | undefined;
            if (!detail) return;
            setPlaying(detail.state === 1 && !detail.stopped);
        };
        window.addEventListener('psf:state', onState);
        return () => window.removeEventListener('psf:state', onState);
    }, []);

    // Translate layout mode → SplitPane orientation. Side-by-side panes are
    // arranged horizontally; stacked panes are arranged vertically.
    const orientation =
        layoutState.mode === 'side-by-side' ? 'horizontal' : 'vertical';

    // Stable handler for chevron-driven expand. Resets to a balanced 50/50
    // and clears any collapsed state — clicking the chevron is a single
    // affordance for "show me both panes again".
    const handleExpandOther = useCallback(() => {
        setCollapsed(null);
        setSplitPct(50);
    }, [setCollapsed, setSplitPct]);

    return (
        <div
            className="player-cockpit"
            data-mode={layoutState.mode}
            data-transport={layoutState.transport}
        >
            {/* Pane container — flexes to fill all space above the toolbar.
                The SplitPane inside owns the actual flex distribution
                between the two panes; this wrapper exists so the toolbar
                gets its own intrinsic height via `flex: 0 0 auto`.

                Slice 2: in synth-mode the SplitPane is bypassed entirely so
                the NotationPane fills the cockpit body. The chevron / collapse
                logic doesn't apply (no second pane to expand back). The
                splitPct field is preserved untouched in layout state, so
                toggling back to video mode restores the previous split. */}
            <div className="player-cockpit__panes">
                {layoutState.transport === 'synth' ? (
                    <NotationPane
                        onWrapperReady={handleWrapperReady}
                        onReadyForPlayback={handleReadyForPlayback}
                        collapsed={null}
                        orientation={orientation}
                        onExpandOther={handleExpandOther}
                    />
                ) : (
                    <SplitPane
                        orientation={orientation}
                        splitPct={layoutState.splitPct}
                        collapsed={layoutState.collapsed}
                        onSplitChange={setSplitPct}
                        onCollapseChange={setCollapsed}
                        ariaLabel="Video ve nota bölücü"
                    >
                        <VideoPane
                            player={playerRef.current}
                            ready={readyForPlayback}
                            src={activeSrc}
                            videoTrimStart={videoTrimStart}
                            videoTrimEnd={videoTrimEnd ?? undefined}
                            videoOffset={videoOffset}
                            collapsed={layoutState.collapsed}
                            orientation={orientation}
                            onExpandOther={handleExpandOther}
                            playing={playing}
                            onSurfaceClick={handleSurfaceClick}
                            videoElRef={videoElRef}
                        />
                        <NotationPane
                            onWrapperReady={handleWrapperReady}
                            onReadyForPlayback={handleReadyForPlayback}
                            collapsed={layoutState.collapsed}
                            orientation={orientation}
                            onExpandOther={handleExpandOther}
                        />
                    </SplitPane>
                )}
            </div>

            {/* Unified bottom toolbar. Mounted only after readiness so its
                inner <PlayerControls /> can subscribe to a live wrapper. The
                LayoutModeToggle remains absent during loading — fine, the
                user has nothing to interact with until the synth is ready. */}
            {readyForPlayback && playerRef.current && (
                <ControlBar
                    player={playerRef.current}
                    mode={layoutState.mode}
                    onModeChange={setMode}
                    transport={layoutState.transport}
                    onTransportChange={setTransport}
                    videoElRef={videoElRef}
                    variants={lesson.variants}
                    activeVariantId={activeVariantId}
                    onVariantChange={setActiveVariantId}
                />
            )}
            {/* Slice 4: admin-only sync editor. Mounts below the cockpit body
                so the instructor can tune trim/offset/BPM with live preview.
                Hidden entirely when not admin (server-side gated in
                page.tsx via `readSessionFromCookies`). */}
            {isAdmin && (
                <SyncEditor
                    lesson={lesson}
                    videoElRef={videoElRef}
                    initialSync={{
                        videoTrimStart,
                        videoTrimEnd,
                        videoOffset,
                        originalBpm,
                    }}
                    onSyncChange={handleSyncChange}
                />
            )}
        </div>
    );
}
