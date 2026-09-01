import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * Server entry for the prerender step.
 *
 * Deliberately does not import `index.css` — the client build already emits the
 * stylesheet, and pulling it in here would make the SSR bundle depend on
 * Tailwind's output for no benefit.
 */
export function render(): string {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
