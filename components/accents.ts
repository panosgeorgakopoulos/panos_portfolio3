import type { Accent } from '../types';

/**
 * Accent token → concrete Tailwind classes.
 *
 * These must be written out in full: Tailwind scans source text, so a
 * constructed class name like `border-${accent}` is never generated.
 */
interface AccentClasses {
  text: string;
  textHover: string;
  border: string;
  borderHover: string;
  borderFocus: string;
  bg: string;
  dot: string;
  glow: string;
  glowFocus: string;
}

export const ACCENTS: Record<Accent, AccentClasses> = {
  cyan: {
    text: 'text-neon-cyan',
    textHover: 'group-hover:text-neon-cyan',
    border: 'border-neon-cyan/30',
    borderHover: 'group-hover:border-neon-cyan/60',
    borderFocus: 'focus-visible:border-neon-cyan/60',
    bg: 'bg-neon-cyan/10',
    dot: 'bg-neon-cyan',
    glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(0,240,255,0.45)]',
    glowFocus: 'focus-visible:shadow-[0_0_40px_-10px_rgba(0,240,255,0.45)]',
  },
  purple: {
    text: 'text-neon-purple-text',
    textHover: 'group-hover:text-neon-purple-text',
    border: 'border-neon-purple/30',
    borderHover: 'group-hover:border-neon-purple/60',
    borderFocus: 'focus-visible:border-neon-purple/60',
    bg: 'bg-neon-purple/10',
    dot: 'bg-neon-purple',
    glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(189,0,255,0.45)]',
    glowFocus: 'focus-visible:shadow-[0_0_40px_-10px_rgba(189,0,255,0.45)]',
  },
  green: {
    text: 'text-neon-green',
    textHover: 'group-hover:text-neon-green',
    border: 'border-neon-green/30',
    borderHover: 'group-hover:border-neon-green/60',
    borderFocus: 'focus-visible:border-neon-green/60',
    bg: 'bg-neon-green/10',
    dot: 'bg-neon-green',
    glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(0,255,148,0.45)]',
    glowFocus: 'focus-visible:shadow-[0_0_40px_-10px_rgba(0,255,148,0.45)]',
  },
};
