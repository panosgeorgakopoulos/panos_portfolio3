import React from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import type { Project, DemoKind } from '../types';
import { PROJECTS } from '../constants';
import { useReveal } from '../lib/hooks';
import AskFile from './demos/AskFile';
import MedbotDemo from './demos/MedbotDemo';
import AdmissionDemo from './demos/AdmissionDemo';
import MetascribeTour from './demos/MetascribeTour';
import PipelineDemo from './demos/PipelineDemo';
import NexusDemo from './demos/NexusDemo';

const DEMOS: Record<DemoKind, React.FC<{ project: Project }>> = {
  pipeline: PipelineDemo,
  sophie: AskFile,
  medbot: MedbotDemo,
  nexus: NexusDemo,
  metascribe: MetascribeTour,
  panhellenic: AdmissionDemo,
};

// Where the model's output ends and the code's authority begins, with a signal crossing the boundary.
const Flow: React.FC<{ model: string; code: string }> = ({ model, code }) => (
  <div className="flow" data-r style={{ ['--d' as string]: '0.25s' }}>
    <div className="flow-cell">
      <span className="flow-tag">Model · proposes</span>
      <p>{model}</p>
    </div>
    <div className="flow-wire" aria-hidden><i /></div>
    <div className="flow-cell is-code">
      <span className="flow-tag">Code · decides</span>
      <p>{code}</p>
    </div>
  </div>
);

const ProjectSection: React.FC<{ project: Project; index: number }> = ({ project: p, index }) => {
  const ref = useReveal<HTMLElement>();
  const Demo = DEMOS[p.demo];
  const flagship = index === 0;

  return (
    <section id={p.slug} ref={ref} className={`project${flagship ? ' is-flagship' : ''}`} aria-labelledby={`${p.slug}-title`}>
      <span className="proj-rule" aria-hidden />
      <header className="proj-head">
        <p className="proj-node" data-r>
          {flagship ? <span className="flag">Flagship</span> : null}
          Node {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </p>
        <h2 id={`${p.slug}-title`} className="proj-title" data-r style={{ ['--d' as string]: '0.05s' }}>{p.title}</h2>
        <p className="proj-meta" data-r style={{ ['--d' as string]: '0.12s' }}>
          <span>{p.kind}</span>
          <span>{p.year}</span>
          <span className="tag">{p.visibility === 'private' ? <><Lock size={12} aria-hidden /> Private</> : 'Open source'}</span>
        </p>
      </header>

      <div className="proj-body">
        <div className="proj-text">
          <p className="proj-summary" data-r style={{ ['--d' as string]: '0.15s' }}>{p.summary}</p>
          <ul className="proj-facts" data-r style={{ ['--d' as string]: '0.2s' }}>
            {p.facts.map(f => <li key={f}>{f}</li>)}
          </ul>
          <Flow model={p.boundary.model} code={p.boundary.code} />
          <p className="proj-stack" data-r style={{ ['--d' as string]: '0.3s' }}>{p.stack.join(' / ')}</p>
          {p.link && (
            <a className="line-link" href={p.link} target="_blank" rel="noreferrer" data-r style={{ ['--d' as string]: '0.35s' }}>
              Source on GitHub <ArrowUpRight size={16} aria-hidden />
            </a>
          )}
        </div>
        <div className="proj-demo" data-r style={{ ['--d' as string]: '0.18s' }}>
          <Demo project={p} />
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
