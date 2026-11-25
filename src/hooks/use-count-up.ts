import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Animates a number from 0 to `target`. With reduced motion enabled the final
 * value is applied immediately.
 */
export function useCountUp(target: number, duration = 900) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, duration, reduceMotion]);

  return value;
}
