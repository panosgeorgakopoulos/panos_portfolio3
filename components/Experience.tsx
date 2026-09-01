import React from 'react';
import { EXPERIENCES } from '../constants';
import SectionHeading from './SectionHeading';
import { useReveal } from './useReveal';

const Experience: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="experience"
      ref={ref}
      aria-labelledby="experience-heading"
      className="relative z-10 flex min-h-screen flex-col justify-center border-t border-white/10 bg-neon-bg py-24 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]"
    >
      <div className={`mx-auto w-full max-w-5xl px-6 ${isVisible ? 'is-revealed' : ''}`}>
        <SectionHeading id="experience-heading" index="01" eyebrow="Career" title="EXPERIENCE" />

        <ol className="relative space-y-14 border-l border-white/10 pl-8 md:pl-12">
          {EXPERIENCES.map((exp, index) => (
            <li
              key={exp.id}
              style={{ '--i': index + 2 } as React.CSSProperties}
              className="reveal-item group relative"
            >
              {/* Timeline node */}
              <span
                aria-hidden="true"
                className={`absolute -left-[2.1rem] top-2 flex h-3 w-3 items-center justify-center md:-left-[3.35rem] ${
                  exp.current ? '' : 'opacity-60'
                }`}
              >
                {exp.current ? (
                  <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-neon-purple opacity-60" />
                ) : null}
                <span className="relative h-2.5 w-2.5 rounded-full bg-neon-purple ring-4 ring-neon-bg transition-shadow group-hover:shadow-[0_0_12px_#bd00ff]" />
              </span>

              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-400">
                {exp.period}
              </p>

              <h3 className="font-display text-2xl font-medium text-white transition-colors group-hover:text-neon-cyan md:text-3xl">
                {exp.role}
              </h3>
              <p className="mt-1 text-lg font-light text-slate-300">{exp.company}</p>
              {exp.subtitle ? (
                <p className="mt-1 font-mono text-xs text-neon-cyan/70">{exp.subtitle}</p>
              ) : null}

              <ul className="mt-5 max-w-2xl space-y-3 border-l-2 border-white/5 pl-5 transition-colors group-hover:border-neon-cyan/30">
                {exp.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="text-sm font-light leading-relaxed text-slate-300 md:text-base"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-2">
                {exp.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded border border-white/5 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300 transition-colors group-hover:border-neon-purple/30"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
