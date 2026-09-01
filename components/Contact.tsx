import React from 'react';
import { ArrowRight, Command, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { RESUME_DATA } from '../constants';
import { useReveal } from './useReveal';
import { openCommandPalette } from './CommandPalette';

const SOCIAL_LINKS = [
  { key: 'email', label: 'Email', icon: Mail, href: `mailto:${RESUME_DATA.email}` },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, href: RESUME_DATA.socials.linkedin },
  { key: 'github', label: 'GitHub', icon: Github, href: RESUME_DATA.socials.github },
  { key: 'phone', label: 'Phone', icon: Phone, href: `tel:${RESUME_DATA.phone.replace(/\s/g, '')}` },
] as const;

const Contact: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="relative z-50 flex min-h-screen items-center justify-center overflow-hidden border-t border-white/10 bg-neon-bg py-24 shadow-[0_-20px_60px_-15px_rgba(0,0,0,1)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/10 blur-[140px]"
      />

      <div
        className={`relative z-10 mx-auto w-full max-w-4xl px-6 text-center ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-neon-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" aria-hidden="true" />
          {RESUME_DATA.availabilityBadge}
        </p>

        <h2
          id="contact-heading"
          className="mb-8 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          LET&rsquo;S BUILD
          <br />
          <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            SOMETHING REAL
          </span>
        </h2>

        <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-slate-400 md:text-xl">
          {RESUME_DATA.availability} {RESUME_DATA.availabilityNote}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${RESUME_DATA.email}`} className="btn btn-primary">
            <Mail size={16} aria-hidden="true" />
            {RESUME_DATA.email}
            <ArrowRight size={15} className="btn-icon" aria-hidden="true" />
          </a>
          <button type="button" onClick={openCommandPalette} className="btn btn-ghost">
            <Command size={15} aria-hidden="true" />
            Copy my details
          </button>
        </div>

        <footer className="mt-14">
          <ul className="flex justify-center gap-4 md:gap-6">
            {SOCIAL_LINKS.map(({ key, label, icon: Icon, href }) => (
              <li key={key}>
                <a
                  href={href}
                  {...(href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  aria-label={label}
                  title={label}
                  className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:scale-110 hover:border-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_24px_rgba(0,240,255,0.35)] active:scale-100"
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="text-slate-400 transition-colors group-hover:text-neon-cyan"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-20 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 font-mono text-xs text-slate-400 md:flex-row">
            <span>
              &copy; {new Date().getFullYear()} {RESUME_DATA.fullName}
            </span>
            <span>Designed &amp; engineered in Athens</span>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
