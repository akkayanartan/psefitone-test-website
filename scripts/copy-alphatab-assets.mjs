#!/usr/bin/env node
/**
 * copy-alphatab-assets.mjs
 *
 * Idempotent postinstall hook that copies AlphaTab's runtime static assets
 * (worker, classical UMD bundle, soundfont(s), music fonts) from the installed
 * npm package into the Next.js `public/` tree, where they can be served at
 * the URL root.
 *
 * Run from `nextjs-app/` (i.e. cwd === the Next.js project root).
 *
 * Source : node_modules/@coderline/alphatab/dist/
 *   - alphaTab.worker.*  (web worker — exact filename varies by build)
 *   - alphaTab.js / alphaTab.min.js
 *       Classical (non-ESM, UMD/CJS-style) bundles. Required because under
 *       Turbopack, AlphaTab's `WebPlatform` detection misclassifies the
 *       runtime as `Browser` (classical) instead of `BrowserModule` (ESM)
 *       when `import.meta.url` is rewritten by the bundler. AlphaTab then
 *       falls back to spawning a Blob worker whose body is
 *       `importScripts(settings.core.scriptFile)`. If `scriptFile` points
 *       at the bundled-chunk URL (an ES module), `importScripts` (a classic
 *       worker API) silently fails — and the synth worker never bootstraps.
 *       Shipping the UMD bundle as a static asset and pointing
 *       `core.scriptFile` at it (e.g. `/alphatab/alphaTab.min.js`) makes
 *       `importScripts` succeed. See AlphaTabPlayer.tsx for the call site.
 *   - soundfont/*.sf2|*.sf3   (one or more General MIDI soundfonts)
 *   - font/**            (Bravura music font + WOFF2 + metadata)
 *
 * Destination : public/alphatab/
 *   - <worker>           (e.g. alphaTab.worker.mjs at URL /alphatab/...)
 *   - alphaTab.js / alphaTab.min.js (UMD bundles for the synth-worker fix)
 *   - <soundfont(s)>     (e.g. sonivox.sf3 at URL /alphatab/sonivox.sf3)
 *   - font/**            (URL /alphatab/font/...)
 *
 * Notes:
 *   - All copies use { force: true, recursive: true } so a re-run on a warm
 *     `node_modules/` overwrites cleanly without throwing.
 *   - Filenames are discovered dynamically (no hardcoded names beyond the
 *     glob `alphaTab.worker.*`). The first run logs every file copied so the
 *     downstream player code (settings.core.scriptFile, settings.player.soundFont)
 *     can be wired with the verified filename.
 *   - The UMD bundle copy is opt-in per filename — we explicitly check for
 *     `alphaTab.js` and `alphaTab.min.js` rather than glob-matching, so we
 *     never accidentally pull in unrelated dist files (`.d.ts`, vite/webpack
 *     bundler entrypoints, the ESM `.mjs` variants, etc.).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TAG = '[copy-alphatab-assets]';

// Resolve paths relative to the Next.js project root (nextjs-app/).
// We deliberately use process.cwd() because npm runs postinstall from the
// package.json directory; this matches the script's documented contract.
const projectRoot = process.cwd();
const pkgDir = path.join(projectRoot, 'node_modules', '@coderline', 'alphatab');
const distDir = path.join(pkgDir, 'dist');
const destRoot = path.join(projectRoot, 'public', 'alphatab');

console.log(`${TAG} starting`);
console.log(`${TAG} project root : ${projectRoot}`);
console.log(`${TAG} source dist  : ${distDir}`);
console.log(`${TAG} destination  : ${destRoot}`);

// Bail with a clear error if the package isn't installed yet.
// (npm install runs the dependency download *before* postinstall, so this
//  should never fire in normal flow — but if someone runs the script
//  manually on a fresh clone, fail loud.)
if (!fs.existsSync(distDir)) {
  console.error(
    `${TAG} ERROR: dist directory not found at ${distDir}. ` +
      `Did you forget to run \`npm install\` first?`,
  );
  process.exit(1);
}

// Make sure the destination root exists. Idempotent — recursive:true is a
// no-op if it already exists.
fs.mkdirSync(destRoot, { recursive: true });

let filesCopied = 0;

/**
 * Copy a single file (force overwrite). Logs the source/dest pair.
 */
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { force: true });
  console.log(`${TAG} copy file  : ${path.relative(distDir, src)}  ->  ${path.relative(projectRoot, dest)}`);
  filesCopied++;
}

/**
 * Recursively copy a directory tree (force overwrite). Logs each file
 * copied. We walk manually instead of leaning on `fs.cpSync(... recursive)`
 * for the directory case so we get per-file log lines.
 */
function copyDirectory(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`${TAG} skip dir   : ${srcDir} (not found)`);
    return;
  }
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      copyFile(srcPath, destPath);
    }
  }
}

// 1. Worker file(s). Discovered via prefix match on `alphaTab.worker.`.
//    Current 1.8.x ships `alphaTab.worker.mjs`, but we don't hardcode that.
const workerFiles = fs
  .readdirSync(distDir, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.startsWith('alphaTab.worker.'))
  .map((e) => e.name);

if (workerFiles.length === 0) {
  console.error(
    `${TAG} ERROR: no worker file found in ${distDir} (expected something matching \`alphaTab.worker.*\`).`,
  );
  process.exit(1);
}

for (const name of workerFiles) {
  copyFile(path.join(distDir, name), path.join(destRoot, name));
}

// 2. Classical UMD bundle (`alphaTab.js` / `alphaTab.min.js`). Used as the
//    `core.scriptFile` value so the synth-worker's classical bootstrap
//    (`importScripts(scriptFile)` inside a Blob worker) succeeds under
//    Turbopack — see header comment above and AlphaTabPlayer.tsx.
//
//    We check for each filename explicitly (instead of widening the glob to
//    `alphaTab.*` and filtering) because the dist directory contains many
//    similarly-named files we do NOT want to ship to public/ (`alphaTab.mjs`,
//    `alphaTab.core.mjs`, `alphaTab.vite.js`, `alphaTab.webpack.js`,
//    `.d.ts` typings, etc.). Only the two UMD/CJS-compatible classical
//    bundles are copied; everything else stays in node_modules where the
//    bundler can find it via normal ESM resolution.
const umdBundleNames = ['alphaTab.js', 'alphaTab.min.js'];
let umdBundleCount = 0;
for (const name of umdBundleNames) {
  const src = path.join(distDir, name);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(destRoot, name));
    umdBundleCount++;
  }
}
if (umdBundleCount === 0) {
  console.error(
    `${TAG} ERROR: no UMD bundle found in ${distDir} ` +
      `(expected one or both of: ${umdBundleNames.join(', ')}). ` +
      `The synth worker will fail to bootstrap without this — see header comment.`,
  );
  process.exit(1);
}

// 3. Soundfont(s). The package may ship multiple variants (.sf2, .sf3) — copy
//    them all so downstream code can pick whichever it prefers.
const soundfontDir = path.join(distDir, 'soundfont');
if (fs.existsSync(soundfontDir)) {
  for (const entry of fs.readdirSync(soundfontDir, { withFileTypes: true })) {
    if (entry.isFile()) {
      copyFile(path.join(soundfontDir, entry.name), path.join(destRoot, entry.name));
    }
  }
} else {
  console.warn(`${TAG} no soundfont/ directory at ${soundfontDir}`);
}

// 4. Music font directory (Bravura + friends). Copy the whole tree.
const fontSrc = path.join(distDir, 'font');
const fontDest = path.join(destRoot, 'font');
copyDirectory(fontSrc, fontDest);

console.log(`${TAG} done: copied ${filesCopied} files to public/alphatab/`);
