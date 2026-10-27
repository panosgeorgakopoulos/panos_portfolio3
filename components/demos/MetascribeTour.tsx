import React, { useState } from 'react';
import type { Project } from '../../types';
import CaptureFrame from './CaptureFrame';

const SPOTS = [
  { x: 6, y: 33, title: 'Page queue', text: 'Pages are transcribed one at a time, first in first out. Stop finishes the current request and keeps the rest for later.' },
  { x: 37, y: 72, title: 'Crop box', text: 'Diagrams get their own crop, so the model sees the figure on its own and can return it as CeTZ drawing code.' },
  { x: 74, y: 62, title: 'Compiled Typst', text: 'The transcription compiles in the browser through WASM. A page that compiles can still be wrong, so it goes to review.' },
  { x: 93, y: 27, title: 'Mark reviewed', text: 'Nothing counts as done until a person has compared the scan with the output and accepted it.' },
  { x: 85, y: 19, title: 'Export', text: 'Download a runnable Typst project or a faithful Word file. Incomplete exports say exactly which pages they contain.' },
];

const MetascribeTour: React.FC<{ project: Project }> = ({ project }) => {
  const [on, setOn] = useState(1);
  return (
    <div className="demo">
      <CaptureFrame captures={project.captures}>
        {() => SPOTS.map((s, i) => (
          <button key={s.title} type="button" className={`spot${on === i ? ' is-on' : ''}`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => setOn(i)} aria-pressed={on === i} aria-label={s.title}>
            {i + 1}
          </button>
        ))}
      </CaptureFrame>
      <p className="demo-note">Tap the numbered stitches to explore the review screen.</p>
      <div className="spot-note" aria-live="polite">
        <b>{on + 1} · {SPOTS[on].title}</b>
        <p>{SPOTS[on].text}</p>
      </div>
    </div>
  );
};

export default MetascribeTour;
