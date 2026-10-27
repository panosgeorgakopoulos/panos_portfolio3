import React, { useState } from 'react';
import { Check, Copy, Github, Linkedin, Mail } from 'lucide-react';
import { PROFILE } from '../constants';
import { useReveal } from '../lib/hooks';

const XMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" fill="currentColor" /></svg>
);

const Contact: React.FC = () => {
  const ref = useReveal<HTMLElement>();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard blocked: the mailto link still works */ }
  };

  return (
    <footer id="contact" ref={ref} className="contact" aria-labelledby="contact-title">
      <div className="converge" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}
        <b />
      </div>
      <div className="contact-inner">
        <h2 id="contact-title" data-r>Every signal ends at an output.<br /><span className="accent">Let’s make it your team.</span></h2>
        <p className="contact-lede" data-r style={{ ['--d' as string]: '0.1s' }}>{PROFILE.availability}. If you’re putting AI into a product that has to be right, I’d like to hear about it.</p>
        <div className="contact-actions" data-r style={{ ['--d' as string]: '0.18s' }}>
          <a className="btn btn-signal btn-lg" href={`mailto:${PROFILE.email}`}><Mail size={20} aria-hidden /> {PROFILE.email}</a>
          <button type="button" className="btn btn-line" onClick={copy} aria-live="polite">
            {copied ? <><Check size={18} aria-hidden /> Copied</> : <><Copy size={18} aria-hidden /> Copy</>}
          </button>
        </div>
        <ul className="contact-links" data-r style={{ ['--d' as string]: '0.24s' }}>
          <li><a href={`https://${PROFILE.socials.linkedin}`} target="_blank" rel="noreferrer"><Linkedin size={18} aria-hidden /> LinkedIn</a></li>
          <li><a href={`https://${PROFILE.socials.github}`} target="_blank" rel="noreferrer"><Github size={18} aria-hidden /> GitHub</a></li>
          <li><a href={`https://${PROFILE.socials.twitter}`} target="_blank" rel="noreferrer"><XMark /> X</a></li>
        </ul>
        <p className="contact-foot">© {new Date().getFullYear()} {PROFILE.name} · Athens · Built with React and canvas</p>
      </div>
    </footer>
  );
};

export default Contact;
