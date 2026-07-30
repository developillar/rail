# RAIL — Design rationale

Why the app looks like this, and how to keep it looking like this.

This document is for two readers. The owner, who did not write the code and wants to know which
choices were deliberate, what they cost, and where they are arguable. And the next designer, who
should read it before touching a pixel, because most of what makes RAIL look designed rather than
decorated is a small number of rules applied without exception — and the failure mode is not ugly
work, it is *average* work.

Three companion documents. `README.md` says what exists. `docs/PRD.md` says what the product is and
what it refuses to be. `docs/APP-SHELL-SPEC.md` is the canonical geometry of the shell —
navigation, boot, HOME, TABLES, FRIENDS — down to the unit. This file is the argument underneath all
three.

Where this file and the code disagree, **the code is what ships** and the disagreement is a bug in
one of them. §6.10 lists the deviations that are decisions, with the argument for and against each,
and §9 lists the drift nobody has decided yet. Every figure printed here has been checked against
the code; if you find one that has not, treat the code as true and fix this file.

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
stops being loud, and you have a generic dark-mode app with an orange brand colour.

**The amber inventory of the shell, counted in the code rather than remembered.** Across the boot
and the four destinations there are **eleven** amber marks: one is time, ten are the crowd.

| Screen | Marks | What they are |
|---|---|---|
| boot `/` | 0 | the meter is bone `ink(0.3)` — the app's own readiness is neither time you own nor expression |
| HOME | 1 | `OKONKWO TO ACT / 0:11`, a 13px clock, ≈0.2% of the screen |
| TABLES | 5 | one `ReactionMark` per room that has a crowd; table 30 is dark and gets none |
| FEED | 4 | the lead hand's massed bar, plus one per bad beat |
| FRIENDS | 1 | the 1,240 on the rail you are both standing on |

Every one is legal — a clock or a crowd. `NavRail`, `Masthead` and `LeaveMark` contain no call to
`amber()` at all, which is the part that actually matters. An earlier draft of this section said
"exactly two", which was a count of the two screens the shell *added* mistaken for a count of the
shell; TABLES' and FEED's crowd marks were always there.

### 2. Every figure is mono; every sentence is Helvetica

Numbers go in `<Mono>` (JetBrains Mono). Labels, headlines and button text go in `<Sans>`
(Helvetica). Never a numeral inside a Helvetica string — which is why the door on HOME reads
`Walk in on Bea's table` with `238 WATCHING` set beside it in mono, rather than "Walk in on table
12".

**Breaking it looks like:** `Take seat 1 · min 4,000` in one Helvetica line. It will not look
*wrong*. It will look like a normal app, the numerals will not align in a column, and the
instrument feeling — the thing that makes a bet slider read as measurement — evaporates.

**Where the app does not hold this:** six headlines set figures inside Helvetica prose — the edition's
five and `/floor`'s one. That is unresolved rather than allowed, and §6.10 argues it both ways. The
strict version is reachable: TABLES' six room sentences are written with no digit in any of them.

### 3. Violent type contrast: at least 4×

At least 4× between the smallest and largest type on a screen. A 7px mono eyebrow beside a 78px
numeral. Never a 14/16/20/24 ramp — that evenness is the tell.

Where the app actually stands, smallest to largest `<Mono>`/`<Sans>` size on each screen (the
masthead wordmark counts, it is type). **All twelve hold the law.**

| Screen | Range | Ratio | The largest figure |
|---|---|---|---|
| HOME | 7 → 78 | 11.1× | `4` — your people at tables right now |
| FRIENDS | 7 → 62 | 8.9× | `340` — hands of yours Sven has watched |
| Table | 7 → 54 | 7.7× | the pot, on the table's own axis |
| Boot | 7 → 44 | 6.3× | the wordmark |
| Loadout | 6.5 → 34 | 5.2× | how many of your four slots have something on them |
| Rail | 6.5 → 34 | 5.2× | the pot on the vantage |
| Floor | 6.5 → 30 | 4.6× | the hero room's pot |
| Clip | 6.5 → 30 | 4.6× | the pot |
| Profile | 6.5 → 30 | 4.6× | `12,940` — hands **watched** |
| Shop | 6.5 → 30 | 4.6× | the lead price |
| TABLES | 7 → 30 | 4.3× | each room's pot |
| Feed | 7 → 30 | 4.3× | the lead hand's pot |

Four of these used to fall short — the edition and the three ownership screens, at 3.1× to 3.7× —
and they were exactly the four that read as another app. The defence offered at the time was that
their contrast is carried by *object* scale rather than type: a 118 × 96 earned tile against 6.5px
agate on `/profile`, a 72-unit bust against 8px meta. That is a real argument, and it is also exactly
the argument someone makes when they have quietly drifted into a 12/14/16/20 ramp. It lost, and the
fix in each case was **to find the figure the screen was already about and set it once, large**,
rather than to inflate something arbitrary:

- `/profile` lifted `HANDS WATCHED` (12,940) out of a list of six career rows at mono 14 and set it
  at mono 30 in the empty ground beside the identity block. The list below now opens on `HANDS
  PLAYED`, so the contrast between the two figures *is* the screen's argument. The record was the one
  screen entirely about figures and its largest figure was 14.
- `/loadout` tightened the slot pitch from 78 to 66, which is what bought a near-empty zone holding
  one figure: the count of slots with something on them, at mono 34, read from the same state the
  `EQUIP` cells write.
- `/shop` raised the lead price from 22 to 30, and `/feed` the lead pot from 26 to 30 — which is the
  stop `/floor`, `/tables` and `/clip` already set a lead pot at, so this was drift rather than a
  decision.

`/loadout` is the interesting one, because the pure ratio fix (raise a number) would have left the
screen a settings list. It failed law 5 as well as law 3, and both failures had the same cause.

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
makes generated layouts dead. Each screen's file names its own, with unit ranges, in its header
comment: HOME's dense zone is `YOU, TONIGHT` (380 → 684 — six figures, three equipped provenance
tiles plus the dashed empty fourth, and three routes in 300 units) and its empty zone is 56 → 300
(five objects in 244 units) plus the foot, which ends on 76 units of nothing. TABLES: dense
190 → 866, empty 56 → 190 (three objects in 134 units). FRIENDS: dense 496 → 1236, empty zones the
hero at 56 → 250 and the relief band at 928, which is two objects and thirty units of ground between
two dense registers. `/loadout`: dense 84 → 348 (four slots on a 66-unit pitch), near-empty
348 → 478 (one figure and 63 units of ground under it).

**HOME draws three tiles, not four.** `LOADOUT.slots` has three entries and the screen prints
`3 OF 4 SLOTS`; the fourth is `EmptySeat`, the app's only dashed frame, so dashed reads as absence
rather than as a button. Both this document and the shell spec said "four provenance tiles" for a
while, which is the kind of error that survives because it is nearly true.

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
| `AMBER_LIGHT` | `#fabc86` | two uses, both "this is the one you are aiming at": the aimed seat's name on the table, and the selected throwable's label on `/clip` |
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

7c's four bands, as `app/tables.tsx` actually applies them. Four channels, and nothing here is a
ranking — the loudest room is not drawn *bigger*, it is drawn *louder*:

| band | watching | listing opacity | rail weight | rail ink | busts | pot ink |
|---|---|---|---|---|---|---|
| LOUD | ≥ 40 | 1 | 2px | `ink(0.42)` | 3 | `ink()` |
| WARM | ≥ 4 | 0.8 | 1px | `ink(0.3)` | 2 | `ink()` |
| QUIET | ≥ 1 | 0.55 | 1px | `ink(0.22)` | 1 | `ink(0.75)` |
| EMPTY | 0 | 0.45 | 1px | `ink(0.16)` | 0 | `ink(0.5)`, and `NO POT YET` |

**This differs from ask 7c's caption, which says a loud rail is five busts and a quiet one a hairline
at 16%, and the difference was undeclared until now.** Five 22-unit busts plus a `+N MORE` figure do
fit on a 380-unit strip, so it is a composition call rather than a constraint: at the listing's own
height the five faces crowded the crowd mark sharing that line, and 3 / 2 / 1 / 0 gives the four
bands four counts you can tell apart at a glance, which is the whole job of the channel. 16% under a
1px rule on this ground is very nearly not a line at all beside an `ink(0.1)` divider; 22% still
reads as a rail. *The argument the other way:* five is the number the handoff drew, the bust count is
the channel a reader learns fastest, and three-vs-two is a smaller step than five-vs-two.

The band table above is the one to trust. `src/components/RailStrip.tsx`'s own docstring still
repeats the caption's five and 16% and is wrong.

The faces come off `ROOM_FACES` through a cursor, disjointly, so **no face stands on two rails at
once** is true by construction rather than by inspection — `/tables` draws all six rails on one
canvas, and it used to draw 🦊, 🐸 and 🦁 on two rails each. The `+N MORE` remainder is computed
from the slice that was actually drawn, so a band that truncates a room's rail cannot make the
arithmetic beside it lie.

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
throw cooldown, the boot progress meter, HOME's `0:11`, and the showdown's counting stack. They are
exempt from the ladder because a clock cannot lie — if it ran on a curve it would be a decoration of
time rather than a measurement of it. `src/state/meters.ts` samples at 100ms for countdowns and 80ms
for the cooldown, and `useCount` at 16ms; those are sampling rates, not durations, and they are not
ladder candidates.

**Which of them loop, precisely.** A countdown ends one of two ways and it has to be told which,
which is why `useCountdown` takes a `loop` argument:

- **The table's hand clock ends.** It reaches 0:00, calls `onDone` once — the table reads that as the
  timeout that acts for you — and clears its interval.
- **HOME's door clock loops.** HOME stands outside a room where somebody is always to act, so the
  meter re-arms at zero. It counted 11 → 0 and then froze on `0:00` for the rest of the session,
  under a line still saying `OKONKWO TO ACT`, which was the one lie on the screen — on the one figure
  the file's own comment calls "a clock, and a clock cannot lie".
- **The cooldown does not loop**; it drains once per throw and stops.

So the accurate form of the invariant is: *nothing in the app is animated on a loop, and the only
looping meter is HOME's door clock.* Neither kind is allowed to keep an interval alive after it has
stopped counting, which the original `useCountdown` did — invisible only because setting 0 twice
changes nothing.

### The two overshoots

Two, both on `settle`: **90 `punch`** (the winner's bust punches 1.06× on impact, then releases over
120 `mark`) and **240 `open`** (the boundary notch widening to admit you as you take a seat).
Everything else in the app arrives and stops. This is the whole answer to the brief's "motion with
weight": weight is not applied evenly, it is spent where a physical event happens and withheld
everywhere else. A third would make the first two ordinary.

**Being exact about it: `EASE.settle` has four call sites, not two.** The punch (`app/table.tsx`),
the same punch replayed as a preview (`app/loadout.tsx` — the same object, so the same curve), the
notch opening (`app/rail.tsx`), and one more: the counter's maker's mark striking onto the plate over
`MS.mark` (`app/shop.tsx`), which scales 0.6 → 1 and therefore overshoots by about 6% on the way. It
is the handoff's own beat and it is the only celebration money buys, so it stays. But "there are
exactly two overshoots in the app" is a claim about *what you feel*, not about the curve table, and
the honest version is: **two overshoots you notice, on the two physical events, plus a struck mark
that borrows the same curve for 120ms.** If a fourth appears, cut it.

### The invariants

1. Nothing is animated on a loop. The only looping meter is HOME's door clock, and meters run on
   elapsed time rather than on the ladder.
2. Amber only *moves* for crowd and clock.
3. Every sequence is interruptible; input is never blocked by motion, including the win. A tap
   anywhere during the showdown skips to T+900, the last beat that still has something to say.
4. Reticles never interpolate — they snap. Selection in the nav bar snaps on the frame the route
   changes; the only timed value in the whole nav component is the press fill's release.
5. Type is set, never faded. On boot the wordmark and the positioning line appear at full ink on the
   frame the font resolves.
6. No shared value is written during render — always inside `useEffect`.

### One duration that is off the ladder, honestly

- `src/state/useShowdown.ts`: the winning stack overshoots 3% and settles over **260ms**.

That number is transcribed from the handoff's own showdown keyframes (ask 4), drawn before the ladder
was written in ask 9 and never reconciled with it. It sits inside `useCount`, which runs on elapsed
time at a 16ms sample, so it is a meter's second phase rather than a transition — which is the
defence, and it is a slightly convenient one. **For rounding it to 240 `open`:** the ladder's whole
value is that it admits no exceptions, and an exception inside the most-repeated sequence in the app
is where drift starts. **For keeping it:** it is the settle on the one figure the whole showdown
exists to deliver, and the designer wrote 260.

There used to be two more, both in `app/table.tsx`'s pot travel — a **340ms** arc after **18ms** of
upward anticipation. Both are gone; see §6.10, deviation 7. The arc is `MS.travel` (320) and the
anticipation frame was dropped rather than rounded to a stop the ladder does not have.

---

## 6. Judgement calls

Ten places where the handoff, or the shell spec written after it, had to be interpreted rather than
transcribed. All are commented at the point they apply, and each is stated here with what was
rejected. 6.1 to 6.8 are translation calls made while building the handoff's own screens; 6.9 and
6.10 are the places the documents disagree with each other and somebody had to pick.

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

### 6.9 Four canvases deviate from the shell spec's heights

| Screen | Spec | Built | Why |
|---|---|---|---|
| `/tables` | 976 | 1032 | §6 budgets a listing at pitch 100, which holds two lines of Sans 13 in 248 units; every room sentence in `social.ts` runs to three (78 to 100 characters), so at pitch 100 the third line would be struck through by the room's own rail. Pitch is 110; every other value is the spec's. |
| `/friends` | 1000 | 1620 | §7's layout predates `REQUESTS_IN`, `REQUESTS_OUT` and per-person suggestions, which cannot be drawn honestly in the 230 units its foot reserved. The masthead, hero, rail object and ledger keep §7's geometry to the unit. |
| `/feed` | 900 | 948 | FEED is a destination and its foot did not carry the play-chips constraint; the other three all do. The two agate lines were added and the canvas grew by them plus `NAV_RESERVE`, rather than the crowd strip being crowded. Last ink 884. |
| `/loadout` | 700 | 852 | The slot pitch tightened 78 → 66 to make a real dense zone, and the units that bought — plus an extension — were spent on the near-empty zone the screen had none of (§2 rules 3 and 5). |

The precedent this sets is the right one: **shrinking written copy or the primary object to hit a
canvas number is worse than a taller document on a screen that scrolls.** The reserve at the foot is
the constraint the height exists to serve, and all four keep it.

### 6.10 Declared deviations: where the handoff wins, where it loses

Three documents govern this app and they do not fully agree: the handoff panels
(`project/RAIL Table.dc.html`, ten asks), the shell spec written afterwards to navigate them
(`docs/APP-SHELL-SPEC.md`), and this file's own law. Three independent audits read the law and the
shell spec without the handoff panels in front of them, and flagged six places where the build was
following the handoff as though it were drift. It is not drift. **Where the handoff specifies a
value, the handoff wins** — over the shell spec, over an auditor, and over taste — and the six are
recorded here as declared deviations so the next reader can disagree with the reasoning rather than
rediscover the conflict.

Each is written as: what the build does, which document says so, and the argument against.

**1. `/table`'s win delta `+12,090` is amber, and law 1 says a chip count is never amber.**
Ask 4a's caption: the delta is the one amber mark in the sequence and fades at T+1,100. *For:* the
delta is not a stake, it is the *event* — the pot arriving on a face, drawn from T+620 and dropped at
T+1,400, so 780ms and not the 480ms an earlier draft of this section claimed.
Amber belongs to expression, and this is the most expressive frame in the app. It is also the only
amber figure in a showdown that is otherwise all bone. *Against:* law 1 names "an amber chip count"
as the example of breaking it, and a reader cannot see the difference between a chip count that is a
stake and one that is an event. Kept because the handoff drew it, and because 780ms is not a state.
Note that it *snaps* off rather than fading: nothing in the showdown is tweened out. The caption's
fade at T+1,100 would be a code change, not a doc change.

**2. `/rail`'s current tape row draws its pot-share bar in amber; historical rows draw theirs bone.**
Ask 5b, exactly. *For:* the bar on the live row is the pot *growing*, which is time, and the row is
already the amber row (its clock is amber). *Against:* a pot proportion is a stake at any age, and
the row's amber clock already says "now" — so the bar is a second signal for the same fact, which is
how a budget becomes a palette. Kept as drawn.

**3. `/table`, `/rail` and `src/components/table/*` set their tracked uppercase labels in Helvetica**
— `ON THE RAIL`, `YOUR ACTION`, `RAISE TO`, `CALL`, `FOLD`, `CANCEL`, `POT`, `TO CALL`, `POT ODDS`,
`IN FRONT` — while the shell sets the same register in mono. The handoff sets every one of these in
Helvetica with em tracking, on the surface it drew first. *For:* the table is an instrument and its
chrome is *legend*, not eyebrow: the mono is reserved so hard on that screen that every figure reads
as a figure the instant you look at it, and tracked Helvetica caps at 8–10px are the caption voice of
a technical drawing. *Against:* the shell spec's rule ("eyebrows are mono; Helvetica sentence-case is
what you press to do a thing") is a good rule, and `CANCEL` and `PRESS AGAIN` genuinely *are* presses,
so the table now uses one voice for two jobs. **The boundary drawn: the shell spec's mono rule governs
the shell and the new screens; the handoff's Helvetica governs the table surface.** A future pass that
converts the table should convert all of it at once, including `POT`, and delete this deviation
rather than narrow it.

**4. `/loadout`'s `EQUIPPED` / `FILL` are mono 7 inside a bordered cell**, not the Helvetica
sentence-case every other press in the app uses. Ask 8b, exactly. *For:* they are not routes, they
are the state of the slot they sit in, and the border ink is doing the pressing — `EQUIP` in bone at
`ink(0.35)` becomes `EQUIPPED` in full ink at `INK`, which is a readout changing rather than a button
being pushed. *Against:* it is still a `Pressable` and the app's rule is that a `Pressable` speaks
Helvetica.

Two nearby cells were *not* covered by this and were changed, because they were inventions of the
implementation rather than anything the handoff drew: `/loadout`'s route to the counter was a mono
link with an arrow in the masthead's corner (an arrow is an icon, a route is not a caption, and two
right-ranged agate lines cannot share one corner) and is now the slab `The counter` with the balance
in its mono figure slot; `/profile`'s route to the loadout was `<Mono>LOADOUT</Mono>` and is now
`Change loadout`, which is also the name the shell spec's route map gives it. The same destination
was being called two things on two screens.

**5. The SELECTED throwable cell on `/clip` is tinted `amber(0.1)` with its label in `AMBER_LIGHT`.**
Asks 5a and 6b, exactly, and `AMBER_LIGHT`'s only other use in the app is the aimed seat's name on the
table — the same meaning, "this is the one you are aiming at". *For:* the throwable *is* expression — the one thing in the app amber is for — so an
armed throwable glowing faintly is the accent doing its job, and this tray is the only place in the app
where selection means "this is what will leave your thumb", which is not the same act as "you are
standing here". *Against:* the shell spec rules out a fill or tint for a selected state by name, and a
translucent tint sits close to the translucency law 4 bans. Kept.

The *press* state on the same cell was a different matter and was changed. `/rail`'s tray has no
selected state — a railbird's throw fires on release — but its **pressed** cell was also `amber(0.1)`,
so one tint meant "selected" on `/clip` and "pressed" on `/rail` while every other press in the app is
`SURFACE.press`. It is `SURFACE.press` now. A tint that means two things means neither.

**6. HOME is `/home` and `app/index.tsx` is the boot mark that `router.replace()`s into it.** The
shell spec §3–§5 specifies the opposite — HOME at `app/index.tsx`, the boot as an overlay above the
`<Stack>` — and the build inverted it. The spec was corrected to describe the build, not the reverse.
*For the build:* `replace()` leaves no history, so back never returns to a splash; the font gate in
`_layout.tsx` already holds the app until JetBrains Mono resolves, so the boot has no readiness left
to report and the overlay's `ready` prop has nothing to carry; and one screen paints at a time.
*For the spec:* `/` is the app's entry URL and it is now a screen nobody can stand on, and an overlay
would make the boot genuinely unmountable rather than replaced. This is the one deviation an auditor
called the highest-value fix in the app, and it is not a fix — pointing the nav's HOME cell at `/`
would replay the splash on every press of HOME.

**7. The one place the ladder overrides the handoff.** Ask 4a's caption gives the pot's travel a
340ms arc after 18ms of upward anticipation. Ask 9 declares the ladder canonical and says in as many
words that a transition outside the ladder is a bug, and `MS.travel` is 320. The build follows ask 9:
**the arc runs on `MS.travel` and the anticipation frame is dropped**, rather than rounded to
`MS.punch / 5`, which is 18 and still not a stop. *For:* the ladder is the later document, it was
written to govern exactly this, and its value is entirely in admitting no exceptions — two exceptions
in the app's most-watched motion is where drift begins. *Against:* 340 and 18 are the frames the
emotional peak of the product was reviewed and approved at, and 18ms of anticipation is not a
ladder-shaped value at all — it is a physical wind-up, and dropping it makes the pot leave without
gathering itself. If somebody wants it back, the honest way is to add an anticipation stop to the
ladder in ask 9's own terms, not to write 18 at the call site.

**One more, not on the auditors' list and not resolved: six Helvetica headlines carry figures inside
them.** Five are the edition's — `EDITION.lead.headline` is "Bea puts 4,200 in with second pair, and
is right.", plus "Tomás folds the winner with 40 seconds left", "Sven shoves 6,400 in the dark and
triples up", "You lost 4,820 to a straight flush" and "Your cooler on Bea drew 24 answers" — and the
sixth is `FLOOR.headline`, "Bea is up 9,400 at table 12 and will not leave." Law 2 says never a numeral
in a Helvetica string, and `app/home.tsx` states the same rule in its own comment: "No digit ever
enters a Helvetica sentence on this screen." So two screens disagree with each other.

*The reading that keeps them:* the law governs **labels and figure slots**, and these are prose — a
sentence with a verdict in it, which is exactly what makes FEED an edition rather than a feed. "Bea
puts 4,200 in with second pair, and is right" cannot be restructured into an eyebrow and a figure
without becoming a caption, and a headline that reads "Bea puts *four thousand two hundred* in" is
worse than either. *The reading that fixes them:* HOME proves the pattern works — the figure leaves the
sentence and sits beside it in mono — and six is not "an exception", it is a convention. TABLES already
holds the strict version: every room sentence is written with no digit in it, deliberately, and they
are better sentences for it.

The honest position is that the rule should be narrowed in writing to *labels, buttons and figure
slots* and the headlines declared prose, **or** the six should be rewritten the way TABLES' six were.
Doing neither is what leaves an auditor to find it. Fixing it now means redesigning the edition's lead
and three agate rows, so it was left, and it is recorded here.

---

## 7. Adding a screen without breaking the system

A checklist. If you can tick all of it, the screen will belong.

1. **Author on the 420 canvas.** `<Screen height={N} mode="scroll">` for a document,
   `mode="fit"` for a composition that must not reflow. Absolute `<Box l= t= w= h=>` only.
2. **Open with a masthead** if it is a document: `<Masthead title meta />` from
   `src/components/AppShell.tsx` — mono 20/700/.26 at (20, 20), agate meta right-ranged, 2px
   `ink(0.8)` rule at y=56. **Do not hand-draw it.** Eight screens call it; HOME was the last one
   still drawing its own, at values that happened to match, which is exactly how a masthead drifts.
   Then set your first eyebrow **14 units under that rule** (t=70) — the house offset under every
   full-width rule in the app.
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
    the 58-unit notch), re-derive the notch pairs, end the canvas with ≥64 units of empty ground
    (`NAV_RESERVE`), and carry the play-chips constraint in the foot. **If it is a pushed screen**,
    give it a `<LeaveMark>` on its own top rule with a `fallback` that is one of the four
    destinations — never `/`, which is the boot — and no nav bar.
    **Section eyebrows have two settings and no third:** mono 7 / `.3` / `ink(0.55)` for a section
    under a full-width rule, mono 7 / `.3` / `ink(0.5)` for the screen's opening eyebrow. The agate
    that answers one from the right margin is mono 7 / `.12` / `ink(0.32)`. A person's name is Sans 12
    in a row you can open and Sans 11 in a row inside a register; an item's agate meta line is mono 7,
    or 6.5 only at plan scale where everything is drawn at a third size.
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
| Red dots, unread badges, "3 NEW" — in the bar or in a document | Engagement metrics wearing measurement's clothes. Ticks count what is live now, and a section that wants a figure gets a measurement of *itself*: FEED's `BAD BEATS` is answered by `3 TONIGHT`, read from `EDITION.badBeats.length`. FEED shipped with a hardcoded `3 NEW` for a while, on the one screen whose whole doctrine is that it dates itself. |
| Any language implying money | Deposit, cash out, withdraw, transfer, gift, balance-in-currency, prize, value. Not a disclaimer problem, a naming problem. |

---

## 9. Not built, and known drift

Stated plainly so nobody reads this document as a description of a finished product.

### Known drift between the spec and the build

The seven **declared** deviations are in §6.10; they are decisions, not drift. What follows is drift:
places the build and a document genuinely disagree and nobody has decided, or where something the
handoff specifies is simply not there.

- **The spec's route shape was the stale half, and it has been corrected.** `docs/APP-SHELL-SPEC.md`
  §3–§5 put HOME on `/` in `app/index.tsx` with the boot as an overlay; the build put the boot on `/`
  and HOME on `/home`, and `NAV_CELLS`' HOME cell is `{ label: 'HOME', route: '/home', … }`. The
  spec now describes what is built and marks the difference as `BUILT`. An earlier draft of *this*
  section described the same divergence as a bug in the code and told the reader to point the HOME
  cell at `/`, which would have replayed the splash on every press of HOME. It was wrong; §6.10
  deviation 6 carries the actual argument. **`app/screens.tsx` never existed** either — the spec's
  review-only contents page was dropped when `index.tsx` became the boot, and the route is gone from
  the map.
- **The showdown's emoji squash is missing.** Ask 4 specifies the bust punching 1.06× *and* the
  emoji itself scaling 1.18× for 90ms, described as the only squash in the app. The build does the
  1.06× frame punch only.
- **One duration is off the ladder** (260, the winning stack's settle) — see §5.
- **The bet slider's thumb is amber**, on a control that sets a stake. Law 1 says amber is time and
  expression, and a bet is neither. This is transcribed faithfully: the prototype's own 2e draws the
  thumb and its diamond head in `oklch(.72 .185 47)`. So the handoff breaks its own rule in exactly
  one place, and you have to decide which wins. *For keeping it:* the thumb is the only object on
  the screen tracking your finger in real time, it is a needle on an instrument, and an amber needle
  is why the slider reads as measurement rather than as a form control. *For changing it:* the rule
  is more valuable than any single application of it, and a bone thumb on a bone-ticked rule would
  lose very little.
- **The free-throw allowance is amber on `/rail` and bone on HOME.** `3 / 5 FREE · RESETS 4:12` is
  `amber()` at `app/rail.tsx`; `3 OF 5 FREE THROWS LEFT` is `ink(0.35)` at `app/home.tsx`. Same
  quantity, two colour meanings, and only one of them can be right. *For amber in both places:* it
  counts expression and it resets on a clock, which is both halves of law 1. *For bone in both:* on
  `/rail` it sits over a tray you are about to throw from, where amber is doing work; on HOME it is
  the fourth agate line in a band about your career, where it would be the screen's second amber mark
  and would break the one thing HOME's composition is strict about. My own answer is the second —
  amber where the throw is, bone where the record is — but the rule has not been written down, so
  today it is drift.
- **The POT lockup does not have one spec.** It is the most repeated figure in the app, and the
  numeral is set at mono 30/700/-0.04 on `/floor`, `/tables`, `/feed` and `/clip`; 34/-0.04 on
  `/rail`'s vantage; 24/-0.03 on its tape; and 54/-0.03 on the table itself, which is the handoff's own
  value and is right — the pot on the table is on the table's axis and is the screen's whole centre.
  Those are defensible per canvas: a document, a fit surface, a second distance.

  The **label** is not defensible, because it is the same word doing the same job every time, and it is
  set four ways: `Sans 7/.3/ink(0.4)` on `/floor`, `/feed`, `/tables` and `/rail`'s tape;
  `Sans 8/.3/ink(0.4)` on `/clip` and `/rail`'s vantage; `Sans 8/.2/ink(0.42)` beside the table's own
  pot readout; `Sans 10/.34/ink(0.4)` over the pot itself. The **gap** between label and numeral is 5,
  6 or 7 depending on the screen. One lockup — label, gap and weight fixed, numeral free per canvas —
  is the fix, and it has not been made.
- **Three exports in `src/data/social.ts` are drawn nowhere:** `LAST_HAND`, `INVITATIONS` (with its
  `Invitation` type) and `byStatusThenTogether`, whose sort `LEDGER` performs inline on the next line
  instead. The first two are written in voice and are honest candidates for a screen; the comparator
  is dead code with a `STATUS_ORDER` constant existing only to feed it.

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
- **Ask 3's other two targeting mechanics are not implemented.** **3a is two taps on the busts** —
  choosing a throwable turns the busts themselves into 56-unit targets and a second tap sends, with
  the seat index chipped into each bust's corner. Its panel is still titled "Seat numbers", which is
  where the belief that 3a used separate number boxes comes from; `chats/chat2.md` retracts them in
  as many words ("the target is now the avatar itself, so 3a's separate number boxes are gone"), and
  the panel's own subhead says the busts are the targets. 3c is the quarter-arc thumb dial with six
  detents in the busts' real positions, whose arc doubles as the cooldown gauge. Only **3b**,
  drag-and-release, is built — it was the recommendation, and it is the only one that is a single
  continuous gesture with a physical commit point.
- **The rail's throw has no target selection** — it is hardcoded to seat 3. The table's drag-to-throw
  targets any bust; the rail's tray does not, so a railbird cannot choose a face.
- **Loadout equip state, shop ownership, friend requests, invites and the rail's free-throw counter
  are local component state** and reset when the screen unmounts.
