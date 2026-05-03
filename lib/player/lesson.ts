/**
 * LessonPlayerRecord — the per-lesson data contract consumed by `<PlayerCockpit>`.
 *
 * Slice 3 introduces a variant selector. A lesson can carry multiple recordings
 * (e.g. main camera + alternate angle, original tempo + slowed-down take). The
 * cockpit picks the `isDefault` variant on first mount and lets the user switch
 * between them via `<VariantSelector>` in the toolbar.
 *
 * The trim/offset hooks live at the lesson level (not per-variant) since v1
 * assumes all variants of a lesson share the same musical content alignment.
 * If a future lesson needs per-variant trims, this contract is the place to
 * lift them down to the variant.
 */

export interface LessonPlayerVariant {
    id: string;
    label: string;
    src: string;
    isDefault?: boolean;
}

export interface LessonPlayerRecord {
    id: string;
    // At least one variant required; tuple type enforces this at compile time.
    variants: [LessonPlayerVariant, ...LessonPlayerVariant[]];
    videoTrimStart?: number;
    videoTrimEnd?: number;
    videoOffset?: number;
}

/**
 * Sample record for `/lab/player`. Both variants point at `/sample-lesson.mp4`
 * because only one MP4 lives in `public/`. The duplication is intentional —
 * it lets the variant switcher be exercised end-to-end (state change, src
 * re-bind, currentTime preservation) without a second asset. Replace the
 * `alt.src` once a real alternate take exists.
 */
export const sampleLessonRecord: LessonPlayerRecord = {
    id: 'lab-sample',
    variants: [
        {
            id: 'main',
            label: 'Ana Kayıt',
            src: '/sample-lesson.mp4',
            isDefault: true,
        },
        { id: 'alt', label: 'Alternatif', src: '/sample-lesson.mp4' },
    ],
};
