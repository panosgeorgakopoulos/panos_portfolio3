import React, { useEffect, useRef } from 'react';

/**
 * Hairline reading-progress bar pinned to the top edge.
 *
 * Scales a single element on the compositor rather than animating width, and
 * writes to the DOM inside a rAF so a fast scroll can't queue extra work.
 */
const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-70 h-px bg-transparent">
      <div
        ref={barRef}
        style={{ transform: 'scaleX(0)' }}
        className="h-full origin-left bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green"
      />
    </div>
  );
};

export default ScrollProgress;
