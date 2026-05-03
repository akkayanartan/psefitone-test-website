/**
 * sample.alphatex.ts — inline alphaTex source for the `/lab/player` preview.
 *
 * Score-only (no tab) accordion phrase. Loaded into the `AlphaTabApi` via
 * `api.tex(sampleAlphaTex)` — no network request, no asset path. Pure string.
 *
 * The tex grammar uses the AlphaTab dialect (see https://alphatab.net/docs/alphatex/introduction).
 *
 * Anatomy of the snippet:
 *  - `\title`, `\subtitle` — printed above the staff (when titles are enabled).
 *  - `\tempo 96` — quarter-note BPM. Comfortable practice tempo.
 *  - `\track "Accordion"` — single track, named so the wrapper can target it later.
 *  - `\instrument 21` — General MIDI program 21 (Accordion). Won't sound like a
 *    real piano-accordion (sonivox is a generic GM bank) but is the right channel.
 *  - `.` — separates header from beats.
 *  - Bars: four 4/4 bars stepping up + back down a one-octave C-major scale,
 *    finishing on a whole note. Score-only phrase, deliberately small so the
 *    Step 4 render gate is unambiguous: count four bars, treble clef, no tab.
 *
 * Beat duration syntax (`:N`) — `:4` = quarter, `:8` = eighth, `:1` = whole.
 * Pitch syntax (`c4`, `g4`, …) — note name + octave (middle C = `c4`).
 *
 * Source-of-truth: `_archive/guitarbear/guitarbear-source/PSEFITONE-PLAYER-PLAN.md` §6.
 */
export const sampleAlphaTex = `
\\title "Psefitone Player Preview"
\\subtitle "Standard notation, score only"
\\tempo 96
\\track "Accordion"
\\instrument 21
.
:4 c4 d4 e4 f4 |
:4 g4 a4 b4 c5 |
:8 c5 b4 a4 g4 f4 e4 d4 c4 |
:1 c4 |
`.trim();
