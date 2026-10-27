import React, { useEffect, useRef, useState } from 'react';
import { buildNet, layout, LAYER_NAMES, NetEdge } from '../lib/net';

const SIGNAL = '#c6f432';
const INK = '232, 236, 240';

interface Signal { edge: number; s: number; speed: number }

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

// Cubic curve between two nodes, bent along the flow direction.
function curve(ax: number, ay: number, bx: number, by: number, vertical: boolean, t: number): [number, number] {
  const [c1x, c1y, c2x, c2y] = vertical
    ? [ax, (ay + by) / 2, bx, (ay + by) / 2]
    : [(ax + bx) / 2, ay, (ax + bx) / 2, by];
  const u = 1 - t;
  return [
    u * u * u * ax + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * bx,
    u * u * u * ay + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * by,
  ];
}

interface Props { vertical: boolean; onRouted?: (n: number) => void }

const NeuralCanvas: React.FC<Props> = ({ vertical, onRouted }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const { nodes, edges, layerCount } = buildNet();
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const out = new Map<number, number[]>();
    const inc = new Map<number, number[]>();
    edges.forEach((e, i) => {
      out.set(e.from, [...(out.get(e.from) ?? []), i]);
      inc.set(e.to, [...(inc.get(e.to) ?? []), i]);
    });

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const box = vertical
        ? { x0: 56, x1: w - 56, y0: 70, y1: h - 50 }
        : { x0: w * 0.08 + 104, x1: w - 150, y0: 150, y1: h - 80 };
      layout(nodes, layerCount, w, h, box, vertical);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Hover: light the whole path through a node, upstream and downstream.
    let hovered = -1;
    let lit = new Set<number>();
    const trace = (n: number) => {
      const set = new Set<number>();
      const walk = (i: number, dir: Map<number, number[]>, key: 'from' | 'to') => {
        for (const e of dir.get(i) ?? []) { if (!set.has(e)) { set.add(e); walk(edges[e][key], dir, key); } }
      };
      walk(n, out, 'to'); walk(n, inc, 'from');
      return set;
    };
    const onMove = (ev: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx = ev.clientX - r.left, my = ev.clientY - r.top;
      let best = -1, bd = 26 * 26;
      nodes.forEach((n, i) => { const d = (n.x - mx) ** 2 + (n.y - my) ** 2; if (d < bd) { bd = d; best = i; } });
      if (best !== hovered) {
        hovered = best;
        lit = best >= 0 ? trace(best) : new Set();
        canvas.style.cursor = best >= 0 && nodes[best].href ? 'pointer' : 'default';
        setHoverLabel(best >= 0 ? nodes[best].label : null);
        if (still) draw(99);
      }
    };
    const onLeave = () => { hovered = -1; lit = new Set(); setHoverLabel(null); canvas.style.cursor = 'default'; if (still) draw(99); };
    const onClick = () => { const n = nodes[hovered]; if (n?.href) document.querySelector(n.href)?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' }); };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', onClick);

    const signals: Signal[] = [];
    let routed = 0;
    const pick = (list: number[]) => {
      const total = list.reduce((s, e) => s + edges[e].w, 0);
      let r = Math.random() * total;
      for (const e of list) { r -= edges[e].w; if (r <= 0) return e; }
      return list[list.length - 1];
    };
    const spawn = () => {
      const starts = nodes.map((n, i) => (n.layer === 0 ? i : -1)).filter(i => i >= 0);
      const from = starts[Math.floor(Math.random() * starts.length)];
      const list = out.get(from);
      if (list?.length) signals.push({ edge: pick(list), s: 0, speed: 0.55 + Math.random() * 0.5 });
      nodes[from].fire = Math.max(nodes[from].fire, 0.6);
    };

    const edgePath = (e: NetEdge, upto: number) => {
      const a = nodes[e.from], b = nodes[e.to];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      const steps = 22;
      for (let i = 1; i <= steps; i++) {
        const t = (i / steps) * upto;
        const [x, y] = curve(a.x, a.y, b.x, b.y, vertical, t);
        ctx.lineTo(x, y);
      }
    };

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      const focus = lit.size > 0;

      // Layer headers
      ctx.font = '500 10.5px "JetBrains Mono Variable", ui-monospace, monospace';
      ctx.fillStyle = `rgba(${INK}, ${0.38 * ease((t - 0.1) / 0.6)})`;
      ctx.textAlign = 'center';
      for (let l = 0; l < layerCount; l++) {
        const ln = nodes.filter(n => n.layer === l);
        if (vertical) {
          ctx.textAlign = 'left';
          ctx.fillText(LAYER_NAMES[l].toUpperCase(), 0, ln[0].y - 26);
        } else {
          const x = ln.reduce((s, n) => s + n.x, 0) / ln.length;
          ctx.fillText(LAYER_NAMES[l].toUpperCase(), x, 112);
        }
      }

      // Edges
      edges.forEach((e, i) => {
        const p = ease((t - e.born) / 0.7);
        if (p <= 0) return;
        edgePath(e, p);
        const on = lit.has(i);
        ctx.strokeStyle = on ? SIGNAL : `rgba(${INK}, ${focus ? 0.035 : 0.07 + e.w * 0.09})`;
        ctx.lineWidth = on ? 1.6 : 1;
        ctx.globalAlpha = on ? 0.85 : 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Signals with short trails
      for (const sg of signals) {
        const e = edges[sg.edge], a = nodes[e.from], b = nodes[e.to];
        const dim = focus && !lit.has(sg.edge) ? 0.25 : 1;
        for (let k = 5; k >= 0; k--) {
          const tt = sg.s - k * 0.025;
          if (tt < 0) continue;
          const [x, y] = curve(a.x, a.y, b.x, b.y, vertical, tt);
          ctx.fillStyle = SIGNAL;
          ctx.globalAlpha = dim * (k === 0 ? 1 : 0.5 - k * 0.08);
          ctx.beginPath(); ctx.arc(x, y, k === 0 ? 2.3 : 1.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Nodes
      ctx.textBaseline = 'middle';
      nodes.forEach((n, i) => {
        const p = ease((t - n.born) / 0.5);
        if (p <= 0) return;
        const flagship = n.id === 'laygrounded';
        const base = n.layer === 0 ? 3.5 : n.layer === 1 ? (flagship ? 9 : 6.5) : n.layer === 2 ? 5 : 8;
        const r = base * p;
        const on = i === hovered || (focus && [...lit].some(e => edges[e].from === i || edges[e].to === i));
        const dim = focus && !on ? 0.3 : 1;

        if (n.fire > 0.02) {
          ctx.strokeStyle = SIGNAL;
          ctx.globalAlpha = n.fire * 0.7 * dim;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(n.x, n.y, r + 4 + (1 - n.fire) * 10, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = dim;
        ctx.fillStyle = '#07080a';
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = n.layer === 1 || n.layer === 3 ? 1.6 : 1.2;
        ctx.strokeStyle = on || n.layer === 3 || flagship ? SIGNAL : `rgba(${INK}, 0.55)`;
        ctx.stroke();
        if (n.fire > 0.05 || flagship) {
          ctx.fillStyle = SIGNAL;
          ctx.globalAlpha = dim * Math.max(flagship ? 0.9 : 0, n.fire);
          ctx.beginPath(); ctx.arc(n.x, n.y, r * 0.45, 0, Math.PI * 2); ctx.fill();
        }

        // Labels
        const la = ease((t - n.born - 0.15) / 0.5) * dim;
        ctx.globalAlpha = la;
        const isProject = n.layer === 1;
        ctx.font = isProject || n.layer === 3
          ? `600 ${vertical ? 10 : 13}px "Archivo Variable", system-ui, sans-serif`
          : `500 ${vertical ? 9 : 11}px "JetBrains Mono Variable", ui-monospace, monospace`;
        ctx.fillStyle = on || n.layer === 3 ? (n.layer === 3 ? SIGNAL : '#fff') : `rgba(${INK}, ${isProject ? 0.92 : 0.6})`;
        if (vertical) {
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + (n.index % 2 ? -r - 10 : r + 11));
        } else if (n.layer === 0) {
          ctx.textAlign = 'right';
          ctx.fillText(n.label, n.x - r - 10, n.y);
        } else {
          ctx.textAlign = 'left';
          ctx.fillText(n.label, n.x + r + 10, n.y);
        }
        ctx.globalAlpha = 1;
      });
    }

    if (still) { draw(99); return () => { ro.disconnect(); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); canvas.removeEventListener('click', onClick); }; }

    let raf = 0, last = performance.now(), start = last, acc = 0, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); } }, { threshold: 0 });
    io.observe(canvas);

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;

      if (t > 2.4) {
        acc += dt;
        while (acc > 0.11) { acc -= 0.11; if (signals.length < 70) spawn(); }
      }
      for (let i = signals.length - 1; i >= 0; i--) {
        const sg = signals[i];
        sg.s += dt * sg.speed;
        if (sg.s >= 1) {
          const to = edges[sg.edge].to;
          nodes[to].fire = 1;
          const next = out.get(to);
          signals.splice(i, 1);
          if (next?.length) signals.push({ edge: pick(next), s: 0, speed: 0.55 + Math.random() * 0.5 });
          else { routed++; onRouted?.(routed); }
        }
      }
      nodes.forEach(n => { n.fire = Math.max(0, n.fire - dt * 1.6); });
      draw(t);
      if (visible) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [vertical, onRouted]);

  return (
    <>
      <canvas ref={ref} className="neural-canvas" aria-hidden />
      <span className="sr-only" aria-live="polite">{hoverLabel ?? ''}</span>
    </>
  );
};

export default NeuralCanvas;
