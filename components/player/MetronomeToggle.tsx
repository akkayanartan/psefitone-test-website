'use client';

/**
 * MetronomeToggle — single icon-button that flips AlphaTab's metronome on/off.
 *
 * The wrapper exposes `metronomeVolume` as a direct number setter; AlphaTab
 * does not emit any event when the value changes, so the toggle keeps a
 * local boolean mirror. On click we flip the local state and write
 * `0.4` (a sensible audible default per the player overhaul plan) when
 * enabled, `0` when disabled.
 *
 * The button uses the same visual language as `psef-layout-toggle__btn`
 * but stands alone (no role="group" wrapper) since it's a single toggle,
 * not a 2-button radio. Styling lives under `.psef-toolbar-btn` in
 * `globals.css`.
 */

import { useState } from 'react';
import { Activity } from 'lucide-react';
import type AccordionPlayer from './AccordionPlayer';

const METRONOME_VOLUME_ON = 0.4;
const METRONOME_VOLUME_OFF = 0;

interface MetronomeToggleProps {
    /** The buffered facade. Always non-null when this component renders —
     *  ControlBar only mounts after `readyForPlayback`. */
    player: AccordionPlayer;
}

export default function MetronomeToggle({ player }: MetronomeToggleProps) {
    // Local mirror — `player.metronomeVolume` doesn't emit events. Lazy
    // initializer reads the wrapper at mount so HMR / future remounts with
    // a non-zero `_metronomeVolume` don't desync the toggle's "off" label
    // from audibly-running synth clicks.
    const [enabled, setEnabled] = useState<boolean>(
        () => player.metronomeVolume > 0,
    );

    return (
        <button
            type="button"
            className="psef-toolbar-btn"
            aria-pressed={enabled}
            aria-label={enabled ? 'Metronomu kapat' : 'Metronomu aç'}
            title="Metronom"
            onClick={() => {
                const next = !enabled;
                setEnabled(next);
                player.metronomeVolume = next
                    ? METRONOME_VOLUME_ON
                    : METRONOME_VOLUME_OFF;
            }}
        >
            <Activity size={18} aria-hidden="true" />
        </button>
    );
}
