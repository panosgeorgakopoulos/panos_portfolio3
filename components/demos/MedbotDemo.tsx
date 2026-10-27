import React, { useState } from 'react';
import { Ban, Check, CornerDownLeft, HelpCircle } from 'lucide-react';
import { parse, plan, MEDBOT_EXAMPLES, Parse, Plan } from '../../lib/medbot';

const LAYERS = [
  { n: 1, name: 'Rules', note: 'regex templates, aliases' },
  { n: 2, name: 'Classifier', note: 'LogReg intent + CRF slots' },
  { n: 3, name: 'Embeddings', note: 'multilingual MiniLM' },
] as const;

const MedbotDemo: React.FC = () => {
  const [q, setQ] = useState('');
  const [out, setOut] = useState<{ p: Parse; v: Plan } | null>(null);

  const run = (text: string) => {
    setQ(text);
    const p = parse(text);
    setOut({ p, v: plan(p) });
  };

  const Verdict = out ? (out.v.ok ? Check : out.p.intent && out.v.message.startsWith('Refused') ? Ban : HelpCircle) : null;

  return (
    <div className="demo">
      <form className="ask-form" onSubmit={e => { e.preventDefault(); if (q.trim()) run(q); }}>
        <label htmlFor="medbot-input" className="sr-only">Give the hospital assistant a command</label>
        <input id="medbot-input" value={q} onChange={e => setQ(e.target.value)} placeholder="give 2 paracetamol to ward 3" autoComplete="off" maxLength={120} />
        <button type="submit" aria-label="Send command"><CornerDownLeft size={18} aria-hidden /></button>
      </form>
      <div className="chips" role="group" aria-label="Example commands">
        {MEDBOT_EXAMPLES.map(s => <button key={s} type="button" className="chip" onClick={() => run(s)}>{s}</button>)}
      </div>

      <p className="demo-note">Simulation: the routing idea, running in your browser. The real models are trained in Python.</p>
      <ol className="layers" aria-label="Understanding layers">
        {LAYERS.map(l => (
          <li key={l.n} className={out?.p.layer === l.n ? 'is-lit' : out && out.p.layer && l.n < out.p.layer ? 'is-passed' : ''}>
            <span className="layer-n">{l.n}</span>
            <span><b>{l.name}</b><small>{l.note}</small></span>
          </li>
        ))}
      </ol>

      <div className="medbot-out" aria-live="polite">
        {out ? (
          <>
            <p className="slots">
              {(['intent', 'item', 'qty', 'ward'] as const).map(k => (
                <span key={k}><small>{k}</small>{out.p[k] ?? '—'}</span>
              ))}
            </p>
            <p className={`verdict ${out.v.ok ? 'is-ok' : 'is-stop'}`}>
              {Verdict && <Verdict size={18} aria-hidden />} <span><b>Planner:</b> {out.v.message}</span>
            </p>
          </>
        ) : <p className="ask-empty">Pick an example. The phrasing gets looser from left to right, and a deeper layer catches it. The last one hits an expired batch.</p>}
      </div>
    </div>
  );
};

export default MedbotDemo;
