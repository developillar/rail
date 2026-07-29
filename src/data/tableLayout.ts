import type { SeatId } from './fixtures';

/**
 * The table's geometry, in design units on the 420 x 912 canvas.
 *
 * This is the one place the handoff needed a decision rather than a
 * transcription. 1a still draws seats as the flat name plates it was built
 * with; every panel after ask 3 draws them as busts, and the designer's own
 * note says the plates are the stale half ("say the word and I'll propagate the
 * bust there so the whole file is consistent"). Drag-to-target in 3b only works
 * if the seats *are* the busts, so the busts win — but they are placed on 1a's
 * boundary, whose notches already sit exactly where a bust belongs:
 *
 *   left rail  breaks at y 240-288 and 400-448  -> seats 3 and 5
 *   right rail breaks at the same rows          -> seats 4 and 6
 *   top rail   breaks at x 150-270              -> seat 2
 *   bottom rail breaks at x 0-146               -> seat 1, your cards
 *
 * Busts sit outside the hairline, which is what makes a railbird's position —
 * below the line entirely — read as a different thing.
 */

export const BOUNDARY = {
  top: 196,
  bottom: 520,
  left: 28,
  right: 391,
  /** Six segments with a notch cut for every seat. */
  segments: [
    { x: 28, y: 196, w: 122 },
    { x: 270, y: 196, w: 122 },
    { x: 146, y: 520, w: 246 },
  ],
  // The notch is cut for the whole seat — bust and name block — so the line
  // breaks exactly where a player sits and nothing is drawn through a numeral.
  verticals: [
    { x: 28, y: 196, h: 44 },
    { x: 28, y: 356, h: 36 },
    { x: 28, y: 490, h: 31 },
    { x: 391, y: 196, h: 44 },
    { x: 391, y: 356, h: 36 },
    { x: 391, y: 490, h: 31 },
  ],
  /** The measurement ticks inside the top edge. */
  ticks: { x: 44, y: 204, w: 332, pitch: 14 },
};

export type SeatGeometry = {
  x: number;
  y: number;
  size: number;
  /** Which way the name block reads from the bust. */
  side: 'left' | 'right' | 'center';
  /** Where the name block sits. */
  labelX: number;
  labelY: number;
};

export const SEATS: Record<SeatId, SeatGeometry> = {
  1: { x: 28, y: 576, size: 62, side: 'left', labelX: 104, labelY: 582 },
  2: { x: 190, y: 140, size: 40, side: 'center', labelX: 150, labelY: 188 },
  3: { x: 8, y: 240, size: 56, side: 'left', labelX: 8, labelY: 306 },
  4: { x: 356, y: 240, size: 56, side: 'right', labelX: 8, labelY: 306 },
  5: { x: 12, y: 392, size: 44, side: 'left', labelX: 12, labelY: 442 },
  6: { x: 364, y: 392, size: 44, side: 'right', labelX: 12, labelY: 442 },
};

/**
 * The name block reads *under* its bust rather than beside it. 1a set the
 * plates beside the seats because a plate is only 136px wide; a bust plus a
 * name plus a five-figure stack is not, and beside-the-bust would put the
 * stack straight through the pot numeral and the board. Under the bust keeps
 * the pot's 54px numeral clear and the density variation intact.
 */
export const BET_CHIP = { y: 258, inset: 78 };

/** The point a throwable arrives at: the ticked strip above the head. */
export const headStrip = (seat: SeatId) => {
  const s = SEATS[seat];
  return { x: s.x + s.size / 2, y: s.y - 7 };
};

/** The table chrome, top to bottom. */
export const CHROME = {
  header: { wordmark: { x: 20, y: 52 }, stakes: { y: 56 }, rule: 88 },
  rail: { label: 104, strip: { x: 20, y: 120, w: 126 }, reacted: 116, watching: 132, rule: 156 },
  pot: { y: 250 },
  board: { y: 376, w: 44, gap: 5 },
  street: { y: 452 },
  hole: { x: 28, y: 486, w: 54, h: 76, gap: 7 },
  readout: { x: 240, y: 576, w: 152 },
  clock: { label: 696, rule: 720 },
  actionBar: { y: 722, h: 88, rule: 810 },
  /** In targeting the instrument row is replaced by the tray, per 3b. */
  tray: { rule: 732, hint: 744, y: 770, h: 88, cooldown: 858 },
};
