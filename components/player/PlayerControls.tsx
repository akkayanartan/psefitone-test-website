'use client';

/**
 * PlayerControls — transport bar for the AlphaTab player.
 *
 * # What this file does (Slice 1+2 scope)
 *
 * Five controls in a single horizontal toolbar group inside the cockpit's
 * bottom bar:
 *
 *  1. Play/pause toggle button.
 *  2. Speed slider (0.25× → 2.0×, step 0.05).
 *  3. Current-time / total-time label ("MM:SS / MM:SS").
 *  4. Clear Loop button — appears only while a loop range is set.
 *  5. Loop toggle button — appears alongside Clear Loop while a range is set,
 *     toggles `player.isLooping` without clearing the range.
 *
 * The button toggles `wrapper.playPause()`. The slider writes
 * `wrapper.setPlaybackSpeed(v)` (which branches between video-master and
 * synth modes internally). The time label is updated imperatively via
 * `currentTimeRef.current.textContent = ...` on each `psf:position` window
 * event, throttled to ~10 Hz.
 *
 * # Event consumption (consumer, not slot writer — Slice 1)
 *
 * `PlayerCockpit` OWNS the wrapper's three single-subscriber event slots
 * (`positionChanged`, `stateChanged`, `playbackRangeChanged`) and
 * re-broadcasts each as a window CustomEvent: `psf:position`, `psf:state`,
 * `psf:range`. PlayerControls is now a CONSUMER of those window events —
 * it does NOT write into the wrapper slots. Multiple components can read
 * the same stream without fighting over the single subscriber slots.
 *
 * Loop UI (Slice 2C): on `psf:range` we mirror the range-set state into both
 * `hasLoop` (gates Clear Loop) AND `looping` (drives the Loop toggle). On
 * Clear Loop click we set `player.isLooping = false; player.playbackRange =
 * null` — the second write fires `playbackRangeChanged(null)` which the
 * cockpit re-broadcasts, our listener flips both flags off and the buttons
 * unmount. The Loop toggle just writes `player.isLooping = next` without
 * touching the range.
 *
 * # The 60-fps gate (the whole point of this component)
 *
 * The plan demands "zero re-renders of PlayerControls during steady play"
 * (plan §60-fps-strategy). Three design choices enforce it:
 *
 *  - **Position events are ref-driven, not state-driven.** The `psf:position`
 *    listener fires roughly per playback frame. Calling `setState` from it
 *    would re-render the whole component every frame and blow the budget.
 *    Instead, the time-display `<span>` carries a `ref` and we mutate
 *    `textContent` imperatively. React never knows the label moved.
 *
 *  - **Time-label updates are throttled to 10 Hz.** A `lastUpdateTsRef` guard
 *    short-circuits any update fired within 100 ms of the last one. Eyes
 *    can't read more than 10 frames/s of changing digits anyway, and this
 *    cuts 6× the DOM writes vs. updating at 60 Hz. The cursor (driven by
 *    AlphaTab's own RAF) still moves at full 60 fps — only the *label*
 *    throttles.
 *
 *  - **The speed slider is uncontrolled.** A controlled `<input value={...}>`
 *    forces a re-render per drag-frame (drag fires onChange continuously).
 *    `defaultValue` keeps the browser in charge of the thumb position; we
 *    only update the small `speedDisplay` label state once per change. This
 *    re-renders during user drag — that's expected and not "steady play."
 *    During steady play, no drag, no re-render.
 *
 * State that *is* allowed:
 *  - `playing: boolean` — flipped by `psf:state` (fires on play/pause/stop,
 *    rare). Drives the icon swap.
 *  - `speedDisplay: string` — written only from the slider's onChange, only
 *    during user interaction.
 *  - `hasLoop: boolean` — flipped by `psf:range`. Fires at most twice per
 *    loop cycle (set, clear). Drives the Clear Loop / Loop toggle mount.
 *  - `looping: boolean` — mirrored from `psf:range` and flipped locally on
 *    Loop toggle click. Drives `aria-pressed` on the Loop toggle.
 *
 * # Disabled gating
 *
 * `isReadyForPlayback` is wired through from `PlayerCockpit`'s readiness
 * gate. In practice the cockpit only mounts this component once readiness is
 * true, so the disabled state is mostly a defense-in-depth guard for the
 * React 19 StrictMode double-invoke window.
 *
 * # Reduced motion
 *
 * The play button hover lift uses `transform: scale(1.05)` — exactly the
 * properties the design system permits to animate. The styles below honor
 * `@media (prefers-reduced-motion: reduce)` by zeroing the transform and
 * transition duration. Fine-grained per-element CSS rather than a global
 * gate so the slider thumb still works (it's drag, not animation).
 */

import { useEffect, useRef, useState } from 'react';
import { Repeat } from 'lucide-react';
import type AccordionPlayer from './AccordionPlayer';
import type {
    PlaybackRange,
    PlayerPositionEvent,
    PlayerStateEvent,
} from '@/lib/player/types';

type PlayerControlsProps = {
    /** The buffered facade. Always non-null when this component renders — the
     *  parent only mounts it after `readyForPlayback` fires (see PlayerCockpit). */
    player: AccordionPlayer;
    /** Whether the underlying AlphaTabApi is ready for playback. Until true,
     *  the play button is disabled. */
    isReadyForPlayback?: boolean;
};

/** Format milliseconds as `M:SS`. Negative or NaN clamps to `0:00`. */
function formatTime(ms: number): string {
    if (!Number.isFinite(ms) || ms < 0) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Round a float to a percent string with no decimals (e.g. `1.0` → `100%`). */
function toPercent(v: number): string {
    return `${Math.round(v * 100)}%`;
}

const SPEED_MIN = 0.25;
const SPEED_MAX = 2.0;
const SPEED_STEP = 0.05;
const SPEED_DEFAULT = 1.0;

/** 10 Hz throttle for the time label — enough for a human to read steady
 *  digit progression, well below per-frame DOM-write cost. */
const TIME_LABEL_THROTTLE_MS = 100;

export default function PlayerControls({
    player,
    isReadyForPlayback = false,
}: PlayerControlsProps) {
    /** Driven by `stateChanged` — fires on play/pause/stop, rare. */
    const [playing, setPlaying] = useState(false);
    /** Display string for the speed label. Only mutates from slider onChange. */
    const [speedDisplay, setSpeedDisplay] = useState(toPercent(SPEED_DEFAULT));
    /** True while a loop range is set. Driven by `psf:range`.
     *  Gates the Clear Loop button — completely unmounts when false rather
     *  than disabling, so the toolbar layout collapses cleanly. */
    const [hasLoop, setHasLoop] = useState(false);
    /** Slice 2C: drives the Loop toggle's `aria-pressed`. Mirrored from
     *  `psf:range` (range present → looping; range cleared → not looping)
     *  and toggled locally when the user clicks the toggle. */
    const [looping, setLooping] = useState(false);

    /** Imperatively-updated time label — bypasses React reconciler. */
    const currentTimeRef = useRef<HTMLSpanElement | null>(null);
    /** Last time we wrote to currentTimeRef.textContent (throttle guard). */
    const lastUpdateTsRef = useRef<number>(0);
    /** Slider thumb's current value, kept in a ref so aria-valuenow stays
     *  current without forcing a re-render on every drag-frame. */
    const speedValueRef = useRef<number>(SPEED_DEFAULT);

    useEffect(() => {
        // psf:position — high-frequency, ref-driven, throttled to 10 Hz. The
        // CustomEvent is dispatched by `PlayerCockpit` from inside the
        // wrapper's `positionChanged` slot. Multiple listeners can read this
        // stream without contending for the single-subscriber slot.
        const onPosition = (e: Event) => {
            const detail = (e as CustomEvent<PlayerPositionEvent>).detail;
            if (!detail) return;
            const now =
                typeof performance !== 'undefined'
                    ? performance.now()
                    : Date.now();
            if (now - lastUpdateTsRef.current < TIME_LABEL_THROTTLE_MS) return;
            lastUpdateTsRef.current = now;
            const node = currentTimeRef.current;
            if (node) {
                node.textContent = `${formatTime(detail.currentTime)} / ${formatTime(detail.endTime)}`;
            }
        };

        // psf:state — low-frequency. State change is fine; it drives the
        // play/pause icon swap which IS a render. AlphaTab fires this at
        // most a few times per session.
        const onState = (e: Event) => {
            const detail = (e as CustomEvent<PlayerStateEvent>).detail;
            if (!detail) return;
            // PlayerState: 0 = Paused, 1 = Playing. Stopped is a side-flag.
            setPlaying(detail.state === 1 && !detail.stopped);
        };

        // psf:range — low-frequency, fires once per loop set/clear. The
        // state re-render here is intentional and acceptable: at most two
        // per loop cycle, never during steady play. Drives the Clear Loop
        // button + Loop toggle mount/unmount and mirrors the looping state.
        const onRange = (e: Event) => {
            const detail = (e as CustomEvent<PlaybackRange | null>).detail;
            setHasLoop(detail !== null);
            // Slice 2C mirror: range present implies looping; range cleared
            // implies not looping. Local Loop toggle click also writes here
            // via setLooping(next), so the two paths converge.
            setLooping(detail !== null);
        };

        window.addEventListener('psf:position', onPosition);
        window.addEventListener('psf:state', onState);
        window.addEventListener('psf:range', onRange);
        return () => {
            window.removeEventListener('psf:position', onPosition);
            window.removeEventListener('psf:state', onState);
            window.removeEventListener('psf:range', onRange);
        };
        // Listeners reference refs only; the deps array is empty by design.
    }, []);

    return (
        <div className="psef-controls" role="toolbar" aria-label="Oynatıcı kontrolleri">
            {/* Play / pause */}
            <button
                type="button"
                className="psef-controls__playbtn"
                aria-label={playing ? 'Duraklat' : 'Oynat'}
                aria-pressed={playing}
                onClick={() => player.playPause()}
                disabled={!isReadyForPlayback}
            >
                {playing ? <PauseIcon /> : <PlayIcon />}
            </button>

            {/* Speed slider — center group fills available width */}
            <div className="psef-controls__speed-group">
                <span
                    className="psef-controls__speed-caption"
                    aria-hidden="true"
                >
                    Hız
                </span>
                <input
                    type="range"
                    className="psef-controls__slider"
                    min={SPEED_MIN}
                    max={SPEED_MAX}
                    step={SPEED_STEP}
                    defaultValue={SPEED_DEFAULT}
                    aria-label="Oynatma hızı"
                    aria-valuemin={SPEED_MIN}
                    aria-valuemax={SPEED_MAX}
                    aria-valuenow={speedValueRef.current}
                    aria-valuetext={speedDisplay}
                    onChange={(e) => {
                        const v = Number(e.currentTarget.value);
                        speedValueRef.current = v;
                        setSpeedDisplay(toPercent(v));
                        // Plan §4: when video master is attached, the speed
                        // change must go through the <video> element so its
                        // `ratechange` listener mirrors the new rate back into
                        // AlphaTab in lockstep. When tab-only, write straight
                        // through to AlphaTab. The wrapper hides the branch:
                        // `setPlaybackSpeed` checks `_videoHandler` itself.
                        player.setPlaybackSpeed(v);
                    }}
                />
                <span
                    className="psef-controls__speed-value"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {speedDisplay}
                </span>
            </div>

            {/* Current-time label — imperatively updated, no React renders */}
            <span
                ref={currentTimeRef}
                className="psef-controls__time"
                aria-label="Geçerli süre"
            >
                0:00 / 0:00
            </span>

            {/* Loop group — Clear Loop + Loop toggle. Mounts as a unit only
                when a loop range is set, so the baseline (no loop) layout is
                unchanged: when a loop appears, both buttons slide in
                together. Slice 2C added the Loop toggle alongside the
                existing Clear Loop, grouped here for the a11y tree. */}
            {hasLoop && (
                <div
                    className="psef-controls__loop-group"
                    role="group"
                    aria-label="Tekrar kontrolleri"
                >
                    <button
                        type="button"
                        className="psef-controls__clear-loop"
                        aria-label="Döngüyü temizle"
                        onClick={() => {
                            // Reverse the order used at set-time: turn off
                            // looping first, then clear the range. The
                            // wrapper forwards the playbackRange = null
                            // write to AlphaTab, which fires
                            // `playbackRangeChanged(null)` — the cockpit
                            // re-broadcasts as `psf:range`, our listener
                            // flips hasLoop + looping to false, and the
                            // group unmounts.
                            player.isLooping = false;
                            player.playbackRange = null;
                        }}
                    >
                        <ClearLoopIcon />
                        <span>Döngüyü temizle</span>
                    </button>
                    <button
                        type="button"
                        className="psef-controls__loop-toggle"
                        onClick={() => {
                            const next = !looping;
                            setLooping(next);
                            player.isLooping = next;
                        }}
                        aria-pressed={looping}
                        aria-label={
                            looping ? 'Tekrarı duraklat' : 'Tekrarı sürdür'
                        }
                        title="Tekrarla"
                    >
                        <Repeat size={18} aria-hidden="true" />
                    </button>
                </div>
            )}

            {/*
                Plain <style> tag (not styled-jsx). Matches the project's
                existing pattern (see PlayerLab.client.tsx → LoadingCard).
                Class names are namespaced under `psef-controls__*` so
                they can't collide with anything else on the site.
            */}
            <style>{`
                .psef-controls {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 1rem 1.25rem;
                    margin-top: 1.25rem;
                    background: var(--brand-dark2);
                    border: 1px solid var(--brand-border);
                    border-radius: 4px;
                }

                /* ── Play / pause button ──────────────────────────────── */
                .psef-controls__playbtn {
                    flex: 0 0 auto;
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    border: none;
                    background: var(--brand-secondary);
                    color: var(--brand-text);
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow:
                        0 4px 20px rgba(134, 41, 255, 0.28),
                        0 1px 6px rgba(0, 0, 0, 0.35);
                    /* Only transform / opacity / box-shadow transition — never
                       layout properties. Spring curve matches the design
                       system's signature interactive feel. */
                    transition:
                        transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                        opacity 0.18s ease,
                        box-shadow 0.22s ease;
                }
                .psef-controls__playbtn:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow:
                        0 8px 32px rgba(134, 41, 255, 0.38),
                        0 2px 10px rgba(0, 0, 0, 0.4);
                }
                .psef-controls__playbtn:active:not(:disabled) {
                    transform: scale(0.97) !important;
                }
                .psef-controls__playbtn:focus-visible {
                    outline: 2px solid var(--brand-secondary);
                    outline-offset: 3px;
                }
                .psef-controls__playbtn:disabled {
                    background: var(--brand-dark3);
                    color: var(--brand-muted);
                    cursor: not-allowed;
                    opacity: 0.55;
                    box-shadow: none;
                }

                /* ── Speed group ──────────────────────────────────────── */
                .psef-controls__speed-group {
                    flex: 1 1 auto;
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    min-width: 0;
                }
                .psef-controls__speed-caption {
                    flex: 0 0 auto;
                    font-family: var(--font-body);
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: var(--brand-accent);
                }
                .psef-controls__slider {
                    flex: 1 1 auto;
                    min-width: 0;
                    cursor: pointer;
                }
                .psef-controls__speed-value {
                    flex: 0 0 auto;
                    font-family: var(--font-body);
                    font-variant-numeric: tabular-nums;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--brand-muted);
                    /* Fixed-ish width so 25% / 100% / 200% don't jitter */
                    min-width: 3ch;
                    text-align: right;
                }

                /* ── Time label ───────────────────────────────────────── */
                .psef-controls__time {
                    flex: 0 0 auto;
                    font-family: var(--font-body);
                    font-variant-numeric: tabular-nums;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--brand-muted);
                    letter-spacing: 0.02em;
                    /* Width: enough for "MM:SS / MM:SS" with two-digit minutes
                       comfortably. Tabular-nums keeps every digit in its lane. */
                    min-width: 11ch;
                    text-align: right;
                }

                /* ── Clear Loop button (Step 7) ───────────────────────── */
                .psef-controls__clear-loop {
                    flex: 0 0 auto;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    height: 38px;
                    padding: 0 0.875rem;
                    /* Pill shape distinguishes it from the square notation
                       card and the circular play button — its own visual
                       affordance, not a peer of either. */
                    border-radius: 999px;
                    border: 1px solid var(--brand-border);
                    background: transparent;
                    color: var(--brand-muted);
                    font-family: var(--font-body), system-ui, sans-serif;
                    font-size: 0.8rem;
                    font-weight: 500;
                    letter-spacing: 0.01em;
                    cursor: pointer;
                    /* Same animatable-only properties as the play button:
                       transform, border-color, color. No layout shifts. */
                    transition:
                        transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                        border-color 0.2s ease,
                        color 0.2s ease;
                }
                .psef-controls__clear-loop:hover {
                    transform: scale(1.03);
                    border-color: var(--brand-primary);
                    color: var(--brand-primary);
                }
                .psef-controls__clear-loop:active {
                    transform: translateY(1px) scale(0.99) !important;
                }
                .psef-controls__clear-loop:focus-visible {
                    outline: 2px solid var(--brand-secondary);
                    outline-offset: 3px;
                }
                .psef-controls__clear-loop svg {
                    width: 14px;
                    height: 14px;
                    flex: 0 0 auto;
                }

                /* ── Reduced-motion override ──────────────────────────── */
                @media (prefers-reduced-motion: reduce) {
                    .psef-controls__playbtn {
                        transition: none;
                    }
                    .psef-controls__playbtn:hover:not(:disabled) {
                        transform: none;
                    }
                    .psef-controls__playbtn:active:not(:disabled) {
                        transform: none !important;
                    }
                    .psef-controls__clear-loop {
                        transition: none;
                    }
                    .psef-controls__clear-loop:hover {
                        transform: none;
                    }
                    .psef-controls__clear-loop:active {
                        transform: none !important;
                    }
                }

                /* ── Range input — cross-browser thumb + track ────────── */
                /* Reset native styling so the thumb / track follow the brand. */
                .psef-controls__slider {
                    appearance: none;
                    -webkit-appearance: none;
                    background: transparent;
                    height: 22px;
                    padding: 0;
                    margin: 0;
                }
                .psef-controls__slider:focus {
                    outline: none;
                }
                .psef-controls__slider:focus-visible::-webkit-slider-thumb {
                    box-shadow:
                        0 0 0 4px rgba(134, 41, 255, 0.35),
                        0 1px 4px rgba(0, 0, 0, 0.4);
                }
                .psef-controls__slider:focus-visible::-moz-range-thumb {
                    box-shadow:
                        0 0 0 4px rgba(134, 41, 255, 0.35),
                        0 1px 4px rgba(0, 0, 0, 0.4);
                }
                /* WebKit / Blink — track */
                .psef-controls__slider::-webkit-slider-runnable-track {
                    height: 4px;
                    border-radius: 2px;
                    background: linear-gradient(
                        90deg,
                        var(--brand-secondary),
                        var(--brand-primary)
                    );
                }
                /* WebKit / Blink — thumb */
                .psef-controls__slider::-webkit-slider-thumb {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    margin-top: -6px; /* center on the 4px track */
                    border-radius: 50%;
                    background: var(--brand-text);
                    border: none;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
                    cursor: grab;
                    transition: transform 0.18s ease;
                }
                .psef-controls__slider::-webkit-slider-thumb:active {
                    cursor: grabbing;
                }
                /* Firefox — track */
                .psef-controls__slider::-moz-range-track {
                    height: 4px;
                    border-radius: 2px;
                    background: linear-gradient(
                        90deg,
                        var(--brand-secondary),
                        var(--brand-primary)
                    );
                    border: none;
                }
                /* Firefox — thumb */
                .psef-controls__slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--brand-text);
                    border: none;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
                    cursor: grab;
                }
                .psef-controls__slider::-moz-range-thumb:active {
                    cursor: grabbing;
                }
            `}</style>
        </div>
    );
}

/* ─── Inline SVG icons ────────────────────────────────────────────────────
 * Roll-our-own to avoid pulling in lucide-react (not currently in the
 * dependency tree per package.json — the README mentions it but it's not
 * actually installed). Two tiny inline SVGs cost <300 bytes and ship in
 * the same chunk as PlayerControls. */

function PlayIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            // Optical centering: the visual centroid of a triangle is
            // shifted right of its bounding-box center.
            style={{ transform: 'translateX(2px)' }}
        >
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function PauseIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
    );
}

function ClearLoopIcon() {
    // Loop arc with a slash — readable at 14px. Strokes use `currentColor`
    // so the icon picks up the button's hover/focus color transition with
    // no extra rules.
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Loop arrow — a circular path with a small head */}
            <path d="M3 8a5 5 0 1 1 1.5 3.5" />
            <path d="M3 11.5V8.5h3" />
            {/* Slash through the loop */}
            <path d="M2.5 13.5L13.5 2.5" />
        </svg>
    );
}
