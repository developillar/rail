import { useEffect, useRef, useState } from 'react';

/**
 * Meters are the one exemption in the motion spec: the clock and the cooldown
 * are driven by elapsed time, never by the duration ladder, "because a clock
 * cannot lie". Both loop; nothing else in the app does.
 */

/** Counts down in tenths, which is the precision the clock numeral is set at. */
export function useCountdown(seconds: number, running: boolean, onDone?: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const done = useRef(false);
  const finish = useRef(onDone);
  finish.current = onDone;

  useEffect(() => {
    if (!running) {
      setRemaining(seconds);
      done.current = false;
      return;
    }
    const start = Date.now();
    done.current = false;
    const id = setInterval(() => {
      const left = Math.max(0, seconds - (Date.now() - start) / 1000);
      setRemaining(left);
      if (left <= 0 && !done.current) {
        done.current = true;
        finish.current?.();
      }
    }, 100);
    return () => clearInterval(id);
  }, [seconds, running]);

  return { remaining, progress: seconds > 0 ? remaining / seconds : 0 };
}

/** The 2.5s throw cooldown: a hairline that drains under the throw key. */
export function useCooldown(until: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 80);
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
