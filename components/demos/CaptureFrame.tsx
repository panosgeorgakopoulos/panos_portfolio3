import React, { useState } from 'react';
import type { Capture } from '../../types';

// Real screenshots of the running app, framed as a stitched window.
const CaptureFrame: React.FC<{ captures: Capture[]; children?: (i: number) => React.ReactNode }> = ({ captures, children }) => {
  const [i, setI] = useState(0);
  if (!captures.length) return null;
  const c = captures[i];
  return (
    <figure className="capture">
      {captures.length > 1 && (
        <div className="capture-tabs" role="tablist" aria-label="Screens">
          {captures.map((cap, j) => (
            <button key={cap.src} role="tab" aria-selected={i === j} className={i === j ? 'is-on' : ''} onClick={() => setI(j)}>
              Screen {j + 1}
            </button>
          ))}
        </div>
      )}
      <div className="capture-win">
        <img src={c.src} alt={c.alt} width={c.width} height={c.height} loading="lazy" decoding="async" />
        {children?.(i)}
      </div>
      <figcaption>{c.caption} <span>Captured from the running app.</span></figcaption>
    </figure>
  );
};

export default CaptureFrame;
