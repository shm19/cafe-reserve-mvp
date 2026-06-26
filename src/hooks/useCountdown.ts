import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Counts down from `initialSeconds` to 0, ticking once per second.
 * Returns the remaining seconds, a `done` flag, and `restart()` to reset it
 * (used for "resend code").
 */
export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          stop();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [stop]);

  useEffect(() => {
    start();
    return stop; // clean up the interval when the component unmounts
  }, [start, stop]);

  const restart = useCallback(() => {
    setSeconds(initialSeconds);
    start();
  }, [initialSeconds, start]);

  return { seconds, done: seconds === 0, restart };
}
