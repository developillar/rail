# RAIL — Product and Game Design Document

Status: this describes a working prototype, not a shippable product. Everything under
"Screen by screen" exists and runs on a phone today. Everything under "Roadmap" does not.
Where the two are easy to confuse — the poker engine above all — the document says so in
plain words rather than implying more than is built.

Companion documents: `README.md` (what exists and why), `docs/APP-SHELL-SPEC.md` (the
canonical geometry of the navigation, the boot sequence, HOME, TABLES and FRIENDS),
`chats/chat1.md` and `chats/chat2.md` (the design conversation the whole thing came out of),
`project/RAIL Table.dc.html` (the original design handoff, ten asks, every panel).

---

## 1. What RAIL is

RAIL is a portrait, mobile, social poker app: No-Limit Hold'em, six seats, **play chips
only**, built so that watching a hand is as complete an activity as playing one. It
monetizes expression — throwable objects, celebrations, seat and table cosmetics — and never
chips, never ads, never rake. In poker, the rail is the place spectators stand; a rail is
also a line, and a single hairline rule is the recurring structural device on every surface
of the app, from the app icon to the navigation bar to the boundary of the table itself. The
visual direction is locked to what the handoff calls **1a Terminal**: near-black ground, bone
ink, monospaced numerals, measurement ticks, and exactly one accent — amber — reserved for
time and expression. The product bet is that the social layer of poker, not the poker, is the
thing nobody in the category has built.

**The positioning sentence, which no screen, label, empty state or store listing may ever
violate:**

> Social poker rooms with friends. Play chips only.

Chips are non-transferable and worthless. Credits (CR) buy objects and never chips. Nothing
in the product may imply that money can be won, deposited, cashed out, transferred, gifted or
held. Section 12 states what that forbids in concrete label terms.

---

## 2. The thesis: the name is the concept

Every poker app treats spectating as a degraded mode of playing — a read-only table with the
buttons greyed out, offered because a friend asked to watch. RAIL inverts it. The rail is
where most people are most of the time, so the rail is where the product lives: you arrive
watching, you react from outside the line, you read the hand afterwards as an edition, and
taking a seat is one of several equally legitimate things to do with an evening. The
prototype's own record screen makes the claim numerically: hands *watched* (12,940) is set in
the same size, on the same shelf, as hands *played* (4,812), and "seated from the rail 58
times" is a career statistic.

Two consequences are designed into everything, and both are testable as defects:

**Watching is first-class.** Where a screen offers both, watching is on the left and takes
the wider cell — HOME's door reads `Walk in on Bea's table / 238 WATCHING` at 240 units, with
`Take a seat` beside it at 140. A listing on TABLES is a single press and it opens the rail,
never a seat, so a mis-tap can never buy you in. Folding at your own table does not eject
you: the controls leave, your cards become outlines, the rail ticks arrive, and you are a
railbird at a table you are still sitting at.

**A rail is a line.** The line is the app's only structural device. Sections are divided by
1px and 2px hairlines, never by cards. The selected state anywhere in the app is a **58-unit
notch subtracted from a line** — the same gap, at three scales: the navigation cell, the
`LISTINGS · PLAN` register in the TABLES masthead, and the seat cut into the table boundary.
The app icon is one boundary hairline broken by one notch with the crowd ticked beneath. The
boot screen draws that mark, then walks the line down to the foot of the screen and becomes
the navigation you use for the rest of the session.

---

## 3. Audience and the competitive read

**Audience.** Groups of friends aged roughly 22–40 who already play poker together in person
or over group chats, plus the much larger population who enjoy poker as a spectator sport and
a story generator without wanting to risk money. The unit of adoption is a friend group, not
an individual: a rail of eleven people is the prototype's default scale, and the product is
close to worthless at a rail of one.

**The read.** Search the store for poker and every result is the same object: green or blue
felt, an oval table drawn in perspective, gold accents, glossy chips, casino signifiers,
purple-to-pink gradient promos, a lobby that is a sortable table of stakes and a shop full of
chip bundles. The category has converged so hard that rejecting casino visual language
entirely is the highest-leverage move available — before any feature argument, the screenshots
alone read as a different product.

The specific moves this app makes instead:

| The category does | RAIL does | Where you can see it |
|---|---|---|
| Felt, perspective, gloss | A drawn instrument: near-black ground, hairline geometry, measurement ticks, no simulated surface | `/table`, `src/data/tableLayout.ts` |
| Chips in gold, prizes in colour | One accent (amber `#fe7825`), spent only on time and expression; chip counts sit in neutral bone | `src/design/tokens.ts` |
| Spectating as read-only | The rail as its own screen with its own gestures, its own throw provenance and its own record | `/rail` |
| Lobby as a sortable dashboard | Two registers of the same six rooms — a plan you walk, and listings — sorted by **noise**, never by stakes | `/floor`, `/tables` |
| A social feed of cards and vanity metrics | An edition: masthead, dated number, one lead hand with a verdict in the headline, everything else in agate | `/feed` |
| Emotes as chat stickers | Four throwables with trajectory, a target, a cooldown and residue that persists on a face | `/table`, `/rail`, `/clip` |
| Cosmetics as one undifferentiated shop grid | Earned wears measurement ticks; purchased wears a maker's mark; a section advertises what money cannot buy | `/profile`, `/loadout`, `/shop` |
| Emoji and stock icon sets as UI | No icons at all. Emoji are avatars and throwables only | `docs/APP-SHELL-SPEC.md` §9 |
| Light mode: nobody | Still nobody — the handoff explored a bone-paper Broadsheet direction and it lost to Terminal on the line-as-spine argument | `chats/chat1.md` |

The six App Store screenshots are ordered as an argument — watch, measure, throw, win, read,
own — and the word "poker" does not appear until the third caption:

1. "You do not need a seat to be in the hand."
2. "Every bet is a measurement, not a slider."
3. "Throw at a face. Not into a chat box."
4. "The pot does not vanish. It goes to a face."
5. "Somebody wrote up your worst hand. Beautifully."
6. "What you earned and what you bought never look alike."

---

## 4. Pillars, and the design consequence each one forces

**1. Watching is the product.** Consequence: every route into a room lands on the rail
first; the seat is taken from inside the rail or the plan. FRIENDS' relief band prints one
figure — 58 seats taken after watching first — because watching must not read as a waiting
room. The navigation's live ticks count rooms live and people on now; they never count what
you have not read.

**2. Expression is the business model.** Consequence: nothing purchasable may touch a card,
a bet or a clock, and every ownership screen says so in its own foot ("NO ITEM ON EITHER
SHELF CHANGES A CARD, A BET, OR A CLOCK"). The throw is identical whichever object you throw;
only the object differs. Cooldown is 2.5 s for everyone and is not for sale.

**3. The line is the only device.** Consequence: no cards, no rounded corners, no shadows,
no gradients, no blur, no translucent panels. Selection is a notch. Returning from a pushed
screen is the inverse — a 2px stub **added** to that screen's own top rule, never an arrow or
a chevron, because the app owns no icon language and will not start one.

**4. Figures are set like instruments.** Consequence: every number in the app is JetBrains
Mono; every human sentence and every button phrase is Helvetica; a numeral never appears
inside Helvetica. This is why the door says `Walk in on Bea's table / 238 WATCHING` instead
of "Walk in on table 12" — the room's number moves out of the phrase and into the mono figure
slot beside it.

**5. Violent type contrast and deliberate density.** Consequence: at least 4× between the
smallest and largest type on any screen (HOME runs 7 → 78 = 11.1×, FRIENDS 7 → 62 = 8.9×,
TABLES 7 → 30 = 4.3×), and every screen names one dense zone and one nearly empty zone in its
own source comment. A 14/16/20/24 ramp is a defect.

**6. Amber is a budget, not a palette.** Consequence: under 5% of any screen, and in practice
far less — HOME carries exactly one amber figure (a 13px clock, about 0.2% of the screen) and
FRIENDS carries exactly one amber mark (the crowd on the hand you are watching). Amber on a
chip, a stake, a seat, a name, a button or any part of navigation is a defect.

**7. Nothing is reachable only by gesture, and nothing blocks input.** Consequence: the
showdown can be skipped by tapping anywhere; the boot sequence can be skipped by tapping
anywhere; the rail's tape is a swipe-up but the same data is reachable by reading the vantage.
The navigation bar has no gestures at all, because three screens already own a distinct drag.

**8. Play chips, stated as fact rather than disclaimed.** Consequence: the constraint is set
in mono agate in the foot of every destination, in the app's own voice, as two lines of
statement — not a legal footer, not a modal, not a checkbox.

---

## 5. The loop

### Minute to minute, at a table

The table is one surface with four action-bar states and no modals. Your clock is a 2px amber
rule that drains; another player's clock is a bone hairline, because the accent marks the time
*you own*, not time in general.

1. **Your turn.** A readout row, your amber clock, then four cells divided by hairlines:
   FOLD, CALL 600, RAISE TO 2,100, THROW. The primary is a filled bone slab. No accent on a
   chip action.
2. **Sizing a raise.** The bar becomes the slide rule: minor ticks every 100 chips, four
   named stops (MIN 1,200 · ½ 2,100 · POT 4,250 · ALL IN 4,820), a 2px thumb with a diamond
   head, and the amount set at 44px against a 9px label. Dragging is 1:1 with no inertia;
   stops seat with a 120 ms settle and a selection haptic. Committing everything **arms
   first**: the cell states `PRESS AGAIN · ALL IN 4,820` and waits for a second deliberate
   press.
3. **Waiting.** Dead time is not dead: two resting orders (queue fold, queue call-any) plus
   THROW, which is never blocked by turn order. Agate under the bar states the rule —
   `QUEUED ORDER CANCELS IF THE BET SIZE CHANGES`.
4. **Folded.** Your cards go to outline, `MUCKED` in 7px agate, your bust dims and drops, the
   controls leave, and the rail's ticks arrive with `YOU ARE ON THE RAIL / 15 WATCHING`. THROW
   is the only live control. The space stays empty on purpose.
5. **All in.** No decisions remain, so the bar stops being a control and becomes a readout:
   the committed figure at 46px, the pot beside it, the runout drawn as five segments with one
   still hollow.
6. **Throwing.** Press a throwable in the tray and drag. A dashed hairline leader tracks your
   thumb and snaps discretely to the nearest bust within 92 units; the aimed bust takes a
   reticle and lights its head strip; release fires, dragging off the table cancels for free.
   Your thumb never leaves the bottom third and the board is never covered.
7. **Showdown**, 1.4 s, six beats, over the live table rather than in a modal. The pot numeral
   is the only object that travels: it collapses, arcs to the winner's bust, is absorbed, the
   stack counts with tabular digits, the bust punches 1.06× (the only squash in the app), and
   at T+900 railbird reactions arrive as amber ticks on the same head strip a throwable uses.
   Everything clears on one 180 ms exit. Losing is a subtraction — desaturate, drop 3px, count
   the stack down, no red, no delta chip — and by T+1,400 you are indistinguishable from
   someone who folded pre-flop.

### The session loop

Boot (about 1.24 s) hands off to HOME. HOME answers one question — are my people playing, and
do I walk in — with one numeral, one sentence and one press. From there:

**Watch → react → read → own.** You walk in on a friend's table from HOME or from a TABLES
listing, stand on the rail, throw a metered reaction or two, swipe up for the tape to see the
hand as a record, and either take the open seat or leave it. Hands you were part of, or that
were loud enough, arrive in the edition on FEED — a dated document with a lead hand, bad beats
in agate, and a section where you appear in the third person. From the edition you open the
clip and pin a reaction to the second it belongs to. What you did accrues on the record;
what you earned appears on the earned shelf and can be equipped in the loadout beside
something you bought at the counter. Nothing in that loop requires you to sit down, and the
economy is fed by expression rather than by sitting down.

---

## 6. Feature set, screen by screen

Twelve routes. Four are destinations that carry the navigation bar; the rest are screens you
were pushed into to do one thing, and they hide the bar so their geometry stays exactly as
drawn. Every screen is authored in design units on a fixed 420-wide canvas and scaled by
`<Screen>`: `mode="fit"` scales the whole composition so it never reflows, `mode="scroll"`
keeps device width and scrolls.

| Route | File | Kind | Canvas | Masthead / header |
|---|---|---|---|---|
| `/` | `app/index.tsx` | boot overlay | own frame, `width / 420` | the mark itself |
| `/home` | `app/home.tsx` | destination | 880, scroll | `RAIL` |
| `/tables` | `app/tables.tsx` | destination | 1032, scroll | `TABLES` + `LISTINGS · PLAN` |
| `/feed` | `app/feed.tsx` | destination | 914, scroll | `THE RAIL` |
| `/friends` | `app/friends.tsx` | destination | 1620, scroll | `YOUR RAIL` |
| `/floor` | `app/floor.tsx` | pushed (second register of TABLES) | 900, scroll | `THE FLOOR` + `LISTINGS · PLAN` |
| `/table` | `app/table.tsx` | pushed | 912, fit | own 14px header, rule at 88 |
| `/rail` | `app/rail.tsx` | pushed | 720, fit | own header, rule at 44 |
| `/clip` | `app/clip.tsx` | pushed | 760, fit | own header, rule at 44 |
| `/profile` | `app/profile.tsx` | pushed | 870, scroll | `THE RECORD` |
| `/loadout` | `app/loadout.tsx` | pushed | 768, scroll | `LOADOUT` |
| `/shop` | `app/shop.tsx` | pushed | 720, scroll | `THE COUNTER` |

### `/` — Boot

**For:** teaching the mark in one gesture, and covering font load.
**Does:** draws `RAIL` at mono 44/700/.26 over a 2px rule broken by a 58-unit notch centred
on the screen, the positioning line in 7px agate beneath it, and a fourteen-tick loading meter
that runs on elapsed time over 900 ms. The rail builds outward from the notch (620 ms), holds,
then in one 320 ms move the line walks down to where the navigation bar lives while the notch
travels to HOME's position and the wordmark walks up to the masthead at exactly the size and
tracking HOME sets it. A tap skips the dwell; reduce-motion draws the rest frame and cuts.
**Deliberately absent:** a spinner, a percentage, a progress bar, a logo animation, and any
amber whatsoever — this meter measures the app's readiness, which is neither time you own nor
expression.

### `/home` — the door

**For:** answering "are my people playing, and do I walk in", then telling you where you
stand. It is a door, not a dashboard.
**Does:** a hero of one figure — `4`, at mono 78 — for how many of your people are at a table
right now, `OF 11 ON YOUR RAIL / ACROSS 3 TABLES` beside it in 8px agate, one Helvetica
sentence ("Bea sat down before dinner and has not given a chip back since"), and the screen's
only amber: `OKONKWO TO ACT / 0:06`, a live countdown. Then the paired door slab, then a dense
`YOU, TONIGHT` band with your bust, handle, `12,940 WATCHED · 4,812 PLAYED`, free throws
remaining, four equipped loadout tiles at 96-unit pitch, and three route cells (`The record`,
`Loadout`, `The counter`) divided by two vertical hairlines rather than boxed. The foot is the
rail as an object with `11 ON YOUR RAIL` beside it, then the constraint in agate.
**Deliberately absent:** a roster (that is FRIENDS), a second room (that is TABLES), an unread
badge, a chart, a chip balance presented as a score, and a numeral inside any Helvetica
sentence on the screen.

### `/tables` — the register

**For:** choosing a room by why you would walk in, not by what it costs.
**Does:** six live rooms, each drawn identically as one listing: a mono eyebrow carrying room,
stake and open seats (`TABLE 12 · 2/5 NL · 2 SEATS`), one Helvetica sentence with no digit in
it, the pot as the only large numeral (mono 30), the room's own rail drawn as a rail with its
crowd hanging below the line, and an amber crowd mark whose length is the count. Listings are
sorted by watchers, descending — in the code, not only in the copy. Four noise bands (LOUD
≥ 40, WARM ≥ 4, QUIET ≥ 1, EMPTY 0) drive four channels: listing opacity, rail weight and ink,
how many busts hang off it, and pot ink. The one room that is not dealing gets the only honest
call to action in a lobby — `Sit first / MIN 4,000` at full ink inside its dimmed listing. The
masthead carries `LISTINGS · PLAN` with the 2px rule notched under the half you are standing
in; PLAN pushes `/floor`.
**Deliberately absent:** sortable columns, stakes as a sort key, waitlist counts as a metric,
a card per listing, and any second target inside a listing. One press per room, and it opens
the rail.

### `/floor` — the plan

**For:** the same six rooms at a different distance, for people who choose by looking.
**Does:** tables are *drawn* rather than listed, using the identical broken hairline boundary
and busts-at-notches as the seated view. Your people's table takes the plan's full width with
its headline, its rail, and the paired press `Take seat 1 / MIN 4,000` beside `Just watch`.
The rest of the floor is the same object at a third the size, loudest first, with an empty
table drawn at 45% opacity and labelled `EMPTY` instead of shouting for attention.
**Deliberately absent:** a LeaveMark and a navigation bar — it is TABLES at another distance,
so the way back is the register notch in its own masthead. One screen with two ways back
would be two devices for one act.

### `/table` — six-max, mid-hand

**For:** the hand itself, and the most-touched surface in the app.
**Does:** the boundary as six hairline segments with a notch cut for every seat; busts outside
the line with the name block reading *under* the bust; the pot at the centre; the board with
the newest street lit; your hole cards and stack; the rail's own strip and watcher count in
the header band; the four action-bar states, the slide rule, the drag-to-throw tray with its
2.5 s cooldown meter, throw residue persisting on faces, and the 1.4 s showdown. The way out
is a 2px bone stub added to the header rule at y=88, labelled `LEAVE THE TABLE` — deliberately
at the top of the screen, because the bottom 190 units are the instrument (clock rule 720,
action bar 722–810, cooldown to 858) and nothing that leaves the table may sit a thumb-width
from ALL IN.
**Deliberately absent:** a chat box, a modal, a navigation bar, a hand-strength meter, an
odds coach beyond the pot-odds readout the handoff drew, and any red anywhere — hearts and
diamonds are warm bone (`#e8dcd2`), because red in this app would be a second accent.

### `/rail` — the spectator view

**For:** the screen that earns the name. It has no reference anywhere in the category.
**Does:** two watch models on one screen. The **vantage** draws the table closed — six
notches, none of them yours — with the pot, the board, the running tape and the amber clock of
the player to act, and *you* below it all at a literal rule with the crowd hanging off it,
your bust lit and labelled `YOU`. Swipe up for the **tape**: the hand as a page, one row per
action with the amount in tabular mono, pot growth as a 2px bar under each row, and rail
reactions as margin annotations pinned to the action they answered (2, 9, 24 — the tick block
grows with the count). Throws from here are **metered** (`3 / 5 FREE · RESETS 4:12`) and
arrive **hollow**, never solid, so a seated player can always tell a crowd reaction from a
table reaction. Joining is a 620 ms sequence: your bust leaves the rail along the same dashed
path a throwable travels, the empty slot takes a reticle, the buy-in uses the same slide rule
as a bet, the boundary notch widens to admit you, and the rail count drops by one as the crowd
chips shrink — you are the subject now, not one of them. When the table is full, the join
becomes a waitlist with position and ETA.
**Deliberately absent:** a chat, a "request to play" queue you cannot see the front of, and
any way to affect the hand. A railbird's only instrument is a throw, and it is metered.

### `/clip` — reactions live in time

**For:** a hand after the fact, with the crowd's judgement readable before you watch.
**Does:** 24 seconds of one hand. The scrub is the bet slider again — minor ticks, four street
stops that snap with a haptic, a diamond thumb — and above the track is the **reaction lane**:
every throw drawn as a hairline at the second it landed, so a spike at 0:11 is a shape you
read at a glance. A throw here pins to the frame, not the post (`PINS TO 0:11, NOT THE POST`),
and the `WHO THREW AT 0:11` row marks each thrower's object filled if it came from a seat and
hollow if it came from the rail, with the legend stated on the screen. Two ways out: close the
clip back to the edition, or walk in on the room the hand is still being played in.
**Deliberately absent:** a comment thread, a like button, an autoplay feed of adjacent clips,
and a reaction count above the fold.

### `/feed` — the edition

**For:** the rail as editorial. A dashboard reports; an edition decides.
**Does:** a masthead (`THE RAIL`, `29 JUL · ED 412`), one lead hand with a real headline
containing a verdict — "Bea puts 4,200 in with second pair, and is right." — its board, its
pot at mono 26, winner and loser busts with their lines, the reaction total massed into one bar
with the breakdown in agate beside it, and `Watch clip / 0:24`. Then everything else demoted:
`BAD BEATS` in agate with three items and their cards at 16×22, then `FROM YOUR TABLES` where
you appear in the third person ("You lost 4,820 to a straight flush", `Rematch`).
**Deliberately absent:** an infinite grid, vanity metrics above a headline, a like button, and
any unread count in the navigation bar — the document dates itself, which is precisely why the
bar never counts what is unread.

### `/friends` — your rail

**For:** "your friends are your rail" as a structure rather than a slogan.
**Does:** a hero of one figure — `340`, hands of yours Sven has watched — and the sentence
that makes it mean something. Then the rail as a literal object: one 2px rule with notches cut
for the people who are *seated* (bust astride the notch, frame lit) while people who are
*railing* hang below an unbroken line, people who are merely *around* stand clear of the line
entirely at 22 units, and people who are away get no bust at all, only `+4 AWAY TONIGHT`.
Presence is drawn with the app's own vocabulary — notch, line, frame, size, opacity — and never
with a coloured dot. A dedicated band carries the most interesting state on the screen,
somebody watching the same hand as you, drawn as one rail rule with two busts on it and the
screen's single amber mark. Then the **ledger**: six rows of two figures each (`RAILED YOU 340
· YOU RAILED 96`), the hands-watched-together figure set in mono, and a tick strip whose
*length* is that figure so it reads as measurement rather than a sortable column. Then requests
in both directions, each carrying the room you were both standing in as its reason, three
suggestions with real reasons, and an add-by-handle field where the rule underneath *is* the
input — a hairline at 30% that steps to 2px bone the moment there is something to send — noted
`NOBODY CAN SEND CHIPS`.
**Deliberately absent:** follower counts, mutual badges, ranks, a green dot, an unread badge on
requests, and any amber on a state change.

### `/profile` — the record

**For:** a record, not a trophy case.
**Does:** your bust at 72 units with a ticked head strip, sessions and hours on the rail,
`SEATED FROM THE RAIL 58 TIMES`, one Helvetica line ("You have watched more hands than you have
played, and it shows"), then six career rows where hands watched sits in the same column as
hands played. Then two separate shelves: `EARNED · 9`, each tile carrying the hand it came from
(`TABLE 7 · QUADS BEATEN · 14 JUN`), and `PURCHASED · 4`, each carrying an edition and a price.
**Deliberately absent:** a win rate, a leaderboard position, a chip graph, a level, and a
shared shelf — a shared shelf would let the two classes borrow each other's meaning.

### `/loadout` — four slots

**For:** the place the earned/purchased distinction has to work hardest, because both classes
sit adjacent at the same size.
**Does:** four slots, each showing its object at 56 units in its own class frame, its title in
Helvetica, its origin in mono, and its provenance line; an `EQUIP` / `EQUIPPED` cell that
toggles instantly; an empty fourth slot drawn as the only dashed frame in the app, so it reads
as absence rather than a button. Then `HOW IT LANDS` — a live preview of exactly what an
opponent sees when your throw lands on their head strip, filled from a seat and hollow from the
rail, with the 1.06× punch you can press to replay — and `RAIL CARD`, proving both classes
survive at 26 and 22 units on a stranger's rail. The foot states the two rules that matter: a
slot accepts either class, and swapping is free and instant, because loadout is expression, not
commitment.
**Deliberately absent:** rarity tiers, stat lines, set bonuses, and any suggestion that
equipping a purchased object changes the throw. `NEITHER CLASS CHANGES THE THROW — ONLY THE
OBJECT THROWN`.

### `/shop` — the counter

**For:** selling objects honestly in a game whose currency of status is the record.
**Does:** dated stock (`STOCK · 29 JUL`), one lead item with a named maker, real copy and a
flat price in credits (`1,800 CR`), and a buy press that fires the only celebration money buys
— the maker's mark striking onto the plate over 120 ms. Then three more items, one owned, one
struck through as sold out. Then the load-bearing section: **NOT FOR SALE**, ticked earned
items shown *with their requirements* ("SURVIVE A ONE-OUTER", "FOLD 20 IN A ROW"), advertised
inside the shop, under the note `TICKS ARE NOT STOCK`. The foot: `NO ITEM IS EVER SOLD WITH
TICKS — THAT IS THE WHOLE DEAL`.
**Deliberately absent:** bundles, boxes, loot, timers, discounts, a currency-purchase flow of
any kind, and any object that touches a card, a bet or a clock. It is also a deliberate dead
end — nothing is bought onward from here.

---

## 7. Game rules: implemented versus scripted

**There is no poker engine.** This must not be misread. `src/state/useTable.ts` is a scripted
hand, not a dealer:

- One hand exists, drawn to the chip, and it is the hand every panel of the design was
  reviewed with: table 12, 2/5 NL, blinds 50/100, hand 1,285, board Q♠ J♠ 7♦ 2♥ with the river
  to come, your hole cards A♠ K♠, pot 2,450, 600 to call, 2,100 to raise to, fourteen watching,
  a 20-second clock.
- Opponents do not decide anything. They "think" for 3,200 ms and then the script resolves.
  **Fold** makes you a railbird at your own table for 8 s and re-deals. **Call** takes the 4a
  win: pot 12,090, stack 4,820 → 16,910. **Shove** runs you into 4b's straight flush
  (7-8-9-T-J♠) and the losing sequence. Every new hand re-deals the same hand with the
  hand number incremented.
- Consequently there is no dealing, no shuffling, no blinds posting, no betting-round
  bookkeeping, no side pots, no hand evaluation, no turn order, no timebank, no sit-out, no
  rake and no rebuy. The visible cards on the board are fixtures. `TAPE`, `CLIP` and `EDITION`
  are transcripts of the same hand written by hand.
- One fixture is knowingly unreconciled: the losing sequence counts a stack down from 8,140 to
  3,320 because those are 4b's numerals from the handoff, while the live stack you carry into
  the hand is 4,820. It is correct as a motion study and wrong as arithmetic. A real engine
  makes the question disappear.

This was the right call for a prototype — a build that dealt random cards would immediately
stop matching the screens it exists to prove — and it is the single largest gap to a shippable
product.

**What a real engine would have to own.** It is server-authoritative or it is nothing:

1. Deck, shuffle and deal, with a seeded, auditable RNG and no card ever resident on a client
   that the player is not entitled to see.
2. Betting rounds: blinds and antes, minimum raise, incomplete raises, string-bet prevention,
   all-in and side pots, and the exact chip arithmetic for split pots and odd chips.
3. Hand evaluation and showdown order, including which five cards are "playing" — the table
   already draws a 1px underscore under the playing five, and that set has to come from the
   engine.
4. Turn order, action clocks, timebanks, disconnect and time-out policy (the prototype folds a
   timed-out hand, which is a defensible rule but must be the engine's rule, not the view's).
5. Table lifecycle: seating and un-seating, buy-in ranges and top-ups, sit-out, blind posting
   on return, table closure when a room empties, and the waitlist `/rail` already draws.
6. A hand history record that is the single source of truth for the tape, the clip, the
   edition and the record — every reaction in the app pins to a moment in that history, so the
   history's identifiers are load-bearing.
7. Anti-collusion and integrity: seating rules for friends at the same table, chip-dumping
   detection (which matters even for worthless chips, because status is real), and multi-account
   detection.

---

## 8. The expression system

Expression is the wedge, so it is engineered rather than decorated. Emotes are **objects with
physics, in 2D** — not stickers, not overlays.

**The four throwables.** They are adjectives about *luck*, never opinions about people, and
that is the entire moderation strategy rather than an afterthought to it:

| Object | Means | Class in the prototype |
|---|---|---|
| HEATER (flame) | running good | purchased |
| COOLER (skull) | brutal luck | earned |
| ICE (ice cube) | playing slow | earned |
| CROWN (crown) | earned respect | earned, locked |

There is no thumbs-down, no laugh, no insult, and no free-text channel anywhere in the app. A
COOLER thrown at a player says the deck was cruel; there is no available vocabulary for saying
the player is stupid. That is a deliberate ceiling on what abuse can even be expressed, and it
is why the app can ship a reaction system without shipping a chat moderation problem.

**Targeting.** The handoff explored three genuinely different mechanics for the hardest
interaction in the product — pick an object, pick a target, in portrait, mid-hand, without
covering the table and without accidental sends. 3a was two taps on the busts themselves; 3c
was a quarter-arc thumb dial with six detents in the busts' real positions, whose own arc
doubled as the cooldown gauge. **3b, drag and release, is the one that ships**: it is the only
single continuous gesture, so the commit point is physical (you let go) rather than a second
tap that can be mis-hit, and the thumb never leaves the bottom third. The leader is a dashed
hairline that snaps discretely — a reticle jumps, it never interpolates — within 92 units of a
bust, with a selection haptic on each change of target. Dragging off the table cancels
silently and for free.

**Cooldown.** 2.5 s per player, drawn as a hairline that drains under the throw key with the
numeral counting down in mono. It never greys the tray, never shows a spinner and never nags:
you may open the tray during cooldown and pre-aim, you simply cannot release. It is a declared
meter, so it runs on elapsed time and is exempt from the duration ladder.

**Residue.** A throw lands on the target's ticked head strip — the same landing zone the
showdown's railbird reactions arrive on — and **persists** there until the hand ends,
accumulating a count if you throw again. Residue is state on a face, not a floating animation,
which is what makes a throw feel like it happened to someone.

**Provenance, drawn and never labelled.** A throw from a seat is **filled**; a throw from the
rail is **hollow**. That one distinction holds everywhere the object appears: in flight at the
table, arriving on a bust at the rail, and in the clip's thrower row, which states the legend
in situ (`FILLED = FROM A SEAT`, `HOLLOW = FROM THE RAIL`). It means a seated player can always
tell whether the crowd or an opponent just reacted to them.

**Density, so a friend never reads as a mob.** Three registers, applied identically wherever a
reaction count appears: one reaction is **named in full**; 2–39 are **counted, one tick each**
(4px pitch, 2px in agate); 40 or more are **massed into a single bar**, capped at 96 units (48
in agate). A single cooler from Bea and 240 from a crowd are different objects, not the same
object with a bigger number.

**Rail metering.** Railbirds get a free-throw allowance (3 of 5, resetting on a visible timer)
so that spectating is expressive without being a spam channel. Seated players are metered only
by the 2.5 s cooldown, because a seated player is already paying attention with their stack.

---

## 9. Progression and economy

**One binary carries the whole system, and it is structural rather than decorative:**

- **Earned** items wear the **measurement ticks**, cut into the top edge of the object — the
  app's own language of record, the same ticks as the head strip, the slide rule and the
  reaction lane. Ticks are bone, never amber.
- **Purchased** items wear a **maker's mark**: a filled corner plate on an object wrapped in an
  offset hairline. Packaging applied to the object, rather than measurement cut into it.

Measurement versus manufacture, not two tiers of one thing. The distinction survives at 24–26
units on a stranger's rail, where ticks become texture and the mark collapses to a corner dot
inside its wrapper — which is the size that actually matters, because that is how most people
will ever see your objects.

**Credits (CR)** are the only purchasable currency and they buy objects only. The prototype
carries a 4,050 CR balance, flat prices (900 / 1,800 / 2,400 CR), named makers ("MAKER M",
"MAKER V"), dated weekly stock and numbered editions (`ED 231 / 500`). There are no bundles,
no boxes, no loot, no timers and no discounts.

**Never for sale, and advertised as such inside the shop:** anything with ticks. The counter
carries a NOT FOR SALE section listing earned objects beside the requirement that yields them
("SURVIVE A ONE-OUTER", "FOLD 20 IN A ROW"). Selling a ticked object once would retroactively
devalue every ticked object in the app, so the rule is absolute: **nothing is ever sold with
ticks — that is the whole deal.**

**The rule that keeps the economy honest:** no cosmetic touches a card, a bet or a clock. Not
the throw's speed, not its cooldown, not the reaction it draws, not your time to act, not your
position, not the deck. Every ownership screen prints this in its own foot. A purchased object
changes only what other people see when you express yourself, which is exactly what people are
willing to pay for and the only thing this product will sell them.

**What accrues instead of a level:** the record. Hands played and hands watched, biggest pot
won, throws landed and throws answered, seats taken from the rail, clips that made an edition.
There is no XP bar, no rank, no season pass and no daily-login reward in the design.

---

## 10. The social model

**The rail is the primitive.** Not a friends list, not a follow graph — a line with people
standing on it. FRIENDS draws it literally, and presence is drawn with the app's own
vocabulary: seated people are astride a notch in the line, railbirds hang below an unbroken
line, people who are in the app and in no room stand clear of the line entirely, and people who
are away are a figure rather than a face. There is no coloured status light anywhere.

**Reciprocity, not popularity.** The ledger carries two figures per person — hands of yours
they watched, hands of theirs you watched — and the quantity the screen is *about* is hands
watched together, drawn as a tick strip whose length is the figure. There is no follower count,
no mutual badge, no rank, and nothing sortable. Requests run in both directions and each one
carries the room you were both standing in as its reason, because a suggestion without a reason
is an algorithm asking for trust.

**Rooms, not lobbies.** Rooms are sorted by noise. A room's rail is drawn as a rail. Private
rooms exist as a concept and a label (`Private room`, and a fixture for a private room opened
"for the six of you who met on Bea's rail") but are not built.

**Moderation falls out of the vocabulary.** This is the strategy, stated plainly, because it
is a product decision rather than a policy one:

1. **There is no text channel.** No chat at the table, no chat on the rail, no comments on a
   clip, no display-name field with free input beyond a handle. Most poker-app abuse arrives as
   text, and this app has nowhere to put it.
2. **The reaction vocabulary is four adjectives about luck.** The worst available act is
   throwing COOLER at someone repeatedly, and that act is bounded by the 2.5 s cooldown, by the
   rail's free-throw allowance, and by residue that names *you* as the thrower on their face.
3. **Provenance is always visible.** Every throw is attributable — filled from a seat, hollow
   from the rail, with the thrower's own bust in the clip's row. Anonymous throwing does not
   exist.
4. **Density protects the target.** The massing rule means a target sees "240" as one bar
   rather than 240 individual events, which is deliberately less overwhelming than the raw
   count.

What still has to be built for a shippable moderation story: per-person mute and block that
suppress a thrower's objects for the muted party, a report path attached to a hand-history
moment (the clip already pins reactions to a second, so the report has a natural anchor), rate
limits enforced server-side rather than in local state, and handle moderation, since a handle
is the one piece of user-authored text in the product.

---

## 11. Compliance and copy constraints

Positioning: **social poker rooms with friends, play chips only.** Chips are non-transferable
and have no value. This shapes what things are named, not just what disclaimers say.

**Forbidden in labels, buttons, empty states, notifications and store copy:** deposit,
withdraw, cash out, cash in, buy chips, sell chips, send chips, gift chips, transfer, balance
(of chips), wallet, bank, prize, jackpot, payout, winnings, real money, value, "worth", odds
of profit, and any construction implying that chips are or will become convertible. No "coming
soon" hints at real-money play. No currency symbols on chip figures. Credits are written `CR`,
always as a count of an internal token that buys objects.

**How the constraint is expressed instead:** as a statement of fact in mono agate in the foot
of each destination, in the app's own voice, never as a legal modal:

- HOME: `CHIPS ARE PLAY CHIPS · THEY CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT` /
  `CREDITS BUY OBJECTS, NEVER CHIPS`
- TABLES: `EVERY ROOM IS PLAY CHIPS ONLY · SORTED BY NOISE, NEVER BY STAKES` /
  `CHIPS CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT`
- FRIENDS: `A RAIL IS PEOPLE, NOT A FOLLOWER COUNT` / `CHIPS CANNOT BE SENT, RECEIVED OR
  CASHED OUT`
- The invite field carries `NOBODY CAN SEND CHIPS` in its own corner — the constraint stated
  exactly where a person would expect to be able to violate it.
- The boot screen states the positioning line itself: `SOCIAL POKER ROOMS WITH FRIENDS · PLAY
  CHIPS ONLY`.

**Voice rules that go with it.** Mono uppercase with wide tracking for eyebrows and labels
naming territory; sentence-case Helvetica for anything a human would say or press
(`Take seat 1`, `Just watch`, `Sit first`, `Walk in`). Figures never enter a Helvetica phrase.
Headlines carry verdicts, because the rail's voice *is* the product. No placeholder copy
anywhere: no lorem, no "coming soon", no unwritten empty state.

Not covered here and still required before submission: age gating and store age rating,
regional review of "social casino" classification, in-app-purchase disclosure for credits, and
privacy copy for the friend graph.

---

## 12. Motion requirements

Motion is a requirement, not a decoration budget, and it is specified rather than taste-based
(`src/design/tokens.ts`, `src/design/motion.ts`).

- **Five named curves, and no others:** LINEAR (clocks, meters, counts), SLIDE (panels, rules,
  slots, plans), ARC (anything that travels the table), SETTLE (the only two overshoots), OUT
  (every exit).
- **Eleven duration stops, and nothing between them:** 0 TRACK, 90 PUNCH, 120 MARK, 180 EXIT,
  220 ARRIVE, 240 OPEN, 320 TRAVEL, 420 COUNT, 620 JOIN, 900 SKIP, 1400 WHOLE. **A transition
  outside the ladder is a bug, not a preference.**
- **Two declared exemptions.** 0 · TRACK is for anything following a finger 1:1 (the bet
  thumb, the clip scrub, the drag leader). **Meters** — a clock, a cooldown, a loading progress
  — run on elapsed time and are exempt, because a clock cannot lie.
- **Everything leaves the same way.** One 180 ms OUT, opacity plus a small translate, for every
  object in the app, so nothing ever exits in a way a user has to learn.
- **Two overshoots exist in the entire product:** 1.06× on a win, 1.04× on sitting down.
  Nothing else bounces, ever.
- **Nothing loops except the clock and the cooldown.**
- **Amber only moves for the crowd and the clock.**
- **Nothing blocks input.** Every sequence is interruptible, including the win; a tap skips the
  showdown to T+900 and the boot to its handoff.
- **Reticles and selected states never interpolate.** The navigation notch, label colour and
  label weight snap on the frame the route changes. The only timed value in the navigation bar
  is a press fill releasing.
- **Reduced motion is a first-class path**, not a global disable: the boot draws its rest frame
  and cuts; the same content is reachable in the same number of presses.
- **Implementation rule:** Reanimated only, and no shared value is ever written during render —
  always inside `useEffect`.

---

## 13. Non-goals

Ruled out by name. Any of these appearing in a build is a defect rather than a preference.

- **Real money in any form.** No wagering, no deposits, no withdrawals, no chip purchase, no
  chip transfer, no sweepstakes, no tokens with resale value, no "play now, cash later".
- **Tournaments, MTTs, sit-and-gos, jackpots, bad-beat bonuses, rakeback, VIP tiers.** The unit
  is a room with friends in it.
- **Other poker variants.** No Omaha, no short-deck, no mixed games in the first shippable
  build.
- **Chat, in any form.** No table chat, no rail chat, no clip comments, no direct messages.
  The reaction vocabulary is the channel.
- **Any advertising.** No interstitials, no rewarded video, no sponsored rooms.
- **Pay-to-win of any shape,** including cosmetics that alter a throw's speed, a cooldown, a
  clock, a seat position or the deck.
- **A dashboard lobby.** No sortable columns, no stakes as a sort key, no six-metric summary,
  no charts.
- **Engagement metrics as UI.** No unread badges, no streaks, no daily-login rewards, no push
  notification that reports a number.
- **Landscape, tablet layouts, and desktop.** Portrait only, one 420-unit canvas. Web exists
  for review only.
- **Icons, emoji-as-icons, and a second selected-state device.** Emoji are avatars and
  throwables only; selection is a notch plus an ink step.
- **3D, perspective, WebGL, felt simulation.** Everything is 2D and drawn.

---

## 14. Open questions

1. **Whose hand goes in the edition, and who writes the headline?** The lead headline in the
   prototype carries a verdict ("and is right"), which a template cannot produce credibly.
   Options: heuristics over hand history, a model with a tight house style, or curation. This is
   the highest-variance unsolved product question, because the edition is the retention engine.
2. **Free-throw economy.** 3 of 5 with a 4:12 reset is a drawn figure, not a tuned one. Are
   free throws per rail, per hand or per session, and does an earned object ever raise the cap
   (it must not, or earned becomes pay-to-express by another route)?
3. **Does a railbird's throw ever cost credits?** Currently no. If throws are always free after
   the meter resets, the entire economy rests on the objects themselves, which is cleaner but
   thinner.
4. **Where do private rooms sit?** A fixture describes one opened "for the six of you who met
   on Bea's rail", and TABLES carries the label, but nothing is built. Are they invite-only
   rooms, persistent clubs, or scheduled events?
5. **Presence granularity.** FRIENDS distinguishes seated / railing / around / away. "Around"
   is honest and also the least useful state; it may be the first thing to cut.
6. **What does an empty rail look like?** Every screen is drawn at the density of a working
   product with eleven friends. Day one, a new user has none, and the confidence-in-emptiness
   rule has to survive contact with genuine emptiness rather than composed emptiness.
7. **Is the clip a real video, a replay of hand history, or a drawn reconstruction?** The
   current screen is the third thing, which is cheapest to serve and hardest to make feel live.
8. **Cooldown at the table versus fairness of expression.** 2.5 s is uniform; a heads-up hand
   and a six-way pot are very different in how much room that leaves for reacting.
9. **Should the record ever be private?** Hands watched is a flattering statistic here and an
   uncomfortable one to expose to a stranger's rail card.
10. **Store classification risk.** A play-chips poker app that sells cosmetics may still attract
    a social-casino rating in some regions; that decision affects the store copy and the age
    gate, and it should be answered before art is finalised.

---

## 15. Roadmap: from this prototype to a shippable build

### Where the prototype actually stands

Built and working on device, in Expo Go, with no native modules: twelve routes, the boot
sequence and its handoff into the navigation bar, the navigation rail with its notch and live
ticks, all four table action-bar states, the slide rule with armed all-in, drag-and-release
targeting with cooldown and residue, the full 1.4 s showdown in both win and loss variants,
the rail with both watch models and the join sequence, the clip with a working scrub and
reaction lane, the edition, both lobby registers, the record, the loadout with its live impact
preview, and the counter with its purchase mark. Type, colour, grain and the motion ladder are
tokenised. `npm run typecheck` is the gate.

**Known gaps in the prototype itself** — small, worth listing because they will otherwise be
mistaken for features:

- The navigation bar's HOME cell targets `/`, which is the boot overlay, while HOME itself
  lives at `/home`. The consequence is visible: HOME draws no notch of its own, and pressing
  HOME from another destination replays the splash before landing there. Either HOME moves back
  onto `/` with the boot becoming an overlay above the Stack (which is what
  `docs/APP-SHELL-SPEC.md` §4 specifies), or the cell's route changes. One line either way.
- Several drawn controls are inert by design-review necessity rather than intent: `Throw` and
  `Save` on the edition, `Share clip`, `Open a table`, `Private room`, and `Join waitlist`.
- Loadout equip state, shop ownership, friend requests, invites and the rail's free-throw
  counter are all local component state. They reset when the screen unmounts.
- Rail throws are hardcoded to seat 3; the rail has no target selection.
- `INVITATIONS` and `LAST_HAND` exist as written fixtures and are not drawn on any screen.
- The loss sequence's stack figures are not reconciled with the live stack (section 7).
- `README.md`'s screen table predates the shell work: it lists eight screens and describes
  `app/index.tsx` as a developer contents page, which it no longer is.

### Stage 1 — Make the prototype coherent (days)

Fix the HOME route, reconcile the loss numerals, lift the local state into one client store so
equip, ownership and requests survive navigation, wire or remove every inert control, refresh
`README.md`'s route table, and add target selection to the rail's throw. No new surfaces. The
outcome is a demo that never contradicts itself in front of an investor.

### Stage 2 — The hand engine (the real blocker)

Server-authoritative Hold'em, six-max, as specified in section 7: deck and deal, betting rounds
with side pots, hand evaluation returning the playing five, turn order and clocks, seating and
buy-in, and a hand-history record with stable identifiers. Client becomes a view over engine
state; `useTable.ts` is deleted rather than extended. Nothing else on this roadmap can be
honestly built before this exists, because the tape, the clip, the edition and the record are
all projections of hand history.

### Stage 3 — Backend, accounts, presence

Accounts and handles (with handle moderation), the friend graph and its request flow, a realtime
transport for table and rail state, presence with the four states FRIENDS already draws, the
throw pipeline with server-enforced cooldown and rail metering, and durable inventory for
earned and purchased objects. Earned-object triggers ("survive a one-outer", "fold 20 in a row")
become server-evaluated achievements over hand history, which is the only place they can be
trusted.

### Stage 4 — Trust, safety and integrity

Mute and block, report attached to a hand-history moment, server-side rate limits, anti-collusion
and chip-dumping detection, multi-account signals, and an abuse review workflow. Also the
compliance work: age gate, store rating, IAP disclosure, privacy copy for the graph.

### Stage 5 — Commerce and content

Credits as a real IAP with receipt validation, the counter's dated stock as a merchandising
pipeline with named makers and numbered editions, and the edition itself as a produced artefact
— which means answering open question 1. Clips need a decision on representation and a serving
strategy.

### Stage 6 — Store assets and submission

The wordmark and icon are designed and rationalised (one boundary hairline broken by one notch,
crowd ticked beneath, surviving to 29px because the notch is a gap rather than a detail), and
the six screenshots exist as compositions with their captions written. What does not exist:
final exported icon sets at every required size, screenshots exported at 1290 × 2796 from real
builds rather than drawn crops, a store subtitle and description in the app's voice, a preview
video, and the localisation decision.

### The blockers, named plainly

A hand engine. A backend. Realtime presence. Accounts and identity. An anti-abuse story that
does not depend on there being no chat forever. Store assets and a compliance review. Every
one of those is missing today, and the prototype's job was never to have them — it was to prove
that a poker app can be built around the rail instead of the table, and it does.
