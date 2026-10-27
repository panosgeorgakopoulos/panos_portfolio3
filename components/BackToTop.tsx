import React, { useEffect, useRef, useState } from 'react';

// A glass bot. Its outline fills as you scroll down and drains on the way back up; press it to return to the top.
const HEAD = 'M32 16 H44 A14 14 0 0 1 58 30 V46 A14 14 0 0 1 44 60 H20 A14 14 0 0 1 6 46 V30 A14 14 0 0 1 20 16 Z';

const BackToTop: React.FC = () => {
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);
  const progress = useRef<SVGPathElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.current?.style.setProperty('stroke-dashoffset', String(1 - p));
      setShown(window.scrollY > window.innerHeight * 0.6);
      setDone(p > 0.985);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  const toTop = () => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
  };

  return (
    <button type="button" className={`bot${shown ? ' is-shown' : ''}${done ? ' is-done' : ''}`} onClick={toTop} aria-label="Back to top">
      <span className="bot-glass" aria-hidden />
      <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden>
        <line x1="32" y1="5" x2="32" y2="16" className="bot-antenna" />
        <circle cx="32" cy="5" r="3" className="bot-bulb" />
        <path d="M6 32 H2 V44 H6 M58 32 H62 V44 H58" className="bot-ears" />
        <path d={HEAD} className="bot-track" />
        <path d={HEAD} pathLength={1} ref={progress} className="bot-progress" />
        <rect x="15" y="27" width="34" height="20" rx="10" className="bot-visor" />
        <path d="M21 39 L25 34.5 L29 39 M35 39 L39 34.5 L43 39" className="bot-eyes" />
      </svg>
    </button>
  );
};

export default BackToTop;
