import type React from 'react';

/**
 * Pointer-tracked highlight for elements carrying the `spotlight` utility.
 *
 * The handlers write `--mx` / `--my` straight onto the node. Putting the
 * pointer position into React state would re-render every card in the grid on
 * every mousemove — the same reason the hero parallax writes CSS variables.
 *
 * The element's rect is measured once on enter and reused, so a move only
 * costs two custom-property writes (paint, no layout).
 */
const rects = new WeakMap<HTMLElement, DOMRect>();

let reduceMotion: MediaQueryList | null = null;

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  if (!reduceMotion) reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  return reduceMotion.matches;
}

export const spotlight = {
  onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    rects.set(event.currentTarget, event.currentTarget.getBoundingClientRect());
  },
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const node = event.currentTarget;
    const rect = rects.get(node) ?? node.getBoundingClientRect();
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  },
  onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
    rects.delete(event.currentTarget);
  },
} as const;
