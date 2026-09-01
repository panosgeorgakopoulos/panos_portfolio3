import React from 'react';
import { RESUME_DATA, SKILL_GROUPS } from '../constants';
import SectionHeading from './SectionHeading';
import { ACCENTS } from './accents';
import { useReveal } from './useReveal';
import { spotlight } from './spotlight';

/** Every tool, in one line. Decorative — the cards above carry the real list. */
const TICKER = SKILL_GROUPS.flatMap((group) => group.items);

const Skills: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="skills"
      ref={ref}
      aria-labelledby="skills-heading"
      className="relative z-20 flex min-h-screen flex-col justify-center border-t border-white/10 bg-black py-24 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:80px_80px] opacity-40"
      />

      <div
        className={`relative z-10 mx-auto w-full max-w-6xl px-6 ${isVisible ? 'is-revealed' : ''}`}
      >
        <SectionHeading id="skills-heading" index="03" eyebrow="Capabilities" title="TECH STACK">
          {RESUME_DATA.summary}
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group, index) => {
            const accent = ACCENTS[group.accent];
            return (
              <div
                key={group.id}
                {...spotlight}
                style={{ '--i': index + 2 } as React.CSSProperties}
                className={`reveal-item spotlight group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] ${accent.borderHover} ${accent.glow}`}
              >
                <div className="relative z-10 mb-5 flex items-center gap-2.5">
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${accent.dot}`} />
                  <h3
                    className={`font-mono text-xs uppercase tracking-[0.18em] ${accent.text}`}
                  >
                    {group.label}
                  </h3>
                </div>
                <ul className="relative z-10 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded border border-white/5 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 transition-colors group-hover:border-white/10 group-hover:text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Toolchain ticker. aria-hidden: it repeats the cards above verbatim. */}
        <div
          aria-hidden="true"
          style={{ '--i': 8 } as React.CSSProperties}
          className="reveal-item edge-fade mt-12 overflow-hidden border-y border-white/5 py-4"
        >
          <ul className="flex w-max animate-marquee items-center gap-8 hover:[animation-play-state:paused]">
            {[...TICKER, ...TICKER].map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex shrink-0 items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400"
              >
                {item}
                <span className="h-1 w-1 shrink-0 rounded-full bg-neon-cyan/50" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;
