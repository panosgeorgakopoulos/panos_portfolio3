import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { PIPELINE } from '../constants';
import SectionHeading from './SectionHeading';
import { ACCENTS } from './accents';
import { useReveal } from './useReveal';
import { spotlight } from './spotlight';

/** How long each stage holds before the track advances, in ms. */
const DWELL = 5200;

const Process: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  /** Restarts the CSS progress animation whenever the stage changes. */
  const [tick, setTick] = useState(0);

  // Advance only while the section is on screen: an off-screen timer is both
  // wasted work and a stage the visitor never sees.
  useEffect(() => {
    if (!isVisible || !isPlaying) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % PIPELINE.length);
      setTick((t) => t + 1);
    }, DWELL);

    return () => window.clearInterval(id);
  }, [isVisible, isPlaying]);

  const select = (index: number) => {
    setActive(index);
    setTick((t) => t + 1);
    setIsPlaying(false);
  };

  const stage = PIPELINE[active];
  const accent = ACCENTS[stage.accent];

  return (
    <section
      id="process"
      ref={ref}
      aria-labelledby="process-heading"
      className="relative z-[15] flex min-h-screen flex-col justify-center overflow-hidden border-t border-white/10 bg-black py-24 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:80px_80px] opacity-30"
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] transition-colors duration-1000 ${accent.bg}`}
      />

      <div className={`relative z-10 mx-auto w-full max-w-6xl px-6 ${isVisible ? 'is-revealed' : ''}`}>
        <SectionHeading id="process-heading" index="02" eyebrow="Process" title="ONE CLAIM, END TO END">
          The system I am building, from the scanned document that starts a
          dispute to the letter that settles it.
        </SectionHeading>

        {/* ── Track ─────────────────────────────────────────────────────── */}
        <div
          style={{ '--i': 3 } as React.CSSProperties}
          className="reveal-item relative mb-10"
        >
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[19px] h-px bg-white/10 md:top-[23px]"
          />
          {/* The travelled portion of the line. */}
          <div
            aria-hidden="true"
            className={`absolute left-0 top-[19px] h-px origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:top-[23px] ${accent.dot}`}
            style={{
              width: '100%',
              transform: `scaleX(${(active + 0.5) / PIPELINE.length})`,
            }}
          />

          <ol
            className="relative grid grid-cols-5 gap-1"
            aria-label="Pipeline stages"
          >
            {PIPELINE.map((item, index) => {
              const itemAccent = ACCENTS[item.accent];
              const isActive = index === active;
              const isDone = index < active;

              return (
                <li key={item.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => select(index)}
                    aria-current={isActive ? 'step' : undefined}
                    className="group flex w-full flex-col items-center gap-3 rounded-lg py-1 outline-offset-4"
                  >
                    <span
                      aria-hidden="true"
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                        isActive
                          ? `${itemAccent.border} scale-110 bg-black`
                          : isDone
                            ? 'border-white/20 bg-black'
                            : 'border-white/10 bg-black group-hover:border-white/30'
                      }`}
                    >
                      {isActive ? (
                        <span
                          className={`absolute inset-0 animate-ping rounded-full opacity-30 ${itemAccent.bg}`}
                        />
                      ) : null}
                      <span
                        className={`h-2 w-2 rounded-full transition-colors duration-500 ${
                          isActive || isDone ? itemAccent.dot : 'bg-white/25'
                        }`}
                      />
                    </span>
                    <span
                      className={`text-center font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 sm:text-[11px] ${
                        isActive ? itemAccent.text : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── Detail ────────────────────────────────────────────────────── */}
        <div
          {...spotlight}
          style={{ '--i': 4 } as React.CSSProperties}
          className="reveal-item spotlight relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-10"
        >
          {/* Dwell indicator: restarts on every stage change via the key. */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/5">
            <div
              key={tick}
              className={`h-full origin-left ${accent.dot}`}
              style={
                isPlaying
                  ? { animation: `dwell ${DWELL}ms linear forwards` }
                  : { transform: 'scaleX(1)', opacity: 0.35 }
              }
            />
          </div>

          {/* Every stage is rendered and the inactive ones are `hidden`: it keeps
              all five in the prerendered HTML for crawlers, and a stepper
              should not expose the steps you are not on to assistive tech. */}
          {PIPELINE.map((item, index) => {
            const itemAccent = ACCENTS[item.accent];
            return (
              <div
                key={item.id}
                hidden={index !== active}
                className={index === active ? 'relative z-10 animate-rise' : undefined}
              >
                <p
                  className={`mb-3 font-mono text-[11px] uppercase tracking-[0.2em] ${itemAccent.text}`}
                >
                  Step {String(index + 1).padStart(2, '0')} — {item.label}
                </p>
                <h3 className="max-w-3xl font-display text-2xl font-medium leading-snug text-white md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-slate-300">
                  {item.body}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-200 ${itemAccent.border}`}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? 'Pause the walkthrough' : 'Play the walkthrough'}
            className="absolute bottom-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-slate-400 transition-colors hover:border-white/30 hover:text-white"
          >
            {isPlaying ? (
              <Pause size={13} aria-hidden="true" />
            ) : (
              <Play size={13} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Process;
