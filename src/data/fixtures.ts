import type { Suit } from '@/components/Card';

/**
 * The hand every screen in the handoff is drawn from: table 12, 2/5 NL,
 * six seats, fourteen railbirds. Nothing here is generated — these are the
 * exact figures, names and faces the prototype uses, so a screen built from
 * this file lands on the same numerals the design was reviewed with.
 */

export type SeatId = 1 | 2 | 3 | 4 | 5 | 6;

export type Player = {
  seat: SeatId;
  name: string;
  face: string;
  stack: number;
};

export const YOU: Player = { seat: 1, name: 'OKTA', face: '🐙', stack: 4820 };

export const CAST: Record<SeatId, Player> = {
  1: YOU,
  // Derya is a flat plate in 1a and absent from the bust panels, so this face
  // is the one addition to the cast — same register as the rest of it.
  2: { seat: 2, name: 'DERYA', face: '🦡', stack: 8150 },
  3: { seat: 3, name: 'OKONKWO', face: '🐺', stack: 15300 },
  4: { seat: 4, name: 'BEA', face: '🦩', stack: 3020 },
  5: { seat: 5, name: 'TOMÁS', face: '🐢', stack: 22780 },
  6: { seat: 6, name: 'SVEN', face: '🦌', stack: 6400 },
};

export const PRIYA: Player = { seat: 6, name: 'PRIYA', face: '🦉', stack: 9150 };

/** The crowd. Faces on the rail rule, in the order they are drawn. */
export const CROWD = ['🐸', '🐼', '🦊', '🐨', '🦁', '🐷', '🐵', '🦝'];

/**
 * Ask 7b — the register the six rooms' rails are sliced from, in draw order and
 * disjointly: three faces for table 12, three for 7, two for 9, two for 3, one
 * for 21, none for the dark room. Eleven faces for eleven busts.
 *
 * `CROWD`'s first three open it, because table 12's rail is the one crowd the
 * rest of the app draws (`/floor` hangs `CROWD`'s first five off the hero's
 * rule, `/table` and `/rail` draw the same faces), so table 12 reads the same in
 * both registers. `CROWD[3]` 🐨 and `CROWD[4]` 🦁 are table 12's too — the plan
 * draws five — so no other room borrows them; the rooms below it take `CROWD`'s
 * last three and five faces of their own. **A face standing on two rails at
 * once is a content bug on a screen whose subject is who is watching what**, and
 * `/tables` draws all six rails on one canvas.
 */
export const ROOM_FACES = [
  ...CROWD.slice(0, 3),
  ...CROWD.slice(5),
  '🦅',
  '🦫',
  '🦙',
  '🦦',
  '🦥',
];

export type CardSpec = { rank: string; suit: Suit };

const c = (rank: string, suit: Suit): CardSpec => ({ rank, suit });

/** Ask 1 / 2 / 3 — the live hand, turn, you last to act. */
export const HAND = {
  table: 12,
  blinds: '50/100',
  handNo: 1285,
  street: 'TURN · 4 OF 5',
  pot: 2450,
  board: [c('Q', 's'), c('J', 's'), c('7', 'd'), c('2', 'h'), null] as (CardSpec | null)[],
  hole: [c('A', 's'), c('K', 's')] as CardSpec[],
  toCall: 600,
  potOdds: '6.1 : 1',
  inFront: 0,
  raiseTo: 2100,
  watching: 14,
  clockSeconds: 20,
  bets: { 3: 600, 4: 600 } as Partial<Record<SeatId, number>>,
  folded: [2, 5, 6] as SeatId[],
  dealer: 6 as SeatId,
};

/** Ask 2e — the slide rule. Four named stops, minor ticks every 100. */
export const BET = {
  min: 1200,
  halfPot: 2100,
  pot: 4250,
  allIn: 4820,
  step: 100,
};

/** Ask 4a — the win. The pot numeral is the only object that travels. */
export const WIN = {
  pot: 12090,
  board: [c('Q', 's'), c('J', 's'), c('7', 'd'), c('2', 'h'), c('T', 's')] as CardSpec[],
  playingFive: [0, 1, 4],
  hand: 'ROYAL DRAW · A K Q J T ♠',
  stackFrom: 4820,
  stackTo: 16910,
  delta: 12090,
  fromTheRail: 9,
  nextHand: 1285,
};

/** Ask 4b — the losing seat. Losing is a subtraction, not an event. */
export const LOSS = {
  pot: 12090,
  board: [c('Q', 's'), c('J', 's'), c('T', 's'), c('2', 'h'), c('7', 's')] as CardSpec[],
  winnerSeat: 3 as SeatId,
  winnerHole: [c('9', 's'), c('8', 's')] as CardSpec[],
  winnerHand: 'STRAIGHT FLUSH · 7 8 9 T J ♠',
  winnerPlayingFive: [0, 1, 2, 4],
  winnerStackTo: 20990,
  stackFrom: 8140,
  stackTo: 3320,
};

/** Ask 3 / 5 / 6 — the four throwables. Adjectives about luck, not opinions. */
export type Throwable = {
  id: string;
  face: string;
  name: string;
  meaning: string;
  owned: boolean;
  origin: 'earned' | 'purchased';
};

export const THROWABLES: Throwable[] = [
  { id: 'heater', face: '🔥', name: 'HEATER', meaning: 'RUNNING\nGOOD', owned: true, origin: 'purchased' },
  { id: 'cooler', face: '💀', name: 'COOLER', meaning: 'BRUTAL\nLUCK', owned: true, origin: 'earned' },
  { id: 'ice', face: '🧊', name: 'ICE', meaning: 'PLAYING\nSLOW', owned: true, origin: 'earned' },
  { id: 'crown', face: '👑', name: 'CROWN', meaning: 'EARNED\nRESPECT', owned: false, origin: 'earned' },
];


export const COOLDOWN_MS = 2500;

/** Ask 5 — the rail. The table you are not seated at. */
export const RAIL = {
  table: 12,
  stakes: '2/5 NL',
  watching: 1240,
  pot: 12090,
  board: [c('Q', 's'), c('J', 's'), c('7', 'd'), c('T', 's'), null] as (CardSpec | null)[],
  street: 'TURN · RIVER TO COME',
  tape: 'OKONKWO BET 1,400 · BEA RAISE 4,200 · SVEN FOLD\nPRIYA FOLD · OKONKWO TO ACT ',
  clock: '0:11',
  freeThrows: 3,
  freeThrowCap: 5,
  resets: '4:12',
  minBuyIn: 4000,
  seats: [
    { seat: 3 as SeatId, action: 'BET 1,400', stack: 8900, live: true },
    { seat: 4 as SeatId, action: 'RAISE 4,200', stack: 14200, live: true },
    { seat: 5 as SeatId, action: '', stack: 22780, live: false },
    { seat: 6 as SeatId, action: '', stack: 6400, live: false },
  ],
};

/** Ask 5b — the tape. One row per action, pot growth under each. */
export const TAPE = {
  handNo: 1286,
  rows: [
    { street: 'PREFLOP', seat: 3 as SeatId, action: 'RAISE', amount: 600, pot: 9, reactions: 0 },
    { street: null, seat: 4 as SeatId, action: 'CALL', amount: 600, pot: 16, reactions: 2 },
    { street: 'FLOP · Q♠ J♠ 7♦', seat: 3 as SeatId, action: 'BET', amount: 1400, pot: 34, reactions: 9 },
    { street: null, seat: 4 as SeatId, action: 'RAISE', amount: 4200, pot: 70, reactions: 24, loud: true },
  ],
  current: { street: 'TURN · T♠', seat: 3 as SeatId, note: 'TO ACT · 4,200 TO CALL', clock: '0:11', pot: 37 },
  waitlist: { ahead: 2, eta: '~6 MIN' },
};

/** Ask 6a — the edition. Hierarchy carries the judgement, not counters. */
export const EDITION = {
  date: '29 JUL',
  number: 412,
  lead: {
    kicker: 'HAND OF THE NIGHT · TABLE 12',
    headline: 'Bea puts 4,200 in with second pair, and is right.',
    board: [c('Q', 's'), c('J', 's'), c('7', 'd'), c('T', 's'), c('4', 'h')] as CardSpec[],
    pot: 12090,
    winner: { face: '🦩', name: 'BEA', line: 'WINS 12,090' },
    loser: { face: '🐺', name: 'OKONKWO', line: '−6,100' },
    reactions: 240,
    breakdown: [
      { face: '💀', count: 168 },
      { face: '🔥', count: 52 },
    ],
    clip: '0:24',
  },
  badBeats: [
    {
      headline: 'Quads lose to a runner-runner royal',
      meta: 'TABLE 7 · 28,400 · 12 MIN',
      cards: ['A', 'K', 'Q'],
      reactions: 96,
    },
    {
      headline: 'Tomás folds the winner with 40 seconds left',
      meta: 'TABLE 3 · 9,150 · 34 MIN',
      cards: ['9', '9', '5'],
      reactions: 41,
    },
    {
      headline: 'Sven shoves 6,400 in the dark and triples up',
      meta: 'TABLE 12 · 19,200 · 1 HR',
      cards: ['7', '2', '2'],
      reactions: 22,
    },
  ],
  yourTables: [
    {
      headline: 'You lost 4,820 to a straight flush',
      meta: 'TABLE 12 · HAND 1,285 · 2 MIN',
      action: 'Rematch',
    },
    {
      headline: 'Your cooler on Bea drew 24 answers',
      meta: 'TABLE 12 · 0:11 IN CLIP · 9 MIN',
      action: 'Open',
    },
  ],
  footer: '1,240 ON THE RAIL · 6 LIVE',
};

/** Ask 6b — the clip. Reactions are annotations pinned to a second. */
export const CLIP = {
  table: 12,
  handNo: 1286,
  reactions: 240,
  length: 24,
  playhead: 11,
  pot: 7890,
  board: [c('Q', 's'), c('J', 's'), c('7', 'd'), null, null] as (CardSpec | null)[],
  actors: [
    { face: '🐺', name: 'OKONKWO', line: 'BET 1,400', live: false },
    { face: '🦩', name: 'BEA', line: 'RAISE 4,200', live: true },
  ],
  streets: [
    { label: 'PREFLOP', at: 0 },
    { label: 'FLOP', at: 6 },
    { label: 'TURN', at: 13.3 },
    { label: 'RIVER', at: 19 },
  ],
  /** Every throw, at the second it landed. The crowd's judgement as a shape. */
  lane: [
    { at: 1.5, weight: 0.55 },
    { at: 2.0, weight: 0.4 },
    { at: 4.9, weight: 0.85 },
    { at: 5.3, weight: 0.55 },
    { at: 8.2, weight: 1 },
    { at: 8.6, weight: 0.7 },
    { at: 10.5, weight: 1.7 },
    { at: 10.8, weight: 1.45 },
    { at: 11.1, weight: 1.2 },
    { at: 11.4, weight: 0.75 },
    { at: 15.3, weight: 1.3 },
    { at: 15.6, weight: 0.9 },
    { at: 15.9, weight: 0.55 },
    { at: 19.6, weight: 0.6 },
  ],
  atPlayhead: {
    label: 'AT 0:11 · BEA RAISES TO 4,200',
    count: 24,
    throwers: [
      { face: '🐸', mark: '💀', fromSeat: false },
      { face: '🐼', mark: '💀', fromSeat: false },
      { face: '🦊', mark: '🧊', fromSeat: false },
      { face: '🐨', mark: '🔥', fromSeat: true },
      { face: '🦁', mark: '💀', fromSeat: false },
    ],
    more: 19,
  },
};

/** Ask 7a — the floor. Noise is the sort order, never stakes. */
export const FLOOR = {
  live: 6,
  onRails: 1240,
  headline: 'Bea is up 9,400 at table 12 and will not leave.',
  hero: {
    table: 12,
    stakes: '2/5 NL',
    street: 'TURN',
    pot: 7890,
    watching: 238,
    railShown: 5,
    railMore: 233,
    minBuyIn: 4000,
    seats: [
      { face: '🦩', name: 'BEA', stack: 23600, lit: true },
      { face: '🐺', name: 'OKONKWO', stack: 8900, lit: false },
      { face: '🦉', name: 'PRIYA', stack: 9150, lit: false },
      { face: '🦌', name: 'SVEN', stack: 6400, lit: false },
    ],
  },
  rest: [
    {
      table: 7,
      stakes: '5/10 NL',
      pot: 21400,
      watching: 412,
      seats: 'FULL',
      faces: ['🐢', '🐷'],
      opacity: 1,
    },
    {
      table: 3,
      stakes: '1/2 NL',
      pot: 3150,
      watching: 20,
      seats: '2 SEATS',
      faces: ['🦊'],
      openSlot: true,
      opacity: 0.8,
    },
    {
      table: 21,
      stakes: '1/2 NL',
      pot: 880,
      watching: 3,
      seats: '4 SEATS',
      faces: ['🦁'],
      opacity: 0.55,
    },
    {
      table: 30,
      stakes: '2/5 NL',
      pot: 0,
      watching: 0,
      seats: 'OPENS AT 2',
      faces: [],
      opacity: 0.45,
    },
  ],
};

/** Ask 8a — the record. Hands watched count as play. */
export const RECORD = {
  handle: 'OKTA',
  face: '🐙',
  sessions: 96,
  hoursOnRail: 41,
  seatedFromRail: 58,
  line: 'You have watched more hands than you have played, and it shows.',
  career: [
    ['HANDS PLAYED', '4,812'],
    ['HANDS WATCHED', '12,940'],
    ['BIGGEST POT WON', '28,400'],
    ['THROWS LANDED', '1,206'],
    ['THROWS ANSWERED', '3,340'],
    ['CLIPS IN AN EDITION', '7'],
  ] as [string, string][],
  earned: [
    { face: '💀', name: 'COOLER · IRON', from: 'TABLE 7 · QUADS\nBEATEN · 14 JUN' },
    { face: '👑', name: 'CROWN · CUT', from: '100 HANDS ON THE\nRAIL · 02 MAY' },
    { face: '🧊', name: 'ICE · SLOW', from: 'FOLDED 20 STRAIGHT\n· 11 JUN' },
  ],
  earnedCount: 9,
  purchased: [
    { face: '🔥', name: 'HEATER · BRASS', maker: 'M', edition: 'ED 088 / 500', price: '2,400 CR' },
    { face: '🧊', name: 'ICE · GLASS', maker: 'V', edition: 'ED 231 / 500', price: '1,800 CR' },
    { face: null, glyph: '1', name: 'SEAT CHIP · INK', maker: 'M', edition: 'ED 402 / 500', price: '900 CR' },
  ],
  purchasedCount: 4,
};

/** Ask 8b — the loadout. Four slots, both classes adjacent. */
export const LOADOUT = {
  slots: [
    {
      face: '💀',
      title: 'Cooler · Iron',
      origin: 'EARNED' as const,
      meta: 'TABLE 7 · QUADS BEATEN · 14 JUN',
      equipped: true,
    },
    {
      face: '🔥',
      title: 'Heater · Brass',
      origin: 'PURCHASED' as const,
      maker: 'M',
      meta: 'ED 088 / 500 · MAKER M',
      equipped: true,
    },
    {
      face: '👑',
      title: 'Crown · Cut',
      origin: 'EARNED' as const,
      meta: '100 HANDS ON THE RAIL · 02 MAY',
      equipped: true,
    },
  ],
  emptySlot: { index: '04', unequipped: 6 },
};

/** Ask 8c — the counter. Dated stock, flat prices, named makers. */
export const COUNTER = {
  date: '29 JUL',
  balance: '4,050 CR',
  lead: {
    face: '🧊',
    title: 'Ice · Glass',
    maker: 'V',
    kicker: 'MAKER V · THIS WEEK ONLY',
    copy: 'The slow-play needle, cut in glass. Same throw, same cooldown, colder object.',
    price: 1800,
    edition: 'ED 231 / 500',
  },
  stock: [
    {
      face: '🔥',
      title: 'Heater · Brass',
      maker: 'M',
      meta: 'MAKER M · ED 088 / 500 · OWNED',
      price: '2,400 CR',
      owned: true,
    },
    {
      glyph: '7',
      title: 'Seat chip · Ink',
      maker: 'M',
      meta: 'MAKER M · THE NUMBER IN YOUR CORNER',
      price: '900 CR',
      owned: false,
    },
    {
      face: '👑',
      title: 'Crown · Leaf',
      maker: 'V',
      meta: 'MAKER V · 500 / 500 GONE',
      price: 'SOLD OUT',
      soldOut: true,
    },
  ],
  notForSale: [
    { face: '💀', name: 'COOLER · IRON', requirement: 'SURVIVE A ONE-OUTER' },
    { face: '🧊', name: 'ICE · SLOW', requirement: 'FOLD 20 IN A ROW' },
  ],
};
