# RAIL — Design rationale

Why the app looks like this, and how to keep it looking like this.

This document is for two readers. The owner, who did not write the code and wants to know which
choices were deliberate, what they cost, and where they are arguable. And the next designer, who
should read it before touching a pixel, because most of what makes RAIL look designed rather than
decorated is a small number of rules applied without exception — and the failure mode is not ugly
work, it is *average* work.

Two companion documents. `README.md` says what exists. `docs/APP-SHELL-SPEC.md` is the canonical
spec for the shell — navigation, boot, HOME, TABLES, FRIENDS — down to the unit. This file is the
argument underneath both. Where this file and the code disagree, the code is what ships and the
disagreement is a bug in one of them; §9 lists the ones I know about.

---

## 1. Three directions, one locked

The brief asked for the same screen — the table, six-max, mid-hand — in three directions, then a
kill. The premise was that every poker app in the store looks identical (green felt, oval table,
gold, glossy chips) and that **rejecting casino visual language entirely is the highest-leverage
move available**. All three directions reject it; they disagree about what to replace it with.

| | **A · Terminal** (locked) | **B · Broadsheet** | **C · Table** |
|---|---|---|---|
| Ground | near-black `#0a0a0b` | bone paper `#f3f0e8` | charcoal wool felt |
| Figures | JetBrains Mono | financial-page numerals, Bodoni pot | stamped into the cloth |
| The table is | a drawn form — six hairline segments with a notch cut per seat | a labelled diagram with leader lines | a real surface: woven tooth, bone card stock, clay chips with edge wear |
| The rail is | a line | a rule between columns | a leather seam with a token per railbird |
| Reference | Braun meets a trading terminal | a financial page | a card room, photographed |
| Weakness | coldest; can read as austere | riskiest at arm's length in a dark room | least legible at a glance |

**Terminal was locked at the end of ask 1** — before the action bar, deliberately, because ask 2
needed mono numerals and ticks to make an instrument, and stalling on the direction would have
cost more than picking. The argument for it was not "it looks best". It was structural: *Terminal
is the only one of the three where the line is load-bearing rather than stylistic.* The product is
named after a line. In Terminal the table boundary **is** six hairline segments with a gap where a
player sits; the rail **is** a rule with faces hanging off it; the clock **is** a 2px rule
draining; the app icon **is** one boundary hairline broken by one notch. In Broadsheet the rule is
a typographic convention borrowed from newspapers, and in Table it is a seam in leather. Both are
fine. Neither makes the name mean anything.

The second reason: expression is the business. Throwables land on people and persist. A near-black
ground with one signal colour gives an emote somewhere to *be* — an amber diamond on bone-on-black
is unmissable at 12 units. On bone paper the same object has to fight the page; on felt it has to
fight the weave.

### What was given up

**Killing Broadsheet cost the best App Store listing.** No poker app in the store is light-mode.
That is a genuine, measurable differentiator on a page where you compete as six thumbnails, and
Terminal's near-black screenshot sits in a category of near-black screenshots — it is
differentiated by its *geometry*, which is a slower read than a differentiated *value*. It also
cost the one direction that would have looked at home in daylight. If the owner ever wants to
revisit this, note that the geometry ports: the boundary, the notch, the busts, the tick strips and
the slide rule are all value-independent. It is a palette and a type-pairing change, roughly
`tokens.ts` plus the eight surface steps, not a redesign. What would *not* port is the amber
budget — one warm accent on bone paper needs to become one red, and "amber belongs to time and
expression" would need re-deriving from scratch.

**Killing Table cost warmth, and cost it permanently.** Terminal has exactly one texture (grain)
and no materials. There is nothing in the app that feels like an object you could pick up. That is
the intended trade — "premium-industrial over cartoon, always" — but it means RAIL will never be
cosy, and a social product that is never cosy is making a bet that precision reads as respect. I
think it does. It is the most contestable thing about the whole direction.

---

## 2. The law

Nine rules. A reviewer should be able to hold a screen against this list and get a yes or a no on
each. For each I have written what breaking it *looks* like, because that is the part people miss:
these do not fail loudly, they fail by making a screen look like every other screen.

### 1. One accent, and it belongs to time and expression

Ground is `#0a0a0b`. Ink is bone `#e8e7e4` at alphas through `ink(a)`. Amber `#fe7825` through
`amber(a)` is the only accent, and it is reserved for **time** (the clock, the cooldown) and
**expression** (the crowd, a throw, reaction marks). Never on chips, stakes, seats, names, buttons
or navigation. Under 5% of any screen.

Two refinements that matter more than the rule: *your* clock is amber, another player's clock is a
bone hairline — the accent marks time you own, not time in general, or it is on screen every few
seconds and means nothing. And earned items' ticks are bone, not amber, so provenance never borrows
the crowd's colour.

**Breaking it looks like:** an amber "Take seat" button. An amber active tab. An amber chip count.
The instant amber becomes the app's "primary" colour, the clock stops being urgent and the crowd
stops being loud, and you have a generic dark-mode app with an orange brand colour. The whole shell
— boot, four destinations, every masthead — contains exactly **two** amber marks: HOME's `0:06`
clock and FRIENDS' single crowd mark.

### 2. Every figure is mono; every sentence is Helvetica

Numbers go in `<Mono>` (JetBrains Mono). Labels, headlines and button text go in `<Sans>`
(Helvetica). Never a numeral inside a Helvetica string — which is why the door on HOME reads
`Walk in on Bea's table` with `238 WATCHING` set beside it in mono, rather than "Walk in on table
12".

**Breaking it looks like:** `Take seat 1 · min 4,000` in one Helvetica line. It will not look
*wrong*. It will look like a normal app, the numerals will not align in a column, and the
instrument feeling — the thing that makes a bet slider read as measurement — evaporates.

### 3. Violent type contrast: at least 4×

At least 4× between the smallest and largest type on a screen. A 7px mono eyebrow beside a 78px
numeral. Never a 14/16/20/24 ramp — that evenness is the tell.

Where the app actually stands, smallest to largest type (the masthead wordmark counts, it is type):

| Screen | Range | Ratio | |
|---|---|---|---|
| HOME | 7 → 78 | 11.1× | ✓ |
| FRIENDS | 7 → 62 | 8.9× | ✓ |
| Table | 7 → 46 | 6.6× | ✓ |
| Boot | 7 → 44 | 6.3× | ✓ |
| Rail | 6.5 → 34 | 5.2× | ✓ |
| Floor | 6.5 → 30 | 4.6× | ✓ |
| Clip | 6.5 → 30 | 4.6× | ✓ |
| TABLES | 7 → 30 | 4.3× | ✓ |
| Feed | 7 → 26 | 3.7× | under |
| Shop | 6.5 → 22 | 3.4× | under |
| Profile | 6.5 → 20 | 3.1× | under |
| Loadout | 6.5 → 20 | 3.1× | under |

The four that fall short are the edition and the three ownership screens, and the defence is that
their contrast is carried by *object* scale rather than type: a 118 × 96 earned tile against 6.5px
agate on `/profile`, a 72-unit bust against 8px meta. That is a real argument and it is also
exactly the argument someone makes when they have quietly drifted into a 12/14/16/20 ramp. **My
recommendation: the ownership screens want one large figure each** — the record's career total, the
counter's balance — which would fix the ratio and improve the screens. The feed is the harder case:
an edition is *supposed* to be even, and 26 is already the pot. I would leave the feed and fix the
other three.

**Breaking it looks like:** nothing. That is the danger. A 14/16/20/24 screen reads as competent
and forgettable, and it is the single most reliable signature of generated design.

### 4. Hairline rules are the structure — no cards

Sections are divided by 1px and 2px rules, never by cards. Forbidden outright: rounded corners,
drop shadows, gradients, blur, translucent panels, cards nested in cards, uniform padding
everywhere, generic icon sets, and emoji used as icons (emoji are **only** avatars and throwables).

The app is named after a line, so the line does all the work a card would: the 2px `ink(0.8)` rule
at y=56 brackets every document; the nav bar's 2px rule at the foot brackets it from below; three
route cells on HOME are separated by two vertical hairlines rather than boxed; a slab is a 1px
border with a bone fill, not a rounded button.

**Breaking it looks like:** one listing wrapped in a 1px box with 12px radius, because the row felt
loose. Then all six. Then the app is a card app, and the rail is decoration.

The two places radius exists are deliberate and narrow: the drag puck and the landing ring in
targeting are circles. A circle is a shape; a 12px-radius rectangle is a softened box. If you find
yourself adding `borderRadius` to something rectangular, that is the violation.

### 5. Density variation — one dense zone, one nearly empty

Every screen needs one information-dense zone and one that is nearly empty. Uniform density is what
makes generated layouts dead. Each screen's file names its own: HOME's dense zone is `YOU, TONIGHT`
(380 → 684, six figures, four provenance tiles, three routes in 300 units) and its empty zone is
56 → 300 (five objects in 244 units). TABLES: dense 190 → 866, empty 56 → 190 (three objects in 134
units). FRIENDS: dense 496 → 1236, empty 56 → 250.

**Breaking it looks like:** a screen where every band is 88 units tall with 20 units of padding.
Legible, balanced, dead.

### 6. Confidence in emptiness

If a screen looks too empty it is probably right. HOME dedicates 244 units to five objects and ends
on 76 units of nothing. The folded state of the table removes the controls and *leaves the space
empty* rather than filling it with a "waiting" panel.

**Breaking it looks like:** filling HOME's empty zone with a roster (which eats FRIENDS) or a second
room (which eats TABLES). The discipline stated in `app/home.tsx` is worth quoting as the general
form: **HOME's hero is one figure and one sentence, forever.**

### 7. Motion comes off the ladder

Five named curves in `src/design/motion.ts`, eleven durations in `MS`. A duration outside the ladder
is a bug. Meters — a clock, a cooldown, a loading progress — run on elapsed time and are exempt.
Reanimated only; never mutate a shared value during render, always inside `useEffect`. Full
treatment in §5.

### 8. Screens are authored in design units on the 420 canvas

Absolutely positioned `<Box l= t= r= w= h=>` inside `<Screen height={N} mode="fit"|"scroll">`. No
flex-flow layout at screen level; flex only inside a slab or a row of tiles. This is what keeps a
hairline landing on the pixel it was drawn on, and it is what makes a spec written in units
implementable without judgement.

**Breaking it looks like:** a screen that reflows on a 320pt phone, so the pot numeral stops being
centred on the board and the notch stops falling where a seat is.

### 9. Copy: play chips only, and it shapes the nouns

Positioning is "social poker rooms with friends, play chips only". Chips are non-transferable and
worthless. Nothing may imply money can be won, deposited, cashed out or transferred. Credits (CR)
buy cosmetics only. Every destination carries the constraint in its foot, in mono agate, as a
statement of fact rather than a disclaimer: `CHIPS ARE PLAY CHIPS · THEY CANNOT BE BOUGHT,
TRANSFERRED OR CASHED OUT` / `CREDITS BUY OBJECTS, NEVER CHIPS`.

This is a design rule, not a legal one, because it decides what things are *called*. `Sit first`,
not "Join now". `Just watch`, not "Spectate". `Invite by handle` with `NOBODY CAN SEND CHIPS` in the
figure slot. A shop section titled `NOT FOR SALE`.

And the voice: **mono uppercase eyebrows with wide tracking** for anything naming a territory or a
measurement (`WHERE YOUR PEOPLE ARE`, `SORTED BY NOISE, NEVER BY STAKES`), **sentence-case Helvetica**
for human sentences and for anything you press to do a thing (`Take seat 1`, `Walk in`). Moving
between rooms of the app is not doing a thing, which is why the nav labels are mono.

### 10. Reuse the objects

Do not reinvent a bust, a rule, a tick strip, a reaction mark or an earned tile. §4 is the
inventory. The reason is not DRY, it is that the app's meaning lives in these objects: a ticked
strip above a head means "a throwable lands here", and if a second component draws ticks above a
head for decoration, the first one stops meaning anything.

---

## 3. The token system

Everything in `src/design/tokens.ts`. It is 132 lines and it is the whole visual system; if you
read one file, read that one.

### Colour

| Token | Value | What it is for |
|---|---|---|
| `GROUND` | `#0a0a0b` | the only background in the app |
| `INK` / `ink(a)` | `#e8e7e4` | bone. The app's only neutral, used at alphas |
| `AMBER` / `amber(a)` | `#fe7825` | the signal. Time and expression only |
| `AMBER_LIGHT` | `#fabc86` | one use: a *named* target in the throw readout |
| `CARD_RED` | `#e8dcd2` | hearts and diamonds — warm bone, **never red** |
| `CARD_BLACK` | `#dfe3e4` | spades and clubs, a hair cooler than hearts |

There is **no red anywhere in the app** — not on a suit, not on a loss, not on an error. Losing is
drawn as a subtraction: your bust desaturates and drops 3 units, your cards go to outline, your
stack counts *down* with no delta chip. The 3 units of drop is the entire body language of losing.
A red number would have done the job in one stroke and would have made the app a casino.

`ink(a)` and `amber(a)` return the flat hex at `a >= 1` and an `rgba()` string below it, so there is
one call site for every neutral in the app and no hard-coded rgba strings to drift.

The two chromatic values were authored as `oklch(.72 .185 47)` and `oklch(.84 .1 62)`. React Native
has no `oklch()`, so they are converted to their exact sRGB hex once, in the token file, with the
original oklch written in the comment above them. See §6.3.

### Type

Two helpers, and they exist to solve one specific translation problem:

```ts
mono(size, weight = 400, tracking = 0, lineHeight = 1)   // JetBrains Mono
sans(size, weight = 400, tracking = 0, lineHeight = 1)   // Helvetica
```

**Letter-spacing is multiplied by size** because CSS `letter-spacing` is em-relative and React
Native's `letterSpacing` is absolute points. `mono(20, 700, 0.26)` emits `letterSpacing: 5.2`, which
is what `.26em` means at 20px. Tracking is therefore always written the way a designer thinks about
it — as a fraction of the size — and any size change carries its tracking with it automatically.
This is also why the boot handoff works: the wordmark scales 44 → 20 through a transform, and
because letter-spacing rides on the transform, `.26em` holds exactly across the animation.

`lineHeight` is a multiplier with a floor of `0.8`, rounded to 2dp — so `lh={0.9}` on a 78px numeral
is a real leading of 70.2, and a large figure can crowd its own box without a magic pixel value.
`font-variant-numeric: tabular-nums` from the prototype is dropped as unnecessary: JetBrains Mono is
monospaced, so every figure is already tabular and nothing reflows while a stack counts.

Weights: mono at 400 (agate), 500 (mid), 700 (figures and the wordmark); Helvetica at 400 and 500.
That is three mono weights, and the brief banned "more than two weights". I think the third is
earned — 400 for agate, 700 for figures, 500 for the middle register that would otherwise force
every mid-size number to shout — but it is a deviation, it is the kind of thing that grows to five
weights if nobody watches it, and if you want to hold the brief literally, the weight to cut is 500.

On Android, `FONT.sans` resolves to `sans-serif` (Roboto), not Helvetica; there is no Helvetica on
Android and bundling one is a licence question, not a design one. Helvetica's role here is to be
neutral and unremarkable next to the mono, and Roboto does that. It is a real difference in the
Helvetica lowercase 'a' and 'R' and nobody will notice it who has not seen both.

### Surfaces

Eight named steps, all near-black, all backgrounds, none of them cards:

| Step | Value | Where |
|---|---|---|
| `live` | `#1b1c20` | the newest board card |
| `lit` | `#17181c` | a bust that is live |
| `press` | `#17181a` | the pressed state of a dark cell |
| `card` | `#15161a` | a face-down card, a resting bust |
| `dim` | `#131418` | a crowd chip |
| `dark` / `quickBet` | `#101113` | a folded seat / a selected quick-bet cell |
| `pressLight` | `#c9c8c4` | the pressed state of the bone slab |

The token file's comment says "four steps only". There are eight keys, of which five are surfaces
(`live`, `lit`, `card`, `dim`, `dark`) and three are interaction states (`press`, `pressLight`,
`quickBet`). The comment is stale; the discipline it is protecting is real and worth keeping: these
steps span `#101113` to `#1b1c20`, a range of about 11 levels of brightness, and their whole job is
to say *live / resting / folded* without introducing a second hue. A ninth step should have to argue
for itself.

Two interaction rules ride on this: **press is never an opacity change** (it is `SURFACE.press` on a
dark cell, `SURFACE.pressLight` on a bone slab), and the fill lands on the frame the finger lands
(`MS.track`, 0) and clears over `MS.exit` (180) — colour, not opacity, in both directions.

### The canvas

`CANVAS_W = 420`, `CANVAS_H = 912`. Every screen is authored at that width and scaled by
`<Screen>`:

- `scale = width / 420` in `scroll` mode — the document keeps device width and runs past the bottom.
- `scale = min(width / 420, available / height)` in `fit` mode — the whole canvas fits inside the
  safe area so the composition never reflows.

`fit` is for compositions that cannot move: the table, the rail, the clip. `scroll` is for
documents: HOME, TABLES, FEED, FRIENDS, the floor, the record, the loadout, the counter. The
consequence worth knowing: **fit-mode scale is smaller than scroll-mode scale on every ordinary
phone**, which is why the boot screen is not a `<Screen>` — it needs scroll-mode scaling to hand off
pixel-exactly onto HOME's masthead.

`chips(n)` is `n.toLocaleString('en-US')`. Every chip count in the app goes through it, so no
screen invents its own thousands separator.

---

## 4. The recurring objects

Ten objects carry the app. Each exists because a piece of meaning needed a shape.

**The line — `<Rule>`.** A hairline, absolutely placed, optionally vertical. The structural device,
because the app is named after it. Two weights matter: **2px at `ink(0.8)`** is the bracket — every
masthead rule, the nav bar's line, the boot mark, the rail in `RailStrip` at full volume. 1px at
`ink(0.1)`–`ink(0.3)` divides within a section. A rule **bleeds off both edges** when it is
structural; an inset line is a container, and containers are cards.

**The notch — the app's only selected-state device.** A gap cut in a line where you are standing.
It exists at three scales and nowhere else: the 58-unit cut in the nav bar's rule under the active
destination; the 53/30-unit cut in a masthead rule under the active register half
(`LISTINGS · PLAN`); and the seat cut in the table boundary in `src/data/tableLayout.ts`. Selection
is a *subtraction* — the line makes room for you. The app icon is the same object: one boundary
hairline broken by one notch, with the crowd ticked beneath. Returning from a pushed screen inverts
it: `LeaveMark` **adds** a 2px stub to the screen's own top rule. No pill, no fill, no underline, no
dot, no badge, and no second selected-state device may be invented.

**The bust — `<Bust>`.** A square avatar frame holding an emoji, set *outside* the hairline
boundary. It is the app's load-bearing object: the throwable's target, the win's destination, the
rail's crowd chip, the join's traveller and a friend's presence are all this component at sizes from
20 to 72 units. Seven frames (`lit`, `bone`, `rest`, `dim`, `crowd`, `target`, `slot`) carry state
through border and surface rather than colour. Emoji sizing is a hand-tuned lookup per frame size
(72 → 48px face with a 6-unit baseline drop, 22 → 15/1) because emoji metrics are not proportional
to their box — optical alignment over mathematical, as the brief demands. The seat index is chipped
*outboard* of the corner so it never crops the face. `EmptySeat` is the only dashed frame in the
app, so dashed reads as absence rather than as a button.

**The head strip.** A five-unit ticked band immediately above a bust, `w = size + 2` at pitch 6.
It is the declared landing zone for a throwable, and it is the reason the interaction works: the
target is the avatar itself, not a separate hit box. It goes amber only once something has landed
on it. The same strip receives railbird reactions at T+900 of a win, which is what makes a
celebration scale with how many people watched.

**The tick strip — `<Ticks>`.** The app's language of record: `repeating-linear-gradient` in the
prototype, N absolutely-placed 1px children here. The head strip, the slide rule's minor ticks, the
reaction lane, the clip scrub, the boot meter, the nav bar's live counts, the ledger's
hands-watched-together bars and every earned item are all this one object. Its **length or pitch is
the figure** — under 5 seconds on the clock the tick pitch halves, with no colour change and no
sound.

**The slide rule — `BetSlider`.** Not a pill. A measured rail: minor ticks every 100 chips, four
named stops (`MIN`, `½`, `POT`, `ALL IN`) drawn as vertical rules at their true positions, a 2px
thumb with a diamond head, the amount set at mono 44 against a 9px label, and the readout stating
`% OF POT`, `STACK AFTER` and `STEP 100` in agate down the right. Dragging is 1:1 with no inertia;
stops are detents that seat with a selection haptic rather than markers you slide past. Quick-bet
cells above it are selected by a 2px top edge, never a fill. All-in **arms** — the cell states the
commitment in words and waits for a second deliberate press. The same instrument is reused as the
clip's scrub, which is the strongest evidence that it was designed rather than styled.

**The reaction mark — `<ReactionMark>`.** The crowd, at three density registers so one friend's
cooler never renders like a mob: **1** is named in full; **2–39** is one tick each (pitch 4, or 2 in
agate); **40+** masses into a single bar capped at 96 units (48 in agate). The same object is the
lobby's room-tone mark. Amber, always, because it is the crowd — the one legal use of the accent
outside a clock.

**The rail strip — `<RailStrip>`.** One rule with faces hanging *below* it, and yours drawn `bone`
while everyone else's is `crowd` at 0.7 opacity. A railbird is outside the line, so the object puts
them outside the line. Rule weight, ink and bust count scale with the room's noise band, so a loud
room is visibly heavier before you read a single figure.

**The throw mark — `<ThrowMark>`.** A 45°-rotated square. **Filled came from a seat, hollow came
from the rail.** Provenance is drawn, never labelled. This is the smallest object in the app and one
of the most important: it is what lets a seated player tell a table reaction from a crowd reaction
at a glance, and it is the visual treatment the product's name demands for railbird reactions.

**The earned tile versus the purchased plate — `<EarnedItem>` / `<PurchasedItem>`.** The whole
progression system hangs on one binary, so it is drawn structurally rather than decoratively:

- **Earned** wears the measurement ticks cut into its top edge, on a bone frame at `ink(0.6)`. Ticks
  are the app's own language of record — the head strip, the slide rule, the reaction lane. Earned
  ticks are bone, so amber stays reserved for crowd and clock.
- **Purchased** wears a filled maker's-mark corner square on a plate wrapped in an *offset* hairline
  — packaging applied to the object rather than cut into it.

Measurement versus manufacture, not two tiers of one thing. It survives at 26 units on a stranger's
rail: the ticks read as texture, the mark collapses to a corner dot plus its wrapper. **Nothing is
ever sold with ticks — that is the whole deal**, and the shop advertises it with a `NOT FOR SALE`
section listing ticked items and their requirements.

One more object that is not a component but is load-bearing: the four throwables are **adjectives
about luck, not opinions about people** — `HEATER` (running good), `COOLER` (brutal luck), `ICE`
(playing slow), `CROWN` (earned respect). That is the entire moderation strategy, designed in rather
than policed later.

---

## 5. Motion

Ask 9 of the handoff was a motion spec, so motion here comes from a document rather than from taste.
It lives in `CURVE`/`MS` in `tokens.ts` and `EASE` in `motion.ts`.

### The five curves

| Curve | Bezier | Job |
|---|---|---|
| `linear` | `0, 0, 1, 1` | clocks, meters, every count — a clock must be evenly spaced |
| `slide` | `.2, .9, .25, 1` | panels, rules, slots, plans — decelerates hard into place |
| `arc` | `.35, 0, .2, 1` | anything that travels the table |
| `settle` | `.2, 1.15, .3, 1` | the two overshoots |
| `out` | `.4, 0, 1, 1` | every exit in the app |

In the handoff each curve is drawn as a **tick ramp** rather than a graph — tick spacing *is* the
easing — which keeps even the spec sheet inside the app's own vocabulary. `settle` is the only curve
drawn in amber there, because it is the only one you actually feel.

### The eleven-stop ladder

| ms | Name | What it is for |
|---|---|---|
| 0 | `track` | 1:1 finger-following. A declared stop, not "no animation" |
| 90 | `punch` | impact |
| 120 | `mark` | a mark striking, a detent seating |
| 180 | `exit` | every exit in the app |
| 220 | `arrive` | something arriving |
| 240 | `open` | opening, admitting, widening |
| 320 | `travel` | crossing the table |
| 420 | `count` | a numeral counting |
| 620 | `join` | taking a seat; the boot build |
| 900 | `skip` | the dwell; the beat a tap skips to |
| 1400 | `whole` | the whole showdown |

**A transition outside the ladder is a bug, not a choice.** Note the wording: a *transition*. `0 ·
track` and meters are the two declared exemptions, and the ladder deliberately contains no stop
between 240 and 320 or between 620 and 900 — the gaps are the point. Also note that no ladder stop
shares a name with a curve (the 240 stop is `open`, not `settle`) so a spec line can never be
ambiguous.

### Meters, and why they are exempt

A meter is a value driven by **elapsed time** rather than by a transition: the table clock, the 2.5s
throw cooldown, the boot progress meter, HOME's `0:06`. They are exempt from the ladder because a
clock cannot lie — if it ran on a curve it would be a decoration of time rather than a measurement
of it. They are also **the only things in the app that loop**. `src/state/meters.ts` samples at
100ms for countdowns and 80ms for the cooldown; those are sampling rates, not durations, and they
are not ladder candidates.

### The two overshoots

There are exactly two, both on `settle`: **90 `punch`** (the winner's bust punches 1.06× on impact,
then releases over 120 `mark`) and **240 `open`** (the boundary notch widening to admit you as you
take a seat). Everything else in the app arrives and stops. This is the whole answer to the brief's
"motion with weight": weight is not applied evenly, it is spent in two places where a physical event
happens, and withheld everywhere else. A third overshoot would make the first two ordinary.

### The invariants

1. Nothing loops except the clock and the cooldown.
2. Amber only *moves* for crowd and clock.
3. Every sequence is interruptible; input is never blocked by motion, including the win. A tap
   anywhere during the showdown skips to T+900, the last beat that still has something to say.
4. Reticles never interpolate — they snap. Selection in the nav bar snaps on the frame the route
   changes; the only timed value in the whole nav component is the press fill's release.
5. Type is set, never faded. On boot the wordmark and the positioning line appear at full ink on the
   frame the font resolves.
6. No shared value is written during render — always inside `useEffect`.

### Three durations that are off the ladder, honestly

- `app/table.tsx`: the pot numeral travels on **340ms** with **18ms** of upward anticipation first.
- `src/state/useShowdown.ts`: the winning stack overshoots 3% and settles over **260ms**.

Both numbers are transcribed from the handoff's own showdown keyframes (ask 4), which were drawn
before the ladder was written in ask 9 and were never reconciled with it. The choice was: keep the
keyframes the emotional peak was reviewed and approved at, or round 340 → 320 and 260 → 240 to obey
a rule the same document wrote later. The implementation kept the keyframes and left the conflict
visible. **The argument for changing them:** the ladder's whole value is that it admits no
exceptions, and two exceptions in the single most-repeated sequence in the app is where drift
starts. **The argument for keeping them:** 18ms of anticipation is not a ladder-shaped value at all,
and the sequence is the one place in the app where a designer specified frame-level timing on
purpose. If you want one answer: move the travel to 320 and the settle to 240, and keep the 18ms
anticipation as a declared exemption alongside meters.

---

## 6. Judgement calls

Seven places where the handoff had to be interpreted rather than transcribed. All are commented at
the point they apply, and each is stated here with what was rejected.

### 6.1 Seats became busts, and the name block moved underneath

The base table (1a) still drew seats as the flat name plates it was built with. Every panel from ask
3 onward drew them as busts, and the designer's own note called the plates the stale half. **Drag
to target only works if the seats *are* the busts**, so the busts won.

They sit on 1a's existing boundary, whose notches already fall exactly where a seat belongs. But a
bust plus a name plus a five-figure stack is much wider than a 136-unit plate, and set *beside* the
bust it ran straight through the pot's numeral and the board. So the name block reads **under** its
bust. *Rejected:* keeping the plates (kills the interaction), or keeping the block beside the bust
and shrinking the pot numeral (kills the density variation, which is the screen's whole composition).

### 6.2 The notch was widened to cover the whole seat

Consequence of 6.1: the boundary's notch is cut for the bust **and** its name block, so no hairline
is ever drawn through a numeral. *Rejected:* the narrow notch, which would have put a 1px rule
across a stack. This one is not really contestable — a line through a figure is a defect at any
weight.

### 6.3 `oklch()` converted to sRGB

`oklch()` has no React Native equivalent. The two chromatic values are converted once, in
`tokens.ts`, with the original oklch preserved in the comment: `oklch(.72 .185 47)` → `#fe7825`,
`oklch(.84 .1 62)` → `#fabc86`. *Rejected:* a runtime oklch → sRGB converter, which would put a
colour-space library in the bundle to produce two constants; and eyeballing an approximation, which
would have lost the designer's chroma and made the amber
budget unauditable.

### 6.4 Letter-spacing conversion

CSS tracking is em-relative; RN's is absolute. Rather than hard-coding a point value at every call
site, the type helpers multiply: `letterSpacing = size * tracking`. *Rejected:* writing absolute
tracking per call, which would have broken the boot handoff (where the wordmark scales 44 → 20 and
`.26em` must hold) and would have made every size change a two-value edit.

### 6.5 The grain became a generated tile with its strength in the alpha

The prototype's texture is an SVG `feTurbulence` filter at `baseFrequency .85`, `numOctaves 2`,
desaturated, composited at `opacity .5; mix-blend-mode: overlay`. React Native cannot run an SVG
filter, and blend modes are not dependable across both platforms. So `scripts/make-grain.js`
generates a deterministic 128px tile — two octaves of tiling value noise, one nearly per-pixel and
one coarser — as sparse white and black specks **with the strength baked into the alpha**, tiled by
`<Grain>` at layer opacity 0.5 with `resizeMode="repeat"`. No blend mode is needed and the result is
identical on iOS, Android and web. *Rejected:* `react-native-svg` with a filter (unsupported on
native), a blend-mode overlay (platform-inconsistent), and a hand-authored noise PNG (not
reproducible — re-running the script produces a byte-identical file).

Texture is the brief's highest-value anti-plastic move, and it is the one element of the design a
reviewer will not notice until they turn it off.

### 6.6 The mock status bar and home indicator were dropped

The prototype drew a 44px status band and an 878px home-indicator pill. On a device the real ones
occupy exactly that space, which is what the mocks were standing in for. So they are gone, and
`<Screen>` pays for them with real safe-area insets instead. *Rejected:* drawing them (two status
bars), and ignoring insets (ink under the notch).

### 6.7 The navigation device, and what it beat

The handoff has no navigation — the designs navigate through their own content on purpose. So the
shell was a genuine design problem, worked as three competing proposals and resolved in
`docs/APP-SHELL-SPEC.md` §1. The decision:

> **The nav device is THE RAIL — one 2px hairline across the bottom of the app, broken by a
> 58-unit notch cut where you are standing, with four mono words hanging off it.**

Bottom, because 5a is literally a rule across the bottom of the frame with the crowd hanging off it:
a persistent bottom rule puts the whole app *above* the rail and the viewer where the product says
the viewer stands, and it is the only position that honours "everything interactive inside thumb
reach". Cells are sized to their words — 104 / 120 / 92 / 104, summing to exactly 420, with rule
segments of 54 / 48 / 40 and 23-unit outer margins. Selection is carried on two channels so a
subtraction is not doing the work alone: the notch, plus the label stepping from `ink(0.34)`/400 to
`ink()`/500. Ink ends at y=34, leaving 24 units of empty ground that hangs the labels off the rule,
keeps all ink out of the home-indicator strip, and is the fallback inset when `insets.bottom` is 0.

The bar's only figures are tick strips counting **what is live now** — rooms live, people on your
rail — never what is unread. An unread count is an engagement metric wearing measurement's clothes,
and the edition already dates itself on its own masthead.

What it beat, all rejected by name:

| Rejected | Why |
|---|---|
| An icon tab bar | Law 4 bans generic icon sets and emoji-as-icons, and the app has no drawn icon language to extend |
| A filled/tinted active cell | A filled cell in a four-cell row is a card, in the one place this app has never drawn one |
| Mono figures under every label | The bar counts what is live, never what is unread |
| Four equal 105-unit cells | A symmetric four-column grid is the loudest generic tell in the app |
| A masthead dropdown behind the wordmark | A wordmark does not read as a control without a caret, which is an icon and a lie |
| Home-as-hub | Two taps between FEED and TABLES in an app opened twenty times a night |
| Swipe between tabs | `/rail` owns swipe-up-for-the-tape, `/clip` owns a drag scrub, `/table` owns drag-to-throw — a global pan teaches that one gesture means four things |
| The index under the masthead at y=64 | Out of thumb reach, and its compensating gesture collided with three the app already owns |

One improvement on all three proposals: **`Screen.tsx` is not edited.** All three reached into its
scroll branch to reserve the bar's height. Instead the reserve is authored in design units, in the
canvas, where law 8 says composition lives: **every destination canvas ends with ≥64 units of empty
ground below its last ink** (`NAV_RESERVE`). Nothing shared changes, and the reserve is a value an
implementer can see rather than a padding term they cannot.

The bar shows on the four destinations and hides on every screen you were pushed into to do one
thing. The table especially: its bottom 190 units are the instrument (clock rule 720, action bar
722–810, cooldown to 858), and a destination press one thumb-width from ALL IN, inside a second 2px
meter, is not a trade worth making.

**Where this is contestable.** A subtraction is a quiet selected state. On a first run, before you
have learned the notch, the clearest signal that HOME is active is the label's ink step — and if you
deleted the notch entirely, most users would still navigate fine. The counter-argument, which I
believe, is that the notch is the one idea the whole product is built on (icon, boot, seat,
register, "you are here" — one object in five places), and an app is allowed exactly one idea that
has to be learned. If you ever test it and the notch reads as a rendering glitch, the fix is to
widen the ink step, not to add a pill.

### 6.8 The hand is scripted, not simulated

`src/state/useTable.ts` is a scripted hand, not a poker engine. The handoff specifies one hand drawn
to the chip, and a prototype dealing random cards would immediately stop matching the screens it
exists to prove: fold and you sit out as a railbird at your own table, call and you take the 4a win,
shove and you run into 4b's straight flush. Each new hand re-deals the same hand. *Rejected:* a real
engine, which would have cost the review value of every figure on the screen.

### 6.9 Three canvases deviate from the shell spec's heights

| Screen | Spec | Built | Why |
|---|---|---|---|
| `/tables` | 976 | 1032 | §6 budgets a listing at pitch 100, which holds two lines of Sans 13 in 248 units; every room sentence in `social.ts` runs to three, so at pitch 100 the third line would be struck through by the room's own rail. Pitch is 110; every other value is the spec's. |
| `/friends` | 1000 | 1620 | §7's layout predates `REQUESTS_IN`, `REQUESTS_OUT` and per-person suggestions, which cannot be drawn honestly in the 230 units its foot reserved. |
| `/feed` | 900 | 914 | Last ink is at 850, and a destination owes `NAV_RESERVE` (64) of empty ground. Nothing moved; 14 units of ground were added. |

The precedent this sets is the right one: **shrinking written copy or the primary object to hit a
canvas number is worse than a taller document on a screen that scrolls.** The reserve at the foot is
the constraint the height exists to serve, and all three keep it.

---

## 7. Adding a screen without breaking the system

A checklist. If you can tick all of it, the screen will belong.

1. **Author on the 420 canvas.** `<Screen height={N} mode="scroll">` for a document,
   `mode="fit"` for a composition that must not reflow. Absolute `<Box l= t= w= h=>` only.
2. **Open with a masthead** if it is a document: `<Masthead title meta />` — mono 20/700/.26 at
   (20, 20), agate meta right-ranged, 2px `ink(0.8)` rule at y=56. Do not hand-draw it.
3. **Name your two zones** in the file's header comment: which band is dense, which is nearly empty,
   with unit ranges. If you cannot name them, the screen is uniform and it is not finished.
4. **Check the type range.** Smallest to largest ≥ 4×. Put the eyebrow at mono 7 with `.3` tracking
   and give the screen one figure that is worth 30+ units.
5. **Every figure in `<Mono>`, every sentence in `<Sans>`.** No numeral inside a Helvetica string —
   move it to a mono figure slot beside the phrase.
6. **Count the amber.** Ideally zero. If it is there, it is a clock, a cooldown, a crowd or a throw,
   and it is under 5% of the screen.
7. **Divide with rules, not boxes.** 2px `ink(0.8)` to bracket, 1px `ink(0.1)`–`ink(0.3)` within.
   Structural rules bleed off both edges. No radius, no shadow, no gradient, no blur.
8. **Reuse the objects.** `Bust`, `Ticks`, `Rule`, `RailStrip`, `ReactionMark`, `EarnedItem` /
   `PurchasedItem`, `EmptySeat`, `PlayingCard`. If you need a new one, it should be a new *meaning*,
   and it should go in `src/components/` with a comment saying what it means.
9. **Press states change colour.** `SURFACE.press` on dark, `SURFACE.pressLight` on bone. Never
   opacity.
10. **Motion off the ladder.** `MS.*` durations, `EASE.*` curves. If it runs on elapsed time, call it
    a meter in a comment. Shared values written in `useEffect`, never during render.
11. **If it is a destination**, add it to `NAV_CELLS` (label ≤ 7 characters at mono 8/.18, so it fits
    the 58-unit notch), re-derive the four notch pairs, and end the canvas with ≥64 units of empty
    ground. **If it is a pushed screen**, give it a `<LeaveMark>` on its own top rule with a
    `fallback` route for cold starts, and no nav bar.
12. **Write the copy in voice, and check the constraint.** Mono uppercase eyebrows for territories
    and measurements; sentence-case Helvetica for human sentences and presses. Nothing implies money.
    Destinations carry the play-chips statement in their foot. No lorem, no "Coming soon", no empty
    state you have not written.
13. **`npx tsc --noEmit`**, then look at the screen at 320pt as well as 393pt.

---

## 8. The banned moves, and why each one is a tell

These are not preferences. Each one is a specific signature of machine-made or committee-made work,
and any of them appearing in a build is a defect.

| Banned | Why it is a tell |
|---|---|
| Purple/violet gradients, indigo-to-pink, teal-to-purple | The default palette of every generated interface of the last few years. It signals "a tool picked this" faster than any layout choice. |
| Gradients generally; more than one accent | A gradient is a decision not made — two colours because one was not chosen. Two accents means neither means anything. |
| Glassmorphism, backdrop blur, translucent floating panels | A style with no content model: it says "there is a layer here" without saying why. It also destroys hairlines, which are this app's structure. |
| Soft drop shadows on everything | Shadow implies elevation implies a card. The app has no cards, so it has nothing to elevate. |
| Uniform corner radius, especially 12 or 16 | The most reliable fingerprint of a default component library. A rounded rectangle is a box apologising for being a box. |
| Cards nested in cards | Each nesting level is a boundary that means nothing. Rules divide with no boundary at all. |
| Floating orbs, blurred blobs, abstract shapes | Decoration that means nothing is the definition of decorated rather than designed. |
| A 14/16/20/24 type ramp | The evenness is the giveaway. Real hierarchy is violent and uneven because the content is. |
| More than two weights | Weight used as emphasis instead of as register — the point where a system stops having a voice. |
| Proportional figures anywhere a number appears | Numerals that reflow while a stack counts. Also just wrong in a product about measurement. |
| Everything centred | Centring is the layout you get when nothing has been decided. RAIL left-ranges to x=20 and right-ranges to x=400, and centres only the pot, because the pot is on the table's axis. |
| Symmetric three- or four-column grids of equal cards | The loudest generic tell in the app, which is why nav cells are 104/120/92/104 and listings are 100+ units of measured, not gridded, space. |
| Identical padding throughout | Uniform spacing is the loudest tell of all. It is what makes generated layouts read as dead. |
| Emoji used as icons | Emoji here are avatars and throwables — content with meaning. Used as an icon set they are somebody else's art direction. Even the suit pips force text presentation (`♠︎`) so they cannot render as colour emoji. |
| Generic rounded-stroke icon sets | The same argument. The app has no icon language, and the cure for that is fewer icons, not a library. |
| Press states that only change opacity | Opacity is what you reach for when you have not decided what pressed *means*. Pressed means a filled cell. |
| Sortable columns, stakes as a sort key, a six-metric summary | A lobby becomes a dashboard the moment it happens, and a dashboard is a product that has given up on having a point of view. Noise is the sort order. |
| Red dots, unread badges, "3 NEW" in the bar | Engagement metrics wearing measurement's clothes. Ticks count what is live now. |
| Any language implying money | Deposit, cash out, withdraw, transfer, gift, balance-in-currency, prize, value. Not a disclaimer problem, a naming problem. |

---

## 9. Not built, and known drift

Stated plainly so nobody reads this document as a description of a finished product.

### Known drift between the spec and the build

- **HOME lives at `/home`, but the nav bar's HOME cell points at `/`.** The shell spec makes
  `app/index.tsx` the HOME screen and `Boot` an overlay rendered by `_layout`. The build instead
  made `app/index.tsx` the boot *route*, which `router.replace('/home')`s when it is done, and
  `NAV_CELLS` was never updated. Two visible consequences: `NavRail` returns `null` on `/home`, so
  **the bar and its 23 → 81 notch never appear on HOME** — the one screen the boot handoff was
  designed to land on — and pressing HOME from another destination re-enters the boot screen.
  Either move the HOME cell's route to `/home`, or restore the spec's shape and make the boot an
  overlay. This is the highest-value fix in the app.
- **`app/screens.tsx` does not exist.** The spec keeps the developer contents page as a review-only
  route; the build dropped it when `index.tsx` became the boot. `README.md` still tells you to enter
  at the index and see a list of eight screens, which is now stale.
- **The showdown's emoji squash is missing.** Ask 4 specifies the bust punching 1.06× *and* the
  emoji itself scaling 1.18× for 90ms, described as the only squash in the app. The build does the
  1.06× frame punch only.
- **Two durations are off the ladder** (340 travel, 260 settle) — see §5.
- **The bet slider's thumb is amber**, on a control that sets a stake. Law 1 says amber is time and
  expression, and a bet is neither. This is transcribed faithfully: the prototype's own 2e draws the
  thumb and its diamond head in `oklch(.72 .185 47)`. So the handoff breaks its own rule in exactly
  one place, and you have to decide which wins. *For keeping it:* the thumb is the only object on
  the screen tracking your finger in real time, it is a needle on an instrument, and an amber needle
  is why the slider reads as measurement rather than as a form control. *For changing it:* the rule
  is more valuable than any single application of it, and a bone thumb on a bone-ticked rule would
  lose very little. Same question, smaller stakes, for `/rail`'s amber `3 / 5 FREE` throw counter —
  which I would keep, since it counts expression and resets on a clock.

### Not built

- **No poker engine, no networking, no accounts, no persistence, no sound.** One scripted hand, one
  scripted table, fixtures in `src/data/`. Nothing is saved between launches.
- **Reduced motion is handled on the boot screen only.** `AccessibilityInfo.isReduceMotionEnabled()`
  is read there and nowhere else; the showdown, the join and the flight do not yet respect it. The
  motion spec's global rule says they should.
- **No light mode, no landscape, no tablet layout** (`supportsTablet: false`), and no localisation —
  `chips()` is hard-wired to `en-US`.
- **Screen-reader labels are partial.** Pressables carry `accessibilityRole` and, in the shell,
  `accessibilityState`; the drawn objects — busts, tick strips, rules — are unlabelled.
- **Wordmark, app icon and the six App Store screenshots** were designed in ask 10 and live in
  `project/RAIL Table.dc.html`. The app ships real icon assets, but the store screenshots are drawn
  at 1:5 in the handoff and have never been exported at 1290 × 2796.
- **Ask 3's other two targeting mechanics** (3a seat-number boxes, 3c the quarter-arc dial) exist in
  the handoff and are not implemented. Only 3b, drag-and-release, is built — it was the
  recommendation, and it is the only one that is a single continuous gesture with a physical commit
  point.
