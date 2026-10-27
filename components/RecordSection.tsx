import React from 'react';
import { RECORD, STACK } from '../constants';
import { useReveal } from '../lib/hooks';

const RecordSection: React.FC = () => {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="record" ref={ref} className="block" aria-labelledby="record-title">
      <span className="proj-rule" aria-hidden />
      <div className="block-head">
        <h2 id="record-title" data-r>Record</h2>
        <p data-r style={{ ['--d' as string]: '0.08s' }}>Where the work happened, and what it runs on.</p>
      </div>
      <div className="record-grid">
        <ol className="timeline">
          {RECORD.map((r, i) => (
            <li key={r.role + r.period} data-r style={{ ['--d' as string]: `${0.1 + i * 0.08}s` }}>
              <span className="tl-dot" aria-hidden />
              <div className="tl-head">
                <h3>{r.org} <span>{r.role}</span></h3>
                <span className="tl-period">{r.period}</span>
              </div>
              {r.tagline && <p className="tl-tagline">{r.tagline}</p>}
              <ul className="tl-points">
                {r.points.map(pt => <li key={pt}>{pt}</li>)}
              </ul>
            </li>
          ))}
        </ol>
        <div className="stack">
          {STACK.map((g, i) => (
            <div key={g.group} className="stack-group" data-r style={{ ['--d' as string]: `${0.15 + i * 0.08}s` }}>
              <h3>{g.group}</h3>
              <ul>{g.items.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecordSection;
