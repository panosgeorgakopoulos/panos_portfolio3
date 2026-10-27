import { useEffect, useState } from 'react';

// The section (ids in page order) whose top has crossed the reading line, a fraction of the viewport height.
// Position-based on purpose: IntersectionObserver ignores rootMargin inside cross-origin iframes (editor previews, embeds).
export function useScrollSpy(ids: string[], line = 0.5): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(' ');

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mark = window.innerHeight * line;
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let hit: string | null = null;
      ids.forEach(id => {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && (top <= mark || (atEnd && top < window.innerHeight))) hit = id;
      });
      setActive(hit);
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); cancelAnimationFrame(raf); };
  }, [key, line]);

  return active;
}
