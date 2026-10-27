import React, { useState } from 'react';
import { CornerDownLeft, ShieldQuestion } from 'lucide-react';
import { ask, SUGGESTIONS, AskResult } from '../../lib/ask';

// Sophie's public boundary, applied to facts about Panos: pick an approved answer or abstain.
const AskFile: React.FC = () => {
  const [q, setQ] = useState('');
  const [asked, setAsked] = useState('');
  const [res, setRes] = useState<AskResult | null>(null);

  const run = (text: string) => {
    setQ(text);
    setAsked(text);
    setRes(ask(text));
  };

  return (
    <div className="demo">
      <form className="ask-form" onSubmit={e => { e.preventDefault(); if (q.trim()) run(q); }}>
        <label htmlFor="ask-input" className="sr-only">Ask a question about Panos</label>
        <input id="ask-input" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask about Panos…" autoComplete="off" maxLength={140} />
        <button type="submit" aria-label="Ask"><CornerDownLeft size={18} aria-hidden /></button>
      </form>
      <div className="chips" role="group" aria-label="Example questions">
        {SUGGESTIONS.map(s => <button key={s} type="button" className="chip" onClick={() => run(s)}>{s}</button>)}
      </div>

      <p className="demo-note">Sophie’s boundary, applied to questions about me: answers come only from a fixed list of approved facts.</p>
      <div className="ask-out" aria-live="polite">
        {!res && <p className="ask-empty">Ask anything. If it isn’t on file, you’ll get an honest “not on file” instead of a guess.</p>}
        {res?.kind === 'answer' && (
          <div className="ask-card">
            <p className="ask-q">{asked}</p>
            <p className="ask-a">{res.fact.answer}</p>
            <p className="ask-src">Source · {res.fact.source} · fact <code>{res.fact.id}</code></p>
          </div>
        )}
        {res?.kind === 'abstain' && (
          <div className="ask-card is-abstain">
            <p className="ask-q">{asked}</p>
            <p className="ask-a"><ShieldQuestion size={18} aria-hidden /> Abstaining. {res.reason}</p>
          </div>
        )}
        {res?.kind === 'clarify' && (
          <div className="ask-card is-clarify">
            <p className="ask-q">{asked}</p>
            <p className="ask-a">That could mean a few things. Which one?</p>
            <div className="chips">
              {res.options.map(f => <button key={f.id} type="button" className="chip" onClick={() => { setAsked(f.keywords[0]); setRes({ kind: 'answer', fact: f }); }}>{f.keywords[0]}</button>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AskFile;
