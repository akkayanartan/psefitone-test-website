/**
 * Public types for the Psefitone AlphaTab player wrapper.
 *
 * Pure type module — zero runtime exports. Safe to import from any context
 * (server, client, edge, build scripts) without pulling in `@coderline/alphatab`.
 *
 * All types use `import type` so that the AlphaTab runtime is never required.
 *
 * Reference: `nextjs-app/node_modules/@coderline/alphatab/dist/alphaTab.d.ts`
 *            (version 1.8.2 — the only authoritative API surface).
 */

import type { synth } from '@coderline/alphatab';

/**
 * The handler shape AlphaTab's external-media output expects when AlphaTab is
 * running in slave mode against an external clock (typically a `<video>`).
 *
 * In AlphaTab 1.8.2 this is a typed public interface (`IExternalMediaHandler`,
 * `alphaTab.d.ts` line 9419). We re-export it under the project-local name
 * `BackingTrackHandler` so the rest of the player stack speaks one vocabulary.
 *
 * Shape (from the .d.ts, paraphrased):
 *  - `backingTrackDuration: number` — total media duration in ms (read-only).
 *  - `playbackRate: number` — read/write, mirrors `<video>.playbackRate`.
 *  - `masterVolume: number` — read/write, mirrors `<video>.volume` (0..1).
 *  - `seekTo(timeMs: number): void`
 *  - `play(): void`
 *  - `pause(): void`
 *
 * Wired by `AccordionPlayer.attachVideo()` (see Step 9).
 */
export type BackingTrackHandler = synth.IExternalMediaHandler;

/**
 * The playback range used for looping. Mirrors AlphaTab's `PlaybackRange` class
 * structurally — `{ startTick, endTick }` — but typed as a plain object so
 * callers don't have to instantiate the AlphaTab class.
 *
 * AlphaTab's setter accepts any structurally-compatible object.
 */
export type PlaybackRange = synth.PlaybackRange;

/**
 * The shape emitted by `AlphaTabApi.playerPositionChanged`
 * (`PositionChangedEventArgs`, `alphaTab.d.ts` line 14154).
 *
 * Forwarded verbatim by `AccordionPlayer.positionChanged`.
 */
export interface PlayerPositionEvent {
    /** Current time within the song in milliseconds. */
    readonly currentTime: number;
    /** Total length of the song in milliseconds. */
    readonly endTime: number;
    /** Current position within the song in midi ticks. */
    readonly currentTick: number;
    /** Total length of the song in midi ticks. */
    readonly endTick: number;
    /** True when this position update was caused by a seek (not steady playback). */
    readonly isSeek: boolean;
}

/**
 * The shape emitted by `AlphaTabApi.playerStateChanged`
 * (`PlayerStateChangedEventArgs`, `alphaTab.d.ts` line 14133).
 *
 * Note: AlphaTab 1.8.2's `PlayerState` enum only has `Paused = 0` and
 * `Playing = 1` — there is no `Stopped = 2`. The "stopped" condition is
 * carried as a separate boolean flag on the event payload (the player is
 * `Paused` AND `stopped` when the user hits stop vs. pause).
 *
 * Forwarded verbatim by `AccordionPlayer.stateChanged`.
 */
export interface PlayerStateEvent {
    /** 0 = Paused, 1 = Playing. */
    readonly state: 0 | 1;
    /** True if playback was stopped (not merely paused). */
    readonly stopped: boolean;
}

/**
 * The full surface of forwarded events on `AccordionPlayer`. Each handler
 * is optional and can be assigned at any time — the wrapper buffers the
 * subscription and dispatches once the underlying `AlphaTabApi` is attached.
 *
 * Mirrors the *public* events specified in the implementation plan
 * (Step 3 / Critical implementation details §5).
 */
export interface AccordionPlayerEventHandlers {
    /** Fires when the player is initialized AND data is ready. See note in `AccordionPlayer`. */
    ready?: () => void;
    /** Same firing as `ready` in 1.8.2 — kept distinct for plan parity. */
    readyForPlayback?: () => void;
    /** Position tick — fires per playback frame (high frequency; do not setState). */
    positionChanged?: (p: PlayerPositionEvent) => void;
    /** State change — fires rarely (play/pause/stop). React re-renders are fine. */
    stateChanged?: (s: PlayerStateEvent) => void;
    /** Loop range set/cleared. Receives `null` when the range is cleared. */
    playbackRangeChanged?: (r: PlaybackRange | null) => void;
}
