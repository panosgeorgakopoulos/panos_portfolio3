import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { ChevronRight, RotateCcw, Rotate3d, Zap } from 'lucide-react';
import { buildNet, LAYER_NAMES } from '../lib/net';

// The hero network in 3D. Same graph as the 2D canvas; layers sit on curved planes in depth,
// the scene orbits slowly, and every node can be hovered, pinned, focused or opened.

const SIGNAL = new THREE.Color('#c6f432');
const INK = new THREE.Color('#e8ecf0');
const MUTED = new THREE.Color('#8b929c');
const LAYER_Z = [0, 0.8, -0.3, 0.6];
const MAX_SIGNALS = 140;
const TRAIL = 5;
const SEGMENTS = 28;

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function texture(draw: (c: CanvasRenderingContext2D, s: number) => void, size = 128) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  draw(cv.getContext('2d')!, size);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Signal { edge: number; s: number; speed: number; burst: number }
interface TipState { i: number; pinned: boolean; touch: boolean }
interface Api {
  hover(i: number | null): void;
  activate(i: number, touch: boolean): void;
  burst(): void;
  reset(): void;
  setAuto(v: boolean): void;
}

const Neural3D: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const headerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tipRef = useRef<HTMLDivElement>(null);
  const passRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const api = useRef<Api | null>(null);
  const [net] = useState(() => buildNet());
  const [tip, setTip] = useState<TipState | null>(null);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    const host = wrap.current!;
    const { nodes, edges, layerCount } = net;
    const N = nodes.length;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'n3-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const group = new THREE.Group();
    scene.add(group);

    // Adjacency for tracing paths and routing signals
    const out: number[][] = Array.from({ length: N }, () => []);
    const inc: number[][] = Array.from({ length: N }, () => []);
    edges.forEach((e, i) => { out[e.from].push(i); inc[e.to].push(i); });

    // ---------- textures and node sprites ----------
    const ringTex = texture((c, s) => {
      c.fillStyle = '#07080a';
      c.beginPath(); c.arc(s / 2, s / 2, s * 0.4, 0, Math.PI * 2); c.fill();
      c.lineWidth = s * 0.075; c.strokeStyle = '#fff'; c.stroke();
    });
    const coreTex = texture((c, s) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(s / 2, s / 2, s * 0.42, 0, Math.PI * 2); c.fill(); });
    const glowTex = texture((c, s) => {
      const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, 0, s, s);
    });

    const sizeOf = (i: number) => {
      const n = nodes[i];
      return n.layer === 0 ? 0.14 : n.layer === 1 ? (n.id === 'laygrounded' ? 0.32 : 0.23) : n.layer === 2 ? 0.17 : 0.26;
    };

    const pos = nodes.map(() => new THREE.Vector3());
    const parts = nodes.map((n, i) => {
      const g = new THREE.Group();
      const ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTex, color: n.layer === 3 || n.id === 'laygrounded' ? SIGNAL : MUTED, transparent: true, depthTest: false }));
      const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreTex, color: SIGNAL, transparent: true, depthTest: false, opacity: 0 }));
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: SIGNAL, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
      ring.renderOrder = 3; core.renderOrder = 4; glow.renderOrder = 5;
      g.add(glow, ring, core);
      group.add(g);
      return { g, ring, core, glow, fire: 0, size: sizeOf(i), hover: 0 };
    });

    // ---------- edges ----------
    const curves = edges.map(() => new THREE.CubicBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()));
    const lines = edges.map(e => {
      const geo = new LineGeometry();
      geo.setPositions(new Array((SEGMENTS + 1) * 3).fill(0));
      const mat = new LineMaterial({ color: 0xe8ecf0, linewidth: 1, transparent: true, opacity: 0.18, depthTest: false });
      const line = new Line2(geo, mat);
      line.renderOrder = 1;
      group.add(line);
      return { line, geo, mat, w: e.w };
    });

    // ---------- depth cues: a dashed rail along each layer and a grid that orbits with the network ----------
    const rails = Array.from({ length: layerCount }, () => {
      const geo = new LineGeometry();
      geo.setPositions(new Array((SEGMENTS + 1) * 3).fill(0));
      const mat = new LineMaterial({ color: 0xe8ecf0, linewidth: 1, transparent: true, opacity: 0.1, dashed: true, dashSize: 0.06, gapSize: 0.1, depthTest: false });
      const line = new Line2(geo, mat);
      line.renderOrder = 0;
      group.add(line);
      return { line, geo, mat };
    });
    const grid = new THREE.GridHelper(18, 36, 0xe8ecf0, 0xe8ecf0);
    const gridMat = grid.material as THREE.LineBasicMaterial;
    gridMat.transparent = true; gridMat.opacity = 0.055; gridMat.depthWrite = false;
    grid.renderOrder = -1;
    group.add(grid);

    // ---------- signals ----------
    const headPos = new Float32Array(MAX_SIGNALS * 3);
    const headGeo = new THREE.BufferGeometry();
    headGeo.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
    const heads = new THREE.Points(headGeo, new THREE.PointsMaterial({ map: glowTex, color: SIGNAL, size: 0.16, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending }));
    const trailPos = new Float32Array(MAX_SIGNALS * TRAIL * 3);
    const trailCol = new Float32Array(MAX_SIGNALS * TRAIL * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
    const trails = new THREE.Points(trailGeo, new THREE.PointsMaterial({ map: glowTex, size: 0.09, vertexColors: true, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending }));
    heads.renderOrder = 2; trails.renderOrder = 2;
    heads.frustumCulled = false; trails.frustumCulled = false;
    group.add(trails, heads);

    // ---------- layout ----------
    let w = 1, h = 1, dist = 10, tanHalf = Math.tan(THREE.MathUtils.degToRad(16));
    const layout = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      const mobile = w < 600;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      lines.forEach(l => l.mat.resolution.set(w, h));
      rails.forEach(l => l.mat.resolution.set(w, h));

      const aspect = w / h;
      const counts = Array.from({ length: layerCount }, (_, l) => nodes.filter(n => n.layer === l).length);
      let hw: number, hh: number;
      let railAt: (l: number, u: number) => THREE.Vector3;
      if (!vertical) {
        const X = 3.4;
        const H = clamp((X + 2.4) / aspect - 0.8, 2.0, 3.4);
        nodes.forEach((n, i) => {
          const c = counts[n.layer];
          const u = c === 1 ? 0 : (n.index / (c - 1)) * 2 - 1;
          const spread = n.layer === layerCount - 1 ? 0.5 : n.layer === 2 ? 0.72 : 1;
          pos[i].set(-X + (n.layer / (layerCount - 1)) * 2 * X, -u * H * spread, 1.5 * (1 - u * u) + LAYER_Z[n.layer]);
        });
        hw = X + 2.4; hh = H + 0.75;
        railAt = (l, u) => new THREE.Vector3(-X + (l / (layerCount - 1)) * 2 * X, -u * H, 1.5 * (1 - u * u) + LAYER_Z[l]);
        grid.rotation.set(0, 0, 0);
        grid.position.set(0, -H - 0.9, 0.4);
      } else {
        const Y = 3.3;
        const W = clamp((Y + 0.9) * aspect - 0.5, 1.3, 3.0);
        nodes.forEach((n, i) => {
          const c = counts[n.layer];
          const u = c === 1 ? 0 : (n.index / (c - 1)) * 2 - 1;
          const spread = n.layer === layerCount - 1 ? 0.88 : n.layer === 2 ? 0.85 : 1;
          pos[i].set(u * W * spread, Y - (n.layer / (layerCount - 1)) * 2 * Y, 1.2 * (1 - u * u) + LAYER_Z[n.layer]);
        });
        railAt = (l, u) => new THREE.Vector3(u * W, Y - (l / (layerCount - 1)) * 2 * Y, 1.2 * (1 - u * u) + LAYER_Z[l]);
        grid.rotation.set(Math.PI / 2, 0, 0);
        grid.position.set(0, 0, -1.1);
        hw = W + 0.5; hh = Y + 1.3;
      }
      tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      dist = Math.max(hh / tanHalf + (vertical ? 1.2 : 1.9), hw / (tanHalf * aspect)) + 0.9;

      rails.forEach((r, l) => {
        const pts: number[] = [];
        for (let k = 0; k <= SEGMENTS; k++) { const q = railAt(l, -1.12 + (k / SEGMENTS) * 2.24); pts.push(q.x, q.y, q.z); }
        r.geo.setPositions(pts);
        r.line.computeLineDistances();
      });

      // Leave room under the network for the controls row.
      group.position.set(vertical ? 0 : -0.45, vertical ? 0.35 : 0.15, 0);
      gridMat.opacity = vertical ? 0.035 : 0.055;
      parts.forEach((p, i) => p.g.position.copy(pos[i]));
      edges.forEach((e, i) => {
        const a = pos[e.from], b = pos[e.to], c = curves[i];
        c.v0.copy(a); c.v3.copy(b);
        if (!vertical) {
          const mx = (a.x + b.x) / 2;
          c.v1.set(mx, a.y, a.z); c.v2.set(mx, b.y, b.z);
        } else {
          const my = (a.y + b.y) / 2;
          c.v1.set(a.x, my, a.z); c.v2.set(b.x, my, b.z);
        }
        const pts: number[] = [];
        const v = new THREE.Vector3();
        for (let k = 0; k <= SEGMENTS; k++) { c.getPoint(k / SEGMENTS, v); pts.push(v.x, v.y, v.z); }
        lines[i].geo.setPositions(pts);
      });
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(host);

    // ---------- interaction state ----------
    let hovered = -1, pinned = -1;
    let litEdges = new Set<number>(), litNodes = new Set<number>();
    // Yaw is unbounded: the network can spin all the way round. Pitch stays gentle so labels remain readable.
    let spin = 0, spinSpeed = 0, userPitch = 0, velYaw = 0, velPitch = 0, resetting = false, holdUntil = 0;
    let autoOn = true, autoT = 0;
    let parX = 0, parY = 0;
    const screen = nodes.map(() => ({ x: 0, y: 0, z: 0, depth: 1 }));

    const trace = (n: number) => {
      const es = new Set<number>(), ns = new Set<number>([n]);
      const walk = (i: number, dir: number[][], key: 'from' | 'to') => {
        for (const e of dir[i]) { if (!es.has(e)) { es.add(e); ns.add(edges[e][key]); walk(edges[e][key], dir, key); } }
      };
      walk(n, out, 'to'); walk(n, inc, 'from');
      return { es, ns };
    };
    let lastTouch = false;
    const refocus = () => {
      const f = pinned >= 0 ? pinned : hovered;
      if (f >= 0) { const t = trace(f); litEdges = t.es; litNodes = t.ns; } else { litEdges = new Set(); litNodes = new Set(); }
      labelRefs.current.forEach((el, i) => {
        if (!el) return;
        el.classList.toggle('is-on', litNodes.has(i));
        el.classList.toggle('is-dim', f >= 0 && !litNodes.has(i));
        el.classList.toggle('is-focus', i === f);
      });
      setTip(f >= 0 ? { i: f, pinned: pinned >= 0, touch: lastTouch } : null);
    };

    const go = (i: number) => {
      const href = nodes[i].href;
      if (!href) return;
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.querySelector(href)?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' });
    };

    const activate = (i: number, touch: boolean) => {
      lastTouch = touch;
      const n = nodes[i];
      if (n.href) {
        // Touch: first tap shows the card, second tap opens it. Mouse and keyboard open straight away.
        if (touch && pinned !== i) { pinned = i; refocus(); return; }
        go(i);
        return;
      }
      pinned = pinned === i ? -1 : i;
      refocus();
    };

    const hit = (x: number, y: number) => {
      let best = -1, bd = 30 * 30;
      screen.forEach((s, i) => { const d = (s.x - x) ** 2 + (s.y - y) ** 2; if (d < bd) { bd = d; best = i; } });
      return best;
    };

    // Drag to orbit (horizontal drags on touch, so vertical scrolling still works)
    let dragging = false, moved = 0, sx = 0, sy = 0, lx = 0, ly = 0, pointerId = -1, pType = 'mouse';
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      dragging = true; moved = 0; pType = e.pointerType;
      sx = lx = e.clientX; sy = ly = e.clientY; pointerId = e.pointerId;
      resetting = false;
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (dragging && e.pointerId === pointerId) {
        const dx = e.clientX - lx, dy = e.clientY - ly;
        lx = e.clientX; ly = e.clientY;
        moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy));
        if (moved > 6) {
          if (!host.hasPointerCapture(pointerId) && pType === 'mouse') host.setPointerCapture(pointerId);
          host.classList.add('is-dragging');
          velYaw = dx * 0.006; spin += velYaw;
          holdUntil = performance.now() / 1000 + 2.5;
          if (pType === 'mouse') { velPitch = dy * 0.004; userPitch += velPitch; }
        }
        return;
      }
      if (e.pointerType === 'mouse') {
        parX = x / w - 0.5; parY = y / h - 0.5;
        if ((e.target as HTMLElement).closest('.n3-label, .n3-tools')) return;
        const i = hit(x, y);
        if (i !== hovered) { hovered = i; lastTouch = false; host.style.cursor = i >= 0 ? 'pointer' : 'grab'; refocus(); }
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      host.classList.remove('is-dragging');
      if (host.hasPointerCapture(pointerId)) host.releasePointerCapture(pointerId);
      if (moved <= 6) {
        const r = host.getBoundingClientRect();
        const i = hit(e.clientX - r.left, e.clientY - r.top);
        if (i >= 0) activate(i, e.pointerType !== 'mouse');
        else if (pinned >= 0) { pinned = -1; refocus(); }
      }
    };
    const onLeave = () => { parX = parY = 0; if (hovered >= 0 && !dragging) { hovered = -1; refocus(); } };
    host.addEventListener('pointerdown', onDown);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerup', onUp);
    host.addEventListener('pointercancel', onUp);
    host.addEventListener('pointerleave', onLeave);

    // ---------- signals ----------
    const signals: Signal[] = [];
    let burstId = 0;
    const burstSeen = new Map<number, Set<number>>();
    const pick = (list: number[]) => {
      const total = list.reduce((s, e) => s + edges[e].w, 0);
      let r = Math.random() * total;
      for (const e of list) { r -= edges[e].w; if (r <= 0) return e; }
      return list[list.length - 1];
    };
    const spawn = () => {
      const starts = nodes.map((n, i) => (n.layer === 0 ? i : -1)).filter(i => i >= 0);
      const from = starts[Math.floor(Math.random() * starts.length)];
      if (out[from].length) signals.push({ edge: pick(out[from]), s: 0, speed: 0.45 + Math.random() * 0.4, burst: 0 });
      parts[from].fire = Math.max(parts[from].fire, 0.6);
    };
    // When each layer was first reached by the latest wave (seconds), for the step strip and headers.
    const layerHit = [-1, -1, -1, -1];
    let passStart = -1;
    const burst = () => {
      burstId++;
      burstSeen.set(burstId, new Set());
      passStart = performance.now() / 1000;
      layerHit.fill(-1); layerHit[0] = passStart;
      nodes.forEach((n, i) => {
        if (n.layer !== 0) return;
        parts[i].fire = 1;
        out[i].forEach(e => { if (signals.length < MAX_SIGNALS) signals.push({ edge: e, s: 0, speed: 0.9, burst: burstId }); });
      });
    };

    api.current = {
      hover: (i) => { hovered = i ?? -1; lastTouch = false; refocus(); },
      activate,
      burst,
      reset: () => { resetting = true; velYaw = velPitch = 0; holdUntil = performance.now() / 1000 + 4; pinned = -1; refocus(); },
      setAuto: (v) => { autoOn = v; },
    };

    // ---------- frame ----------
    const v = new THREE.Vector3();
    const view = new THREE.Vector3();
    let raf = 0, last = performance.now(), start = last, spawnAcc = 0, visible = true, yaw = -0.6, pitch = 0.08;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;

      // Camera dollies in while the network assembles
      const intro = ease((t - 0.1) / 2.4);
      camera.position.set(0, 0, dist * (1.4 - 0.4 * intro));
      camera.lookAt(0, 0, 0);

      if (!dragging) {
        velYaw *= 0.94; velPitch *= 0.92;
        spin += velYaw; userPitch += velPitch;
      }
      if (resetting) {
        const goal = Math.round(spin / (Math.PI * 2)) * Math.PI * 2;
        spin += (goal - spin) * Math.min(1, dt * 5);
        userPitch *= 0.88;
        if (Math.abs(goal - spin) < 0.003 && Math.abs(userPitch) < 0.002) { spin = goal; userPitch = 0; resetting = false; }
      }
      userPitch = clamp(userPitch, -0.32, 0.32);
      // Continuous 360° orbit that eases in, and pauses briefly after the visitor drags or resets.
      const autoActive = autoOn && !dragging && !resetting && now / 1000 > holdUntil && t > 2.2;
      spinSpeed += ((autoActive ? 0.17 : 0) - spinSpeed) * Math.min(1, dt * 1.5);
      if (!dragging) spin += spinSpeed * dt;
      if (autoOn && !dragging) autoT += dt;
      const targetYaw = spin + parX * 0.12 - (1 - intro) * 0.6;
      const targetPitch = userPitch + (autoOn ? Math.sin(autoT * 0.19) * 0.07 : 0) + parY * 0.08;
      const k = Math.min(1, dt * 4);
      yaw += (targetYaw - yaw) * k;
      pitch += (targetPitch - pitch) * k;
      group.rotation.set(pitch, yaw, 0);
      group.updateMatrixWorld();
      camera.updateMatrixWorld();

      // Spawn and advance signals
      if (t > 2.6) {
        spawnAcc += dt;
        while (spawnAcc > 0.12) { spawnAcc -= 0.12; if (signals.length < 70) spawn(); }
      }
      for (let i = signals.length - 1; i >= 0; i--) {
        const sg = signals[i];
        sg.s += dt * sg.speed;
        if (sg.s < 1) continue;
        const to = edges[sg.edge].to;
        parts[to].fire = 1;
        signals.splice(i, 1);
        if (sg.burst) {
          if (sg.burst === burstId && layerHit[nodes[to].layer] < 0) layerHit[nodes[to].layer] = now / 1000;
          const seen = burstSeen.get(sg.burst)!;
          if (!seen.has(to)) {
            seen.add(to);
            out[to].forEach(e => { if (signals.length < MAX_SIGNALS) signals.push({ edge: e, s: 0, speed: 0.9, burst: sg.burst }); });
          }
        } else if (out[to].length) {
          signals.push({ edge: pick(out[to]), s: 0, speed: 0.45 + Math.random() * 0.4, burst: 0 });
        }
      }
      const focus = litEdges.size > 0;
      signals.forEach((sg, i) => {
        const dim = focus && !litEdges.has(sg.edge) ? 0.25 : 1;
        curves[sg.edge].getPoint(Math.min(1, sg.s), v);
        headPos.set([v.x, v.y, v.z], i * 3);
        for (let k2 = 0; k2 < TRAIL; k2++) {
          const tt = Math.max(0, sg.s - (k2 + 1) * 0.03);
          curves[sg.edge].getPoint(tt, v);
          const o = (i * TRAIL + k2) * 3;
          trailPos[o] = v.x; trailPos[o + 1] = v.y; trailPos[o + 2] = v.z;
          const a = dim * (0.6 - k2 * 0.11);
          trailCol[o] = SIGNAL.r * a; trailCol[o + 1] = SIGNAL.g * a; trailCol[o + 2] = SIGNAL.b * a;
        }
      });
      headGeo.setDrawRange(0, signals.length);
      trailGeo.setDrawRange(0, signals.length * TRAIL);
      headGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;
      (heads.material as THREE.PointsMaterial).opacity = focus ? 0.7 : 1;

      // Project nodes for labels, hit testing and depth cueing
      const near = dist * (1.4 - 0.4 * intro);
      nodes.forEach((n, i) => {
        v.copy(pos[i]).applyMatrix4(group.matrixWorld);
        view.copy(v).applyMatrix4(camera.matrixWorldInverse);
        v.project(camera);
        const s = screen[i];
        s.x = (v.x + 1) / 2 * w; s.y = (1 - v.y) / 2 * h; s.z = view.z;
        s.depth = clamp(1 - (-view.z - (near - 1.2)) / 3.2, 0.45, 1);
      });

      // Nodes
      parts.forEach((p, i) => {
        const n = nodes[i];
        const appear = ease((t - n.born) / 0.55);
        p.fire = Math.max(0, p.fire - dt * 1.5);
        const isFocus = i === (pinned >= 0 ? pinned : hovered);
        p.hover += ((isFocus ? 1 : 0) - p.hover) * Math.min(1, dt * 10);
        const on = litNodes.has(i);
        const dim = focus && !on ? 0.28 : 1;
        const sz = p.size * appear * (1 + p.hover * 0.45);
        p.ring.scale.set(sz, sz, 1);
        (p.ring.material as THREE.SpriteMaterial).opacity = dim * screen[i].depth * appear;
        (p.ring.material as THREE.SpriteMaterial).color.copy(on || n.layer === 3 || n.id === 'laygrounded' ? SIGNAL : MUTED);
        const coreA = Math.max(n.id === 'laygrounded' ? 0.95 : 0, p.fire, p.hover);
        p.core.scale.set(sz * 0.42, sz * 0.42, 1);
        (p.core.material as THREE.SpriteMaterial).opacity = coreA * dim * appear;
        const gs = sz * (2.4 + p.fire * 2.2 + p.hover * 1.5);
        p.glow.scale.set(gs, gs, 1);
        (p.glow.material as THREE.SpriteMaterial).opacity = (p.fire * 0.55 + p.hover * 0.5 + (n.layer === 3 ? 0.12 : 0)) * dim * appear;
      });

      // Edges draw in, then light up along traced paths
      edges.forEach((e, i) => {
        const l = lines[i];
        const prog = ease((t - e.born) / 0.75);
        l.line.visible = prog > 0.001;
        l.geo.instanceCount = Math.max(1, Math.round(prog * SEGMENTS));
        const on = litEdges.has(i);
        const depth = (screen[e.from].depth + screen[e.to].depth) / 2;
        l.mat.color.copy(on ? SIGNAL : INK);
        l.mat.linewidth = on ? 2.2 : 1;
        l.mat.opacity = on ? 0.95 : (focus ? 0.05 : (0.1 + e.w * 0.1) * depth);
      });

      // HTML labels follow their nodes. Facing away, the sides mirror; edge-on, labels fade so they never pile up.
      const facing = Math.cos(yaw);
      // Projects and roles stay readable at an angle; the small skill/capability labels and headings only near face-on.
      const legibleMain = clamp((Math.abs(facing) - 0.4) / 0.3, 0, 1);
      const legibleSmall = clamp((Math.abs(facing) - 0.72) / 0.2, 0, 1);
      const legibleHead = clamp((Math.abs(facing) - 0.84) / 0.12, 0, 1);
      const f0 = pinned >= 0 ? pinned : hovered;
      labelRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = screen[i], n = nodes[i];
        const appear = ease((t - n.born - 0.15) / 0.5);
        const r = (sizeOf(i) / 2) / (Math.max(0.5, -s.z) * tanHalf) * (h / 2);
        let tf: string;
        if (vertical) tf = n.index % 2 ? `translate(-50%, calc(-100% - ${r + 6}px))` : `translate(-50%, ${r + 6}px)`;
        else if ((n.layer === 0) === (facing >= 0)) tf = `translate(calc(-100% - ${r + 10}px), -50%)`;
        else tf = `translate(${r + 10}px, -50%)`;
        el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) ${tf}`;
        const show = i === f0 || (f0 >= 0 && litNodes.has(i)) ? 1 : (n.layer === 1 || n.layer === 3 ? legibleMain : legibleSmall);
        const a = appear * (0.55 + 0.45 * s.depth) * show;
        el.style.opacity = String(a);
        el.style.pointerEvents = a < 0.15 ? 'none' : '';
      });
      headerRefs.current.forEach((el, l) => {
        if (!el) return;
        const ids = nodes.map((n, i) => (n.layer === l ? i : -1)).filter(i => i >= 0);
        if (!vertical) {
          const x = ids.reduce((a, i) => a + screen[i].x, 0) / ids.length;
          const y = Math.min(...screen.map(s => s.y)) - 44;
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateX(-50%)`;
        } else {
          const y = ids.reduce((a, i) => a + screen[i].y, 0) / ids.length - 34;
          el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        }
        el.style.opacity = String(0.9 * ease((t - 0.1) / 0.6) * legibleHead);
      });

      // Forward pass: light each step and layer heading as the wave reaches it
      const nowS = now / 1000;
      const passOn = passStart >= 0 && nowS - passStart < 6;
      if (passStart >= 0 && !passOn) { passStart = -1; layerHit.fill(-1); }
      const reached = layerHit.reduce((m, v, l) => (v >= 0 ? l : m), -1);
      passRefs.current.forEach((el, l) => {
        if (!el) return;
        el.classList.toggle('is-done', passOn && layerHit[l] >= 0);
        el.classList.toggle('is-now', passOn && l === reached);
      });
      headerRefs.current.forEach((el, l) => { el?.classList.toggle('is-live', layerHit[l] >= 0 && nowS - layerHit[l] < 1.6); });

      // Node card follows the focused node
      const f = pinned >= 0 ? pinned : hovered;
      if (tipRef.current && f >= 0) {
        const s = screen[f];
        const tw = tipRef.current.offsetWidth, th = tipRef.current.offsetHeight;
        let x = s.x + 22, y = s.y + 22;
        if (x + tw > w - 8) x = s.x - tw - 22;
        if (y + th > h - 8) y = s.y - th - 22;
        tipRef.current.style.transform = `translate3d(${clamp(x, 8, w - tw - 8).toFixed(1)}px, ${clamp(y, 8, h - th - 8).toFixed(1)}px, 0)`;
      }

      renderer.render(scene, camera);
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }, { threshold: 0 });
    io.observe(host);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerup', onUp);
      host.removeEventListener('pointercancel', onUp);
      host.removeEventListener('pointerleave', onLeave);
      api.current = null;
      lines.forEach(l => { l.geo.dispose(); l.mat.dispose(); });
      rails.forEach(l => { l.geo.dispose(); l.mat.dispose(); });
      grid.geometry.dispose(); gridMat.dispose();
      parts.forEach(p => [p.ring, p.core, p.glow].forEach(s => s.material.dispose()));
      [ringTex, coreTex, glowTex].forEach(tx => tx.dispose());
      headGeo.dispose(); trailGeo.dispose();
      (heads.material as THREE.Material).dispose(); (trails.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [net, vertical]);

  const node = tip ? net.nodes[tip.i] : null;
  const hint = !node || !tip ? '' :
    node.layer === 1 ? (tip.touch ? 'Tap again to open the project' : 'Click to open the project') :
    node.layer === 3 ? (tip.touch ? 'Tap again to get in touch' : 'Click to get in touch') :
    tip.pinned ? 'Path pinned · click again to release' : 'Click to pin this path';

  return (
    <div className={`net3d${vertical ? ' is-vertical' : ''}`} ref={wrap} role="group" aria-label="Interactive network: skills feed projects, projects feed capabilities, capabilities feed roles">
      <div className="n3-headers" aria-hidden>
        {LAYER_NAMES.map((l, i) => <span key={l} ref={el => { headerRefs.current[i] = el; }}>{l}</span>)}
      </div>
      <div className="n3-labels">
        {net.nodes.map((n, i) => (
          <button key={`${n.layer}-${n.id}`} type="button" ref={el => { labelRefs.current[i] = el; }}
            className={`n3-label l${n.layer}${n.id === 'laygrounded' ? ' is-flag' : ''}`}
            aria-label={`${n.label}. ${n.sub}`}
            onPointerEnter={e => { if (e.pointerType === 'mouse') api.current?.hover(i); }}
            onPointerLeave={e => { if (e.pointerType === 'mouse') api.current?.hover(null); }}
            onFocus={() => api.current?.hover(i)}
            onBlur={() => api.current?.hover(null)}
            onClick={e => api.current?.activate(i, (e.nativeEvent as PointerEvent).pointerType === 'touch')}>
            {n.label}
          </button>
        ))}
      </div>
      <div className={`n3-tip${node ? ' is-on' : ''}`} ref={tipRef} aria-hidden={!node}>
        {node && (
          <>
            <span className="n3-tip-layer">{LAYER_NAMES[node.layer]}</span>
            <b>{node.label}</b>
            <p>{node.sub}</p>
            <span className="n3-tip-hint">{hint}</span>
          </>
        )}
      </div>
      <div className="n3-tools">
        <p className="n3-pass" aria-hidden>
          {LAYER_NAMES.map((l, i) => (
            <React.Fragment key={l}>
              {i > 0 && <ChevronRight size={12} aria-hidden />}
              <span ref={el => { passRefs.current[i] = el; }}>{l}</span>
            </React.Fragment>
          ))}
        </p>
        <button type="button" className="n3-tool" onClick={() => api.current?.burst()}
          title="Send one signal from every skill through every connection, layer by layer, to the roles"
          aria-label="Run a forward pass: one signal wave from every skill, through every project and capability, to the roles">
          <Zap size={15} aria-hidden /> Run forward pass
        </button>
        <button type="button" className="n3-tool" aria-pressed={auto} onClick={() => { const v = !auto; setAuto(v); api.current?.setAuto(v); }}><Rotate3d size={15} aria-hidden /> Auto-orbit</button>
        <button type="button" className="n3-tool" onClick={() => api.current?.reset()}><RotateCcw size={15} aria-hidden /> Reset</button>
      </div>
    </div>
  );
};

export default Neural3D;
