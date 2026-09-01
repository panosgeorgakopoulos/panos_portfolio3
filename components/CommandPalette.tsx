import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp,
  Award,
  Braces,
  Check,
  Copy,
  CornerDownLeft,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
  Search,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NAV_ITEMS, RESUME_DATA } from '../constants';

/** Anything on the page can open the palette by dispatching this event. */
export const OPEN_PALETTE_EVENT = 'palette:open';

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT));
}

type Command = {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  hint?: string;
  keywords?: string;
  run: () => void;
};

const SECTION_ICONS: Record<string, LucideIcon> = {
  '#experience': Award,
  '#skills': Braces,
  '#projects': Sparkles,
  '#education': GraduationCap,
};

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setIsOpen(false), []);

  const goTo = useCallback(
    (href: string) => {
      close();
      // Let the overlay unmount before the browser resolves the hash target.
      requestAnimationFrame(() => {
        document.querySelector(href)?.scrollIntoView({ block: 'start' });
        history.replaceState(null, '', href);
      });
    },
    [close],
  );

  const copy = useCallback(
    async (text: string, id: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(id);
        window.setTimeout(() => {
          setCopied(null);
          close();
        }, 850);
      } catch {
        // Clipboard blocked (insecure context, denied permission) — fall back
        // to the mail client rather than failing silently.
        window.location.href = `mailto:${RESUME_DATA.email}`;
      }
    },
    [close],
  );

  const commands = useMemo<Command[]>(() => {
    const open = (url: string) => () => {
      close();
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    return [
      ...NAV_ITEMS.map((item) => ({
        id: `nav${item.href}`,
        label: `Go to ${item.label}`,
        group: 'Navigate',
        icon: SECTION_ICONS[item.href] ?? Sparkles,
        keywords: item.label,
        run: () => goTo(item.href),
      })),
      {
        id: 'nav#contact',
        label: 'Go to Contact',
        group: 'Navigate',
        icon: Mail,
        keywords: 'hire email reach out',
        run: () => goTo('#contact'),
      },
      {
        id: 'nav#top',
        label: 'Back to top',
        group: 'Navigate',
        icon: ArrowUp,
        keywords: 'hero start home',
        run: () => {
          close();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
      {
        id: 'copy-email',
        label: 'Copy email address',
        group: 'Actions',
        icon: copied === 'copy-email' ? Check : Copy,
        hint: RESUME_DATA.email,
        keywords: 'clipboard mail address',
        run: () => copy(RESUME_DATA.email, 'copy-email'),
      },
      {
        id: 'copy-phone',
        label: 'Copy phone number',
        group: 'Actions',
        icon: copied === 'copy-phone' ? Check : Copy,
        hint: RESUME_DATA.phone,
        keywords: 'clipboard call mobile',
        run: () => copy(RESUME_DATA.phone, 'copy-phone'),
      },
      {
        id: 'email',
        label: 'Send an email',
        group: 'Connect',
        icon: Mail,
        hint: RESUME_DATA.email,
        keywords: 'mailto contact hire',
        run: () => {
          close();
          window.location.href = `mailto:${RESUME_DATA.email}`;
        },
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        group: 'Connect',
        icon: Linkedin,
        keywords: 'profile network',
        run: open(RESUME_DATA.socials.linkedin),
      },
      {
        id: 'github',
        label: 'Open GitHub',
        group: 'Connect',
        icon: Github,
        keywords: 'code repositories source',
        run: open(RESUME_DATA.socials.github),
      },
      {
        id: 'phone',
        label: 'Call',
        group: 'Connect',
        icon: Phone,
        hint: RESUME_DATA.phone,
        keywords: 'telephone mobile',
        run: () => {
          close();
          window.location.href = `tel:${RESUME_DATA.phone.replace(/\s/g, '')}`;
        },
      },
    ];
  }, [close, copied, copy, goTo]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.group} ${command.keywords ?? ''} ${command.hint ?? ''}`
        .toLowerCase()
        .includes(q),
    );
  }, [commands, query]);

  // Open on Cmd/Ctrl+K from anywhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    const onRequest = () => setIsOpen(true);

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onRequest);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onRequest);
    };
  }, []);

  // Reset, take focus, lock scroll, and hand focus back on close.
  useEffect(() => {
    if (!isOpen) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setActiveIndex(0);
    inputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      const previous = returnFocusRef.current;
      if (previous && document.contains(previous)) previous.focus();
    };
  }, [isOpen]);

  // Keep the highlighted row in view as the selection moves.
  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen, results.length]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      results[activeIndex]?.run();
    }
  };

  if (!isOpen) return null;

  let lastGroup = '';

  return (
    <div className="fixed inset-0 z-80 flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close command palette"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl animate-rise overflow-hidden rounded-2xl border border-white/12 bg-neon-card/95 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.95),0_0_0_1px_rgba(0,240,255,0.08)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 border-b border-white/8 px-4">
          <Search size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={results[activeIndex] ? `palette-${results[activeIndex].id}` : undefined}
            placeholder="Jump to a section, copy my email, open GitHub…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden shrink-0 rounded border border-white/12 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:block">
            esc
          </kbd>
        </div>

        <ul
          ref={listRef}
          id="palette-list"
          role="listbox"
          aria-label="Commands"
          className="max-h-[54vh] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-slate-400">
              Nothing matches “{query}”.
            </li>
          ) : (
            results.map((command, index) => {
              const Icon = command.icon;
              const isActive = index === activeIndex;
              const header = command.group !== lastGroup ? command.group : null;
              lastGroup = command.group;

              return (
                <React.Fragment key={command.id}>
                  {header ? (
                    <li
                      aria-hidden="true"
                      className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 first:pt-1"
                    >
                      {header}
                    </li>
                  ) : null}
                  <li
                    id={`palette-${command.id}`}
                    role="option"
                    aria-selected={isActive}
                    data-active={isActive}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={command.run}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive ? 'bg-white/[0.07] text-white' : 'text-slate-300'
                    }`}
                  >
                    <Icon
                      size={15}
                      aria-hidden="true"
                      className={isActive ? 'text-neon-cyan' : 'text-slate-400'}
                    />
                    <span className="flex-1 truncate">{command.label}</span>
                    {copied === command.id ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-neon-green">
                        copied
                      </span>
                    ) : command.hint ? (
                      <span className="hidden truncate font-mono text-[11px] text-slate-400 sm:block">
                        {command.hint}
                      </span>
                    ) : null}
                    {isActive ? (
                      <CornerDownLeft size={13} className="text-slate-400" aria-hidden="true" />
                    ) : null}
                  </li>
                </React.Fragment>
              );
            })
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-white/8 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles size={11} aria-hidden="true" className="text-neon-cyan" />
            {RESUME_DATA.name}
          </span>
          <span className="hidden sm:block">↑↓ navigate · ↵ select · esc close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
