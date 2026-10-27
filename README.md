# panosgeorgakopoulos.gr

Personal site of Panos Georgakopoulos, AI engineer.

The hero is a live 3D neural network (three.js, loaded lazily, with a 2D canvas fallback for reduced motion or no WebGL), built from the actual portfolio: skills feed projects, projects feed capabilities, capabilities feed the roles being sought. It assembles on load and keeps running forward passes. Drag to orbit, hover or tap a node to trace its path and open its card, click a skill or capability to pin it, or fire a full forward pass. Under the thesis **models propose, code decides**, each project section shows a working piece:

- **LayGrounded** (flagship, confidential): an abstract pipeline animation of the principle only.
- **Sophie**: an "ask about me" box that answers only from approved facts and abstains otherwise.
- **MedBot**: a simulation of the three-layer language routing and the planner's checks.
- **Nexus**: drag the scoring weights and watch listings re-rank.
- **Metascribe**: a guided tour of the real review screen.
- **Panhellenic**: an admission-probability slider on synthetic cutoffs.

## Stack

React 19, TypeScript, Vite, three.js, hand-written CSS and canvas, Archivo and JetBrains Mono (self-hosted), lucide-react icons. No UI framework.

## Structure

```
App.tsx              page order
constants.ts         all content: profile, skills, projects, more work, record, approved facts
lib/net.ts           hero network graph and layout
lib/ask.ts           approved-facts matcher with abstention
lib/medbot.ts        toy re-creation of MedBot routing and planner
lib/admission.ts     logistic admission probability
components/          Hero, Neural3D, NeuralCanvas, LatentField, PassRail, ProjectSection, MoreWork, RecordSection, Contact, demos/
public/captures/     screenshots of the running apps (synthetic sample data)
```

## Develop and deploy

```
npm install
npm run dev
npm run deploy   # builds and publishes dist/ to gh-pages
```
