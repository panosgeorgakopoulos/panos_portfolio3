import { useEffect, useRef, useState } from 'react';

/**
 * Reveals a section the first time it scrolls into view.
 *
 * Returns a ref to attach to the section and whether it has been seen.
 * The observer disconnects after the first intersection — the reveal is
 * one-way, so there is nothing left to watch.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Users who ask for reduced motion get the content immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible } as const;
}
