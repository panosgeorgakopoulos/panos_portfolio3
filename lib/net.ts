import { PROJECTS, SKILLS, ROLES } from '../constants';

// The hero network: skills feed projects, projects feed capabilities, capabilities feed roles.
// Every edge between the first two layers is a real dependency from constants.ts.

export interface NetNode {
  id: string;
  label: string;
  sub: string;       // one line of detail for the node card
  layer: number;
  index: number;
  x: number;
  y: number;
  fire: number;      // 0..1, decays after a signal arrives
  born: number;      // seconds after start when the node appears
  href?: string;
}

export interface NetEdge {
  from: number;
  to: number;
  w: number;         // weight: line strength and how often signals take it
  born: number;
}

export const LAYER_NAMES = ['Inputs', 'Projects', 'Capabilities', 'Output'];

const CAPABILITIES = [
  { id: 'grounded', label: 'Grounded AI', from: ['laygrounded', 'sophie', 'medbot', 'metascribe'] },
  { id: 'data', label: 'Retrieval & data', from: ['sophie', 'panhellenic', 'nexus', 'laygrounded'] },
  { id: 'product', label: 'Product engineering', from: ['laygrounded', 'metascribe', 'nexus', 'sophie'] },
  { id: 'systems', label: 'Systems & backend', from: ['nexus', 'laygrounded', 'medbot', 'panhellenic'] },
];

export function buildNet() {
  const title = (slug: string) => PROJECTS.find(p => p.slug === slug)?.title ?? slug;
  const layers: { id: string; label: string; sub: string; href?: string }[][] = [
    SKILLS.map(s => ({ id: s.id, label: s.label, sub: `Used in ${PROJECTS.filter(p => p.skills.includes(s.id)).map(p => p.title).join(', ')}` })),
    PROJECTS.map(p => ({ id: p.slug, label: p.title, sub: `${p.kind} · ${p.year}`, href: `#${p.slug}` })),
    CAPABILITIES.map(c => ({ id: c.id, label: c.label, sub: `Fed by ${c.from.map(title).join(', ')}` })),
    ROLES.map(r => ({ id: r, label: r, sub: 'Where every path ends. Get in touch.', href: '#contact' })),
  ];

  const nodes: NetNode[] = [];
  const at = new Map<string, number>();
  layers.forEach((layer, li) => layer.forEach((n, i) => {
    at.set(`${li}:${n.id}`, nodes.length);
    nodes.push({ ...n, layer: li, index: i, x: 0, y: 0, fire: 0, born: 0.35 + li * 0.45 + i * 0.06 });
  }));

  const edges: NetEdge[] = [];
  const link = (a: string, b: string, w: number) => {
    const from = at.get(a)!, to = at.get(b)!;
    edges.push({ from, to, w, born: nodes[to].born + 0.1 });
  };
  PROJECTS.forEach(p => p.skills.forEach(s => link(`0:${s}`, `1:${p.slug}`, 0.9)));
  CAPABILITIES.forEach(c => c.from.forEach(p => link(`1:${p}`, `2:${c.id}`, p === 'laygrounded' ? 1 : 0.7)));
  CAPABILITIES.forEach(c => ROLES.forEach((r, i) => link(`2:${c.id}`, `3:${r}`, i === 0 || c.id !== 'grounded' ? 0.8 : 0.45)));

  return { nodes, edges, layerCount: layers.length };
}

// Place nodes for the current canvas box. Horizontal on wide screens, vertical on narrow ones.
export function layout(nodes: NetNode[], layerCount: number, w: number, h: number, box: { x0: number; x1: number; y0: number; y1: number }, vertical: boolean) {
  const counts = Array.from({ length: layerCount }, (_, l) => nodes.filter(n => n.layer === l).length);
  for (const n of nodes) {
    const t = n.layer / (layerCount - 1);
    const c = counts[n.layer];
    const s = c === 1 ? 0.5 : n.index / (c - 1);
    // Outer layers spread less so the shape reads as a funnel into the output.
    const spread = n.layer === layerCount - 1 ? 0.5 : n.layer === 2 ? 0.72 : 1;
    const u = 0.5 + (s - 0.5) * spread;
    if (vertical) {
      n.x = box.x0 + u * (box.x1 - box.x0);
      n.y = box.y0 + t * (box.y1 - box.y0);
    } else {
      n.x = box.x0 + t * (box.x1 - box.x0);
      n.y = box.y0 + u * (box.y1 - box.y0);
    }
  }
  return { w, h };
}
