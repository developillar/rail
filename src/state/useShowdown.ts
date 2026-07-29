import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The 1.4s showdown, as six beats on one clock.
 *
 *   T+0     all cards face up
 *   T+140   the five lock, the rest drop to outline
 *   T+320   the pot numeral collapses and travels to the winner's bust
 *   T+620   absorbed; the stack counts, the bust punches
 *   T+900   settle, and the rail answers
 *   T+1400  gone without a trace
 *
 * Nothing blocks input and nothing has to be dismissed; a tap anywhere skips to
 * T+900, which is the last beat that still has anything to say.
 */
export const BEATS = [0, 140, 320, 620, 900, 1400] as const;
export const SKIP_TO = 4;

export function useShowdown(active: boolean, onDone?: () => void) {
  const [beat, setBeat] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finish = useRef(onDone);
  finish.current = onDone;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = useCallback((from: number) => {
    clear();
    setBeat(from);
    BEATS.forEach((at, i) => {
      if (i <= from) return;
      timers.current.push(
        setTimeout(() => {
          setBeat(i);
          if (i === BEATS.length - 1) finish.current?.();
        }, at - BEATS[from]),
      );
    });
  }, []);

  useEffect(() => {
    if (!active) {
      clear();
      setBeat(-1);
      return;
    }
    run(0);
    return clear;
  }, [active, run]);

  const skip = useCallback(() => {
    if (beat >= SKIP_TO || beat < 0) return;
    run(SKIP_TO);
  }, [beat, run]);

  return { beat, skip };
}

/**
 * A count that runs on elapsed time, tabular so nothing reflows. Counting up on
 * a win overshoots 3% and settles; counting down on a loss simply arrives.
 */
export function useCount(from: number, to: number, duration: number, active: boolean, overshoot = 0) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!active) {
      setValue(from);
      return;
    }
    const start = Date.now();
    const settleFor = overshoot ? 260 : 0;
    const id = setInterval(() => {
      const t = Date.now() - start;
      if (t >= duration + settleFor) {
        setValue(to);
        clearInterval(id);
        return;
      }
      if (t <= duration) {
        const p = t / duration;
        const peak = to + (to - from) * overshoot;
        setValue(Math.round(from + (peak - from) * p));
      } else {
        const p = (t - duration) / settleFor;
        const peak = to + (to - from) * overshoot;
        setValue(Math.round(peak + (to - peak) * p));
      }
    }, 16);
    return () => clearInterval(id);
  }, [active, duration, from, overshoot, to]);

  return value;
}
