import React, { useMemo, useState } from 'react';

// The Nexus scoring idea with synthetic listings: each criterion scores 0–100, the engine weights them.
const CRITERIA = [
  { id: 'budget', label: 'Budget', def: 35 },
  { id: 'location', label: 'Location', def: 30 },
  { id: 'lifestyle', label: 'Lifestyle', def: 20 },
  { id: 'size', label: 'Size', def: 15 },
] as const;
type C = typeof CRITERIA[number]['id'];

const LISTINGS: { name: string; s: Record<C, number> }[] = [
  { name: 'Two-bed, Kypseli', s: { budget: 100, location: 100, lifestyle: 40, size: 55 } },
  { name: 'Loft, Psyrri', s: { budget: 55, location: 100, lifestyle: 95, size: 60 } },
  { name: 'Family flat, Marousi', s: { budget: 80, location: 0, lifestyle: 70, size: 100 } },
  { name: 'Studio, Pangrati', s: { budget: 100, location: 100, lifestyle: 75, size: 20 } },
  { name: 'Penthouse, Glyfada', s: { budget: 15, location: 0, lifestyle: 100, size: 90 } },
];

const ROW = 52;

const NexusDemo: React.FC = () => {
  const [w, setW] = useState<Record<C, number>>({ budget: 35, location: 30, lifestyle: 20, size: 15 });
  const total = CRITERIA.reduce((a, c) => a + w[c.id], 0) || 1;

  const ranked = useMemo(() => {
    const scored = LISTINGS.map(l => ({
      ...l,
      score: Math.min(100, Math.round(CRITERIA.reduce((s, c) => s + l.s[c.id] * (w[c.id] / total), 0))),
    }));
    const order = [...scored].sort((a, b) => b.score - a.score).map(x => x.name);
    return scored.map(x => ({ ...x, rank: order.indexOf(x.name) }));
  }, [w, total]);

  return (
    <div className="demo">
      <div className="weights">
        {CRITERIA.map(c => (
          <label key={c.id} className="weight">
            <span><b>{c.label}</b> <em>{Math.round((w[c.id] / total) * 100)}%</em></span>
            <input type="range" min={0} max={60} value={w[c.id]} onChange={e => setW({ ...w, [c.id]: +e.target.value })} />
          </label>
        ))}
      </div>
      <ol className="ranking" style={{ height: LISTINGS.length * ROW }} aria-label="Ranked listings">
        {ranked.map(l => (
          <li key={l.name} style={{ transform: `translateY(${l.rank * ROW}px)` }} className={l.rank === 0 ? 'is-top' : ''}>
            <span className="rank-n">{l.rank + 1}</span>
            <span className="rank-name">{l.name}</span>
            <span className="rank-bar"><i style={{ width: `${l.score}%` }} /></span>
            <span className="rank-score">{l.score}</span>
          </li>
        ))}
      </ol>
      <p className="demo-note">Synthetic listings for one buyer. Drag a weight and the engine re-ranks; the production defaults are budget 35, location 30, lifestyle 20, size 15.</p>
    </div>
  );
};

export default NexusDemo;
