# Avatar space for throwables

_Started 2026-07-29 15:42 UTC_

---

## User

Continuing from "Poker app design review agenda".

## Assistant

We were building RAIL, a social poker app that monetizes expression rather than chips. We locked the Terminal aesthetic (ask 1a) — monospace numerals, measurement ticks, amber signal color for time and emotes only, hairline geometry, no casino language.

We completed ask 2 — the action bar in all four states (your turn, waiting, folded, all-in), plus the bet slider as a slide rule with 44px numerals, all-in arms, and four named stops. The slider felt like an instrument: measurement, not decoration.

Now we need:

- **Ask 3: Throwable targeting.** Two or three genuinely different approaches for selecting and throwing emotes at opponents in portrait, during a live hand. The constraint is real: no accidental sends, no covering the table, and railbirds throwing from outside the hand need distinct visual treatment. Each approach should solve the interaction differently, not iterate on one idea.

- **Ask 4: Showdown and win.** Motion keyframes only — no static screen. This is the emotional peak and repeats hundreds of times. Has to satisfy on first viewing, disappear by the hundredth. The winner celebrates with weight and follow-through; losers fold cleanly.

- **Ask 5: The rail.** The spectator view is the screen that earned the name. Show how a railbird watches a live table you aren't seated at, reacts to a hand, and joins. No reference exists in the category.

- **Ask 6: Feed and reactions.** Hands, clips, reactions. The rail as editorial, not dashboard.

- **Ask 7: Lobby.** Resist the dashboard instinct. Make it feel like a room.

- **Ask 8: Profile, loadout, shop.** Earned cosmetics must visually differ from purchased ones at a glance — this distinction drives the whole progression system.

- **Ask 9: Motion spec.** Every animation — curve, duration, trigger — in one document.

Current file: `RAIL Table.dc.html` (includes table, action bar, bet slider in Terminal aesthetic).

Ready for ask 3. What's the first targeting approach you want to explore?

## User

I want there to be room for a PFP mii style avatar for the throwables to land. See how this app has room for the PFP

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

Adding a bust slot to every seat — a 56px avatar frame outside the hairline, with the throwable landing zone ticked above the head, cards tucked behind, and the seat index as a corner chip (so the target *is* the PFP, not a separate box).

_[tool: str_replace_edit]_

Typo to fix, then 3b and 3c.

_[tool: str_replace_edit]_

Now 3c.

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

All three targeting options now carry a seat bust: a 56px avatar frame outside the hairline (44px for far seats, 62px for you), monogram placeholder, hole cards tucked behind, seat index chipped into the corner, and a ticked landing strip above each head where the throwable arrives. The target is now the avatar itself, so 3a's separate number boxes are gone — 3b shows the impact ring already parked on Okonkwo's head, 3c puts the reticle crosshair on the aimed bust.

Two things to note: the monograms are placeholders — send me the Mii-style PFP art (or a few samples) and I'll drop real images into the frames. And the base table in 1a still uses the old flat seat plates; say the word and I'll propagate the bust there so the whole file is consistent.

## User

Just use emojis for now for the pfp

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

All 15 busts now hold emoji PFPs — 🐺 Okonkwo, 🦩 Bea, 🐢 Tomás, 🦌 Sven, 🐙 you — sized to fill the frame with the same bottom-anchored bust crop. Swap any character or drop in real art whenever you're ready.

## User

Showdown and win, as motion keyframes rather than a static screen. This is the emotional peak and it repeats hundreds of times — satisfying on the first viewing, invisible by the hundredth.

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

Turn 4 exists but predates the busts, and has no loser frame. Adding both: the win now lands on the winner's avatar, plus a 4b for the losing seat.

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Turn 4 now runs the win through the avatars.

**4a — the winner, 6 frames / 1.4s.** The pot numeral is the only object that travels: it collapses, arcs to the winning seat, and is absorbed into the stack. What changed with the busts — the numeral's destination is now your 🐙 bust, which takes the amber frame at T+320, punches 1.06× with a 1.18× emoji squash at T+620 (the only squash in the app), and receives railbird reactions as amber ticks on the strip above its head at T+900 — the same landing zone throwables use. Everything clears on one 180ms out at T+1,400.

**4b — the losing seat, 3 frames, same clock.** Losing is a subtraction, not an event: cards go to outline, the bust desaturates and drops 3px (the whole body language), stack counts *down* with no delta chip and no red. By T+1,400 you're indistinguishable from someone who folded pre-flop.

Timeline ruler under 4a marks all six beats; nothing blocks input, tap skips to T+900.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Fixed: each opponent chip now sits beside its own name (🐺 left:78, 🦩 right:78 — 21px clear of BEA), and the seat-index chips moved outboard of the bust frame (right:-1, bottom:-10) so they stop cropping the emoji in all nine frames.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

🦩 moved to right:64 in all six 4a frames — 9px from BEA's block, matching the 8px on OKONKWO's side.

## User

5. The rail — the spectator view. This is the screen that earns the name, and it has no reference anywhere in the category. Show how a railbird watches, reacts, and joins.

## Assistant

Building the rail as three pieces: two watch models, plus the join sequence.

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Ask 5 is up as turn 5, top of the file.

**5a — Behind the rail.** The table is drawn closed: six notches, none of them yours. You're below it at a literal 1px rule spanning the screen with the crowd's PFPs hanging off it, yours lit and labelled YOU, "+1,233" for the rest. One throw is in flight — dashed trail from the rail up to Okonkwo's head strip, arriving as a **hollow** diamond, with the legend stated: rail throws are hollow, table throws are solid. Throws are metered (3/5 free, resets 4:12). Join is a bone-ruled slab: Take seat 1 · MIN 4,000.

**5b — The tape.** The hand becomes the page: one row per action, PFP chip, amount in tabular mono, and pot growth as a 2px bar under each row (9% → 70%). Rail reactions are margin annotations pinned to the action they answered — tick blocks that grow with count (2, 9, 24) — which is precisely the object ask 6's feed will reuse. Current row gets the 2px bone rule and the amber clock. Table's full here, so join is a waitlist with position and ETA.

**5c — Joining, 3 frames / 620ms.** Your bust leaves the rail on the same dashed path throwables use, the empty slot takes a reticle, buy-in uses the 2e slide rule, and the boundary notch widens to admit you. Rail count drops 1,240 → 1,239 and the crowd chips shrink to 20px — you're the subject now, not one of them.

My recommendation: ship 5a as the default and make 5b a swipe-up on the same screen — they're the same data at two distances, not competing screens.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Three fixes in turn 5: right-side seat blocks moved to `right:112px` so BEA and PRIYA's names/stacks clear their busts by 9px (mirroring the left side); avatar identities corrected to the established cast — 🦩 flamingo for Bea (6 spots), 🦌 deer for Sven; and the hollow rail-throw arrival re-parked on seat 3's head strip with the dashed trail re-angled to end there and clear the running tape.

## User

The feed and its reaction system.

## Assistant

Turn 6: the edition, the clip (reactions pinned to moments, not posts), and the reaction anatomy.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Turn 6 is in, three parts:

**6a — The edition.** Masthead, dated edition number, one lead hand with a real headline that contains a verdict ("Bea puts 4,200 in with second pair, and is right"), then everything else demoted to agate under section rules: BAD BEATS, then FROM YOUR TABLES where you appear in the third person. Reaction counts sit *below* the fold of each item, never above the headline — hierarchy does the editorial work.

**6b — The clip.** The scrub is the bet-slider instrument again: minor ticks, street stops, diamond thumb. The new idea is the reaction lane above the track — every throw is a hairline at the second it landed, so the crowd's judgement is a *shape* you read before watching (the spike at 0:11 is Bea's raise, 24 throws). Throwing pins to the frame, not the post; the "who threw at 0:11" row marks each thrower with their emote, filled from a seat, hollow from the rail.

**6c — The reaction system.** Four throwables that are adjectives about *luck*, not opinions about people — that's the moderation strategy. Three density registers (1 named in full, 2–40 counted as ticks, 40+ massed into one bar capped at 96px) so a friend's single cooler never reads like a mob. Provenance drawn, not labelled. Economy line foreshadows ask 8's earned-vs-purchased maker's mark.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Both contradictions fixed: 6b now lights FLOP (matching the playhead, board state, and readout), and every reaction mark in 6a obeys 6c's density rule — 240 and the 96/41 bad beats render as massed bars, 22 as 22 real ticks, and 6c's own "9" exemplar is now 9 ticks. The rule text names both scales (96px full, 48px agate; 4px tick pitch, 2px in agate).

## User

7. The lobby. Resist making it a dashboard.

## User

Found issues — fixing…

## Assistant

_[tool: grep]_

_[tool: read_file]_

Turn 7 was written before the interruption; reviewing it, the tone bands in 7c don't match how 7a/7b actually draw. Fixing.

_[tool: run_script]_

_[tool: ready_for_verification]_

Ask 7 is in as turn 7 — and the lobby's core move is that **noise is the sort order**, never stakes. Stakes stay a small mono label; there are no sortable columns anywhere.

**7a — The floor.** Tables are *drawn*, not listed: the same broken hairline boundary, busts at their notches, pot numeral in the middle. Your people's table gets the plan's full width with a headline ("Bea is up 9,400 and will not leave"), its rail, and Take seat / Just watch. The rest of the floor is the identical object at a third the size, loudest first, an empty table drawn at 45%.

**7b — Tonight.** Same data as theatre listings: one sentence per room as the primary object, pot as the only large numeral, roster and crowd mark under a rule. Answers "why walk in" before "what does it cost." The empty room gets the only honest CTA in a lobby: *Sit first*.

**7c — Room tone.** The band system that governs both: LOUD (40+) 2px rule, 5 rail busts, massed bar, card at 100% → WARM → QUIET → EMPTY at 45% with no rail and no mark. Density bands and tick pitches are inherited from 6c, and amber appears only as the crowd mark — never on stakes or seats.

Fixed in this pass: the loud rooms were drawing 1px rails, the hero table's crowd bar was at agate scale, and 7c's captions now say precisely what they govern (rail busts, card opacity).

## User

Found issues — fixing…

## Assistant

Making 7b's strips real rail strips — noise-scaled busts with +N, empty seats moved out to the right-hand label.

_[tool: run_script]_

_[tool: ready_for_verification]_

7b's strips are now rails, not rosters: bust count scales with the crowd (5 + "+407" for table 7's 412, 5 + "+233" for table 12, 3 at 80% + "+17" for the warm room, 1 at 55% + "+2" for the quiet one), so the loudest room finally shows the most faces. Open seats moved out of the strip into the corner label — "1 SEAT OPEN · 238 WATCHING" — and the caption now states the rule: the strip is the rail, open seats are stated, not drawn.

## User

8. Profile, loadout, and shop. Earned and purchased cosmetics must be distinguishable at a glance — that distinction is load-bearing for the whole progression system.

## Assistant

Ask 8's whole system hangs on one binary, so I'm making it structural rather than decorative: **earned items carry the measurement ticks; purchased items carry a maker's mark.** One is the app's language of record, the other is packaging.

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Turn 8 is up. The distinction is **ticks vs mark** — earned items wear the measurement ticks cut into their top edge (the app's own language: head strip, slide rule, reaction lane), purchased items wear a filled maker's-mark corner on a plate wrapped in an offset hairline. Measurement versus manufacture, not two tiers of one thing.

**8a Profile** — a record, not a trophy case: hands *watched* counted alongside hands played, "seated from the rail 58 times," and two separate shelves. Earned tiles carry the hand they came from ("TABLE 7 · QUADS BEATEN · 14 JUN"); purchased carry an edition and price.

**8b Loadout** — four slots where both classes sit adjacent, which is where the distinction works hardest. Includes the preview of what an opponent actually sees when your throw lands, and your rail card at 26px.

**8c The counter** — dated stock, flat prices, named makers, no bundles or boxes, one sold-out item struck through. The load-bearing section is **NOT FOR SALE**: ticked items with their requirements, advertised in the shop. "Nothing is ever sold with ticks — that is the whole deal."

**8d Provenance** — anatomy of both, plus proof it survives at 24px on a stranger's rail (ticks read as texture, the mark collapses to a corner dot + wrapper). Four rules, and the note that earned ticks are bone so amber stays reserved for crowd and clock.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Fixed: all three earned callouts in 8d now have an explicit `width:90px` and wrap to two lines inside the 96px clear band, matching the purchased column's rhythm — the collision is gone and the set no longer depends on string length. Leader lines re-aligned to the shifted rows.

## User

9. A motion spec — every animation, its curve, duration, and trigger, in one document.

## Assistant

Ask 9 is a reference document rather than screens, so it's one wide spec sheet: named curves drawn as tick ramps, a fixed duration ladder, then every animation in the file as rows.

_[tool: run_script]_

_[tool: ready_for_verification]_

Turn 9 is at the top — one 860×1814 spec sheet, three parts.

**Curves.** Five named curves, each drawn as a tick ramp rather than a graph: LINEAR evenly spaced, SLIDE crowding its ticks at the end, ARC symmetrical, SETTLE overshooting past the rule and returning (drawn in amber — the only curve you actually feel), OUT invisible until it's gone. Tick spacing *is* the easing, which keeps the spec inside the app's own vocabulary.

**Duration ladder.** Ten values, each with a job: 90 PUNCH, 120 MARK, 180 EXIT, 220 ARRIVE, 240 SETTLE, 320 TRAVEL, 420 COUNT, 620 JOIN, 900 SKIP, 1400 WHOLE. A duration outside the ladder is a bug, not a choice.

**Every animation — 36 entries** grouped by ask, with trigger, what moves, ms, curve, and a note: the action bar and clock, all three targeting mechanics, the full showdown sequence, the join, the feed's reaction lane and density bands, the lobby's tone changes, equip and purchase, then global rules including reduced motion.

The three invariants at the foot: nothing loops except the clock and the cooldown, amber only moves for crowd and clock, and every sequence is interruptible — input is never blocked by motion, including the win.

That closes asks 1–9. If you want it as a handoff artifact, I can export the spec sheet to PDF, or pull the whole file into a document with the screens beside their motion entries.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The spec now agrees with itself: the ladder opens with a declared **0 · TRACK** stop for 1:1 finger-following (eleven stops), the 240 stop is renamed **OPEN** so no stop shares a name with a curve, and the clock and cooldown are declared meters — driven by elapsed time, explicitly exempt. The footer rule is scoped accordingly: a *transition* outside the ladder is a bug.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

## User

10. Wordmark, app icon, and six App Store screenshots.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Turn 10 is at the top.

**10a Wordmark** — the masthead already running in the feed, named: mono 700 at .26em over the 2px rule that *is* the rail. Four lockups (primary, stacked with crowd ticks, reversed, monogram in a bust frame), construction showing the rule sitting 1.5× cap height below the baseline, and five rules — including amber banned from the mark so it stays reserved for crowd and clock.

**10b App icon** — the boundary hairline broken by one notch, crowd ticked beneath. No card, no chip, no suit; every competitor icon in the category is one of those three. Shown with construction, then one file at 180 → 29px with no simplified variant — the notch survives because it's a gap, not a detail.

**10c Six store shots** — order is the argument: watch → measure → throw → win → read → own. The first sells spectating (what nobody else offers), the last sells the earned/purchased split. Captions are single claims the screen below proves, and the word "poker" doesn't appear until the third shot.

Two notes: shots are drawn at 1:5 of 1290×2796 — say the word and I'll export them at full size as PNGs. And the store copy (subtitle, description) is still open if you want it in the same voice.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

All three fixed: the icon's segment and tick widths now compute in display space, so the notch is a real gap and the tick band respects both margins at every size (220 down to 29); the four panel eyebrows are `right:24px` like everywhere else in turns 8–9; and the monogram renders one centered mono R over an empty ticked frame.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

