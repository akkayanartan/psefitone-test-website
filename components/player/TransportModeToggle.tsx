'use client';

/**
 * TransportModeToggle — two-button toggle for synth-only / video transport.
 *
 * Mirrors the structure of `LayoutModeToggle.tsx` so the right-side toolbar
 * group reads as a coherent set of icon-button toggles. `Music2` reads as
 * "synthesizer / instrument" (AlphaTab's internal synth drives playback);
 * `Video` reads as "video master" (the existing split-pane + video-master
 * mode). Active mode is indicated via `aria-pressed="true"` plus the
 * brand-secondary tint defined under `.psef-transport-toggle__btn` in
 * `globals.css`.
 *
 * The toggle is purely a state writer — it does NOT mount/unmount panes
 * itself. PlayerCockpit reads `layoutState.transport` and decides whether
 * to render the SplitPane or the bare NotationPane.
 */

import { Music2, Video } from 'lucide-react';

type TransportMode = 'video' | 'synth';

interface TransportModeToggleProps {
    transport: TransportMode;
    onTransportChange: (transport: TransportMode) => void;
}

export default function TransportModeToggle({
    transport,
    onTransportChange,
}: TransportModeToggleProps) {
    return (
        <div
            className="psef-transport-toggle"
            role="group"
            aria-label="Çalma kaynağı"
        >
            <button
                type="button"
                className="psef-transport-toggle__btn"
                aria-pressed={transport === 'synth'}
                aria-label="Sentezleyici"
                title="Sentezleyici"
                onClick={() => onTransportChange('synth')}
            >
                <Music2 size={18} aria-hidden="true" />
            </button>
            <button
                type="button"
                className="psef-transport-toggle__btn"
                aria-pressed={transport === 'video'}
                aria-label="Video"
                title="Video"
                onClick={() => onTransportChange('video')}
            >
                <Video size={18} aria-hidden="true" />
            </button>
        </div>
    );
}
