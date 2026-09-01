import { useEffect, useRef, useState } from 'react';

const NUMERIC = /^(\d+(?:\.\d+)?)(.*)$/s;

/**
 * Counts a stat up to its final value once it becomes visible.
 *
 * Values in `STATS` are not all plain numbers ("8.0", "37/37"), so only the
 * leading number is animated and whatever follows is appended verbatim. Under
 * reduced motion the final value is returned immediately.
 */
export function useCountUp(value: string, active: boolean, duration = 1100): string {
  const match = NUMERIC.exec(value);
  // Starts at the *final* value so the prerendered markup carries the real
  // figure (a crawler reading "0.0 GPA" would be worse than no animation) and
  // hydration matches. The effect below rewinds to zero and counts up.
  const [display, setDisplay] = useState(value);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!match) return;
    if (!active) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    const target = Number(match[1]);
    const start = performance.now();
    setDisplay(formatted(0, match[1], match[2]));

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo — fast arrival, long settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(formatted(target * eased, match[1], match[2]));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, duration, value, match?.[1], match?.[2]]);

  return match ? display : value;
}

function formatted(n: number, source: string, suffix: string) {
  const decimals = source.includes('.') ? source.split('.')[1].length : 0;
  return `${n.toFixed(decimals)}${suffix}`;
}
