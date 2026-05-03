'use client';

/**
 * NotationPane — frame around `<AlphaTabHost>` for the Player Cockpit.
 *
 * # What this file does
 *
 * Same shape as `VideoPane.tsx`: pane-level frame + the conditional chevron
 * that expands the OTHER (video) pane back when it's been collapsed.
 *
 * Unlike the video pane, this pane mounts `<AlphaTabHost>` UNCONDITIONALLY —
 * the host is the source of the readiness signal that gates the rest of the
 * cockpit. AlphaTab will paint its own loading state (and eventually the
 * notation) inside this pane regardless of whether the player is ready for
 * playback.
 *
 * # Sizing
 *
 * AlphaTabHost's inner `<div>` is `width: 100%; height: 100%`. The pane is
 * also `width: 100%; height: 100%` of whatever the SplitPane gives it. The
 * `min-height: 0` + `min-width: 0` on the parent flex chain ensures the
 * notation can actually shrink past its content's intrinsic size when the
 * splitter compresses the pane — without that, AlphaTab's rendered SVG would
 * push the pane wider than the splitter intended.
 *
 * The pre-Step-5 `60vh` viewport hack is GONE — pixels come from the splitter
 * now, not from the viewport.
 */

import AlphaTabHost from './AlphaTabHost';
import PaneCollapseButton from './PaneCollapseButton';
import type AccordionPlayer from './AccordionPlayer';
import type { AlphaTabApi } from '@coderline/alphatab';
import type { SplitOrientation, SplitCollapsed } from './SplitPane';

interface NotationPaneProps {
    onWrapperReady: (wrapper: AccordionPlayer, api: AlphaTabApi) => void;
    onReadyForPlayback: () => void;
    collapsed: SplitCollapsed;
    orientation: SplitOrientation;
    /** Click handler for the chevron that expands the OTHER (video) pane
     *  back. Provided by PlayerCockpit which resets to 50/50. */
    onExpandOther: () => void;
}

export default function NotationPane({
    onWrapperReady,
    onReadyForPlayback,
    collapsed,
    orientation,
    onExpandOther,
}: NotationPaneProps) {
    // Show "expand the video pane" chevron only when the FIRST child (video)
    // is collapsed — the notation pane is currently full-bleed.
    const showExpandChevron = collapsed === 'first';
    // Direction points TOWARD the collapsed pane. In horizontal layout the
    // video lives to the left → chevron left. In vertical it lives above
    // → chevron up.
    const direction: 'left' | 'up' =
        orientation === 'horizontal' ? 'left' : 'up';

    return (
        <div
            className="player-pane player-pane--notation"
            data-orientation={orientation}
        >
            <AlphaTabHost
                onWrapperReady={onWrapperReady}
                onReadyForPlayback={onReadyForPlayback}
            />
            {showExpandChevron && (
                <div className="player-pane__chevron player-pane__chevron--start">
                    <PaneCollapseButton
                        direction={direction}
                        onClick={onExpandOther}
                        ariaLabel="Videoyu göster"
                    />
                </div>
            )}
        </div>
    );
}
