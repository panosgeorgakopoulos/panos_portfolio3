import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Menu, Search, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { openCommandPalette } from './CommandPalette';

/** Hoisted so the scroll-spy observer is not torn down on every re-render. */
const NAV_HREFS = NAV_ITEMS.map((item) => item.href);

/** Tracks which section is currently in view so the nav can mark it active. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      // The nav sits at the top, so bias the viewport band downward.
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );

    ids
      .map((id) => document.querySelector(id))
      .filter((el): el is Element => el !== null)
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const active = useActiveSection(NAV_HREFS);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  /** Escape and the toggle return focus to the button; a nav link does not. */
  const restoreFocusRef = useRef(false);

  // The overlay behaves like a modal: trap Tab inside it, close on Escape,
  // lock background scroll, and hand focus back where it came from.
  useEffect(() => {
    if (!isMenuOpen) return;

    const focusables = (): HTMLElement[] => {
      const overlay = overlayRef.current;
      if (!overlay) return [];
      return Array.from(overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    };

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        restoreFocusRef.current = true;
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);

      const button = toggleRef.current;
      if (restoreFocusRef.current && button && document.contains(button)) button.focus();
      restoreFocusRef.current = false;
    };
  }, [isMenuOpen]);

  const scrollToTop = (event: React.MouseEvent) => {
    event.preventDefault();
    // An explicit behavior:'smooth' argument overrides the CSS scroll-behavior
    // reset in the prefers-reduced-motion block, so gate it here too.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    history.pushState(null, '', window.location.pathname);
  };

  const logo = (
    <>
      <Cpu
        className="text-neon-cyan transition-all duration-500 group-hover:animate-spin-slow"
        size={20}
        aria-hidden="true"
      />
      <span className="font-display text-lg font-bold tracking-wider text-white">
        PANOS<span className="text-neon-purple-text">.DEV</span>
      </span>
    </>
  );

  return (
    <header>
      {/* Desktop */}
      <nav
        aria-label="Main"
        className="fixed left-1/2 top-6 z-70 hidden w-auto -translate-x-1/2 md:block"
      >
        <div className="glass flex items-center gap-8 rounded-full px-7 py-3.5 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <a href="#" onClick={scrollToTop} className="group flex items-center gap-2">
            {logo}
            <span className="sr-only">Back to top</span>
          </a>

          <ul className="flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-current={active === item.href ? 'page' : undefined}
                  className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                    active === item.href ? 'text-neon-cyan' : 'text-slate-400 hover:text-neon-cyan'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Open command palette"
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-slate-400 transition-colors hover:border-neon-cyan/40 hover:text-slate-200"
            >
              <Search size={13} aria-hidden="true" />
              <kbd className="font-mono text-[10px] text-slate-400 transition-colors group-hover:text-neon-cyan">
                ⌘K
              </kbd>
            </button>

            <a href="#contact" className="btn btn-primary btn-sm">
              Hire me
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile header */}
      <div className="glass fixed inset-x-0 top-0 z-70 flex h-16 items-center justify-between px-6 md:hidden">
        <a href="#" onClick={scrollToTop} className="group flex items-center gap-2">
          {logo}
          <span className="sr-only">Back to top</span>
        </a>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white active:bg-white/20"
          >
            <Search size={20} aria-hidden="true" />
          </button>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10 active:bg-white/20"
            onClick={() => {
              restoreFocusRef.current = isMenuOpen;
              setIsMenuOpen((open) => !open);
            }}
          >
            {isMenuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        hidden={!isMenuOpen}
        className="fixed inset-0 z-60 flex animate-fade-in-up flex-col items-center justify-center gap-8 bg-black/95 backdrop-blur-xl md:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-display text-3xl font-light uppercase tracking-widest text-white transition-colors hover:text-neon-cyan"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#contact"
          className="btn btn-primary mt-4"
          onClick={() => setIsMenuOpen(false)}
        >
          Get in touch
        </a>
      </div>
    </header>
  );
};

export default Navbar;
