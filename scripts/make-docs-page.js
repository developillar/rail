/**
 * Renders docs/PRD.md and docs/DESIGN.md into one readable page.
 *
 * The subject is RAIL, so the page is set in RAIL's own vocabulary rather than a
 * generic documentation theme: the ground, the bone ink, JetBrains Mono for
 * every figure and label, hairline rules instead of cards, and amber reserved —
 * here it marks nothing at all, because a document has neither a clock nor a
 * crowd. Single-theme on purpose: the app commits to one dark world and a
 * light-mode version of this page would describe a product that does not exist.
 *
 *   node scripts/make-docs-page.js   →  dist-standalone/docs.html
 *
 * `marked` is a dev-time-only dependency (installed with --no-save); the output
 * is a static file with the fonts inlined, so it needs no network.
 */
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist-standalone', 'docs.html');

const FONTS = [
  ['JetBrainsMono_400Regular', '400Regular/JetBrainsMono_400Regular.ttf'],
  ['JetBrainsMono_500Medium', '500Medium/JetBrainsMono_500Medium.ttf'],
  ['JetBrainsMono_700Bold', '700Bold/JetBrainsMono_700Bold.ttf'],
];

const face = ([family, rel]) => {
  const file = path.join(ROOT, 'node_modules/@expo-google-fonts/jetbrains-mono', rel);
  const b64 = fs.readFileSync(file).toString('base64');
  return `@font-face{font-family:'${family}';src:url(data:font/ttf;base64,${b64}) format('truetype');font-display:block}`;
};

const DOCS = [
  ['prd', 'The product', 'docs/PRD.md'],
  ['design', 'The design', 'docs/DESIGN.md'],
  ['shell', 'The app shell', 'docs/APP-SHELL-SPEC.md'],
];

marked.setOptions({ mangle: false, headerIds: true });

const sections = DOCS.map(([id, label, rel]) => {
  const md = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  return { id, label, rel, html: marked.parse(md) };
});

const css = `
${FONTS.map(face).join('\n')}

:root{
  --ground:#0a0a0b;
  --ink:#e8e7e4;
  --mono:'JetBrainsMono_400Regular',ui-monospace,Menlo,monospace;
  --sans:Helvetica,Arial,sans-serif;
}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--sans);
  -webkit-font-smoothing:antialiased;font-size:15px;line-height:1.62;overflow-x:hidden}

/* The rail: one 2px rule bracketing the document, exactly as every masthead in
   the app is bracketed. */
header{position:sticky;top:0;background:var(--ground);z-index:2;
  border-bottom:2px solid rgba(232,231,228,.8);padding:18px 22px 12px}
.wordmark{font:700 20px/1 'JetBrainsMono_700Bold',var(--mono);letter-spacing:.26em}
.meta{font:400 8px/1 var(--mono);letter-spacing:.14em;color:rgba(232,231,228,.5);
  text-transform:uppercase;margin-top:9px}
nav{display:flex;gap:0;margin-top:14px;flex-wrap:wrap}
nav a{font:400 8px/1 var(--mono);letter-spacing:.22em;text-transform:uppercase;
  color:rgba(232,231,228,.4);text-decoration:none;padding:8px 14px 8px 0}
nav a:hover,nav a:focus-visible{color:var(--ink);outline:none}

main{max-width:680px;margin:0 auto;padding:0 22px 96px}
section{padding-top:34px}
.eyebrow{font:400 7px/1 var(--mono);letter-spacing:.3em;text-transform:uppercase;
  color:rgba(232,231,228,.5);padding-bottom:14px}

/* Type contrast: the document title against its 7px eyebrow is the same ratio
   the screens hold. */
h1{font:700 30px/1.12 'JetBrainsMono_700Bold',var(--mono);letter-spacing:-.02em;
  margin:0 0 22px;text-wrap:balance}
h2{font:700 15px/1.3 'JetBrainsMono_700Bold',var(--mono);letter-spacing:.02em;
  margin:44px 0 0;padding-top:14px;border-top:1px solid rgba(232,231,228,.2);text-wrap:balance}
h3{font:500 11px/1.4 'JetBrainsMono_500Medium',var(--mono);letter-spacing:.16em;
  text-transform:uppercase;color:rgba(232,231,228,.62);margin:30px 0 0}
h4{font:400 10px/1.4 var(--mono);letter-spacing:.18em;text-transform:uppercase;
  color:rgba(232,231,228,.5);margin:24px 0 0}
p,ul,ol,blockquote{margin:14px 0 0}
/* Long unbroken tokens — a token name, a hex, a path — break rather than push
   the page sideways. */
p,li,td,h1,h2,h3,h4{overflow-wrap:anywhere}
ul,ol{padding-left:20px}
li{margin:7px 0}
li::marker{color:rgba(232,231,228,.35)}
strong{font-weight:400;font-family:'JetBrainsMono_500Medium',var(--mono);font-size:.94em;
  letter-spacing:.01em}
em{font-style:italic;color:rgba(232,231,228,.82)}
a{color:var(--ink);text-decoration:none;border-bottom:1px solid rgba(232,231,228,.3)}
a:hover{border-bottom-color:var(--ink)}
hr{border:0;border-top:1px solid rgba(232,231,228,.14);margin:34px 0 0}
blockquote{border-left:2px solid rgba(232,231,228,.3);padding-left:16px;
  color:rgba(232,231,228,.7)}
code{font:400 12.5px/1.5 var(--mono);color:rgba(232,231,228,.9);
  background:#15161a;padding:1px 5px}
pre{background:#15161a;border-left:2px solid rgba(232,231,228,.22);padding:14px 16px;
  overflow-x:auto;margin:16px 0 0}
pre code{background:none;padding:0;font-size:11.5px;line-height:1.65}

/* Wide content scrolls in its own container; the page never scrolls sideways. */
.table-wrap{overflow-x:auto;margin:18px 0 0}
table{border-collapse:collapse;width:100%;font-size:13px;
  font-variant-numeric:tabular-nums}
th{font:400 7.5px/1.4 var(--mono);letter-spacing:.22em;text-transform:uppercase;
  color:rgba(232,231,228,.5);text-align:left;padding:0 14px 8px 0;
  border-bottom:1px solid rgba(232,231,228,.28);white-space:nowrap}
td{padding:9px 14px 9px 0;border-bottom:1px solid rgba(232,231,228,.1);
  vertical-align:top}
td code{font-size:11.5px}

footer{max-width:680px;margin:0 auto;padding:0 22px 60px;
  font:400 7px/1.7 var(--mono);letter-spacing:.12em;text-transform:uppercase;
  color:rgba(232,231,228,.32);border-top:1px solid rgba(232,231,228,.14);padding-top:16px}

@media (max-width:520px){
  h1{font-size:24px}
  main{padding:0 18px 80px}
  header{padding:16px 18px 10px}
}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
`;

// marked emits bare <table>; wrap each so a wide table scrolls on its own.
const wrapTables = (html) => html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');

const page = `<title>RAIL — product and design</title>
<style>${css}</style>
<header>
  <div class="wordmark">RAIL</div>
  <div class="meta">Product and design · social poker rooms with friends · play chips only</div>
  <nav>${sections.map((s) => `<a href="#${s.id}">${s.label}</a>`).join('')}</nav>
</header>
<main>
${sections
  .map(
    (s) => `<section id="${s.id}">
  <div class="eyebrow">${s.rel}</div>
  ${wrapTables(s.html)}
</section>`,
  )
  .join('\n')}
</main>
<footer>
  Chips are play chips · they cannot be bought, transferred or cashed out<br>
  Credits buy objects, never chips
</footer>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, page);
console.log(`wrote ${OUT} (${(page.length / 1048576).toFixed(2)} MB, ${sections.length} documents)`);
