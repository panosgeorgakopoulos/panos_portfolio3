import React from 'react';
import { Award, GraduationCap, Languages } from 'lucide-react';
import { CERTIFICATIONS, EDUCATION, LANGUAGES } from '../constants';
import SectionHeading from './SectionHeading';
import { useReveal } from './useReveal';
import { spotlight } from './spotlight';

const Education: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="education"
      ref={ref}
      aria-labelledby="education-heading"
      className="relative z-40 flex min-h-screen flex-col justify-center overflow-hidden border-t border-white/10 bg-black py-24 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:80px_80px] opacity-25"
      />
      <div
        className={`mx-auto w-full max-w-6xl px-6 ${isVisible ? 'is-revealed' : ''}`}
      >
        <SectionHeading id="education-heading" index="05" eyebrow="Credentials" title="EDUCATION" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Degrees */}
          <ol className="space-y-4">
            {EDUCATION.map((entry, index) => (
              <li
                key={entry.id}
                {...spotlight}
                style={{ '--i': index + 2 } as React.CSSProperties}
                className="reveal-item spotlight group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-neon-cyan/40"
              >
                <div className="relative z-10 flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-neon-cyan/5 text-neon-cyan"
                  >
                    <GraduationCap size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-display text-xl font-medium text-white">
                        {entry.institution}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                        {entry.period}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-300">{entry.degree}</p>
                    <ul className="mt-3 space-y-1">
                      {entry.details.map((detail) => (
                        <li key={detail} className="text-sm font-light text-slate-400">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Certifications + languages */}
          <div className="space-y-4">
            <div
              {...spotlight}
              style={{ '--i': 4 } as React.CSSProperties}
              className="reveal-item spotlight rounded-xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="relative z-10 mb-5 flex items-center gap-2.5">
                <Award size={14} className="text-neon-purple" aria-hidden="true" />
                <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-neon-purple-text">
                  Certifications
                </h3>
              </div>
              <ul className="relative z-10 space-y-3">
                {CERTIFICATIONS.map((cert) => (
                  <li
                    key={cert.name}
                    className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-200">
                      {cert.name}
                      <span className="block text-xs text-slate-400">{cert.issuer}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{cert.year}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              {...spotlight}
              style={{ '--i': 5 } as React.CSSProperties}
              className="reveal-item spotlight rounded-xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="relative z-10 mb-5 flex items-center gap-2.5">
                <Languages size={14} className="text-neon-green" aria-hidden="true" />
                <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-neon-green">
                  Languages
                </h3>
              </div>
              <ul className="relative z-10 space-y-3">
                {LANGUAGES.map((lang) => (
                  <li key={lang.name} className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-slate-200">{lang.name}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                      {lang.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
