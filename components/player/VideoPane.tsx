'use client';

/**
 * VideoPane — frame around the `<VideoBackingTrack>` for the Player Cockpit.
 *
 * # What this file does
 *
 * Provides the pane-level frame (background, padding, the relative position
 * context for the absolute chevron) that previously lived inside
 * `VideoBackingTrack`. The frame moved up here because the cockpit now has TWO
 * panes (video + notation) and they both need consistent framing — without
 * double-framing the inner content.
 *
 * The pane is also the host for the "expand the other pane back" chevron,
 * which is rendered ONLY when the *other* pane (notation, second child of
 * SplitPane) is collapsed. Its position depends on the splitter orientation:
 *  - horizontal (side-by-side): chevron points right, sits on the right edge.
 *  - vertical (stacked): chevron points down, sits on the bottom edge.
 *
 * # Mount gate
 *
 * `<VideoBackingTrack>` is mounted only when `ready && player` are both
 * truthy. This mirrors the pre-Step-5 gate inside `AlphaTabPlayer.tsx` — we
 * need a live wrapper to call `attachVideo()` on, and the readiness signal
 * means the wrapper has been wired to the api.
 *
 * Until ready, the pane renders empty (transparent over the cockpit's dark2
 * background). The notation pane shows AlphaTab's loading dots in the same
 * window, so the user's gaze isn't on this pane during the wait.
 */

import { useRef } from 'react';
import VideoBackingTrack from './VideoBackingTrack';
import PaneCollapseButton from './PaneCollapseButton';
import type AccordionPlayer from './AccordionPlayer';
import type { SplitOrientation, SplitCollapsed } from './SplitPane';

interface VideoPaneProps {
    player: AccordionPlayer | null;
    ready: boolean;
    src?: string;
    videoTrimStart?: number;
    videoTrimEnd?: number;
    videoOffset?: number;
    collapsed: SplitCollapsed;
    orientation: SplitOrientation;
    /** Click handler for the chevron that expands the OTHER (notation) pane
     *  back. Provided by PlayerCockpit which resets to 50/50. */
    onExpandOther: () => void;
    /** Whether playback is currently playing — drives the play-overlay
     *  fade inside `<VideoBackingTrack>`. Owned by PlayerCockpit. */
    playing: boolean;
    /** Click-to-play handler — wired to `player.playPause()` by
     *  PlayerCockpit. */
    onSurfaceClick: () => void;
    /** Forwarded into `<VideoBackingTrack>` — mirrors the live
     *  `<video>` element so `<TransportProgressBar>` can read its
     *  `duration` and write `currentTime` for drag-to-seek. */
    videoElRef?: React.RefObject<HTMLVideoElement | null>;
}

export default function VideoPane({
    player,
    ready,
    src,
    videoTrimStart,
    videoTrimEnd,
    videoOffset,
    collapsed,
    orientation,
    onExpandOther,
    playing,
    onSurfaceClick,
    videoElRef,
}: VideoPaneProps) {
    // Show "expand the notation pane" chevron only when the second child
    // (notation) is collapsed — the video pane is currently full-bleed.
    const showExpandChevron = collapsed === 'second';
    // Direction of the chevron points TOWARD the collapsed pane. In
    // horizontal layout the notation lives to the right → chevron right.
    // In vertical layout the notation lives below → chevron down.
    const direction: 'right' | 'down' =
        orientation === 'horizontal' ? 'right' : 'down';

    // The aspect-ratio frame that wraps the video. Default ratio is
    // 16/9 (CSS var fallback); on `loadedmetadata` VideoBackingTrack
    // overwrites `--video-ratio` with the video's natural ratio so the
    // letterbox bands collapse to the true intrinsic shape.
    const frameRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            className="player-pane player-pane--video"
            data-orientation={orientation}
        >
            <div ref={frameRef} className="player-pane__video-frame">
                {/* The actual video track — only mounted once readiness fires.
                    The inner component handles its own with-video / missing-file
                    fork; here we don't need to peek. */}
                {ready && player && (
                    <VideoBackingTrack
                        player={player}
                        src={src}
                        videoTrimStart={videoTrimStart}
                        videoTrimEnd={videoTrimEnd}
                        videoOffset={videoOffset}
                        playing={playing}
                        onSurfaceClick={onSurfaceClick}
                        frameRef={frameRef}
                        videoElRef={videoElRef}
                    />
                )}
            </div>
            {showExpandChevron && (
                <div className="player-pane__chevron player-pane__chevron--end">
                    <PaneCollapseButton
                        direction={direction}
                        onClick={onExpandOther}
                        ariaLabel="Notayı göster"
                    />
                </div>
            )}
        </div>
    );
}
