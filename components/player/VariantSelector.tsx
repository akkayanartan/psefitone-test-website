'use client';

/**
 * VariantSelector — recording variant picker for the Player Cockpit toolbar.
 *
 * # What this does
 *
 * Renders one icon button per `LessonPlayerVariant`. Click a button → swap the
 * active recording. PlayerCockpit re-derives `activeSrc` from the new id and
 * passes it into `<VideoPane>`, which propagates it to `<VideoBackingTrack>`'s
 * `<video src>` attribute. The browser fires a fresh `loadedmetadata` for the
 * new file; VideoBackingTrack restores the prior `currentTime` so the user
 * stays at the same point in the lesson across the swap.
 *
 * # Why icon buttons (not a `<select>`)
 *
 * v1 has at most a small handful of variants per lesson. A horizontal icon
 * group reads as a peer of `<TransportModeToggle>` and `<MetronomeToggle>` —
 * same 36×36 button skin, same aria-pressed semantics. The plan reserves a
 * `<select>`-based fallback for >3 variants; once a real lesson hits that
 * threshold, the upgrade lives in this file alone.
 *
 * # Why this renders nothing for a single variant
 *
 * If a lesson only has one recording there's no choice to make. Rendering a
 * solitary "active" pseudo-toggle would be visual noise. Returning `null`
 * keeps the toolbar clean for the common case.
 *
 * # Accessibility
 *
 * The outer wrapper carries `role="group"` + `aria-label="Kayıt seçimi"` so
 * the toolbar's a11y tree reads as a labelled radio-style group. Each button
 * exposes `aria-pressed` for the active state and `aria-label` + `title` so
 * the human-readable variant name is announced (the icon alone has no
 * meaning to a screen reader).
 */

import { Film } from 'lucide-react';
import type { LessonPlayerVariant } from '@/lib/player/lesson';

interface VariantSelectorProps {
    variants: LessonPlayerVariant[];
    activeVariantId: string;
    onVariantChange: (id: string) => void;
}

export default function VariantSelector({
    variants,
    activeVariantId,
    onVariantChange,
}: VariantSelectorProps) {
    if (variants.length <= 1) return null;

    return (
        <div
            className="psef-variant-toggle"
            role="group"
            aria-label="Kayıt seçimi"
        >
            {variants.map((v) => (
                <button
                    key={v.id}
                    type="button"
                    className="psef-variant-toggle__btn"
                    aria-pressed={v.id === activeVariantId}
                    aria-label={v.label}
                    title={v.label}
                    onClick={() => onVariantChange(v.id)}
                >
                    <Film size={18} aria-hidden="true" />
                </button>
            ))}
        </div>
    );
}
