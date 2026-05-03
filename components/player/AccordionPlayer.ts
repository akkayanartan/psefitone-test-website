/**
 * AccordionPlayer — buffered facade over `AlphaTabApi` for the Psefitone player.
 *
 * # Why this class exists
 *
 * AlphaTab initializes asynchronously (workers, soundfont fetch, midi gen),
 * but React component lifecycle is synchronous. Without a buffer, every
 * settings call between mount and `playerReady` would either no-op or throw.
 *
 * This class is the same pattern GuitarBear uses (their `yV` class — see
 * `_archive/guitarbear/guitarbear-source/PSEFITONE-PLAYER-PLAN.md §4`).
 * Settings written before `instance` is assigned are stored on private
 * fields and flushed in one shot when the real `AlphaTabApi` is attached.
 *
 * # Contract
 *
 *  1. Instantiate freely — `new AccordionPlayer()` is allocation-only.
 *  2. Set transport / playback settings at any point.
 *  3. Once your `AlphaTabApi` has been constructed, assign it via
 *     `player.instance = api` exactly **once** per api lifecycle.
 *  4. Call `attachVideo(handler)` to switch to external-media (slave) mode,
 *     `detachVideo()` to switch back to internal-synth mode.
 *  5. Before re-creating the AlphaTabApi (e.g. after HMR or unmount),
 *     call `destroy()` to clear references and event handlers.
 *
 * # AlphaTab 1.8.2 reality check
 *
 * The plan-of-record (`now-it-is-time-proud-hejlsberg.md`) was written
 * against an analysis of GuitarBear's older 1.7-era bundle. A few real
 * differences in 1.8.2:
 *
 *  - `api.player` is `IAlphaSynth | null` — guard for null before use.
 *  - `api.player.output` typed as `ISynthOutput`; cast to
 *    `IExternalMediaSynthOutput` to access `handler` (the public typed surface
 *    for video-master mode).
 *  - There is no `playerReadyForPlayback` event on `AlphaTabApi` — the single
 *    `playerReady` event already fires once "all required data for playback is
 *    loaded" (`alphaTab.d.ts` line 2513). We wire BOTH the `ready` and
 *    `readyForPlayback` callbacks from `playerReady` for plan parity.
 *  - `PlayerState` enum is `{ Paused = 0, Playing = 1 }` — no Stopped value.
 *    The stopped condition is a separate boolean on the event payload.
 *  - `playbackRangeChanged` emits `PlaybackRangeChangedEventArgs` (with a
 *    `.playbackRange` field), not the range directly. We unwrap before
 *    dispatching to the consumer callback.
 */

import type { AlphaTabApi, synth } from '@coderline/alphatab';
import type {
    AccordionPlayerEventHandlers,
    BackingTrackHandler,
    PlaybackRange,
    PlayerPositionEvent,
    PlayerStateEvent,
} from '@/lib/player/types';

class AccordionPlayer implements AccordionPlayerEventHandlers {
    // ---- attached AlphaTab instance (null until ready) ----
    private _instance: AlphaTabApi | null = null;
    private _videoHandler: BackingTrackHandler | null = null;

    // ---- buffered settings (used until instance is attached) ----
    private _playbackSpeed = 1.0;
    private _isLooping = false;
    private _playbackRange: PlaybackRange | null = null;
    private _masterVolume = 1.0;
    private _metronomeVolume = 0; // off by default for beginners
    private _countInVolume = 0; // off by default for beginners

    // ---- public event callbacks (assignable at any time) ----
    //
    // Typed as `... | undefined` (not `null`) to match the shape of the
    // `AccordionPlayerEventHandlers` interface — this also lets callers
    // simply assign `player.ready = undefined` to detach.
    public ready: (() => void) | undefined = undefined;
    public readyForPlayback: (() => void) | undefined = undefined;
    public positionChanged:
        | ((p: PlayerPositionEvent) => void)
        | undefined = undefined;
    public stateChanged:
        | ((s: PlayerStateEvent) => void)
        | undefined = undefined;
    public playbackRangeChanged:
        | ((r: PlaybackRange | null) => void)
        | undefined = undefined;

    /**
     * Attach the live `AlphaTabApi`. Flushes all buffered settings, attaches
     * the buffered video handler (if any), and wires the forwarded events.
     *
     * Call exactly once per `AlphaTabApi` instance. Re-attaching to a new
     * api requires calling `destroy()` first.
     */
    set instance(api: AlphaTabApi) {
        this._instance = api;

        // 1. Flush buffered playback settings to the live api.
        api.masterVolume = this._masterVolume;
        api.metronomeVolume = this._metronomeVolume;
        api.countInVolume = this._countInVolume;
        api.playbackSpeed = this._playbackSpeed;
        api.isLooping = this._isLooping;
        if (this._playbackRange) {
            api.playbackRange = this._playbackRange;
        }

        // 2. If a video handler was set before the api existed, install it now.
        if (this._videoHandler) {
            this._installVideoHandler(api, this._videoHandler);
        }

        // 3. Wire forwarded events. AlphaTab 1.8.2 collapses `playerReady` and
        //    `playerReadyForPlayback` into a single event — we fire both
        //    consumer callbacks from it for plan parity.
        api.playerReady.on(() => {
            this.ready?.();
            this.readyForPlayback?.();
        });

        api.playerPositionChanged.on((args: synth.PositionChangedEventArgs) => {
            const cb = this.positionChanged;
            if (!cb) return;
            cb({
                currentTime: args.currentTime,
                endTime: args.endTime,
                currentTick: args.currentTick,
                endTick: args.endTick,
                isSeek: args.isSeek,
            });
        });

        api.playerStateChanged.on((args: synth.PlayerStateChangedEventArgs) => {
            const cb = this.stateChanged;
            if (!cb) return;
            cb({
                state: args.state as 0 | 1,
                stopped: args.stopped,
            });
        });

        api.playbackRangeChanged.on(
            (args: synth.PlaybackRangeChangedEventArgs) => {
                this.playbackRangeChanged?.(args.playbackRange);
            },
        );
    }

    get instance(): AlphaTabApi | null {
        return this._instance;
    }

    // ---- buffered setters / getters (auto-flush when instance is attached) ----

    set playbackSpeed(v: number) {
        this._playbackSpeed = v;
        if (this._instance) this._instance.playbackSpeed = v;
    }
    get playbackSpeed(): number {
        return this._playbackSpeed;
    }

    /**
     * Speed setter that branches on transport mode (per plan §4).
     *
     *  - Tab-only mode: writes `playbackSpeed` straight through to AlphaTab.
     *  - Video-master mode: writes to the `<video>` via the `videoSpeedSetter`
     *    callback `VideoBackingTrack` installed on `attachVideo()`. The video
     *    element's `ratechange` listener mirrors the new rate back into
     *    `api.playbackSpeed`, so AlphaTab's transport stays in lockstep with
     *    the video master.
     *
     * `PlayerControls` calls this method instead of writing `playbackSpeed`
     * directly, so the controls component stays oblivious to which mode the
     * player is in. The buffered `_playbackSpeed` is updated either way so
     * the slider's source of truth remains the wrapper.
     */
    setPlaybackSpeed(v: number): void {
        this._playbackSpeed = v;
        if (this._videoHandler && this._videoSpeedSetter) {
            this._videoSpeedSetter(v);
            return;
        }
        if (this._instance) this._instance.playbackSpeed = v;
    }

    /**
     * Internal slot for `VideoBackingTrack` to install / clear a callback
     * that mutates `<video>.playbackRate`. Set during `attachVideo()`,
     * cleared during `detachVideo()`. Not part of the public surface.
     */
    private _videoSpeedSetter: ((v: number) => void) | null = null;
    setVideoSpeedSetter(fn: ((v: number) => void) | null): void {
        this._videoSpeedSetter = fn;
    }

    set isLooping(v: boolean) {
        this._isLooping = v;
        if (this._instance) this._instance.isLooping = v;
    }
    get isLooping(): boolean {
        return this._isLooping;
    }

    set playbackRange(v: PlaybackRange | null) {
        this._playbackRange = v;
        if (this._instance) this._instance.playbackRange = v;
    }
    get playbackRange(): PlaybackRange | null {
        return this._playbackRange;
    }

    set masterVolume(v: number) {
        this._masterVolume = v;
        if (this._instance) this._instance.masterVolume = v;
    }
    get masterVolume(): number {
        return this._masterVolume;
    }

    set metronomeVolume(v: number) {
        this._metronomeVolume = v;
        if (this._instance) this._instance.metronomeVolume = v;
    }
    get metronomeVolume(): number {
        return this._metronomeVolume;
    }

    set countInVolume(v: number) {
        this._countInVolume = v;
        if (this._instance) this._instance.countInVolume = v;
    }
    get countInVolume(): number {
        return this._countInVolume;
    }

    // ---- video backing-track slot ----

    /**
     * Switch AlphaTab to slave mode against the given external-media handler.
     * In slave mode, AlphaTab's internal synth is bypassed and `<video>`
     * (or any other source implementing `BackingTrackHandler`) drives the
     * audio + position. Wired by `VideoBackingTrack` in Step 9.
     */
    attachVideo(handler: BackingTrackHandler): void {
        this._videoHandler = handler;
        if (this._instance) {
            this._installVideoHandler(this._instance, handler);
        }
    }

    /**
     * Reverse `attachVideo()`. AlphaTab returns to internal-synth mode.
     */
    detachVideo(): void {
        this._videoHandler = null;
        if (this._instance) {
            this._installVideoHandler(this._instance, null);
        }
    }

    /**
     * True while a video handler is attached and AlphaTab is in slave mode.
     * Used by `PlayerControls.setPlaybackSpeed()` to decide whether to mirror
     * the speed change through the video element (which then `ratechange` →
     * AlphaTab) or write it directly to the api.
     */
    get hasVideoAttached(): boolean {
        return this._videoHandler !== null;
    }

    /**
     * Toggle AlphaTab's internal animated-beat-cursor RAF.
     *
     * In tab-only mode this should be `true` (AlphaTab drives its own cursor
     * smoothly between position events). In video-master mode it MUST be
     * `false` — video drives `output.updatePosition()` per RVFC tick, and
     * AlphaTab's own RAF would fight for the same cursor and produce visible
     * judder at 60 fps.
     *
     * `VideoBackingTrack` calls this on mount (false) and unmount (true).
     */
    setAnimatedCursor(enabled: boolean): void {
        const api = this._instance;
        if (!api) return;
        api.settings.player.enableAnimatedBeatCursor = enabled;
        api.updateSettings();
    }

    /**
     * Push an external-clock position update into AlphaTab. Called from the
     * RVFC sync loop in `VideoBackingTrack` on every video frame. The path
     * is `api.player.output.updatePosition(ms)` — `IExternalMediaSynthOutput`
     * (`alphaTab.d.ts` line 9460) accepts an absolute time in milliseconds
     * and re-positions the cursor without firing any React state update.
     *
     * No-op while the synth is null (pre-ready) or while we're not in slave
     * mode. Both are safety guards — VideoBackingTrack only calls this from
     * inside an RVFC tick scheduled after `attachVideo()` succeeded, so in
     * practice the api is always live here.
     */
    updateExternalPosition(timeMs: number): void {
        const api = this._instance;
        if (!api) return;
        const player: synth.IAlphaSynth | null = api.player;
        if (!player) return;
        const output = player.output as synth.IExternalMediaSynthOutput;
        if (typeof output.updatePosition !== 'function') return;
        output.updatePosition(timeMs);
    }

    /**
     * Type-safe write to `api.player.output.handler` via the public
     * `IExternalMediaSynthOutput` interface (`alphaTab.d.ts` line 9451).
     *
     * `api.player` is `IAlphaSynth | null` in 1.8.2 — null when the synth
     * is disabled. If null, we silently no-op; the next `instance` setter
     * call will replay the buffered handler.
     */
    private _installVideoHandler(
        api: AlphaTabApi,
        handler: BackingTrackHandler | null,
    ): void {
        const player: synth.IAlphaSynth | null = api.player;
        if (!player) return;
        const output = player.output as synth.IExternalMediaSynthOutput;
        output.handler = handler ?? undefined;
    }

    // ---- transport delegation (no-op while instance is null) ----

    play(): void {
        this._instance?.play();
    }
    pause(): void {
        this._instance?.pause();
    }
    stop(): void {
        this._instance?.stop();
    }
    playPause(): void {
        this._instance?.playPause();
    }

    // ---- read-only positional state ----

    get tickPosition(): number {
        return this._instance?.tickPosition ?? 0;
    }
    get timePosition(): number {
        return this._instance?.timePosition ?? 0;
    }

    /**
     * Drop all references and clear all callbacks. Call this before
     * re-creating an `AlphaTabApi` instance (typically inside React's
     * `useEffect` cleanup). Does not call `api.destroy()` — that's the
     * caller's responsibility.
     */
    destroy(): void {
        this._instance = null;
        this._videoHandler = null;
        this._videoSpeedSetter = null;
        this.ready = undefined;
        this.readyForPlayback = undefined;
        this.positionChanged = undefined;
        this.stateChanged = undefined;
        this.playbackRangeChanged = undefined;
    }
}

export default AccordionPlayer;
