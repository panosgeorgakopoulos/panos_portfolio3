import { Profile, Project, MoreItem, Fact, Record, SkillNode } from './types';

const GH = 'https://github.com/panosgeorgakopoulos';

export const PROFILE: Profile = {
  name: 'Panos Georgakopoulos',
  role: 'AI Engineer',
  status: 'CS student',
  location: 'Athens, Greece',
  email: 'pangegeorg@gmail.com',
  socials: {
    github: 'github.com/panosgeorgakopoulos',
    linkedin: 'linkedin.com/in/panagiotis-sergios-georgakopoulos/',
    twitter: 'x.com/panosgeorgakop7',
  },
  availability: 'Open to full-time AI and software engineering roles, and selected contract builds',
};

// Input layer of the hero network.
export const SKILLS: SkillNode[] = [
  { id: 'llm', label: 'LLMs' },
  { id: 'retrieval', label: 'Retrieval' },
  { id: 'ml', label: 'Classical ML' },
  { id: 'ts', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java / Spring' },
  { id: 'postgres', label: 'PostgreSQL' },
];

// Output layer of the hero network.
export const ROLES = ['AI Engineer', 'Founding Engineer', 'Software Engineer'];

export const PROJECTS: Project[] = [
  {
    slug: 'laygrounded',
    title: 'LayGrounded',
    kind: 'GenAI claims platform · Founder',
    year: '2026',
    visibility: 'private',
    summary:
      'A multi-tenant platform for laytime and demurrage claims in shipping. Teams assemble the voyage record, confirm the inputs, and get results they can reproduce and defend. AI reads the documents and drafts correspondence; deterministic rules produce every figure. It is pre-revenue and handles confidential commercial data, so the pipeline here is an abstract sketch rather than the product.',
    facts: [
      '649 commits',
      'Deterministic calculation engine with clause-level references',
      'AI extraction stays a suggestion until a person confirms it',
      'Results a counterparty can reproduce independently',
      'Multi-tenant access control, built for audit',
    ],
    boundary: {
      model: 'Reads documents and drafts correspondence. Proposes; never decides.',
      code: 'Computes every figure and checks every draft against the confirmed record.',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'Bun', 'Postgres', 'Gemini'],
    skills: ['llm', 'ts', 'postgres'],
    demo: 'pipeline',
    captures: [],
  },
  {
    slug: 'sophie',
    title: 'Sophie',
    kind: 'Verified information assistant',
    year: '2026',
    visibility: 'public',
    link: `${GH}/sophie`,
    summary:
      'An independent assistant that answers questions about the Institut Français de Grèce in Greek, French and English, built on the institute’s public information. Public answers come only from approved facts, shown with their source and evidence quote; when evidence is missing, conflicting or ambiguous, Sophie abstains or asks a clarifying question. It is not an official IFG product and is not in official use.',
    facts: [
      'Contacts, dates, fees and addresses rendered without a model',
      'Hybrid retrieval: pgvector halfvec dense search plus Postgres full-text, fused by reciprocal rank',
      'Ingestion crawler with robots rules, allowlisted HTTPS, private-DNS and redirect rejection',
      'Immutable versioned content; uploads scanned by ClamAV before parsing',
      'Separate read-only database role limited to two public views',
    ],
    boundary: {
      model: 'May select approved fact IDs for policy questions. Never writes the displayed answer.',
      code: 'Alias resolution, validity checks and deterministic rendering decide what is shown.',
    },
    stack: ['TypeScript', 'PostgreSQL', 'pgvector', 'Full-text search', 'Docker'],
    skills: ['llm', 'retrieval', 'ts', 'postgres'],
    demo: 'sophie',
    captures: [],
  },
  {
    slug: 'medbot',
    title: 'MedBot',
    kind: 'Grounded language system',
    year: '2026',
    visibility: 'public',
    link: `${GH}/MedBot`,
    summary:
      'A natural-language interface for a Greek hospital microworld, after Winograd’s SHRDLU. Commands route through three layers of understanding, then a deterministic planner checks clinical constraints before anything in the world changes.',
    facts: [
      'Layer 1: regex templates and alias matching',
      'Layer 2: Logistic Regression intent classifier and CRF slot tagger',
      'Layer 3: multilingual MiniLM embeddings for out-of-vocabulary phrasing',
      'Planner checks expiry dates, stock levels and role permissions',
      'Pronoun resolution across turns, clarification questions, PHI redaction in logs',
    ],
    boundary: {
      model: 'Learned models only resolve what the user meant.',
      code: 'The planner decides whether the action is allowed and applies it to the world state.',
    },
    stack: ['Python', 'scikit-learn', 'CRF', 'Transformers', 'Gradio', 'pytest'],
    skills: ['ml', 'python', 'llm'],
    demo: 'medbot',
    captures: [],
  },
  {
    slug: 'nexus',
    title: 'Nexus',
    kind: 'Real-estate matching platform',
    year: '2026',
    visibility: 'private',
    summary:
      'A property platform that scores every listing against each buyer’s preferences. A weighted engine combines budget, location, size and lifestyle fit; admins tune the weights, and a scheduled job re-scores every buyer each hour. Viewing history feeds an interest heatmap.',
    facts: [
      'Weighted multi-criteria scoring: budget, location, size, lifestyle',
      'Admin-tunable weights, recorded with who changed them and when',
      'Hourly batch re-scoring for all buyers',
      'JWT authentication, dynamic search specifications, map view',
    ],
    boundary: {
      model: 'No learned model: a transparent scoring function.',
      code: 'Each criterion is its own calculator; the engine combines them with explicit weights.',
    },
    stack: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'PostgreSQL', 'Leaflet'],
    skills: ['java', 'postgres'],
    demo: 'nexus',
    captures: [],
  },
  {
    slug: 'metascribe',
    title: 'Metascribe',
    kind: 'Handwritten physics to Typst',
    year: '2026',
    visibility: 'private',
    summary:
      'Transcribes handwritten Greek physics notebooks into Typst with vision models, then puts every page through review before export. Runs entirely in the browser: no server, no proxy, and API keys never leave session memory.',
    facts: [
      'Anthropic, OpenAI and Gemini providers with key validation and bounded, rate-limit-aware retries',
      'Sequential FIFO queue with stop and resume',
      'Typst compiled in-browser via WASM; CeTZ diagrams; crop-box review',
      'Exports a runnable Typst project ZIP or a faithful DOCX',
      'Playwright end-to-end tests',
    ],
    boundary: {
      model: 'Vision models propose the transcription of each page or crop.',
      code: 'A person compares scan and compiled output and flags uncertainty before a page counts as done.',
    },
    stack: ['React', 'TypeScript', 'PDF.js', 'CodeMirror 6', 'IndexedDB', 'typst.ts WASM'],
    skills: ['llm', 'ts'],
    demo: 'metascribe',
    captures: [
      { src: '/captures/metascribe-review.jpg', alt: 'Metascribe review screen: handwritten notebook scan on the left with a crop box around a diagram, compiled Typst page on the right', caption: 'Review screen, running the built-in synthetic sample. Scan left, compiled Typst right.', width: 1600, height: 1000 },
    ],
  },
  {
    slug: 'panhellenic',
    title: 'Panhellenic',
    kind: 'Probabilistic admissions model',
    year: '2026',
    visibility: 'public',
    link: `${GH}/panhellenic`,
    summary:
      'Replaces the “points calculator” for Greek university entrance exams with a probability of admission, using historical cutoffs, their volatility and multi-year trend, and explains every result in plain language.',
    facts: [
      'Logistic admission probability from historical score distributions',
      'Volatility index (standard deviation of past cutoffs) widens the risk margin',
      'Z-score badges against national statistics',
      'Explainable waterfall breakdown per department',
    ],
    boundary: {
      model: 'A transparent statistical model, not a black box.',
      code: 'A Python pipeline builds the data; the browser does the maths.',
    },
    stack: ['JavaScript', 'Python', 'Chart.js'],
    skills: ['ml', 'python'],
    demo: 'panhellenic',
    captures: [
      { src: '/captures/panhellenic-explain.jpg', alt: 'Panhellenic explainable prediction dashboard with a 99% admission probability and a plain-language explanation', caption: 'Explainable prediction for one department.', width: 1600, height: 833 },
      { src: '/captures/panhellenic-results.jpg', alt: 'Panhellenic results table listing departments with point margins and certainty badges', caption: 'Results across departments for a sample set of grades.', width: 1600, height: 1000 },
    ],
  },
];

export const MORE: MoreItem[] = [
  { title: 'CYBERBUS', note: 'Smart tour-bus PWA. Gemini Vision AR landmark scanner, voice tour guide, driver telemetry dashboard.', stack: ['Node', 'Express', 'Gemini', 'Leaflet'], year: '2026', visibility: 'live', link: 'https://cyberbus-lew7.onrender.com', capture: { src: '/captures/cyberbus-tour.jpg', alt: 'CYBERBUS passenger dashboard on the Tour & View tab: route progress to the Panathenaic Stadium, AR camera panel and next-stop card', caption: 'Passenger dashboard, Tour & View.', width: 1600, height: 797 } },
  { title: 'Marine Heatwave Predictor', note: 'French Hackathon at IFG. XGBoost on ocean temperature data to warn aquaculture producers.', stack: ['Python', 'XGBoost', 'Xarray'], year: '2025', visibility: 'public', link: `${GH}/HackathonChallenge1` },
  { title: 'Island Drive Rentals', note: 'Car rental platform. 8 languages, RBAC, Stripe webhooks, atomic booking transactions.', stack: ['Next.js 15', 'Prisma', 'Stripe'], year: '2026', visibility: 'public', link: `${GH}/island-drive-rentals` },
  { title: 'Transaction Risk', note: 'High-risk transaction classifier in a leak-free scikit-learn pipeline.', stack: ['Python', 'scikit-learn'], year: '2026', visibility: 'public', link: `${GH}/transaction-analysis-backend` },
  { title: 'Healthcare Management', note: 'Patients, doctors and admins; booking with a 3-day cancellation rule; BCrypt auth.', stack: ['Java', 'Servlets', 'MySQL'], year: '2025', visibility: 'public', link: `${GH}/Healthcare-Management-System` },
];

export const RECORD: Record[] = [
  {
    period: 'Jul 2026 – Present',
    role: 'Founder & Lead Engineer',
    org: 'LayGrounded',
    tagline: 'GenAI claims platform for dry-bulk chartering · Next.js 16 · Supabase/PostgreSQL · Gemini vision · Docker',
    points: [
      'Shipped an end-to-end generative AI document pipeline: a vision-language model extracts port events from PDF Statements of Facts as editable, source-traceable suggestions, with schema-validated structured output and automatic model fallback for resilience.',
      'Designed a hybrid architecture where the LLM proposes and a deterministic, dependency-pure rules engine decides. It covers GENCON 94 and ASBATANKVOY (NOR validity, timezone-aware SHEX/SSHEX, weather and shifting exceptions), is published as an open-source package, and is reproducible under counterparty scrutiny.',
      'Architected the full multi-tenant stack solo (RLS-enforced tenancy, Dockerised production build), adding LLM-drafted claim correspondence with source citations, clause flagging by severity, time-bar tracking and sensitivity analysis.',
      'Gathered requirements from industry contacts and turned them into application logic; integrated external systems (weather archives, AIS vessel movements, sanctions screening) so every AI-extracted fact is checked against third-party evidence.',
    ],
  },
  {
    period: 'Jan 2026 – Present',
    role: 'Expertise Member',
    org: 'UniAI',
    points: [
      'Contribute to research and initiatives promoting responsible AI adoption, including organising open-to-all university hackathons (Makeathon) and managing the information, notes and materials for open events that showcase AI and its responsible use.',
    ],
  },
  {
    period: 'Sep – Oct 2025 · Sep – Oct 2026',
    role: 'Administrative Secretary',
    org: 'Institut français de Grèce',
    points: [
      'Customer-facing administrative role: communication with students and staff, event preparation and documentation workflows.',
    ],
  },
  {
    period: 'Ongoing',
    role: 'Student · Athens',
    org: 'Computer Science',
    points: ['Coursework in ML, NLP, web systems and databases, alongside the work above.'],
  },
];

export const STACK: { group: string; items: string[] }[] = [
  { group: 'AI / ML', items: ['LLM apps (Claude, GPT, Gemini)', 'Hybrid retrieval', 'pgvector', 'Vision transcription', 'scikit-learn', 'XGBoost', 'Transformers', 'CRF', 'MCP'] },
  { group: 'Product engineering', items: ['TypeScript', 'React 19', 'Next.js', 'Node', 'Bun', 'Python', 'Java / Spring Boot'] },
  { group: 'Data & infra', items: ['PostgreSQL', 'Supabase', 'Row-level security', 'Docker', 'Vercel', 'Playwright', 'pytest'] },
];

// Approved facts for the "ask" demo. Answers are fixed strings; matching only selects one.
export const FACTS: Fact[] = [
  { id: 'role', answer: 'Panos is an AI engineer and CS student in Athens who builds grounded AI systems: models propose, deterministic code decides.', source: 'Profile', keywords: ['who', 'what', 'do', 'role', 'about', 'panos', 'engineer', 'job', 'title'] },
  { id: 'available', answer: 'Yes. He’s open to full-time AI and software engineering roles (early-stage startups especially) and selected contract builds.', source: 'Profile', keywords: ['available', 'hire', 'hiring', 'open', 'role', 'job', 'freelance', 'contract', 'work', 'remote', 'full-time', 'fulltime'] },
  { id: 'experience', answer: 'Founder & lead engineer of LayGrounded since July 2026, Expertise Member at UniAI since January 2026, and a customer-facing role at the Institut français de Grèce.', source: 'Record', keywords: ['experience', 'worked', 'founder', 'founded', 'uniai', 'career', 'background', 'cv', 'resume', 'startup'] },
  { id: 'contact', answer: 'Email pangegeorg@gmail.com, or LinkedIn.', source: 'Contact', keywords: ['contact', 'email', 'reach', 'mail', 'talk', 'call', 'linkedin', 'message'] },
  { id: 'biggest', answer: 'LayGrounded: a multi-tenant maritime claims platform, 649 commits. It’s confidential, so the details stay off the page.', source: 'LayGrounded', keywords: ['biggest', 'largest', 'best', 'main', 'proud', 'flagship', 'laygrounded', 'maritime', 'laytime', 'demurrage'] },
  { id: 'rag', answer: 'Yes. Sophie uses hybrid retrieval (pgvector dense plus Postgres full-text, fused by reciprocal rank) but only shows approved facts, and abstains when evidence is missing.', source: 'Sophie', keywords: ['rag', 'retrieval', 'vector', 'embedding', 'embeddings', 'search', 'chatbot', 'sophie', 'hallucination', 'hallucinate'] },
  { id: 'llms', answer: 'He has shipped with Claude, GPT and Gemini: vision transcription (Metascribe), extraction and drafting (LayGrounded), and a vision AR scanner (CYBERBUS).', source: 'Metascribe, CYBERBUS', keywords: ['llm', 'llms', 'gpt', 'claude', 'gemini', 'openai', 'anthropic', 'model', 'models', 'vision', 'ai'] },
  { id: 'agents', answer: 'He has built MCP and OpenAPI integrations and signed webhooks for agent and ERP access, in a confidential product.', source: 'LayGrounded', keywords: ['agent', 'agents', 'mcp', 'tool', 'tools', 'api', 'openapi', 'webhook', 'integration'] },
  { id: 'nlp', answer: 'MedBot routes language through regex rules, then Logistic Regression and a CRF tagger, then multilingual embeddings, with a planner that enforces clinical constraints.', source: 'MedBot', keywords: ['nlp', 'nlu', 'language', 'medbot', 'classifier', 'crf', 'intent', 'shrdlu', 'greek'] },
  { id: 'stack', answer: 'TypeScript, React, Next.js, Node and Bun on the product side; Python, scikit-learn and Transformers for ML; Java and Spring Boot; PostgreSQL and Docker underneath.', source: 'Stack', keywords: ['stack', 'tech', 'language', 'languages', 'typescript', 'python', 'react', 'next', 'framework', 'tools', 'skills'] },
  { id: 'backend', answer: 'Yes: Postgres with separated read roles, migrations with a checksum ledger, ingestion pipelines, and Spring Boot services with scheduled batch jobs.', source: 'Sophie, Nexus', keywords: ['backend', 'database', 'postgres', 'sql', 'java', 'spring', 'server', 'infra', 'security'] },
  { id: 'languages', answer: 'Greek and English, plus French: Sophie answers in all three.', source: 'Record', keywords: ['speak', 'french', 'english', 'spoken', 'fluent', 'multilingual'] },
  { id: 'where', answer: 'Athens, Greece.', source: 'Profile', keywords: ['where', 'location', 'based', 'live', 'city', 'country', 'relocate', 'relocation', 'timezone'] },
  { id: 'student', answer: 'He’s a Computer Science student, building production systems alongside his degree.', source: 'Record', keywords: ['student', 'study', 'degree', 'university', 'school', 'education', 'graduate', 'graduation'] },
];

// Topics with deliberately no approved fact.
export const ABSTAIN_TOPICS = ['salary', 'rate', 'price', 'age', 'old', 'married', 'religion', 'politics', 'gpa', 'grades', 'visa', 'phone'];
