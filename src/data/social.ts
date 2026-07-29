import { CROWD, EDITION, FLOOR, RAIL, RECORD, YOU } from './fixtures';

/**
 * The social and session fixtures the shell's four destinations are drawn from:
 * HOME (§5), TABLES (§6) and FRIENDS (§7) of docs/APP-SHELL-SPEC.md.
 *
 * Nothing here is generated. Every figure either is the figure the spec prints or
 * is seeded from `./fixtures.ts` so the two registers of the floor cannot disagree:
 * the pots, the watching counts and the seat counts of table 12 / 7 / 3 / 21 / 30
 * are `FLOOR.hero` and `FLOOR.rest` exactly, the on-rails figure is `FLOOR.onRails`,
 * the clock is `RAIL.clockSeconds`, and you are `YOU` — OKTA 🐙, seat 1 at table 12,
 * 4,820 in play chips.
 *
 * Two reconciliations, both deliberate and both noted where they apply:
 *
 * 1. The whole of `CAST` is seated at table 12 in the scripted hand, so the cast
 *    alone cannot produce §5's "4 across 3 tables". Tonight's four rooms are the
 *    four the spec names — table 12, table 7, a rail at 12, table 3 — and the rest
 *    of the roster is drawn from the same register of names.
 * 2. Okonkwo is the opponent to act in the hand you are standing at (`RAIL.tape`,
 *    and HOME's amber clock reads OKONKWO TO ACT), so he is on now at table 12 and
 *    is *not* one of tonight's four counted rooms — the room he is in is the room
 *    you are already at. The mastheads count `FEATURED_RAIL`.
 *
 * Chips are play chips. Nothing in any string here is transferable, purchasable,
 * cashable or worth anything.
 */

/* ------------------------------------------------------------------ *
 * HOME — what is live right now, for you
 * ------------------------------------------------------------------ */

/**
 * §5's figures. `atTables` / `tablesLive` / `railSize` are the hero's three
 * numerals; `watching` and `toAct` / `clockSeconds` are table 12's, taken from
 * `FLOOR.hero` and `RAIL` so the door and the rail agree. `onRails` is the
 * house figure both mastheads print (`FLOOR.onRails`), not a sum of the six
 * rooms' rails — it counts everybody standing at every rail tonight.
 */
export const HOME_NOW = {
  handle: YOU.name,
  face: YOU.face,
  seat: YOU.seat,
  chipsInPlay: YOU.stack,
  credits: '4,050 CR',
  sessions: RECORD.sessions,
  hoursOnRail: RECORD.hoursOnRail,
  atTables: 4,
  railSize: 11,
  tablesLive: 3,
  roomsLive: FLOOR.live,
  onRails: FLOOR.onRails,
  sentence: 'Bea sat down before dinner and has not given a chip back since.',
  toAct: 'OKONKWO',
  /** RAIL.clock is '0:11' — the same eleven seconds, as a meter's input. */
  clockSeconds: 11,
  door: {
    label: "Walk in on Bea's table",
    table: RAIL.table,
    stakes: RAIL.stakes,
    watching: FLOOR.hero.watching,
  },
  freeThrows: RAIL.freeThrows,
  freeThrowCap: RAIL.freeThrowCap,
  slotsUsed: 3,
  slots: 4,
  railShown: 6,
  railMore: 5,
};

/**
 * Who of yours is watching what, right now. One entry per person on a rail —
 * a rail is a room you can walk into, so the room's own watching count comes
 * with it. Priya folded early at table 12 and stayed to watch the hand out.
 */
export const WATCHING_NOW: {
  face: string;
  handle: string;
  room: string;
  table: number;
  watching: number;
  line: string;
}[] = [
  {
    face: '🦉',
    handle: 'PRIYA',
    room: 'ON RAIL 12',
    table: 12,
    watching: FLOOR.hero.watching,
    line: 'Priya folded early and has watched every hand since from outside the line.',
  },
];

/**
 * The hand you last played, from `EDITION.yourTables[0]` — hand 1,285 at table
 * 12, the straight flush of ask 4b. `delta` is play chips out of your stack and
 * nothing else; it is drawn as a mono figure, never inside a Helvetica sentence.
 */
export const LAST_HAND = {
  table: RAIL.table,
  stakes: RAIL.stakes,
  handNo: 1285,
  seat: YOU.seat,
  ago: '2 MIN',
  result: 'LOST' as 'LOST' | 'WON',
  delta: -4820,
  line: 'You lost 4,820 to a straight flush',
  meta: 'TABLE 12 · HAND 1,285 · 2 MIN',
  action: 'Rematch',
};

/**
 * The edition you have not opened yet — number and date only. HOME never draws
 * an unread badge; the edition dates itself on its own masthead (§2).
 */
export const UNREAD_EDITION = {
  number: EDITION.number,
  date: EDITION.date,
  lead: EDITION.lead.headline,
  onTheRail: EDITION.footer,
};

/**
 * Two invitations. One seat held open at a friendly room, one private room for
 * people who met on a rail. A private room is a room, not a stake: nothing is
 * bought to enter one and nothing leaves it.
 */
export type Invitation = {
  face: string;
  handle: string;
  kind: 'TABLE' | 'PRIVATE ROOM';
  table: number;
  stakes: string;
  seatsOpen: number;
  sent: string;
  sentence: string;
};

export const INVITATIONS: Invitation[] = [
  {
    face: '🐢',
    handle: 'TOMÁS',
    kind: 'TABLE',
    table: 3,
    stakes: '1/2 NL',
    seatsOpen: 2,
    sent: '9 MIN AGO',
    sentence: 'Tomás is holding the seat on his left until the blind comes round again.',
  },
  {
    face: '🦊',
    handle: 'MARISOL',
    kind: 'PRIVATE ROOM',
    table: 44,
    stakes: '1/2 NL',
    seatsOpen: 4,
    sent: 'TONIGHT, 21:40',
    sentence: 'Marisol has opened a private room for the six of you who met on Bea’s rail.',
  },
];

/* ------------------------------------------------------------------ *
 * TABLES — the register, sorted by noise
 * ------------------------------------------------------------------ */

/** §7c's noise bands. The sort key is the crowd, never the stakes. */
export type NoiseBand = 'LOUD' | 'WARM' | 'QUIET' | 'EMPTY';

export const noiseBand = (watching: number): NoiseBand =>
  watching >= 40 ? 'LOUD' : watching >= 4 ? 'WARM' : watching >= 1 ? 'QUIET' : 'EMPTY';

export type LiveRoom = {
  table: number;
  stakes: string;
  /** The eyebrow's third term. 'OPENS AT 2' when the room is not dealing yet. */
  seatsLabel: string;
  seatsOpen: number;
  /** One sentence about why you would walk in. Never a digit — §9. */
  sentence: string;
  pot: number;
  watching: number;
  /** The room's own rail, drawn as a rail: faces on a hairline plus a remainder. */
  railFaces: string[];
  railMore: number;
  band: NoiseBand;
  minBuyIn: number;
};

/**
 * §6's six listings, loudest first. Table 12 / 7 / 3 / 21 / 30 carry `FLOOR`'s
 * pots, watching counts and seat labels unchanged — a room that shows a different
 * pot in the two registers is a defect. Table 9 is the sixth room the spec asks
 * for, written in the same voice and landing between 238 and 20 so the bands
 * spread across all four. Rail faces come from `CROWD`, in draw order, so no face
 * stands on two rails at once.
 */
export const ROOMS: LiveRoom[] = [
  {
    table: 7,
    stakes: '5/10 NL',
    seatsLabel: 'FULL',
    seatsOpen: 0,
    sentence: 'Nobody at this table has folded a river all night, and the rail has gone quiet watching them.',
    pot: FLOOR.rest[0].pot,
    watching: FLOOR.rest[0].watching,
    railFaces: [CROWD[5], CROWD[6], CROWD[4]],
    railMore: FLOOR.rest[0].watching - 3,
    band: noiseBand(FLOOR.rest[0].watching),
    minBuyIn: 8000,
  },
  {
    table: 12,
    stakes: '2/5 NL',
    seatsLabel: '2 SEATS',
    seatsOpen: 2,
    sentence: 'Bea is running the room and nobody at it wants to be the one who leaves first.',
    pot: FLOOR.hero.pot,
    watching: FLOOR.hero.watching,
    railFaces: [CROWD[0], CROWD[1], CROWD[2]],
    railMore: FLOOR.hero.railMore,
    band: noiseBand(FLOOR.hero.watching),
    minBuyIn: FLOOR.hero.minBuyIn,
  },
  {
    table: 9,
    stakes: '5/10 NL',
    seatsLabel: '1 SEAT',
    seatsOpen: 1,
    sentence: 'One seat left, and the player who opens every pot is sitting directly to its right.',
    pot: 6240,
    watching: 64,
    railFaces: [CROWD[3], CROWD[7]],
    railMore: 62,
    band: noiseBand(64),
    minBuyIn: 8000,
  },
  {
    table: 3,
    stakes: '1/2 NL',
    seatsLabel: '2 SEATS',
    seatsOpen: 2,
    sentence: 'A slow, talkative room where everybody turns their hand over afterwards whether they have to or not.',
    pot: FLOOR.rest[1].pot,
    watching: FLOOR.rest[1].watching,
    railFaces: [CROWD[2], CROWD[0]],
    railMore: FLOOR.rest[1].watching - 2,
    band: noiseBand(FLOOR.rest[1].watching),
    minBuyIn: 1600,
  },
  {
    table: 21,
    stakes: '1/2 NL',
    seatsLabel: '4 SEATS',
    seatsOpen: 4,
    sentence: 'Half the seats are open and the dealer is dealing faster than anyone here is thinking.',
    pot: FLOOR.rest[2].pot,
    watching: FLOOR.rest[2].watching,
    railFaces: [CROWD[4]],
    railMore: FLOOR.rest[2].watching - 1,
    band: noiseBand(FLOOR.rest[2].watching),
    minBuyIn: 1600,
  },
  {
    table: 30,
    stakes: '2/5 NL',
    seatsLabel: 'OPENS AT 2',
    seatsOpen: 6,
    sentence: 'Dark until two in the morning, when the late crowd comes off the rail and sits down.',
    pot: FLOOR.rest[3].pot,
    watching: FLOOR.rest[3].watching,
    railFaces: [],
    railMore: 0,
    band: noiseBand(FLOOR.rest[3].watching),
    minBuyIn: FLOOR.hero.minBuyIn,
  },
];

/** §6's masthead and empty zone: the register's own two figures and its sentence. */
export const TABLES_META = {
  live: FLOOR.live,
  onRails: FLOOR.onRails,
  eyebrow: 'SORTED BY NOISE, NEVER BY STAKES',
  headline: 'The loudest room tonight is the one nobody is leaving.',
  openLabel: 'Open a table',
  privateLabel: 'Private room',
};

/* ------------------------------------------------------------------ *
 * FRIENDS — your rail, and the ledger of who stood on it
 * ------------------------------------------------------------------ */

/**
 * Where a person is tonight. 'table' and 'rail' are on now; 'around' is in the
 * app and in no room; 'away' carries a last-seen. `STATUS_ORDER` is the sort:
 * the people you could be standing next to first, the people you could not last.
 */
export type RailStatus = 'table' | 'rail' | 'around' | 'away';

export const STATUS_ORDER: Record<RailStatus, number> = {
  table: 0,
  rail: 1,
  around: 2,
  away: 3,
};

export type RailPerson = {
  face: string;
  handle: string;
  name: string;
  status: RailStatus;
  /** The room label drawn under a bust: 'TABLE 12', 'ON RAIL 12', or null. */
  where: string | null;
  table: number | null;
  /** Mono agate, only set when status is 'away'. */
  lastSeen: string | null;
  /** Hands of yours they watched, hands of theirs you watched, and the sum. */
  railedYou: number;
  youRailed: number;
  together: number;
  /** True if you met them on a rail rather than across a table. */
  fromYourRail: boolean;
  /** Their rail card's class — earned at a table, or bought at the counter. */
  cardClass: 'earned' | 'purchased';
};

/**
 * Eleven people — §7's "11 PEOPLE". The six of `CAST` keep the ledger figures the
 * spec fixed (Sven 340/96/436, Bea 210/388/598, Okonkwo 96/240/336, Tomás
 * 180/74/254, Priya 64/150/214, Derya 41/88/129); the five additions are in the
 * same register of real first names and sit below Derya on `together`, so sorting
 * by hands-watched-together puts the spec's six in the ledger's six rows.
 * `together` is always `railedYou + youRailed`: the ledger is one quantity read
 * two ways, never a score.
 */
export const RAIL_ROSTER: RailPerson[] = [
  {
    face: '🦩',
    handle: 'BEA',
    name: 'Bea',
    status: 'table',
    where: 'TABLE 12',
    table: 12,
    lastSeen: null,
    railedYou: 210,
    youRailed: 388,
    together: 598,
    fromYourRail: false,
    cardClass: 'earned',
  },
  {
    face: '🦌',
    handle: 'SVEN',
    name: 'Sven',
    status: 'table',
    where: 'TABLE 7',
    table: 7,
    lastSeen: null,
    railedYou: 340,
    youRailed: 96,
    together: 436,
    fromYourRail: true,
    cardClass: 'earned',
  },
  {
    // The opponent to act in the hand you are standing at, per RAIL.tape.
    face: '🐺',
    handle: 'OKONKWO',
    name: 'Okonkwo',
    status: 'table',
    where: 'TABLE 12',
    table: 12,
    lastSeen: null,
    railedYou: 96,
    youRailed: 240,
    together: 336,
    fromYourRail: false,
    cardClass: 'earned',
  },
  {
    face: '🐢',
    handle: 'TOMÁS',
    name: 'Tomás',
    status: 'table',
    where: 'TABLE 3',
    table: 3,
    lastSeen: null,
    railedYou: 180,
    youRailed: 74,
    together: 254,
    fromYourRail: false,
    cardClass: 'purchased',
  },
  {
    face: '🦉',
    handle: 'PRIYA',
    name: 'Priya',
    status: 'rail',
    /**
     * 'RAIL 12', not 'ON RAIL 12': this string is also the caption under a
     * presence bust, which is measured to a 36-unit face, and ten mono-7
     * characters wrapped there and orphaned the room number into the band below.
     * Seven characters set the same measure as 'TABLE 12' and read as its pair —
     * and the app already says *on* structurally, by drawing a railbird below
     * the line while a seated player sits astride it.
     */
    where: 'RAIL 12',
    table: 12,
    lastSeen: null,
    railedYou: 64,
    youRailed: 150,
    together: 214,
    fromYourRail: true,
    cardClass: 'purchased',
  },
  {
    face: '🦡',
    handle: 'DERYA',
    name: 'Derya',
    status: 'away',
    where: null,
    table: null,
    lastSeen: 'AWAY · 2 HR',
    railedYou: 41,
    youRailed: 88,
    together: 129,
    fromYourRail: false,
    cardClass: 'earned',
  },
  {
    face: '🐼',
    handle: 'INGRID',
    name: 'Ingrid',
    status: 'around',
    where: null,
    table: null,
    lastSeen: null,
    railedYou: 88,
    youRailed: 34,
    together: 122,
    fromYourRail: true,
    cardClass: 'purchased',
  },
  {
    face: '🦊',
    handle: 'MARISOL',
    name: 'Marisol',
    status: 'around',
    where: null,
    table: null,
    lastSeen: null,
    railedYou: 30,
    youRailed: 66,
    together: 96,
    fromYourRail: false,
    cardClass: 'earned',
  },
  {
    face: '🐨',
    handle: 'HALIM',
    name: 'Halim',
    status: 'away',
    where: null,
    table: null,
    lastSeen: 'AWAY · 40 MIN',
    railedYou: 24,
    youRailed: 51,
    together: 75,
    fromYourRail: true,
    cardClass: 'purchased',
  },
  {
    face: '🐸',
    handle: 'YUSRA',
    name: 'Yusra',
    status: 'away',
    where: null,
    table: null,
    lastSeen: 'AWAY · 3 DAYS',
    railedYou: 18,
    youRailed: 40,
    together: 58,
    fromYourRail: true,
    cardClass: 'earned',
  },
  {
    face: '🦝',
    handle: 'KENJI',
    name: 'Kenji',
    status: 'away',
    where: null,
    table: null,
    lastSeen: 'AWAY · 6 DAYS',
    railedYou: 9,
    youRailed: 22,
    together: 31,
    fromYourRail: true,
    cardClass: 'purchased',
  },
];

/** Sort: rooms you could walk into first, then by hands watched together. */
export const byStatusThenTogether = (a: RailPerson, b: RailPerson) =>
  STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.together - a.together;

/**
 * §7's rail, as an object: the four named busts hanging below the rule, in the
 * four rooms the mastheads count — table 12, table 7, a rail at 12, table 3.
 * Okonkwo is on now too, at the table you are already standing at, so he hangs
 * with the rest rather than as a fifth room.
 */
export const FEATURED_RAIL: RailPerson[] = [
  RAIL_ROSTER[0],
  RAIL_ROSTER[1],
  RAIL_ROSTER[4],
  RAIL_ROSTER[3],
];

/** The rest of the rail, further away and drawn smaller: three faces, then +7. */
export const RAIL_REST: RailPerson[] = RAIL_ROSTER.filter(
  (p) => !FEATURED_RAIL.includes(p),
);

/** §7's ledger: six rows, most hands watched together first. */
export const LEDGER: RailPerson[] = [...RAIL_ROSTER]
  .sort((a, b) => b.together - a.together)
  .slice(0, 6);

/**
 * §7's masthead and hero. `onNow` counts `FEATURED_RAIL` — the four rooms of your
 * rail with somebody in them — and is the same figure as the nav bar's people
 * ticks. `crowd` is table 12's whole rail (`RAIL.watching`), the one amber mark
 * on the screen, legal because it is the crowd.
 */
export const RAIL_NOW = {
  railSize: RAIL_ROSTER.length,
  onNow: FEATURED_RAIL.length,
  restShown: 3,
  restCount: RAIL_REST.length,
  crowd: RAIL.watching,
  eyebrow: 'WHO IS ON YOUR RAIL TONIGHT',
  hero: 340,
  heroLines: ['HANDS OF YOURS', 'SVEN HAS WATCHED'] as [string, string],
  sentence:
    'Sven has watched you play more hands than anyone and has never taken a seat at your table.',
  seatedFromRail: RECORD.seatedFromRail,
  inviteLabel: 'Invite by handle',
  inviteNote: 'NOBODY CAN SEND CHIPS',
};

/**
 * Requests in both directions. Nothing is accepted or declined with a figure
 * attached — a rail is people, not a follower count, so every request carries a
 * reason you were both in the same room instead.
 */
export type RailRequest = {
  face: string;
  handle: string;
  name: string;
  reason: string;
  sent: string;
  together: number;
};

/** They have asked to stand on your rail. */
export const REQUESTS_IN: RailRequest[] = [
  {
    face: '🐵',
    handle: 'ODILE',
    name: 'Odile',
    reason: 'STOOD ON YOUR RAIL FOR THE STRAIGHT FLUSH',
    sent: '20 MIN AGO',
    together: 46,
  },
  {
    face: '🦁',
    handle: 'TEODOR',
    name: 'Teodor',
    reason: 'SAT TWO SEATS FROM YOU AT TABLE 21 ON SUNDAY',
    sent: '2 HR AGO',
    together: 18,
  },
];

/** You have asked to stand on theirs. */
export const REQUESTS_OUT: RailRequest[] = [
  {
    face: '🐷',
    handle: 'NOOR',
    name: 'Noor',
    reason: 'YOU WATCHED HER TAKE TABLE 7 APART TWICE',
    sent: 'YESTERDAY',
    together: 63,
  },
  {
    face: '🦔',
    handle: 'LEK',
    name: 'Lek',
    reason: 'DEALT YOU IN AT THE PRIVATE ROOM ON THURSDAY',
    sent: '4 DAYS AGO',
    together: 27,
  },
];

/**
 * §7's foot: three people who have sat at your table and never on your rail.
 * Each reason is a fact about rooms you were both in, in mono agate — no mutual
 * badge, no rank, no follower figure.
 */
export type RailSuggestion = {
  face: string;
  handle: string;
  name: string;
  reason: string;
  handsAcross: number;
};

export const SUGGESTIONS: RailSuggestion[] = [
  {
    face: '🦢',
    handle: 'SAOIRSE',
    name: 'Saoirse',
    reason: 'YOU HAVE WATCHED 14 OF THE SAME HANDS',
    handsAcross: 14,
  },
  {
    face: '🐴',
    handle: 'ANWAR',
    name: 'Anwar',
    reason: 'FOUR SESSIONS AT YOUR TABLE, NEVER ON YOUR RAIL',
    handsAcross: 211,
  },
  {
    face: '🦇',
    handle: 'MATEO',
    name: 'Mateo',
    reason: "ON BEA'S RAIL EVERY NIGHT YOU HAVE BEEN",
    handsAcross: 88,
  },
];

/** The line every destination's foot carries, as a statement of fact. */
export const CONSTRAINT = {
  home: [
    'CHIPS ARE PLAY CHIPS · THEY CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT',
    'CREDITS BUY OBJECTS, NEVER CHIPS',
  ] as [string, string],
  tables: [
    'EVERY ROOM IS PLAY CHIPS ONLY · SORTED BY NOISE, NEVER BY STAKES',
    'CHIPS CANNOT BE BOUGHT, TRANSFERRED OR CASHED OUT',
  ] as [string, string],
  friends: [
    'A RAIL IS PEOPLE, NOT A FOLLOWER COUNT',
    'CHIPS CANNOT BE SENT, RECEIVED OR CASHED OUT',
  ] as [string, string],
};
