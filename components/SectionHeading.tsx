import React from 'react';

interface SectionHeadingProps {
  /** Lands on the <h2> itself so a section's aria-labelledby resolves to the heading. */
  id: string;
  /** Two-digit section index, e.g. "01". */
  index: string;
  /** Small mono label beside the index. */
  eyebrow: string;
  /** The visible section title. */
  title: string;
  children?: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  index,
  eyebrow,
  title,
  children,
}) => (
  <div className="mb-12 md:mb-16">
    <div
      style={{ '--i': 0 } as React.CSSProperties}
      className="reveal-item mb-4 flex items-center gap-4"
    >
      <span className="font-mono text-xs tracking-widest text-neon-cyan">
        {index} / {eyebrow}
      </span>
      {/* Draws itself across once the section is revealed. */}
      <div className="h-px flex-1 origin-left scale-x-0 bg-gradient-to-r from-white/25 to-transparent transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] [.is-revealed_&]:scale-x-100" />
    </div>
    <h2
      id={id}
      style={{ '--i': 1 } as React.CSSProperties}
      className="reveal-item font-display text-4xl font-bold tracking-tight text-white md:text-6xl"
    >
      {title}
    </h2>
    {children ? (
      <p
        style={{ '--i': 2 } as React.CSSProperties}
        className="reveal-item mt-6 max-w-2xl text-base font-light leading-relaxed text-slate-300 md:text-lg"
      >
        {children}
      </p>
    ) : null}
  </div>
);

export default SectionHeading;
