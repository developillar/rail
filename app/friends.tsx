import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Masthead } from '@/components/AppShell';
import { Bust } from '@/components/Bust';
import { Box, Mono, Rule, Sans, Ticks } from '@/components/Prim';
import { EarnedItem, PurchasedItem } from '@/components/Provenance';
import { RailStrip } from '@/components/RailStrip';
import { ReactionMark } from '@/components/Reaction';
import { Screen } from '@/components/Screen';
import { TAPE, YOU } from '@/data/fixtures';
import {
  CONSTRAINT,
  FEATURED_RAIL,
  HOME_NOW,
  LEDGER,
  RAIL_NOW,
  RAIL_REST,
  RAIL_ROSTER,
  REQUESTS_IN,
  REQUESTS_OUT,
  SUGGESTIONS,
  WATCHING_NOW,
  type RailPerson,
  type RailRequest,
  type RailSuggestion,
} from '@/data/social';
import { chips, ink, INK, mono, SURFACE } from '@/design/tokens';

/**
 * §7 — FRIENDS. `YOUR RAIL`.
 *
 * Your friends are your rail, and that is a structure rather than a slogan: the
 * screen is (a) the rail as a literal object — one 2px rule with your people on
 * it, 5a's grammar, because a railbird is outside the line and this is the line —
 * and (b) a ledger of reciprocity, two figures per person, hands of yours they
 * watched beside hands of theirs you watched. There is no follower count, no
 * mutual badge, no rank and no green dot.
 *
 * PRESENCE IS DRAWN, and it is drawn with the vocabulary the app already owns —
 * the notch, the line, the frame, the size, the opacity. Three different objects,
 * never one object with a coloured light on it:
 *
 *   AT A TABLE   the rail rule breaks and the bust sits *astride the notch*,
 *                frame 'lit'. This is exactly how `src/data/tableLayout.ts` cuts
 *                the table boundary for a seat and exactly how /floor draws a
 *                room at plan scale: a seat is a gap in a line with a person in
 *                it. Tapping one walks you into that room.
 *   ON A RAIL    the line stays whole and the bust hangs *below* it, frame
 *                'crowd' at 0.7 — outside the line, which is what a railbird is.
 *   AROUND       no line at all. A 22-unit bust, frame 'dim' at 0.55, standing
 *                clear of the rail with a stated fact instead of a room. Being in
 *                the app and in no room is an absence, so it is drawn as one.
 *
 * Away is the fourth state and gets no bust: `+4 AWAY TONIGHT`, in agate. A face
 * you cannot stand next to tonight is not a presence.
 *
 * The four states account for the whole roster, and the masthead's two figures
 * are derived from `RAIL_ROSTER` here rather than read off a constant, so the
 * count over the line and the faces on it are one quantity: five on now hanging
 * off the rule, two standing clear of it, four away — eleven people.
 *
 * THE MOST INTERESTING STATE ON THE SCREEN gets its own band and its own,
 * heavier line: somebody watching the same hand as you. Priya folded early at
 * table 12 and stayed; you are on that rail too, so the object is one rail rule
 * carrying two busts — hers and yours, yours bone via RailStrip's `youIndex`.
 * The same component the whole app draws a crowd with, at the smallest crowd it
 * can hold: two. That band carries the screen's single amber mark, the 1,240 on
 * that rail, legal because it is the crowd.
 *
 * DENSITY. Dense zone: the ledger and the two request registers (496 → 1236).
 * Empty zones: the hero (56 → 250, four objects in 180 units) and the relief band
 * at 928, which is two objects and 30 units of nothing. Type range 7 → 62 = 8.9×.
 *
 * EVERY REPEATED ROW IS KEYED ON THE ROW ITSELF and returns a fragment, carrying
 * its own divider — `tables.tsx`'s `Listing` exactly. A row wants no wrapper at
 * all: every part of it is already drawn in canvas units, so a wrapper element
 * can only be a box with no geometry, and a parent 420 × 0 units tall with its
 * children hundreds of units below it is a row you can see and cannot press —
 * Android delivers a touch to a child by first finding the parent under the
 * finger. A fragment puts the row's press rect directly on the canvas, which is
 * the one view that does contain it.
 *
 * AMBER: exactly one mark, the crowd on the hand you are watching. Nothing else
 * on this screen is amber — not a request, not a count, not a state change.
 * Requests are counted by drawing them, never by a badge.
 *
 * TWO DECISIONS, both deliberate.
 *
 * 1. **The canvas runs to 1620, not §3's 1000.** §7's own 1000-unit layout was
 *    drawn before `src/data/social.ts` carried `REQUESTS_IN`, `REQUESTS_OUT` and
 *    per-person `SUGGESTIONS` reasons, and requests in both directions cannot be
 *    drawn honestly in the 230 units its foot reserves. Nothing else moves: the
 *    masthead, the hero, the rail object and the ledger keep §7's geometry to the
 *    unit, and the canvas still ends on 66 units of empty ground — the bar's
 *    reserve (§2), which is the constraint the height actually exists to serve.
 * 2. **One target per meaning.** §7 gave the ledger row both jobs — /rail when
 *    the person is in a room, /profile when they are not. Splitting them is
 *    clearer and matches how the rest of the app works: a *room* is entered from
 *    the drawn rail (a bust on the line → /rail), and a *person* is opened from
 *    their rail card in the ledger (a row → /profile). A row that means two
 *    things depending on data you cannot see is a coin toss.
 */

/* ------------------------------------------------------------------ *
 * THE RAIL AS AN OBJECT — geometry
 * ------------------------------------------------------------------ */

const BUST_ON = 36;
/** The line. One rule, and the app is named after it. */
const RAIL_Y = 272;
/** Astride the notch: the bust's centre is the line, the way a seat is drawn. */
const SEATED_T = RAIL_Y - BUST_ON / 2;
/** Below the line, and the line unbroken over them: a railbird is outside it. */
const RAILING_T = RAIL_Y + 4;
const ROOM_LABEL_T = 320;
/** The foot of a presence target — bust top through room label. */
const PRESENCE_B = 332;
/** The notch is cut for the whole bust, so no hairline is drawn through a face. */
const NOTCH_PAD = 4;

/**
 * Everybody who is on now, which is what the masthead counts and what the line
 * has to draw. `FEATURED_RAIL` is the four *rooms* of your rail; Okonkwo is on
 * now too, at the table you are already standing at, so social.ts leaves him out
 * of the four and the band was accounting for ten of eleven people. Derived here
 * rather than typed, so the figure over the line and the faces on it are one
 * quantity: five on the line, two standing clear, four away.
 */
const PRESENT: RailPerson[] = [
  ...FEATURED_RAIL,
  ...RAIL_ROSTER.filter(
    (p) => (p.status === 'table' || p.status === 'rail') && !FEATURED_RAIL.includes(p),
  ),
];
/** The masthead's second figure. Read off the roster, never off the four rooms. */
const ON_NOW = PRESENT.length;

/** Measured to the faces, never gridded — segments come out 20/24/80/24/56. */
const RAIL_X = [44, 112, 180, 236, 304];
/**
 * Total, so a sixth presence continues the last pitch instead of resolving to
 * `left: NaN`: the measure is drawn for five and the data decides how many there
 * are.
 */
const railX = (i: number) =>
  RAIL_X[i] ?? RAIL_X[RAIL_X.length - 1] + (i - RAIL_X.length + 1) * 68;

/**
 * The rule, minus a notch for everybody seated. Derived from the roster rather
 * than typed out, so the line cannot disagree with the people standing on it.
 */
const RAIL_SEGMENTS: [number, number][] = (() => {
  const notches = PRESENT.flatMap<[number, number]>((p, i) =>
    p.status === 'table' ? [[railX(i) - NOTCH_PAD, railX(i) + BUST_ON + NOTCH_PAD]] : [],
  );
  const out: [number, number][] = [];
  let cursor = 20;
  for (const [a, b] of notches) {
    if (a > cursor) out.push([cursor, a]);
    cursor = Math.max(cursor, b);
  }
  if (cursor < 400) out.push([cursor, 400]);
  return out;
})();

const AROUND = RAIL_REST.filter((p) => p.status === 'around');
const AWAY_COUNT = RAIL_REST.filter((p) => p.status === 'away').length;
/** Off the line and in from the margin, on the 22-unit bust's own 36-unit pitch. */
const aroundX = (i: number) => 20 + i * 36;
/** The stated fact stands 34 units clear of the last bust, however many there are. */
const AROUND_LABEL_X = aroundX(Math.max(AROUND.length - 1, 0)) + 34;

const LEDGER_TOP = 536;
const LEDGER_PITCH = 66;
/** The rail card's column: the earned / purchased tile, and the one key for it. */
const CARD_X = 236;

const REQ_IN_TOP = 1054;
const REQ_IN_PITCH = 46;
const REQ_OUT_TOP = 1172;
const REQ_OUT_PITCH = 42;
const SUGGEST_TOP = 1294;
const SUGGEST_PITCH = 42;

/** The add-by-handle band. */
const ADD = { rule: 1420, eyebrow: 1434, field: 1455, line: 1486, note: 1502, foot: 1530 };

export default function FriendsScreen() {
  const router = useRouter();
  /**
   * The screen only ever draws one of these — the hand you are standing at — and
   * the band is drawn only if there is one, so an empty register cannot resolve to
   * `undefined.table` in the eyebrow.
   */
  const watching: (typeof WATCHING_NOW)[number] | undefined = WATCHING_NOW[0];

  /**
   * Three state changes, and all three snap on the frame the finger lifts —
   * MS.track (0), the ladder's first stop, which is where reticles and marks
   * live. Nothing here interpolates, so no shared value exists to be written
   * during render.
   */
  const [letIn, setLetIn] = useState<string[]>([]);
  const [asked, setAsked] = useState<string[]>([]);
  const [handle, setHandle] = useState('');
  const [invited, setInvited] = useState<string | null>(null);

  const tap = () => Haptics.selectionAsync().catch(() => {});
  const ready = handle.trim().length > 0;

  const invite = () => {
    if (!ready) return;
    tap();
    setInvited(handle.trim().toUpperCase());
    setHandle('');
  };

  return (
    <Screen height={1620} mode="scroll">
      {/* MASTHEAD, 0 → 56. */}
      <Masthead
        title="YOUR RAIL"
        meta={`${RAIL_NOW.railSize} PEOPLE · ${ON_NOW} ON NOW`}
      />

      {/* THE EMPTY ZONE, 56 → 250. Four objects in 180 units, and nothing else. */}
      <Box l={20} t={70}>
        <Mono size={7} tracking={0.3} color={ink(0.5)}>
          {RAIL_NOW.eyebrow}
        </Mono>
      </Box>
      <Box l={20} t={96}>
        <Mono size={62} weight={700} tracking={-0.05} lh={0.9}>
          {RAIL_NOW.hero}
        </Mono>
      </Box>
      <Box l={134} t={118}>
        <Mono size={8} tracking={0.14} color={ink(0.45)} lh={1.9}>
          {RAIL_NOW.heroLines[0]}
          {'\n'}
          {RAIL_NOW.heroLines[1]}
        </Mono>
      </Box>
      <Box l={20} t={180} w={340}>
        <Sans size={16} weight={500} tracking={-0.01} lh={1.3}>
          {RAIL_NOW.sentence}
        </Sans>
      </Box>

      {/*
        THE LINE, 250 → 356. The rule first, because it is the structure: five
        segments of 20 / 24 / 80 / 24 / 56 units with a notch cut for each of the
        four people who are sitting down. It bleeds to neither edge because this
        is a rail inside a document, not the app's own bottom edge.
      */}
      {RAIL_SEGMENTS.map(([a, b]) => (
        <Rule key={a} l={a} t={RAIL_Y} w={b - a} weight={2} color={ink(0.42)} />
      ))}

      {PRESENT.map((person, i) => (
        <PresenceBust
          key={person.handle}
          person={person}
          x={railX(i)}
          onPress={() => {
            tap();
            router.push('/rail');
          }}
        />
      ))}

      {/*
        AROUND — off the line entirely, and drawn as the absence it is. Two
        22-unit busts standing clear of the rail, then the away remainder as a
        figure rather than a face: you cannot stand next to somebody who is gone.
      */}
      {AROUND.map((person, i) => (
        <Pressable
          key={person.handle}
          onPress={() => {
            tap();
            router.push('/profile');
          }}
          accessibilityRole="button"
          accessibilityLabel={`${person.name}, around`}
          /*
            No slop upward: the presence targets on the line above run to 332 and
            these start at 328, so a finger on somebody's room label must not be
            answered by somebody who is in no room.
          */
          hitSlop={{ top: 0, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => ({
            position: 'absolute',
            left: aroundX(i) - 6,
            top: 328,
            width: 34,
            height: 34,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? SURFACE.press : undefined,
          })}
        >
          <Bust
            size={22}
            emoji={person.face}
            frame="dim"
            opacity={0.55}
            style={{ position: 'relative' }}
          />
        </Pressable>
      ))}
      {AROUND.length > 0 ? (
        <Box l={AROUND_LABEL_X} t={339} pointerEvents="none">
          <Mono size={8} tracking={0.14} color={ink(0.38)}>
            IN THE APP, IN NO ROOM
          </Mono>
        </Box>
      ) : null}
      <Box r={20} t={339} pointerEvents="none">
        <Mono size={8} tracking={0.14} color={ink(0.35)}>
          +{AWAY_COUNT} AWAY TONIGHT
        </Mono>
      </Box>

      {/*
        THE SAME HAND, 372 → 496. The one state on this screen worth a band of
        its own: somebody standing where you are standing. One rail rule at a
        heavier ink than the roster's, two busts hanging off it, yours bone — the
        crowd component at the smallest crowd it can hold. The whole band is one
        press into that room.
      */}
      <Rule l={0} t={372} w={420} color={ink(0.2)} />
      {watching ? (
        <>
          <Box l={20} t={386}>
            <Mono size={7} tracking={0.3} color={ink(0.55)}>
              WATCHING THE SAME HAND AS YOU
            </Mono>
          </Box>
          <Box r={20} t={386}>
            <Mono size={7} tracking={0.12} color={ink(0.32)}>
              TABLE {watching.table} · HAND {chips(TAPE.handNo)} · {HOME_NOW.toAct} TO ACT
            </Mono>
          </Box>
          <Pressable
            onPress={() => {
              tap();
              router.push('/rail');
            }}
            accessibilityRole="button"
            accessibilityLabel={`Walk in on the hand ${watching.handle} is watching`}
            style={({ pressed }) => ({
              position: 'absolute',
              left: 0,
              top: 400,
              width: 420,
              height: 94,
              backgroundColor: pressed ? SURFACE.press : undefined,
            })}
          >
            <RailStrip
              l={20}
              t={10}
              faces={[YOU.face, watching.face]}
              size={28}
              weight={2}
              ruleColor={ink(0.62)}
              ruleWidth={380}
              youIndex={0}
            />
            <ReactionMark r={20} t={20} count={RAIL_NOW.crowd} scale="agate" />
            <Box l={20} t={52} w={356}>
              <Sans size={13} weight={500} lh={1.35}>
                {watching.line}
              </Sans>
            </Box>
          </Pressable>
        </>
      ) : null}

      {/*
        THE LEDGER — THE DENSE ZONE, 496 → 907. One quantity read two ways, and
        the tick strip's *length* is the figure, so it reads as measurement rather
        than as a sortable column. The rail card's class comes straight out of
        `Provenance.tsx` at tile scale: earned wears the measurement ticks cut
        into its top edge, purchased wears a plate inside an offset hairline.
      */}
      <Rule l={0} t={496} w={420} color={ink(0.2)} />
      <Box l={20} t={510}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          THE LEDGER
        </Mono>
      </Box>
      <Box l={230} t={510}>
        <Mono size={7} tracking={0.24} color={ink(0.32)}>
          RAIL CARD
        </Mono>
      </Box>
      <Box r={20} t={510}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          HANDS WATCHED TOGETHER
        </Mono>
      </Box>

      {LEDGER.map((person, i) => (
        <LedgerRow
          key={person.handle}
          person={person}
          top={LEDGER_TOP + i * LEDGER_PITCH}
          divider={i < LEDGER.length - 1}
          onPress={() => {
            tap();
            router.push('/profile');
          }}
        />
      ))}

      {/*
        THE RELIEF, 928 → 1016. Two objects and thirty units of ground, between
        two dense registers. It is the product's whole claim as one figure: the
        seats you took after watching first. Watching is not the waiting room.
      */}
      <Rule l={0} t={928} w={420} color={ink(0.2)} />
      <Box l={20} t={948}>
        <Mono size={34} weight={700} tracking={-0.04} lh={0.9}>
          {RAIL_NOW.seatedFromRail}
        </Mono>
      </Box>
      <Box l={70} t={956}>
        <Mono size={8} tracking={0.14} color={ink(0.45)} lh={1.9}>
          SEATS YOU HAVE TAKEN{'\n'}AFTER WATCHING FIRST
        </Mono>
      </Box>

      {/*
        REQUESTS, BOTH DIRECTIONS, 1016 → 1236. Direction is carried by what the
        row hands you rather than by an arrow: one you decide (a pressable cell),
        one they decide (a stated fact). Every request carries the room you were
        both in as its reason, because a rail is people and not a follower count.
        No badge, no counter, no amber.
      */}
      <Rule l={0} t={1016} w={420} color={ink(0.2)} />
      <Box l={20} t={1030}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          ASKED TO STAND ON YOUR RAIL
        </Mono>
      </Box>
      <Box r={20} t={1030}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          REQUESTS RUN BOTH WAYS
        </Mono>
      </Box>

      {REQUESTS_IN.map((request, i) => (
        <RequestInRow
          key={request.handle}
          request={request}
          top={REQ_IN_TOP + i * REQ_IN_PITCH}
          divider={i < REQUESTS_IN.length - 1}
          admitted={letIn.includes(request.handle)}
          onAdmit={() => {
            tap();
            setLetIn((prev) => [...prev, request.handle]);
          }}
        />
      ))}

      <Box l={20} t={1150}>
        <Mono size={7} tracking={0.3} color={ink(0.5)}>
          YOU ASKED TO STAND ON THEIRS
        </Mono>
      </Box>
      {REQUESTS_OUT.map((request, i) => (
        <RequestOutRow
          key={request.handle}
          request={request}
          top={REQ_OUT_TOP + i * REQ_OUT_PITCH}
          divider={i < REQUESTS_OUT.length - 1}
        />
      ))}

      {/*
        NOT YET ON YOUR RAIL, 1256 → 1402. A suggestion with no reason is an
        algorithm asking for trust, so every one of these is a fact about a room
        you were both standing in. The row opens the person; the cell asks them.
      */}
      <Rule l={0} t={1256} w={420} color={ink(0.2)} />
      <Box l={20} t={1270}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          NOT YET ON YOUR RAIL
        </Mono>
      </Box>
      <Box r={20} t={1270}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          THEY HAVE SAT AT YOUR TABLE, NEVER ON YOUR RAIL
        </Mono>
      </Box>
      {SUGGESTIONS.map((person, i) => (
        <SuggestionRow
          key={person.handle}
          person={person}
          top={SUGGEST_TOP + i * SUGGEST_PITCH}
          divider={i < SUGGESTIONS.length - 1}
          asked={asked.includes(person.handle)}
          onOpen={() => {
            tap();
            router.push('/profile');
          }}
          onAsk={() => {
            tap();
            setAsked((prev) => [...prev, person.handle]);
          }}
        />
      ))}

      {/*
        ADD SOMEONE BY HANDLE, 1420 → 1554. A ruled field, not a search box: the
        `@` is set in mono, the handle is typed into the same face every figure in
        the app is set in, and the rule underneath *is* the input — it steps from
        a hairline at 30% to 2px bone the moment there is something to send, so
        the affordance's state is carried on the app's own structural device. No
        capsule, no fill, no magnifier, no rounded corner. The invite is real:
        press it and the field empties and says who you asked, and that they are
        the ones who decide.

        TWO PATHS, ONE FUNCTION, EACH ONE GESTURE. `returnKeyType="send"` runs
        `invite` from the keyboard, and the slab runs it on the frame the finger
        lifts — one tap, never a tap to dismiss the keyboard and a second to
        press. It is a live responder whenever the field has something in it,
        which is exactly the state the keyboard is up in.
      */}
      <Rule l={0} t={ADD.rule} w={420} color={ink(0.2)} />
      <Box l={20} t={ADD.eyebrow}>
        <Mono size={7} tracking={0.3} color={ink(0.55)}>
          ADD SOMEONE BY HANDLE
        </Mono>
      </Box>
      <Box r={20} t={ADD.eyebrow}>
        <Mono size={7} tracking={0.12} color={ink(0.32)}>
          {RAIL_NOW.inviteNote}
        </Mono>
      </Box>
      <Box l={20} t={ADD.field + 4} pointerEvents="none">
        <Mono size={18} weight={500} color={ink(ready ? 0.55 : 0.35)}>
          @
        </Mono>
      </Box>
      <Box l={38} t={ADD.field} w={232} h={26}>
        <TextInput
          value={handle}
          onChangeText={setHandle}
          onSubmitEditing={invite}
          placeholder="HANDLE"
          placeholderTextColor={ink(0.22)}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="send"
          accessibilityLabel="Handle"
          underlineColorAndroid="transparent"
          style={{
            ...mono(15, 500, 0.08),
            color: ink(),
            width: 232,
            height: 26,
            padding: 0,
            textAlignVertical: 'center',
          }}
        />
      </Box>
      <Rule
        l={20}
        t={ADD.line}
        w={250}
        weight={ready ? 2 : 1}
        color={ready ? INK : ink(0.3)}
      />
      <Pressable
        onPress={invite}
        disabled={!ready}
        accessibilityRole="button"
        accessibilityLabel="Invite by handle"
        accessibilityState={{ disabled: !ready }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 20,
          top: ADD.field - 3,
          width: 104,
          height: 32,
          borderWidth: 1,
          borderColor: ready ? INK : ink(0.2),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Sans size={12} weight={500} color={ink(ready ? 1 : 0.4)}>
          Invite
        </Sans>
      </Pressable>
      {invited ? (
        <Box l={20} t={ADD.note} w={380}>
          <Mono size={8} tracking={0.14} color={ink(0.5)}>
            INVITED @{invited} · THEY DECIDE WHETHER TO STAND HERE
          </Mono>
        </Box>
      ) : null}

      <Box l={20} t={ADD.foot} w={380}>
        <Mono size={7} tracking={0.12} color={ink(0.32)} lh={1.7}>
          {CONSTRAINT.friends[0]}
          {'\n'}
          {CONSTRAINT.friends[1]}
        </Mono>
      </Box>
      {/* Last ink 1554. 66 units of empty ground to the foot at 1620 — the bar's reserve. */}
    </Screen>
  );
}

/**
 * One person on the rail, drawn at the distance they are standing. The target
 * runs from the top of the bust to the foot of its room label so the whole
 * presence — face and room — is one press, and the press fill stops short of the
 * rule so the line is never broken by a finger.
 */
function PresenceBust({
  person,
  x,
  onPress,
}: {
  person: RailPerson;
  x: number;
  onPress: () => void;
}) {
  const seated = person.status === 'table';
  const top = seated ? SEATED_T : RAILING_T;
  const rectTop = seated ? SEATED_T - 6 : RAILING_T;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${person.name}, ${
        person.where
          ? seated
            ? `seated at table ${person.table}`
            : `on the rail of table ${person.table}`
          : 'on your rail'
      }`}
      style={({ pressed }) => ({
        position: 'absolute',
        left: x - 6,
        top: rectTop,
        width: BUST_ON + 12,
        height: PRESENCE_B - rectTop,
        backgroundColor: pressed ? SURFACE.press : undefined,
      })}
    >
      <Bust
        l={6}
        t={top - rectTop}
        size={BUST_ON}
        emoji={person.face}
        frame={seated ? 'lit' : 'crowd'}
        opacity={seated ? 1 : 0.7}
      />
      <Box l={6} t={ROOM_LABEL_T - rectTop}>
        <Mono size={7} tracking={0.12} color={ink(seated ? 0.45 : 0.4)}>
          {person.where}
        </Mono>
      </Box>
    </Pressable>
  );
}

/**
 * A rail card: the person, the two directions of the ledger, where they are, and
 * the class of the card itself. Pressing it opens the person, never a room —
 * rooms are entered from the drawn rail above.
 */
function LedgerRow({
  person,
  top,
  divider,
  onPress,
}: {
  person: RailPerson;
  top: number;
  divider: boolean;
  onPress: () => void;
}) {
  const onNow = person.status === 'table' || person.status === 'rail';
  /** The length is the figure, capped at 96 units (n ≥ 768). */
  const tickW = Math.min(96, Math.round(person.together / 8));
  const card =
    person.cardClass === 'earned' ? (
      <EarnedItem l={CARD_X} t={10} w={22} h={22} />
    ) : (
      <PurchasedItem l={CARD_X} t={10} w={22} h={22} />
    );

  return (
    <>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${person.name}, ${chips(person.together)} hands watched together`}
        style={({ pressed }) => ({
          position: 'absolute',
          left: 0,
          top: top - 6,
          width: 420,
          height: 62,
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Bust
          l={20}
          t={6}
          size={28}
          emoji={person.face}
          frame={onNow ? 'lit' : 'rest'}
          opacity={onNow ? 1 : 0.7}
        />
        <Box l={58} t={8}>
          <Sans size={12} weight={500} color={ink(onNow ? 1 : 0.8)}>
            {person.name}
          </Sans>
        </Box>
        <Box l={58} t={26}>
          <Mono size={7} tracking={0.12} color={ink(0.4)}>
            RAILED YOU {chips(person.railedYou)} · YOU RAILED {chips(person.youRailed)}
          </Mono>
        </Box>
        {person.where ?? person.lastSeen ? (
          <Box l={58} t={40}>
            <Mono size={7} tracking={0.12} color={ink(0.26)}>
              {person.where ?? person.lastSeen}
            </Mono>
          </Box>
        ) : null}
        {card}
        <Box r={20} t={8}>
          <Mono size={12} weight={500} color={ink(0.85)}>
            {chips(person.together)}
          </Mono>
        </Box>
        <Ticks r={20} t={28} w={tickW} h={8} pitch={4} color={ink(0.3)} />
      </Pressable>
      {divider ? <Rule l={20} t={top + 50} w={380} color={ink(0.1)} /> : null}
    </>
  );
}

/** They asked. You decide, so the row ends in something you can press. */
function RequestInRow({
  request,
  top,
  divider,
  admitted,
  onAdmit,
}: {
  request: RailRequest;
  top: number;
  divider: boolean;
  admitted: boolean;
  onAdmit: () => void;
}) {
  return (
    <>
      {/*
        The row's own frame, 44 units of the 46-unit pitch: the three agate lines
        occupy 40 of them and the last four are the admit slab's reach, so the
        target and its slop are inside the parent that has to deliver the touch.
      */}
      <Box l={0} t={top} w={420} h={44}>
        <Bust
          l={20}
          t={0}
          size={26}
          emoji={request.face}
          frame={admitted ? 'lit' : 'crowd'}
          opacity={admitted ? 1 : 0.65}
        />
        <Box l={56} t={1}>
          <Sans size={11} weight={500} color={ink(admitted ? 1 : 0.9)}>
            {request.name}
          </Sans>
        </Box>
        <Box l={56} t={16}>
          <Mono size={7} tracking={0.12} color={ink(0.38)}>
            {request.reason}
          </Mono>
        </Box>
        <Box l={56} t={28}>
          <Mono size={7} tracking={0.12} color={ink(0.26)}>
            {request.sent} · {chips(request.together)} HANDS TOGETHER
          </Mono>
        </Box>
        {admitted ? (
          <Box r={20} t={13}>
            <Mono size={7} tracking={0.24} color={ink(0.5)}>
              ON YOUR RAIL
            </Mono>
          </Box>
        ) : (
          <Pressable
            onPress={onAdmit}
            accessibilityRole="button"
            accessibilityLabel={`Let ${request.name} in`}
            hitSlop={{ top: 4, bottom: 10, left: 8, right: 8 }}
            style={({ pressed }) => ({
              position: 'absolute',
              right: 20,
              top: 4,
              width: 104,
              height: 30,
              borderWidth: 1,
              borderColor: ink(0.35),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? SURFACE.press : undefined,
            })}
          >
            <Sans size={11} weight={500} color={ink(0.85)}>
              Let them in
            </Sans>
          </Pressable>
        )}
      </Box>
      {divider ? <Rule l={20} t={top + 40} w={380} color={ink(0.1)} /> : null}
    </>
  );
}

/** You asked. They decide, so the row ends in a fact instead of a control. */
function RequestOutRow({
  request,
  top,
  divider,
}: {
  request: RailRequest;
  top: number;
  divider: boolean;
}) {
  return (
    <>
      <Box l={0} t={top} w={420} h={30}>
        <Bust l={20} t={0} size={22} emoji={request.face} frame="crowd" opacity={0.5} />
        <Box l={52} t={0}>
          <Sans size={11} weight={500} color={ink(0.75)}>
            {request.name}
          </Sans>
        </Box>
        <Box l={52} t={15}>
          <Mono size={7} tracking={0.12} color={ink(0.32)}>
            {request.reason}
          </Mono>
        </Box>
        <Box r={20} t={6}>
          <Mono size={7} tracking={0.12} color={ink(0.3)}>
            ASKED · {request.sent}
          </Mono>
        </Box>
      </Box>
      {divider ? <Rule l={20} t={top + 30} w={380} color={ink(0.1)} /> : null}
    </>
  );
}

/** Somebody you have shared a room with, and the room, stated. */
function SuggestionRow({
  person,
  top,
  divider,
  asked,
  onOpen,
  onAsk,
}: {
  person: RailSuggestion;
  top: number;
  divider: boolean;
  asked: boolean;
  onOpen: () => void;
  onAsk: () => void;
}) {
  return (
    <>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={person.name}
        /*
          Slop to the pitch and no further: the rows are 42 units apart and drawn
          38 tall, so 2 units above and below is the whole gap — any more and the
          row above would answer for the finger that meant the row below.
        */
        hitSlop={{ top: 2, bottom: 2, left: 8, right: 8 }}
        style={({ pressed }) => ({
          position: 'absolute',
          left: 0,
          top: top - 6,
          width: 306,
          height: 38,
          backgroundColor: pressed ? SURFACE.press : undefined,
        })}
      >
        <Bust l={20} t={6} size={24} emoji={person.face} frame="crowd" opacity={0.55} />
        <Box l={54} t={7}>
          <Sans size={11} weight={500} color={ink(0.8)}>
            {person.name}
          </Sans>
        </Box>
        <Box l={54} t={22}>
          <Mono size={7} tracking={0.12} color={ink(0.36)}>
            {person.reason}
          </Mono>
        </Box>
      </Pressable>
      {asked ? (
        <Box r={20} t={top + 6}>
          <Mono size={7} tracking={0.24} color={ink(0.5)}>
            ASKED
          </Mono>
        </Box>
      ) : (
        <Pressable
          onPress={onAsk}
          accessibilityRole="button"
          accessibilityLabel={`Ask ${person.name} onto your rail`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => ({
            position: 'absolute',
            right: 20,
            top: top - 1,
            width: 76,
            height: 26,
            borderWidth: 1,
            borderColor: ink(0.3),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? SURFACE.press : undefined,
          })}
        >
          <Sans size={11} weight={500} color={ink(0.8)}>
            Ask
          </Sans>
        </Pressable>
      )}
      {divider ? <Rule l={20} t={top + 30} w={380} color={ink(0.1)} /> : null}
    </>
  );
}
