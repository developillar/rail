import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BET, COOLDOWN_MS, HAND, LOSS, type SeatId, WIN } from '@/data/fixtures';

/**
 * The table's states, and the scripted hand that walks you through all of them.
 *
 * There is no poker engine here on purpose: the handoff specifies one hand,
 * drawn to the chip, and a prototype that dealt random cards would stop
 * matching the screens it is meant to prove. So the opponents are on rails —
 * you act, they answer, and the hand resolves into whichever showdown your
 * decision earns.
 */

export type Phase =
  | 'your-turn' // 2a
  | 'raising' // 2e / 2f
  | 'waiting' // 2b
  | 'folded' // 2c
  | 'all-in' // 2d
  | 'showdown' // 4a / 4b
  | 'dealing';

export type Outcome = 'win' | 'loss' | null;

export type Residue = { seat: SeatId; face: string; count: number };

const OPPONENT_THINK_MS = 3200;
const FOLDED_HAND_MS = 8000;

export function useTable() {
  const [phase, setPhase] = useState<Phase>('your-turn');
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [stack, setStack] = useState(WIN.stackFrom);
  const [amount, setAmount] = useState(BET.halfPot);
  const [queued, setQueued] = useState<string | null>(null);
  const [residue, setResidue] = useState<Residue[]>([]);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [handNo, setHandNo] = useState(HAND.handNo);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => clear, [clear]);

  const nextHand = useCallback(() => {
    clear();
    setResidue([]);
    setOutcome(null);
    setQueued(null);
    setAmount(BET.halfPot);
    // The next hand is the same scripted hand again, so the stack returns to the
    // figure every screen in the handoff is drawn with. The showdown's own
    // numerals — 16,910 on a win, 3,320 on a loss — belong to the sequence.
    setStack(WIN.stackFrom);
    setHandNo((n) => n + 1);
    setPhase('dealing');
    later(() => setPhase('your-turn'), 900);
  }, [clear, later]);

  /** Your turn ran out. A timed-out hand folds, exactly like a tapped fold. */
  const timeout = useCallback(() => {
    setPhase('folded');
    later(nextHand, FOLDED_HAND_MS);
  }, [later, nextHand]);

  const fold = useCallback(() => {
    clear();
    setPhase('folded');
    later(nextHand, FOLDED_HAND_MS);
  }, [clear, later, nextHand]);

  const call = useCallback(() => {
    clear();
    setStack((s) => s - HAND.toCall);
    setPhase('waiting');
    later(() => {
      setOutcome('win');
      setPhase('showdown');
    }, OPPONENT_THINK_MS);
  }, [clear, later]);

  const raise = useCallback(
    (to: number) => {
      clear();
      const allIn = to >= BET.allIn;
      setStack((s) => Math.max(0, s - to));
      setPhase(allIn ? 'all-in' : 'waiting');
      later(
        () => {
          // Shoving runs you into the straight flush of 4b; calling wins 4a.
          setOutcome(allIn ? 'loss' : 'win');
          setPhase('showdown');
        },
        OPPONENT_THINK_MS,
      );
    },
    [clear, later],
  );

  const queue = useCallback((order: string) => {
    setQueued((q) => (q === order ? null : order));
  }, []);

  const openRaise = useCallback(() => {
    setAmount(BET.halfPot);
    setPhase('raising');
  }, []);

  const cancelRaise = useCallback(() => {
    setPhase('your-turn');
  }, []);

  /** A throw lands on the target's head strip and stays there until the hand ends. */
  const land = useCallback(
    (seat: SeatId, face: string) => {
      setResidue((r) => {
        const hit = r.find((x) => x.seat === seat);
        return hit
          ? r.map((x) => (x.seat === seat ? { ...x, face, count: x.count + 1 } : x))
          : [...r, { seat, face, count: 1 }];
      });
      setCooldownUntil(Date.now() + COOLDOWN_MS);
    },
    [],
  );

  const showdown = useMemo(() => (outcome === 'loss' ? LOSS : WIN), [outcome]);

  return {
    phase,
    outcome,
    showdown,
    stack,
    amount,
    setAmount,
    queued,
    queue,
    residue,
    land,
    cooldownUntil,
    handNo,
    fold,
    call,
    raise,
    openRaise,
    cancelRaise,
    timeout,
    nextHand,
    setPhase,
  };
}

export type TableApi = ReturnType<typeof useTable>;
