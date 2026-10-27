import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../constants';
import { useScrollSpy } from '../lib/useScrollSpy';

const STOPS = [
  ...PROJECTS.map(p => ({ id: p.slug, label: p.title })),
  { id: 'more', label: 'More work' },
  { id: 'record', label: 'Record' },
  { id: 'contact', label: 'Output' },
];
const STOP_IDS = STOPS.map(s => s.id);

// A forward pass down the page: the signal travels the rail as you scroll, and the layer in view lights up.
const PassRail: React.FC = () => {
  const active = useScrollSpy(STOP_IDS);
  const [on, setOn] = useState(false);
  const rail = useRef<HTMLElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const work = document.getElementById('work');
        if (!work || !rail.current || !fill.current) return;
        // Only once the hero has cleared the rail, so the two never overlap.
        const workTop = work.getBoundingClientRect().top;
        setOn(workTop <= rail.current.getBoundingClientRect().top);
        const start = work.offsetTop - window.innerHeight * 0.5;
        const end = document.documentElement.scrollHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
        fill.current.style.setProperty('--p', String(p));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <nav ref={rail} className={`pass-rail${on ? ' is-on' : ''}`} aria-label="Sections">
      <div className="pass-track" ref={fill}><span className="pass-fill" /><span className="pass-head" /></div>
      <ol>
        {STOPS.map(s => (
          <li key={s.id} className={active === s.id ? 'is-active' : ''}>
            <a href={`#${s.id}`}><span className="pass-node" aria-hidden /> <span className="pass-label">{s.label}</span></a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default PassRail;
