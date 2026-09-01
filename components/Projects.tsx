import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../constants';
import SectionHeading from './SectionHeading';
import { ACCENTS } from './accents';
import { useReveal } from './useReveal';
import { spotlight } from './spotlight';

const Projects: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="projects"
      ref={ref}
      aria-labelledby="projects-heading"
      className="relative z-30 flex min-h-screen flex-col justify-center border-t border-white/10 bg-neon-bg py-24 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:100px_100px] opacity-40"
      />

      <div
        className={`relative z-10 mx-auto w-full max-w-6xl px-6 ${
          isVisible ? 'is-revealed' : ''
        }`}
      >
        <SectionHeading id="projects-heading" index="03" eyebrow="Portfolio" title="SELECTED WORK" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PROJECTS.map((project, index) => {
            const accent = ACCENTS[project.accent];
            const isLinked = Boolean(project.link);

            const Card = (
              <>
                {/* Scan line on hover */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-px w-full opacity-0 group-hover:animate-scan group-hover:opacity-100 ${accent.dot}`}
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3
                      id={`${project.id}-title`}
                      className={`font-display text-2xl font-medium text-white transition-colors ${accent.textHover}`}
                    >
                      {project.title}
                    </h3>
                    <p id={`${project.id}-subtitle`} className={`mt-1 font-mono text-xs ${accent.text}`}>
                      {project.subtitle}
                    </p>
                  </div>
                  {isLinked ? (
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10"
                    >
                      <ArrowUpRight
                        size={18}
                        className="text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                      />
                    </span>
                  ) : null}
                </div>

                <ul className="relative z-10 mt-5 flex-1 space-y-2.5">
                  {project.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2.5 text-sm font-light leading-relaxed text-slate-300"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2 h-1 w-1 shrink-0 rounded-full ${accent.dot} opacity-60`}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <ul className="relative z-10 mt-6 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/5 pt-4">
                  {project.tags.map((tag) => (
                    <li key={tag} className="font-mono text-[10px] text-slate-400">
                      #{tag}
                    </li>
                  ))}
                </ul>
              </>
            );

            const className = `reveal-item spotlight group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/60 p-7 transition-all duration-300 hover:-translate-y-1.5 focus-visible:-translate-y-1.5 ${accent.borderHover} ${accent.borderFocus} ${accent.glow} ${accent.glowFocus}`;

            return isLinked ? (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-labelledby={`${project.id}-title ${project.id}-subtitle ${project.id}-newtab`}
                style={{ '--i': index + 2 } as React.CSSProperties}
                {...spotlight}
                className={className}
              >
                {Card}
                <span id={`${project.id}-newtab`} className="sr-only">
                  opens in a new tab
                </span>
              </a>
            ) : (
              <article
                key={project.id}
                style={{ '--i': index + 2 } as React.CSSProperties}
                {...spotlight}
                className={className}
              >
                {Card}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
