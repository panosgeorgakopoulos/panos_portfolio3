import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Command, Mail, MapPin } from 'lucide-react';
import { RESUME_DATA, STATS } from '../constants';
import { ACCENTS } from './accents';
import { openCommandPalette } from './CommandPalette';
import { useCountUp } from './useCountUp';
import type { Stat } from '../types';

const CHARS = '-_~`!@#$%^&*()+=[]{}|;:,.<>?/0123456789';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scramble-in text effect. Skipped entirely under reduced-motion. */
const DecryptedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let iteration = 0;
    const interval = window.setInterval(() => {
      // Written straight to the DOM: this ticks ~25x/sec and does not need to
      // go through React's render cycle.
      node.textContent = text
        .split('')
        .map((_, index) =>
          index < iteration ? text[index] : CHARS[Math.floor(Math.random() * CHARS.length)],
        )
        .join('');

      if (iteration >= text.length) {
        node.textContent = text;
        window.clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 40);

    return () => window.clearInterval(interval);
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

/** One hero figure. Counts up from zero once the hero has settled. */
const StatTile: React.FC<{ stat: Stat; index: number; started: boolean }> = ({
  stat,
  index,
  started,
}) => {
  const value = useCountUp(stat.value, started);

  return (
    <div
      style={{ '--i': index + 6 } as React.CSSProperties}
      className="reveal-item spotlight rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors duration-300 hover:border-white/12"
    >
      <dt className="relative z-10 text-[10px] uppercase tracking-wider text-slate-400">
        {stat.label}
      </dt>
      <dd
        className={`relative z-10 font-mono text-xl tabular-nums ${ACCENTS[stat.accent].text}`}
      >
        {value}
      </dd>
    </div>
  );
};

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setHasEntered(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  const frameRef = useRef(0);

  // Decoration only; generated once and never re-rendered.
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.12,
        speed: (Math.random() - 0.5) * 40,
        color: Math.random() > 0.6 ? '#00f0ff' : Math.random() > 0.3 ? '#bd00ff' : '#ffffff',
      })),
    [],
  );

  /**
   * Pointer parallax writes CSS custom properties on the section and lets CSS
   * do the transforms. The previous implementation held the pointer position in
   * React state, re-rendering the entire hero — 28 particles included — on
   * every mousemove event.
   */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || prefersReducedMotion()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const { left, top, width, height } = node.getBoundingClientRect();
        const x = ((event.clientX - left) / width) * 2 - 1;
        const y = ((event.clientY - top) / height) * 2 - 1;
        node.style.setProperty('--px', String(x));
        node.style.setProperty('--py', String(y));
      });
    };

    node.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      node.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        style={{ '--px': 0, '--py': 0 } as React.CSSProperties}
        className="relative z-0 flex min-h-screen w-full items-center overflow-hidden bg-neon-bg md:fixed md:inset-0 md:h-screen"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-25"
          style={{ transform: 'translate(calc(var(--px) * -10px), calc(var(--py) * -10px))' }}
        />

        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="absolute -left-[10%] -top-[20%] h-[500px] w-[500px] animate-pulse-slow rounded-full bg-neon-purple/20 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] animate-pulse-slow rounded-full bg-neon-cyan/10 blur-[120px]"
          style={{ animationDelay: '2s' }}
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full transition-transform duration-300 ease-out"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                transform: `translate(calc(var(--px) * ${p.speed}px), calc(var(--py) * ${p.speed}px))`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:py-0">
          <div className={`max-w-3xl space-y-7 ${hasEntered ? 'is-revealed' : ''}`}>
            <div
              style={{ '--i': 0 } as React.CSSProperties}
              className="reveal-item flex flex-wrap items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-neon-green/30 bg-neon-green/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neon-green">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-green" />
                </span>
                {RESUME_DATA.availabilityBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                <MapPin size={12} aria-hidden="true" />
                {RESUME_DATA.location}
              </span>
            </div>

            <h1
              style={{ '--i': 1 } as React.CSSProperties}
              className="reveal-item font-display text-[clamp(1.9rem,8.5vw,2.75rem)] font-light leading-[0.92] tracking-tighter sm:text-6xl lg:text-7xl"
            >
              <span className="block text-white/90">I AM</span>
              <DecryptedText
                text={RESUME_DATA.name.toUpperCase()}
                className="block bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text font-bold text-transparent text-glow"
              />
            </h1>

            <p
              style={{ '--i': 3 } as React.CSSProperties}
              className="reveal-item max-w-2xl border-l-2 border-neon-cyan/40 pl-6 text-lg font-light leading-relaxed text-slate-300 md:text-xl"
            >
              {RESUME_DATA.title}
              <span className="mt-2 block text-base text-slate-400">{RESUME_DATA.tagline}</span>
            </p>

            <div
              style={{ '--i': 4 } as React.CSSProperties}
              className="reveal-item flex flex-wrap items-center gap-3 pt-2"
            >
              <a href="#projects" className="btn btn-primary group">
                View selected work
                <ArrowRight size={15} className="btn-icon" aria-hidden="true" />
              </a>
              <a href={`mailto:${RESUME_DATA.email}`} className="btn btn-ghost">
                <Mail size={15} aria-hidden="true" />
                Get in touch
              </a>
            </div>

            {/* The palette is the fastest path through the whole page — say so. */}
            <button
              type="button"
              onClick={openCommandPalette}
              style={{ '--i': 5 } as React.CSSProperties}
              className="reveal-item group inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2 font-mono text-[11px] text-slate-400 transition-colors hover:border-neon-cyan/40 hover:text-slate-200"
            >
              <Command size={12} aria-hidden="true" className="text-neon-cyan" />
              <span>
                Press{' '}
                <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5 text-[10px] text-slate-300 transition-colors group-hover:border-neon-cyan/40">
                  ⌘K
                </kbd>{' '}
                to jump anywhere
              </span>
            </button>

            <dl className="grid max-w-xl grid-cols-2 gap-3 pt-6 sm:grid-cols-4">
              {STATS.map((stat, index) => (
                <StatTile key={stat.label} stat={stat} index={index} started={hasEntered} />
              ))}
            </dl>
          </div>
        </div>

        <a
          href="#experience"
          aria-label="Scroll to experience"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition-colors hover:text-neon-cyan md:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown size={16} className="animate-bounce" aria-hidden="true" />
        </a>
      </section>

      {/* Spacer: from md up the hero is fixed, so the document needs its height
          back. Below md the hero is in normal flow (a phone viewport is too
          short to hold the hero content inside a clipped, fixed h-screen box),
          so the spacer would be a blank screen. */}
      <div
        id="hero-spacer"
        aria-hidden="true"
        className="pointer-events-none relative z-0 hidden h-screen w-full md:block"
      />
    </>
  );
};

export default Hero;
