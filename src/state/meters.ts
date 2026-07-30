import { useEffect, useRef, useState } from 'react';

/**
 * Meters are the one exemption in the motion spec: the clock and the cooldown
 * are driven by elapsed time, never by the duration ladder, "because a clock
 * cannot lie". Nothing else in the app runs on wall time.
 *
 * A countdown ends one of two ways, and it must be told which. A hand clock
 * ends: it reaches 0:00, calls `onDone` exactly once — the table reads that as
 * the timeout that acts for you — and then stops, interval and all. A door
 * clock loops: HOME stands outside a room where somebody is always to act, so
 * its meter re-arms at zero and keeps reading a live figure instead of freezing
 * on 0:00 under a line that says otherwise. Neither one is allowed to keep an
 * interval alive after it has stopped counting.
 */

/** Counts down in tenths, which is the precision the clock numeral is set at. */
export function useCountdown(
  seconds: number,
  running: boolean,
  onDone?: () => void,
  /** Opt in to re-arming at zero. Off by default: a hand clock ends. */
  loop = false,
) {
  const [remaining, setRemaining] = useState(seconds);
  const finish = useRef(onDone);
  finish.current = onDone;

  useEffect(() => {
    if (!running) {
      setRemaining(seconds);
      return;
    }
    let start = Date.now();
    setRemaining(seconds);
    const id = setInterval(() => {
      const left = Math.max(0, seconds - (Date.now() - start) / 1000);
      if (left > 0) {
        setRemaining(left);
        return;
      }
      if (loop && seconds > 0) {
        // The lap begins at the tick that found zero, not at the zero itself, so
        // the drift is one tick per lap rather than one tick per session.
        start = Date.now();
        setRemaining(seconds);
      } else {
        setRemaining(0);
        // Stop counting. The old meter left this interval firing for the life of
        // the screen, invisible only because setting 0 twice changes nothing.
        clearInterval(id);
      }
      finish.current?.();
    }, 100);
    return () => clearInterval(id);
  }, [seconds, running, loop]);

  return { remaining, progress: seconds > 0 ? remaining / seconds : 0 };
}

/** The 2.5s throw cooldown: a hairline that drains under the throw key. */
export function useCooldown(until: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until <= Date.now()) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      // A meter that has finished counting stops counting. Nothing in the app
      // loops except the clock and the cooldown, and this one is done.
      if (t >= until) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, [until]);

  const left = Math.max(0, until - now);
  return {
    active: left > 0,
    seconds: left / 1000,
    /** 1 at the moment of the throw, 0 when you may throw again. */
    progress: left > 0 ? left / 2500 : 0,
  };
}
