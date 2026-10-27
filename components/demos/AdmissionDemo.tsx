import React, { useMemo, useState } from 'react';
import type { Project } from '../../types';
import { admission, DEPARTMENT } from '../../lib/admission';
import CaptureFrame from './CaptureFrame';

const MIN = 15000, MAX = 19500;

const AdmissionDemo: React.FC<{ project: Project }> = ({ project }) => {
  const [score, setScore] = useState(17600);
  const r = admission(score);
  const pct = Math.round(r.p * 100);

  // Sigmoid drawn across the slider range, so the marker sits on the curve.
  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const s = MIN + (i / 60) * (MAX - MIN);
      pts.push(`${(i / 60) * 300},${100 - admission(s).p * 92}`);
    }
    return 'M' + pts.join(' L');
  }, []);
  const mx = ((score - MIN) / (MAX - MIN)) * 300, my = 100 - r.p * 92;

  return (
    <div className="demo">
      <div className="adm">
        <div className="adm-readout" aria-live="polite">
          <span className="adm-pct">{pct}<small>%</small></span>
          <span className="adm-cap">chance of admission</span>
        </div>
        <svg viewBox="-6 -4 312 112" className="adm-curve" aria-hidden>
          <path d={curve} />
          <line x1={mx} x2={mx} y1={0} y2={100} />
          <circle cx={mx} cy={my} r={6} />
        </svg>
      </div>
      <label className="adm-slider">
        <span>Your points: <b>{score.toLocaleString('en')}</b></span>
        <input type="range" min={MIN} max={MAX} step={10} value={score} onChange={e => setScore(+e.target.value)} />
      </label>
      <dl className="adm-stats">
        <div><dt>Expected cutoff</dt><dd>{Math.round(r.expected).toLocaleString('en')}</dd></div>
        <div><dt>Volatility</dt><dd>±{Math.round(r.vol)}</dd></div>
        <div><dt>Trend</dt><dd>{r.slope >= 0 ? '+' : ''}{Math.round(r.slope)}/yr</dd></div>
        <div><dt>National z</dt><dd>{r.z >= 0 ? '+' : ''}{r.z.toFixed(2)}σ</dd></div>
      </dl>
      <p className="demo-note">Synthetic cutoffs for one illustrative department. Last five years: {DEPARTMENT.cutoffs.map(c => c.toLocaleString('en')).join(', ')}. Stable history makes the curve steeper.</p>
      <CaptureFrame captures={project.captures} />
    </div>
  );
};

export default AdmissionDemo;
