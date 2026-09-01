/**
 * Prerender the single route into dist/index.html.
 *
 * The site is a client-rendered SPA, so without this step every crawler that
 * does not execute JavaScript — Bing, DuckDuckGo, and the LLM answer engines —
 * sees an empty <div id="root">. Google renders JS but does so on a deferred,
 * budget-dependent second pass.
 *
 * There is one route and no data fetching (everything comes from constants.ts),
 * so a static render is enough: `vite build --ssr` compiles entry-server.tsx,
 * this script runs it once, and the markup is injected into the built HTML.
 * `index.tsx` then hydrates that markup instead of creating a fresh root.
 */
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'dist/index.html');
const ssrEntry = path.join(root, 'dist-ssr/entry-server.js');
const MARKER = '<div id="root"></div>';

const { render } = await import(`file://${ssrEntry}`);
const markup = render();

if (!markup || markup.length < 5000) {
  throw new Error(`Prerender produced suspiciously little markup (${markup.length} bytes).`);
}

const html = await readFile(htmlPath, 'utf8');
if (!html.includes(MARKER)) {
  throw new Error(`Could not find ${MARKER} in dist/index.html — did the template change?`);
}

await writeFile(htmlPath, html.replace(MARKER, `<div id="root">${markup}</div>`), 'utf8');
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`prerender: injected ${markup.length.toLocaleString()} bytes of markup`);
