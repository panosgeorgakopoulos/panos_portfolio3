import React, { useEffect, useRef } from 'react';

// Abstract sketch of the LayGrounded principle. No product UI, data, rules or internals.
const STAGES = [
  { x: 60, label: 'Documents', short: 'Docs', sub: 'evidence in' },
  { x: 230, label: 'AI extraction', short: 'AI', sub: 'proposes' },
  { x: 400, label: 'Human review', short: 'Review', sub: 'confirms' },
  { x: 570, label: 'Rules engine', short: 'Engine', sub: 'computes' },
  { x: 740, label: 'Result', short: 'Result', sub: 'reproducible' },
];
const Y = 120;
const SIGNAL = '#c6f432';

interface Packet { x: number; state: 'raw' | 'proposed' | 'confirmed' | 'rejected'; wait: number; y: number; vy: number; a: number }

const PipelineDemo: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const W = 800, H = 250;
    let scale = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      scale = r.width / W;
      canvas.width = r.width * dpr; canvas.height = r.width * (H / W) * dpr;
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    const packets: Packet[] = [];
    let results = 0, held = 0;
    let spawnAcc = 0;
    const frameOf = (p: Packet) => (p.state === 'confirmed' ? SIGNAL : p.state === 'rejected' ? 'rgba(232,236,240,0.25)' : 'rgba(232,236,240,0.85)');

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // rail
      ctx.strokeStyle = 'rgba(232,236,240,0.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(STAGES[0].x, Y); ctx.lineTo(STAGES[4].x, Y); ctx.stroke();
      // confirmed segment after the gate
      ctx.strokeStyle = 'rgba(198,244,50,0.35)';
      ctx.beginPath(); ctx.moveTo(STAGES[2].x, Y); ctx.lineTo(STAGES[4].x, Y); ctx.stroke();

      STAGES.forEach((s, i) => {
        const gate = i === 2;
        ctx.fillStyle = '#0b0d10';
        ctx.strokeStyle = gate || i === 4 ? SIGNAL : 'rgba(232,236,240,0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (gate) { ctx.rect(s.x - 16, Y - 22, 32, 44); } else { ctx.arc(s.x, Y, 13, 0, Math.PI * 2); }
        ctx.fill(); ctx.stroke();
        if (i === 1) { ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(s.x, Y, 19, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); }
        ctx.textAlign = 'center';
        ctx.fillStyle = '#e8ecf0';
        ctx.font = `600 ${Math.max(14, 11 / scale)}px "Archivo Variable", system-ui, sans-serif`;
        const compact = scale < 0.62;
        ctx.fillText(compact ? s.short : s.label, s.x, Y + 38 + Math.max(14, 11 / scale));
        if (compact) return;
        ctx.fillStyle = 'rgba(232,236,240,0.5)';
        ctx.font = `500 ${Math.max(11, 9 / scale)}px "JetBrains Mono Variable", ui-monospace, monospace`;
        ctx.fillText(s.sub, s.x, Y + 46 + Math.max(14, 11 / scale) * 2);
      });

      for (const p of packets) {
        ctx.globalAlpha = p.a;
        ctx.strokeStyle = frameOf(p);
        ctx.fillStyle = p.state === 'confirmed' ? SIGNAL : 'transparent';
        ctx.lineWidth = 1.4;
        if (p.state === 'proposed') ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.rect(p.x - 5, p.y - 5, 10, 10);
        if (p.state === 'confirmed') ctx.fill();
        ctx.stroke(); ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      ctx.textAlign = 'left';
      ctx.font = `500 ${Math.max(11, 9 / scale)}px "JetBrains Mono Variable", ui-monospace, monospace`;
      ctx.fillStyle = 'rgba(232,236,240,0.55)';
      ctx.fillText(`held: ${held}`, STAGES[0].x - 20, 30);
      ctx.fillStyle = SIGNAL;
      ctx.textAlign = 'right';
      ctx.fillText(`reproducible: ${results}`, STAGES[4].x + 30, 30);
    };

    const step = (dt: number) => {
      spawnAcc += dt;
      if (spawnAcc > 0.9) { spawnAcc = 0; packets.push({ x: STAGES[0].x, state: 'raw', wait: 0, y: Y, vy: 0, a: 1 }); }
      held = 0;
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        if (p.state === 'rejected') { p.vy += 120 * dt; p.y += p.vy * dt; p.a -= dt * 1.2; if (p.a <= 0) packets.splice(i, 1); continue; }
        if (p.state === 'raw' && p.x >= STAGES[1].x) p.state = 'proposed';
        if (p.state === 'proposed' && p.x >= STAGES[2].x - 22) {
          held++;
          p.wait += dt;
          if (p.wait > 0.9) { p.state = Math.random() < 0.82 ? 'confirmed' : 'rejected'; }
          continue;
        }
        p.x += 110 * dt;
        if (p.x >= STAGES[4].x) { results++; packets.splice(i, 1); }
      }
    };

    if (still) {
      packets.push({ x: 300, state: 'proposed', wait: 0, y: Y, vy: 0, a: 1 }, { x: 500, state: 'confirmed', wait: 0, y: Y, vy: 0, a: 1 });
      draw();
      return () => ro.disconnect();
    }

    let raf = 0, last = performance.now(), visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); } });
    io.observe(canvas);
    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      step(dt); draw();
      if (visible) raf = requestAnimationFrame(frame);
    }
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  return (
    <div className="demo demo-pipeline">
      <canvas ref={ref} className="pipeline-canvas" role="img"
        aria-label="Abstract pipeline: documents go to AI extraction, which proposes; a person reviews and confirms or rejects; a rules engine computes; the result is reproducible." />
      <p className="demo-note">An abstract sketch of the principle, not the product: no real interface, data or rules are shown. Dashed items are AI proposals; only confirmed items reach the engine.</p>
    </div>
  );
};

export default PipelineDemo;
