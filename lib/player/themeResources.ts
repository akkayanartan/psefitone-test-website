/**
 * themeResources — Psefitone palette → AlphaTab `display.resources`.
 *
 * # What this module does (Step 5 scope)
 *
 * Reads the live Psefitone CSS custom properties from `:root` at runtime and
 * maps them onto the (small) set of color knobs AlphaTab actually exposes via
 * `RenderingResourcesJson`. Returned object is plugged straight into the
 * `display.resources` slot of the AlphaTab settings JSON in
 * `components/player/AlphaTabPlayer.tsx`.
 *
 * Reading tokens at runtime — instead of hardcoding hex literals — keeps the
 * notation in lockstep with the design system: a future palette tweak in
 * `globals.css` propagates to the staff lines and glyphs without anyone
 * touching this file.
 *
 * # AlphaTab 1.8.2 reality check (do not skip this)
 *
 * The plan-author speculated about a much larger surface
 * (`cursorBackgroundColor`, `cursorBorderColor`, `wordsColor`, `effectColor`,
 * `fingeringColor`, `pageBackgroundColor`, etc.). **None of those exist.**
 * Verified by reading
 * `node_modules/@coderline/alphatab/dist/alphaTab.d.ts` lines 14589-14687
 * (`interface RenderingResourcesJson`). The full color surface in 1.8.2 is
 * exactly six keys:
 *
 *   - `staffLineColor`        → lines 14651-14656  (staff + ledger lines)
 *   - `barSeparatorColor`     → lines 14657-14662  (bar lines, accolade, repeat signs)
 *   - `barNumberColor`        → lines 14663-14668  (numerals above each system)
 *   - `mainGlyphColor`        → lines 14669-14674  (note heads, stems, beams, clefs, accidentals — primary voice)
 *   - `secondaryGlyphColor`   → lines 14675-14680  (same set, secondary voice — defaults to 40% black)
 *   - `scoreInfoColor`        → lines 14681-14686  (score header — title/subtitle/composer/copyright text)
 *
 * Anything *not* in that list — cursors, played-note highlight, page
 * background, dynamic markings ("f"/"p"), fingerings — is **not** themable
 * via `display.resources`. Those are styled via CSS classes that AlphaTab
 * stamps on its DOM at render time. Specifically:
 *
 *   - `.at-cursor-bar`   (the wide wash for the currently-playing bar)
 *   - `.at-cursor-beat`  (the sharp vertical line for the current beat)
 *   - `.at-highlight`    (note glyphs while their tick range is active)
 *   - `.at-selection`    (loop range highlight wash)
 *
 * Verified by reading `alphaTab.core.mjs` line 47578-47619 (cursor DOM
 * scaffolding) and line 47558 (highlight classlist add). Those rules belong
 * in scoped CSS — not in this module — which is why this file returns
 * **only** the six color tokens AlphaTab itself consumes. Cursor + highlight
 * CSS lives in `globals.css` so it travels with the design system.
 *
 * # SSR safety
 *
 * `getComputedStyle(document.documentElement)` blows up under Node SSR.
 * `AlphaTabPlayer.tsx` already sits behind `dynamic(..., { ssr: false })`
 * so this should never run server-side, but a one-line guard makes the
 * function safe to import from anywhere — including future test harnesses
 * or storybook contexts that might not bother with the dynamic-import dance.
 *
 * # Color string format
 *
 * AlphaTab's `ColorJson` accepts CSS-compatible hex strings:
 * `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`, `rgb(r,g,b)`, `rgba(r,g,b,a)`.
 * Verified at `alphaTab.d.ts` line 5841-5849. We pass hex/rgba strings
 * through verbatim — AlphaTab's parser handles them all.
 */

/**
 * Local type for the JSON-shaped resources object that AlphaTab's
 * `SettingsJson` accepts.
 *
 * Why declared inline instead of imported: AlphaTab's `RenderingResourcesJson`
 * interface is `declare interface` (non-exported, internal to the .d.ts) at
 * line 14589 — it's the JSON-shaped twin of the exported `RenderingResources`
 * *class*. The exported class uses concrete `Color` instances on every field
 * (line 14547+), but the JSON form accepts `ColorJson = Color | string |
 * number` (line 5849). Since we feed the result into `new AlphaTabApi(el,
 * settingsJson)` — whose constructor signature is `SettingsJson | Settings`
 * (line 261) — we want the JSON shape with strings, not the class shape with
 * `Color` instances.
 *
 * We mirror the public surface manually with the exact same six keys.
 * If a future minor bump renames or adds a key, TypeScript won't catch it
 * here directly, but `npm run build` will: AlphaTab's settings parser
 * (`alphaTab.core.mjs`) logs warnings for unknown resource keys at
 * runtime, and the existing `logLevel: LogLevel.None` would suppress
 * those — so the safety net is the build's snapshot test of the rendered
 * SVG colors. That's an acceptable trade for the cleaner type.
 */
type ThemeResources = {
    staffLineColor?: string;
    barSeparatorColor?: string;
    barNumberColor?: string;
    mainGlyphColor?: string;
    secondaryGlyphColor?: string;
    scoreInfoColor?: string;
};

/**
 * Fallback hex literals for each token. Mirrors the values currently set
 * in `app/globals.css` `:root`. These should never trigger in practice
 * (the variables are always defined on `<html>`), but if `getComputedStyle`
 * returns an empty string for any reason — a misnamed token, a future
 * scoped-token-block change, etc. — we ship sensible defaults instead of
 * AlphaTab rendering the staff in `transparent`. Source: globals.css
 * lines 55-63.
 *
 * Only the keys this module actually consumes are listed. `--brand-secondary`
 * (electric violet) and `--brand-accent` (warm gold) drive the cursor /
 * highlight CSS rules in `globals.css`, not this module — see the
 * "Keys NOT mapped" note inside `buildThemeResources`.
 */
const FALLBACK = {
    primary: '#cbc3d6',
    text: '#f0ecf8',
    muted: '#c2bad1',
    border: 'rgba(203, 195, 214, 0.15)',
} as const;

/**
 * Build the AlphaTab `display.resources` object from live Psefitone tokens.
 *
 * Called exactly once, at AlphaTab construction time, inside
 * `AlphaTabPlayer.tsx`'s `useEffect`. Pure data return — no side effects,
 * no caching, no DOM mutation. Cheap enough to call on every mount: a
 * single `getComputedStyle` read + 6 `.getPropertyValue` calls.
 */
export function buildThemeResources(): ThemeResources {
    // SSR guard — `document` is undefined in Node. Import-time safety net so
    // this module is safe to import from server contexts even though the
    // *call* would be a programming error there. Returns an empty object,
    // which is a valid `RenderingResourcesJson` (every property is optional)
    // and lets AlphaTab fall back to its built-in defaults.
    if (typeof document === 'undefined') return {};

    const cs = getComputedStyle(document.documentElement);
    /**
     * Read a CSS custom property from `:root`, trim leading/trailing
     * whitespace (Chrome/Edge can return ` #cbc3d6` with a leading space
     * depending on how the variable was declared), and fall back to the
     * literal hex if the variable is empty/undefined.
     */
    const tok = (name: string, fallback: string): string => {
        const raw = cs.getPropertyValue(name);
        const trimmed = raw.trim();
        return trimmed.length > 0 ? trimmed : fallback;
    };

    const primary = tok('--brand-primary', FALLBACK.primary);
    const text = tok('--brand-text', FALLBACK.text);
    const muted = tok('--brand-muted', FALLBACK.muted);
    const border = tok('--brand-border', FALLBACK.border);
    // `--brand-accent` (warm gold) and `--brand-secondary` (electric violet)
    // are intentionally not read here. AlphaTab 1.8.2's
    // `RenderingResourcesJson` has no slot for dynamics, effect, or cursor
    // colors — those are styled via CSS classes (`.at-cursor-bar`,
    // `.at-cursor-beat`, `.at-highlight`, `.at-selection`) in `globals.css`.
    // When a future minor bump adds a key like `dynamicsColor`, add a
    // `tok('--brand-accent', '#e3e0aa')` read here and wire it in.

    /**
     * The mapping. Each line cites the token role per the psefitone-design
     * skill (color system table) plus the AlphaTab semantic for the key.
     *
     * Token-role pairings (rationale):
     *
     *   `staffLineColor` ← `--brand-border`
     *     Staff lines and ledger lines should be barely-there scaffolding,
     *     not visual emphasis. `--brand-border` is `rgba(203,195,214,0.15)`
     *     — translucent lavender, the same tone used for whisper-thin
     *     dividers everywhere else on the site. Keeps the staff present
     *     but quiet.
     *
     *   `barSeparatorColor` ← `--brand-border`
     *     Bar lines are structural, same role as staff lines. Pairing them
     *     keeps the whole structural skeleton at the same visual weight.
     *
     *   `barNumberColor` ← `--brand-muted`
     *     Bar numbers are reading-aid metadata — useful but secondary.
     *     `--brand-muted` (`#c2bad1`) puts them at the same visual weight
     *     as captions and supporting text elsewhere.
     *
     *   `mainGlyphColor` ← `--brand-text`
     *     Notes, stems, beams, flags, clefs, time signatures, key
     *     signatures, accidentals — the "ink" of the score. Off-white
     *     `--brand-text` (`#f0ecf8`) gives maximum contrast against the
     *     `--brand-dark2` shell while staying inside the warm-luxury
     *     palette (no harsh #fff).
     *
     *   `secondaryGlyphColor` ← `--brand-muted`
     *     Secondary voice glyphs (default 40% black) demoted to muted
     *     lavender — visible, but subordinate to the main voice.
     *
     *   `scoreInfoColor` ← `--brand-primary`
     *     The header block (title + subtitle + tempo + composer) sits
     *     above the staff in the same role as a section heading. Lavender
     *     `--brand-primary` (`#cbc3d6`) treats it the same way the rest
     *     of the site treats Playfair italic accents — soft, warm,
     *     editorial.
     *
     * Keys NOT mapped (because they don't exist in AlphaTab 1.8.2):
     *
     *   - cursor colors           → CSS classes `.at-cursor-bar`/`.at-cursor-beat`
     *                                (styled in `globals.css`)
     *   - played-note highlight   → CSS class `.at-highlight`
     *                                (styled in `globals.css`)
     *   - selection range         → CSS class `.at-selection`
     *                                (styled in `globals.css`)
     *   - dynamic markings (f/p)  → not a separate color key in 1.8.2;
     *                                rendered as glyphs via `mainGlyphColor`.
     *   - page/canvas background  → AlphaTab's surface is transparent by
     *                                default (verified — no `background`
     *                                property anywhere in core.mjs); the
     *                                container's own background shows
     *                                through. We use `--brand-dark2` on
     *                                the wrapper in `AlphaTabPlayer.tsx`.
     *
     * Engraving / font keys (`elementFonts`, `tablatureFont`, `graceFont`,
     * `numberedNotationFont*`) are intentionally untouched — Step 5 is
     * colors only. Font theming is a separate later workstream.
     */
    return {
        // STRUCTURE — staff lines, bar lines (whisper-thin, lavender alpha)
        staffLineColor: border,
        barSeparatorColor: border,

        // METADATA — bar numbers (muted, supporting role)
        barNumberColor: muted,

        // INK — primary + secondary voice glyphs (off-white + muted)
        mainGlyphColor: text,
        secondaryGlyphColor: muted,

        // HEADER — title/subtitle block above the staff (lavender, editorial)
        scoreInfoColor: primary,
    } satisfies ThemeResources;
}
