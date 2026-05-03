'use client';

/**
 * TransportProgressBar — synced progress bar with drag-to-seek (Slice 1).
 *
 * # What this file does
 *
 * Renders a full-width track + brand-secondary fill that imperatively
 * mutates `transform: scaleX(progress)` on every `psf:position` window
 * event. NOT `width` — `transform` avoids layout reflow and keeps the
 * 60-fps gate intact (plan parity with PlayerControls' label discipline).
 *
 * Drag-to-seek and keyboard arrow seeks branch on transport mode:
 *  - Video-master mode (`videoElRef.current` non-null + `duration` finite):
 *    write `video.currentTime = progress * duration`. The video's `seeked`
 *    event triggers an immediate `syncFrame()` inside VideoBackingTrack,
 *    which repaints the AlphaTab cursor in lockstep.
 *  - Synth-only mode (no video attached): call `player.seekToTick(target)`
 *    where `target = progress * endTick` from the most recent
 *    `psf:position` payload.
 *
 * # Event consumption (no slot writes)
 *
 * PlayerCockpit owns the wrapper's `positionChanged` slot and re-broadcasts
 * each event as `psf:position`. We subscribe to that window event — never
 * touch the wrapper directly — so multiple consumers (this bar + the
 * PlayerControls time label) can read the same stream without fighting
 * over the single subscriber slot.
 */

import { useEffect, useRef } from 'react';
import type AccordionPlayer from './AccordionPlayer';
import type { PlayerPositionEvent } from '@/lib/player/types';

const POSITION_THROTTLE_MS = 100;
const ARROW_KEY_SEEK_MS = 2000;

interface TransportProgressBarProps {
    player: AccordionPlayer;
    videoElRef: React.RefObject<HTMLVideoElement | null>;
}

export default function TransportProgressBar({
    player,
    videoElRef,
}: TransportProgressBarProps) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const fillRef = useRef<HTMLDivElement | null>(null);

    // Last position payload for keyboard-seek math + ARIA state. Refs
    // (not state) so we don't re-render on every position tick.
    const positionRef = useRef<PlayerPositionEvent>({
        currentTime: 0,
        endTime: 0,
        currentTick: 0,
        endTick: 0,
        isSeek: false,
    });
    const lastUpdateTsRef = useRef<number>(0);

    // Whether a pointer is actively dragging — suppresses live position
    // ticks from overwriting the user's drag preview.
    const draggingRef = useRef<boolean>(false);

    useEffect(() => {
        const onPosition = (e: Event) => {
            const detail = (e as CustomEvent<PlayerPositionEvent>).detail;
            if (!detail) return;
            positionRef.current = detail;

            // Keep ARIA value in sync without re-rendering. ARIA reads
            // attributes off the DOM directly so a write here is enough.
            const track = trackRef.current;
            if (track) {
                track.setAttribute(
                    'aria-valuenow',
                    Math.max(0, Math.floor(detail.currentTime)).toString(),
                );
                track.setAttribute(
                    'aria-valuemax',
                    Math.max(0, Math.floor(detail.endTime)).toString(),
                );
            }

            if (draggingRef.current) return;

            const now =
                typeof performance !== 'undefined'
                    ? performance.now()
                    : Date.now();
            if (now - lastUpdateTsRef.current < POSITION_THROTTLE_MS) return;
            lastUpdateTsRef.current = now;

            const fill = fillRef.current;
            if (!fill) return;
            const progress =
                detail.endTime > 0
                    ? Math.max(0, Math.min(1, detail.currentTime / detail.endTime))
                    : 0;
            fill.style.transform = `scaleX(${progress})`;
        };

        window.addEventListener('psf:position', onPosition);
        return () => window.removeEventListener('psf:position', onPosition);
    }, []);

    /**
     * Compute the [0,1] progress under a pointer event relative to the
     * track's bounding rect. Clamped so drags past the edges saturate
     * cleanly.
     */
    const progressFromPointer = (clientX: number): number => {
        const track = trackRef.current;
        if (!track) return 0;
        const rect = track.getBoundingClientRect();
        if (rect.width <= 0) return 0;
        return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    };

    /**
     * Apply a [0,1] progress: visually update the fill AND drive the
     * underlying transport. Branches video vs synth mode at the bottom.
     */
    const applyProgress = (progress: number, commit: boolean) => {
        const fill = fillRef.current;
        if (fill) fill.style.transform = `scaleX(${progress})`;

        if (!commit) return;

        const video = videoElRef.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = progress * video.duration;
            return;
        }
        const endTick = positionRef.current.endTick;
        if (endTick > 0) {
            player.seekToTick(progress * endTick);
        }
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        draggingRef.current = true;
        applyProgress(progressFromPointer(e.clientX), false);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!draggingRef.current) return;
        applyProgress(progressFromPointer(e.clientX), false);
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // releasePointerCapture throws if the pointer was never captured
            // (e.g. the pointer left the element before pointerup). Ignore.
        }
        applyProgress(progressFromPointer(e.clientX), true);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const { endTime, endTick, currentTick } = positionRef.current;
        const video = videoElRef.current;
        const usingVideo =
            !!video && Number.isFinite(video.duration) && video.duration > 0;

        const seekMs = (deltaMs: number) => {
            if (usingVideo) {
                video.currentTime = Math.max(
                    0,
                    Math.min(video.duration, video.currentTime + deltaMs / 1000),
                );
                return;
            }
            if (endTime > 0 && endTick > 0) {
                const ratio = deltaMs / endTime;
                const target = Math.max(
                    0,
                    Math.min(endTick, currentTick + ratio * endTick),
                );
                player.seekToTick(target);
            }
        };

        const seekToProgress = (progress: number) => {
            applyProgress(Math.max(0, Math.min(1, progress)), true);
        };

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                seekMs(-ARROW_KEY_SEEK_MS);
                return;
            case 'ArrowRight':
                e.preventDefault();
                seekMs(ARROW_KEY_SEEK_MS);
                return;
            case 'Home':
                e.preventDefault();
                seekToProgress(0);
                return;
            case 'End':
                e.preventDefault();
                seekToProgress(1);
                return;
            default:
                // Ignore — let the browser handle Tab and other keys.
                break;
        }
    };

    return (
        <div
            ref={trackRef}
            className="psef-progress"
            role="slider"
            tabIndex={0}
            aria-label="Oynatma konumu"
            aria-valuemin={0}
            aria-valuemax={0}
            aria-valuenow={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
        >
            <div className="psef-progress__fill" ref={fillRef} aria-hidden="true" />
            <style>{`
                .psef-progress {
                    position: relative;
                    width: 100%;
                    height: 16px;
                    padding: 6px 0;
                    cursor: pointer;
                    touch-action: none;
                }
                .psef-progress::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    height: 4px;
                    margin-top: -2px;
                    border-radius: 2px;
                    background: var(--brand-border);
                    pointer-events: none;
                }
                .psef-progress__fill {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    height: 4px;
                    margin-top: -2px;
                    border-radius: 2px;
                    background: var(--brand-secondary);
                    transform: scaleX(0);
                    transform-origin: 0 50%;
                    pointer-events: none;
                    will-change: transform;
                }
                .psef-progress:focus-visible {
                    outline: none;
                }
                .psef-progress:focus-visible::before {
                    box-shadow: 0 0 0 3px rgba(134, 41, 255, 0.35);
                }
            `}</style>
        </div>
    );
}
