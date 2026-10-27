import React, { useEffect, useRef } from 'react';

// A faint field of drifting points behind the whole page. Neighbours link up when they come close,
// and the field shifts with scroll so the page always feels in motion.
const LatentField: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0;
    const pts: { x: number; y: number; vx: number; vy: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const want = Math.round((w * h) / 26000);
      while (pts.length < want) pts.push({ x: Math.random() * w, y: Math.random() * h * 1.4, vx: (Math.random() - 0.5) * 9, vy: (Math.random() - 0.5) * 9 });
      pts.length = want;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0, last = performance.now();
    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const shift = (window.scrollY * 0.08) % (h * 1.4);
      for (const p of pts) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h * 1.4; if (p.y > h * 1.4) p.y = -20;
      }
      const ys = pts.map(p => ((p.y - shift) % (h * 1.4) + h * 1.4) % (h * 1.4) - h * 0.2);
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = ys[i] - ys[j];
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            ctx.strokeStyle = `rgba(232, 236, 240, ${0.05 * (1 - Math.sqrt(d2) / 140)})`;
            ctx.beginPath(); ctx.moveTo(pts[i].x, ys[i]); ctx.lineTo(pts[j].x, ys[j]); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = 'rgba(232, 236, 240, 0.16)';
      pts.forEach((p, i) => { ctx.beginPath(); ctx.arc(p.x, ys[i], 1.1, 0, Math.PI * 2); ctx.fill(); });
    };

    if (still) { draw(0); return () => window.removeEventListener('resize', resize); }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) draw(dt);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className="latent-field" aria-hidden />;
};

export default LatentField;
