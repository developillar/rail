# Poker app design review agenda

_Started 2026-07-29 05:35 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "# Claude Design Brief — RAIL??? Paste **Part 1**. Then fire the asks in **Part 2"
The project currently has no files except possibly dotfiles — a `list_files` on the project root would return nothing else.
Current date is now July 28, 2026
</system-info>

<default aesthetic_system_instructions>
The user has not attached a design system. If they have ALSO not attached references or art direction, and the project is empty, you must ASK the user what visual aesthetic they want. Use the questions_v2 tool to ask about preferred vibe, audience, colors, type, mood, etc. Do NOT just pick your own visual aesthetic without getting the user's aesthetic input -- this is how you get slop!

Once answered, use this guidance when creating designs:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are files in the project already.
</default aesthetic_system_instructions>

<pasted_text name="Pasted text (212 lines)">
# Claude Design Brief — RAIL

&gt; Paste **Part 1**. Then fire the asks in **Part 2** one at a time.

---

# PART 1 — The brief

## What this is

**RAIL** is a portrait, mobile, social poker app. No-Limit Hold'em, play chips only,
six seats. It monetizes **expression** — throwables, celebrations, table skins —
never chips, ads, or rake.

Everything is 2D. No 3D, no perspective, no WebGL. Flat, but not flat-looking.

**The bar:** plausible as an App Store Design Award finalist. It should look like
one person with strong taste made every decision deliberately. It should not look
generated.

## The name is the concept

In poker, **the rail** is where the spectators stand. Railbirds are the people
watching — commenting, reacting, invested in a hand they aren't playing. The name
is not decoration. It states what the product is: **poker's social layer, not
poker's table.**

Two consequences you should design into everything:

**Watching is a first-class activity.** Spectating a friend's table, reacting to a
hand from outside it, and seeing hands after the fact are not secondary features.
They are the thesis. The social feed *is* the rail.

**A rail is a line.** Four letters, all caps, and the mark can literally be a
hairline rule. Consider making a single line the recurring structural device
throughout the app — dividers, the action bar edge, the pot boundary, the timer,
the progress indicator, the wordmark itself. One idea applied ruthlessly across
every surface is what separates designed work from decorated work. If you find a
better spine, propose it, but bring an argument.

---

## Banned — the tells

These are the specific things that make an interface read as machine-made. None
appear in this app, at any point, for any reason.

**Color**
- Purple or violet gradients. Indigo-to-pink. Teal-to-purple. That whole family.
- Gradients generally. One exception permitted: a single radial falloff on the felt.
- More than one accent color.

**Surface**
- Glassmorphism — frosted panels, backdrop blur, translucent floating cards.
- Soft drop shadows on every element.
- Uniform corner radius everywhere, especially 12px or 16px.
- Cards nested inside cards inside cards.
- Decoration that means nothing — floating orbs, blurred blobs, abstract shapes.

**Type**
- A ramp like 14 / 16 / 20 / 24. That evenness is the giveaway.
- More than two weights.
- Proportional figures anywhere a number appears.

**Layout**
- Everything centered.
- Symmetric three-column grids of equal cards.
- Identical padding throughout. Uniform spacing is the loudest tell of all.

**Detail**
- Emoji used as icons.
- Generic rounded-stroke icon sets.
- Press states that only change opacity.

---

## Required — the counter-moves

- **Violent type contrast.** At least 4× between smallest and largest type on any
  screen. A 12px label beside a 64px numeral.
- **Density variation.** Every screen needs one tight, information-dense zone and
  one that is mostly empty. Uniform density is what makes generated layouts dead.
- **One accent, used rarely.** Under 5% of any screen. If it's everywhere it means
  nothing.
- **Texture.** Grain, weave, paper tooth, or noise somewhere. This does more to
  kill the plastic look than anything else here.
- **Motion with weight.** Overshoot, anticipation, settle. Chips have mass. Cards
  have stiffness. Nothing fades linearly.
- **Optical alignment over mathematical**, especially numerals and icons.
- **Confidence in emptiness.** If a screen looks too empty, it is probably right.

---

## Aesthetic direction

Every poker app in the store looks identical: green or blue felt, oval table, gold
accents, glossy chips, casino signifiers. **Rejecting casino visual language
entirely is the highest-leverage move available.**

Explore all three. One screen — the table, 6-max, mid-hand — in each, before we go
further.

**A. Terminal.** The table as a precision instrument. Near-black ground, monospace
numerals, hairline geometry, measurement ticks, one signal color. No felt texture —
the table is a drawn form, not a simulated surface. Braun meets a trading terminal.
Cold, exact, expensive. The line-as-spine idea is most natural here.

**B. Broadsheet.** Light mode. Bone paper, black ink, one red. Poker as editorial
infographic — the table is a diagram, not a simulation. Numerals set like a
financial page. **No poker app in the store is light-mode**, which makes this the
most differentiated screenshot you could put on a listing.

**C. Table.** Extreme materiality, zero chrome. Real felt weave at high fidelity,
real card stock, clay chips with genuine edge wear. The interface *is* the physical
objects — no panels floating above them. Restrained and photographic, never glossy
or beveled.

Fixed regardless of direction: **portrait only, max-width 480px, safe-area insets
respected, everything interactive inside thumb reach.**

---

## Copy constraint — every screen

Positioning is **"Social poker rooms with friends. Play chips only."** Chips are
non-transferable and have no value. No label, button, or empty state may imply
money can be won, deposited, or withdrawn. No "value," no "prize," no hints about
real money later. This shapes what things are named, not just what disclaimers say.

---

## Expression — the product wedge

Emotes are **objects with physics**, in 2D. Not stickers, not overlays.

| Moment | Behavior |
|---|---|
| Throw | Select a throwable, target an opponent. It arcs across the table with real trajectory and spin. |
| Impact | Lands on the target's nameplate and **persists** as residue until the hand ends. |
| Win | The winner's seat celebrates with weight and follow-through. |
| Cooldown | 2.5s per player. Visible, not nagging. |

Railbirds can react too — spectators throwing from outside the hand is the feature
the name demands, and it needs its own visual treatment distinct from player emotes.

**The interaction I most want solved:** targeting an opponent, in portrait, during a
live hand, without accidental sends and without covering the table. Two or three
genuinely different approaches, not variations on one.

---

## Screens

Minimal means fewer screens designed properly, not more designed thinly.

1. Table, 6-max, mid-hand
2. Action bar — your turn, waiting, folded, all-in
3. Bet slider and quick bets
4. Emote tray and targeting
5. Showdown and win
6. **The rail** — spectating a live table you aren't seated at
7. Feed — hands, clips, reactions
8. Lobby
9. Profile and cosmetics loadout
10. Shop

Nothing else until these are right.

---

# PART 2 — Ask in this order

**1.** The **table, 6-max, mid-hand**, in all three directions. One screen each, no
variations within a direction. I'll pick one and we kill the other two.

**2.** Once a direction is locked — the **action bar in all four states**, plus bet
slider and quick bets. Most-touched surface in the app. It has to feel like an
instrument.

**3.** **Throwable targeting.** Two or three genuinely different approaches,
including the cooldown treatment.

**4.** **Showdown and win**, as motion keyframes rather than a static screen. This
is the emotional peak and it repeats hundreds of times — satisfying on the first
viewing, invisible by the hundredth.

**5.** **The rail** — the spectator view. This is the screen that earns the name, and
it has no reference anywhere in the category. Show how a railbird watches, reacts,
and joins.

**6.** The **feed** and its reaction system.

**7.** The **lobby.** Resist making it a dashboard.

**8.** **Profile, loadout, and shop.** Earned and purchased cosmetics must be
distinguishable at a glance — that distinction is load-bearing for the whole
progression system.

**9.** A **motion spec** — every animation, its curve, duration, and trigger, in one
document.

**10.** **Wordmark, app icon, and six App Store screenshots.**

---

## How to work with me

- I react to working artifacts, not concepts. Build it, then we'll talk.
- Variations only where a decision is genuinely open. One option where it isn't.
- Premium-industrial over cartoon, always. Gamified, never cute.
- When in doubt, remove something.

</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Design Components">
This project uses Design Components: every design is a single streaming `Name.dc.html` file. The full authoring spec is in your system prompt under "Writing code — Design Components" — follow it. Author and edit `.dc.html` content with the `dc_write`, `dc_html_str_replace`, `dc_js_str_replace`, and `dc_set_props` tools (not `write_file`; `str_replace_edit` works but won't stream); template edits stream into the live preview as you type.
</attached-skill>


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

_[tool: read_skill_prompt]_

_[tool: read_skill_prompt]_

_[tool: set_project_title]_

_[tool: dc_write]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Turn 1 is up: same hand, three directions.

Two rules I applied across all three, and you should shoot them down if you disagree:

- **The accent belongs to time and expression only** — the clock, emote residue, railbird reaction. Never to chips. Chip counts sit in neutral ink, which is also the positioning: play chips get no signal color.
- **The table boundary is a real line.** Player emotes land inside it; railbirds live outside it. In 1a the boundary is literally six hairline segments with a notch cut for each seat.

1a Terminal — mono numerals, measurement ticks, amber signal, filled-bone primary. 1b Broadsheet — bone paper, Bodoni pot numeral, the table drawn as a labelled diagram, hand history set as agate. 1c Table — wool weave, stamped names, clay chips with dashed edge wear, leather rail seam with a token per railbird.

Tweaks on the file: grain on/off, rail layer on/off, and a clock scrubber so you can see the timer at any point.

## User

PART 2 — Ask in this order
1. The table, 6-max, mid-hand, in all three directions. One screen each, no
variations within a direction. I’ll pick one and we kill the other two.
2. Once a direction is locked — the action bar in all four states, plus bet
slider and quick bets. Most-touched surface in the app. It has to feel like an
instrument.
3. Throwable targeting. Two or three genuinely different approaches,
including the cooldown treatment.
4. Showdown and win, as motion keyframes rather than a static screen. This
is the emotional peak and it repeats hundreds of times — satisfying on the first
viewing, invisible by the hundredth.
5. The rail — the spectator view. This is the screen that earns the name, and
it has no reference anywhere in the category. Show how a railbird watches, reacts,
and joins.
6. The feed and its reaction system.
7. The lobby. Resist making it a dashboard.
8. Profile, loadout, and shop. Earned and purchased cosmetics must be
distinguishable at a glance — that distinction is load-bearing for the whole
progression system.
9. A motion spec — every animation, its curve, duration, and trigger, in one
document.
10. Wordmark, app icon, and six App Store screenshots.

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Turn 2 is at the top of the canvas — six cards, each the bottom 452px of the same screen so the states line up.

I locked 1a Terminal to keep moving, since ask 2 needs mono numerals and ticks to feel like an instrument. If you pick 1b instead, the geometry ports directly — only palette and type change.

Three calls in there worth arguing about:

- **The amber clock is yours alone.** Another player's clock runs as a bone hairline (2b). The accent marks time *you own*, not time in general — otherwise it's on screen every few seconds and means nothing.
- **Waiting is not dead time.** Queue fold, call-any, or check like a resting order; throw is never blocked by turn order.
- **Folded makes you a railbird at your own table** (2c). Cards become empty outlines, controls leave, rail ticks arrive, and the space stays empty. Throw is shown mid-cooldown as a preview of ask 3.

The slider (2e) is a slide rule, not a pill: minor ticks every 100, four named stops, 2px thumb with a diamond head, 44px amount against a 9px label. All-in arms before it fires (2f).

Say go and I'll take ask 3, throwable targeting.

## User

Save as standalone HTML: `RAIL Table.dc.html`

## Assistant

_[tool: read_skill_prompt]_

_[tool: read_file]_

## User

Continue with task 3 to 9

