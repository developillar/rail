/**
 * Packages the web export into ONE self-contained HTML file.
 *
 * Why: a hosted preview that anyone can open on a phone, with no install, no
 * dev server and no network. The Artifact host blocks every external request,
 * so the four assets the app actually uses — three JetBrains Mono weights and
 * the grain tile — are inlined as data URIs. Their URLs appear as literal
 * strings in the Metro bundle, so this is a substitution rather than a patch.
 *
 *   npm run build:pages          # produces dist/
 *   node scripts/make-standalone.js
 *
 * Output: dist-standalone/rail.html
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, process.env.STANDALONE_DIST || 'dist-web');
const OUT_DIR = path.join(ROOT, 'dist-standalone');

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const bundleRel = /src="([^"]+\.js)"/.exec(html)?.[1];
if (!bundleRel) throw new Error('no bundle <script src> in dist/index.html');
let bundle = fs.readFileSync(path.join(DIST, bundleRel.replace(/^\//, '')), 'utf8');

/** Every asset the app reaches for at runtime, and where it lives on disk. */
const ASSETS = [
  ['assets/assets/grain', 'image/png', path.join(DIST, 'assets/assets')],
  ['400Regular/JetBrainsMono_400Regular', 'font/ttf', null],
  ['500Medium/JetBrainsMono_500Medium', 'font/ttf', null],
  ['700Bold/JetBrainsMono_700Bold', 'font/ttf', null],
];

const dataUri = (file, mime) =>
  `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;

let inlined = 0;
for (const [needle, mime] of ASSETS) {
  // The bundle carries the finished URL as a string literal, hash and all.
  const re = new RegExp(`"[^"]*${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.[a-f0-9]+\\.[a-z0-9]+"`, 'g');
  const match = bundle.match(re);
  if (!match) throw new Error(`asset not found in bundle: ${needle}`);
  const url = match[0].slice(1, -1);
  const onDisk = path.join(DIST, url.replace(/^\//, ''));
  if (!fs.existsSync(onDisk)) throw new Error(`missing on disk: ${onDisk}`);
  bundle = bundle.split(match[0]).join(JSON.stringify(dataUri(onDisk, mime)));
  inlined += 1;
}

// The react-native-web reset from the exported document, kept verbatim.
const reset = /<style id="expo-reset">([\s\S]*?)<\/style>/.exec(html)?.[1] ?? '';

const page = `<title>RAIL</title>
<style>
${reset}
/* The app is a single dark surface and owns every pixel inside it: no page
   chrome, no theme of this document's own, nothing to fight it. */
html, body { margin: 0; background: #0a0a0b; overscroll-behavior: none; }
#root { display: flex; height: 100%; }
</style>
<div id="root"></div>
<script>
  // expo-router resolves the first screen from window.location, and a hosted
  // page is never served from the root. Normalise the path before the bundle
  // boots so the app opens on its index instead of an unmatched route.
  try {
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/' + window.location.search + window.location.hash);
    }
  } catch (e) {
    /* sandboxed without same-origin access: the app still opens on its index */
  }
</script>
<script>
${bundle}
</script>
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
const out = path.join(OUT_DIR, 'rail.html');
fs.writeFileSync(out, page);
console.log(`inlined ${inlined} assets → ${out} (${(page.length / 1048576).toFixed(2)} MB)`);
