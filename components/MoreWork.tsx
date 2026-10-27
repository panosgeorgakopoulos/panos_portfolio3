import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MORE } from '../constants';
import { useReveal } from '../lib/hooks';

const MoreWork: React.FC = () => {
  const ref = useReveal<HTMLElement>();
  const [lead, ...rest] = MORE;
  return (
    <section id="more" ref={ref} className="block" aria-labelledby="more-title">
      <span className="proj-rule" aria-hidden />
      <div className="block-head">
        <h2 id="more-title" data-r>More work</h2>
        <p data-r style={{ ['--d' as string]: '0.08s' }}>Hackathons, product builds and earlier systems. Each one fed something into the projects above.</p>
      </div>
      <div className="more-grid">
        <article className="more-lead" data-r style={{ ['--d' as string]: '0.12s' }}>
          {lead.capture && <img src={lead.capture.src} alt={lead.capture.alt} width={lead.capture.width} height={lead.capture.height} loading="lazy" />}
          <h3>{lead.title}</h3>
          <p>{lead.note}</p>
          <p className="proj-stack">{lead.stack.join(' / ')}</p>
          {lead.link && <a className="line-link" href={lead.link} target="_blank" rel="noreferrer">Open the live app <ArrowUpRight size={16} aria-hidden /></a>}
          <p className="fine">Free-tier hosting: the first load can take up to a minute while it wakes.</p>
        </article>
        <ul className="more-list">
          {rest.map((m, i) => (
            <li key={m.title} data-r style={{ ['--d' as string]: `${0.15 + i * 0.06}s` }}>
              <a href={m.link} target="_blank" rel="noreferrer" className="more-row">
                <span className="more-title">{m.title}</span>
                <span className="more-note">{m.note}</span>
                <span className="more-meta">{m.stack.join(' / ')} · {m.year}</span>
                <ArrowUpRight className="more-go" size={18} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MoreWork;
