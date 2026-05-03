'use client';

/**
 * ControlBar — unified bottom toolbar for the Psefitone Player Cockpit.
 *
 * # What this file does
 *
 * Hosts two sub-groups, separated by a 1 px divider:
 *  - LEFT (flex: 1 1 auto): the existing `<PlayerControls />` — play/pause,
 *    speed slider, time label, clear-loop pill. Its 60-fps ref-driven
 *    discipline is preserved verbatim; this wrapper does NOT introduce any
 *    new state in position handlers.
 *  - RIGHT (flex: 0 0 auto): the `<LayoutModeToggle />` (two icon buttons:
 *    side-by-side / stacked).
 *
 * The outer `.cockpit-toolbar` div carries `role="toolbar"` and the toolbar's
 * accessible name. PlayerControls' inner wrapper has been demoted from
 * `role="toolbar"` to `role="group"` (transport sub-group) so we don't have
 * two nested toolbars in the a11y tree.
 *
 * # Why this is a separate component
 *
 * The toolbar is rendered ONCE by PlayerCockpit per ready cycle. Splitting
 * it out keeps PlayerCockpit's render tree shallow and isolates the
 * a11y/styling concerns of the toolbar from the orchestration concerns of
 * the cockpit.
 */

import PlayerControls from './PlayerControls';
import LayoutModeToggle from './LayoutModeToggle';
import TransportModeToggle from './TransportModeToggle';
import MetronomeToggle from './MetronomeToggle';
import TransportProgressBar from './TransportProgressBar';
import VariantSelector from './VariantSelector';
import type AccordionPlayer from './AccordionPlayer';
import type { LessonPlayerVariant } from '@/lib/player/lesson';

type LayoutMode = 'side-by-side' | 'stacked';
type TransportMode = 'video' | 'synth';

interface ControlBarProps {
    /** The buffered facade. Always non-null when this component renders —
     *  PlayerCockpit gates the mount on `readyForPlayback && playerRef.current`. */
    player: AccordionPlayer;
    mode: LayoutMode;
    onModeChange: (mode: LayoutMode) => void;
    transport: TransportMode;
    onTransportChange: (transport: TransportMode) => void;
    /** Live `<video>` element ref — forwarded into `<TransportProgressBar>`
     *  so drag-to-seek can write `currentTime` directly when the video
     *  master is attached. */
    videoElRef: React.RefObject<HTMLVideoElement | null>;
    /** Slice 3: lesson recording variants. Rendered as <VariantSelector>
     *  next to <TransportModeToggle> so source-related controls cluster
     *  together visually. <VariantSelector> renders nothing when there's
     *  ≤1 variant. */
    variants: LessonPlayerVariant[];
    activeVariantId: string;
    onVariantChange: (id: string) => void;
}

export default function ControlBar({
    player,
    mode,
    onModeChange,
    transport,
    onTransportChange,
    videoElRef,
    variants,
    activeVariantId,
    onVariantChange,
}: ControlBarProps) {
    return (
        <div
            className="cockpit-toolbar"
            role="toolbar"
            aria-label="Oynatıcı kontrolleri"
        >
            <TransportProgressBar player={player} videoElRef={videoElRef} />
            <div className="cockpit-toolbar__row">
                <div className="cockpit-toolbar__transport">
                    <PlayerControls player={player} isReadyForPlayback />
                </div>
                <div className="cockpit-toolbar__divider" aria-hidden="true" />
                <div className="cockpit-toolbar__layout">
                    <TransportModeToggle
                        transport={transport}
                        onTransportChange={onTransportChange}
                    />
                    <VariantSelector
                        variants={variants}
                        activeVariantId={activeVariantId}
                        onVariantChange={onVariantChange}
                    />
                    <MetronomeToggle player={player} />
                    <LayoutModeToggle mode={mode} onModeChange={onModeChange} />
                </div>
            </div>
        </div>
    );
}
