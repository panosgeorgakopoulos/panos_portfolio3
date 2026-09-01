import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// `npm run build` prerenders the page into #root, so the normal path is
// hydration. Fall back to a fresh root if the markup isn't there (dev server,
// or a build where the prerender step was skipped).
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
