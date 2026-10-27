import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowDown, Mail } from 'lucide-react';
import { PROFILE } from '../constants';
import NeuralCanvas from './NeuralCanvas';

const Neural3D = lazy(() => import('./Neural3D'));

// 3D needs WebGL and a visitor who hasn't asked for reduced motion; everyone else gets the 2D network.
const can3D = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch { return false; }
};
import { useMedia } from '../lib/hooks';

const Hero: React.FC = () => {
  const narrow = useMedia('(max-width: 900px)');
  const [threeD] = useState(can3D);
  const [seconds, setSeconds] = useState(0);

  // Time on the page this visit; only counts while the tab is visible.
  useEffect(() => {
    const t = window.setInterval(() => { if (!document.hidden) setSeconds(s => s + 1); }, 1000);
    return () => window.clearInterval(t);
  }, []);
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <header className="hero" id="top">
      <div className="hero-net">
        {threeD ? (
          <Suspense fallback={null}><Neural3D vertical={narrow} /></Suspense>
        ) : <NeuralCanvas vertical={narrow} />}
      </div>

      <div className="hero-copy">
        <p className="hero-id load-in" style={{ ['--d' as string]: '0.05s' }}>
          <span className="pulse-dot" aria-hidden /> {PROFILE.name}
          <span className="hero-id-role">{PROFILE.role} · {PROFILE.status} · {PROFILE.location.split(',')[0]}</span>
        </p>
        <h1 className="hero-title">
          <span className="line"><span className="load-up" style={{ ['--d' as string]: '0.15s' }}>Models propose.</span></span>
          <span className="line"><span className="load-up accent" style={{ ['--d' as string]: '0.32s' }}>Code decides.</span></span>
        </h1>
        <p className="hero-lede load-in" style={{ ['--d' as string]: '0.6s' }}>
          I build AI systems for real work. Models read, extract and draft; deterministic code checks, computes and decides. When the evidence isn’t there, the system says so.
        </p>
        <div className="hero-actions load-in" style={{ ['--d' as string]: '0.75s' }}>
          <a className="btn btn-signal" href={`mailto:${PROFILE.email}`}><Mail size={18} aria-hidden /> Email me</a>
          <a className="btn btn-line" href="#work">See the work <ArrowDown size={18} aria-hidden /></a>
        </div>
        <p className="hero-status load-in" style={{ ['--d' as string]: '2.6s' }} aria-hidden>
          <span className="pulse-dot" /> live · you’ve been here <span className="hero-clock">{clock}</span> · {threeD ? (narrow ? 'drag to orbit, tap a node' : 'drag to orbit, hover a node') : `${narrow ? 'tap' : 'hover'} a node to trace it`}
        </p>
      </div>
    </header>
  );
};

export default Hero;
