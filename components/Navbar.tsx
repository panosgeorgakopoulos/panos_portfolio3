import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PROFILE, PROJECTS } from '../constants';
import { useScrollSpy } from '../lib/useScrollSpy';

const LINKS = [
  { label: 'Work', href: '#work', ids: PROJECTS.map(p => p.slug) },
  { label: 'More', href: '#more', ids: ['more'] },
  { label: 'Record', href: '#record', ids: ['record'] },
];
const SPY_IDS = ['top', ...LINKS.flatMap(l => l.ids), 'contact'];

// A floating island: a signal orbits its border, and an indicator slides to the section in view.
const Navbar: React.FC = () => {
  const island = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const section = useScrollSpy(SPY_IDS);
  const active = section ? LINKS.findIndex(l => l.ids.includes(section)) : -1;
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = island.current;
    if (!el) return;
    const measure = () => {
      setBox({ w: el.offsetWidth, h: el.offsetHeight });
      const a = linkRefs.current[active];
      setPill(a ? { x: a.offsetLeft, w: a.offsetWidth } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, compact]);

  const r = box.h / 2;

  return (
    <nav className={`island${compact ? ' is-compact' : ''}`} aria-label="Main">
      <div className="island-body" ref={island}>
        {box.w > 0 && (
          <svg className="island-orbit" width={box.w} height={box.h} aria-hidden>
            <rect x="0.5" y="0.5" width={box.w - 1} height={box.h - 1} rx={r} pathLength={100} className="orbit-track" />
            <rect x="0.5" y="0.5" width={box.w - 1} height={box.h - 1} rx={r} pathLength={100} className="orbit-signal" />
          </svg>
        )}
        <a href="#top" className="island-mark" aria-label={`${PROFILE.name}, back to top`}>
          <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
            <path d="M6 8 L16 16 L6 24 M16 16 L26 16" className="mark-edge" />
            <circle cx="6" cy="8" r="2.6" className="mark-node" />
            <circle cx="6" cy="24" r="2.6" className="mark-node" />
            <circle cx="16" cy="16" r="3.2" className="mark-node" />
            <circle cx="26" cy="16" r="3.6" className="mark-out" />
          </svg>
          <span>PANOS</span>
        </a>
        <span className="island-sep" aria-hidden />
        <ul className="island-links">
          {pill && <li className="island-pill" aria-hidden style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />}
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <a ref={el => { linkRefs.current[i] = el; }} href={l.href} className={active === i ? 'is-active' : ''} aria-current={active === i ? 'true' : undefined}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="island-cta"><span className="cta-dot" aria-hidden />Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
