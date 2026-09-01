/**
 * Single source of truth for all site content.
 *
 * Transcribed from Georgakopoulos_CV.docx. When the CV changes, change this
 * file — components read from it and should never hard-code copy.
 */
import type {
  Certification,
  EducationEntry,
  Experience,
  LanguageEntry,
  PipelineStage,
  Project,
  ResumeData,
  SkillGroup,
  Stat,
} from './types';

export const RESUME_DATA: ResumeData = {
  name: 'Panos Georgakopoulos',
  fullName: 'Panagiotis Sergios Georgakopoulos',
  title: 'Software Engineer · Applied AI',
  tagline: 'Backend systems, machine learning and the AI products built on top of them.',
  summary:
    'Fourth-year Computer Science student at the University of Piraeus (GPA 8.0/10 · 185 ECTS · 37 of 37 courses passed) working in software engineering and applied AI — backend services, data pipelines and the machine-learning and LLM systems that sit on them. My current project is an AI laytime and demurrage engine for dry bulk chartering, which has also given me working command of charter party terms, Statements of Facts and voyage operations.',
  location: 'Athens, Greece',
  email: 'pangegeorg@gmail.com',
  phone: '+30 694 716 5007',
  availability:
    'Seeking a software engineering, AI/ML, data or product engineering internship — any industry.',
  availabilityBadge: 'Open to internships',
  availabilityNote: 'Maritime software is where I work today, not where I am limited to.',
  socials: {
    github: 'https://github.com/panosgeorgakopoulos',
    linkedin: 'https://linkedin.com/in/panosgeorgakopoulos',
    x: 'https://x.com/panosgeorgakop7',
    website: 'https://panosgeorgakopoulos.gr',
  },
};

/**
 * Accent colours are semantic, not decorative — keep them that way:
 *   cyan   engineering, platform, the primary call to action
 *   purple AI and machine learning
 *   green  product, domain knowledge, credentials
 */

/** Headline figures. Every value here must be traceable to the CV. */
export const STATS: Stat[] = [
  { value: '8.0', label: 'GPA / 10', accent: 'cyan' },
  { value: '185', label: 'ECTS earned', accent: 'cyan' },
  { value: '37/37', label: 'Courses passed', accent: 'green' },
  { value: '3', label: 'Languages', accent: 'green' },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'laygrounded',
    role: 'Founder & Lead Engineer',
    company: 'LayGrounded',
    period: 'Jul 2026 — Present',
    subtitle: 'AI laytime & demurrage claims engine for dry bulk chartering',
    current: true,
    bullets: [
      'Shipped a vision-language document pipeline that extracts port events from PDF Statements of Facts as editable, source-traceable suggestions, with schema-validated output and automatic model fallback for resilience.',
      'Implemented a deterministic, dependency-pure rules engine covering GENCON 94 and ASBATANKVOY charter terms — notice validity, timezone-aware exclusion periods, weather and shifting exceptions, demurrage triggers — published as a standalone open-source package and reproducible under counterparty scrutiny.',
      'Architected the full multi-tenant stack solo (RLS-enforced tenancy, Dockerised production build), adding clause flagging by severity, time-bar tracking, sensitivity analysis, and LLM-drafted claim correspondence with source citations.',
      'Extending into independent verification of claimed facts — weather archive cross-checks, AIS vessel movement, and sanctions screening — so each line of a claim is backed by third-party evidence rather than the counterparty’s own SOF.',
    ],
    techStack: ['Next.js 16', 'Supabase', 'PostgreSQL', 'Gemini Vision', 'Docker'],
  },
  {
    id: 'uniai',
    role: 'Expertise Member',
    company: 'UniAI',
    period: 'Jan 2026 — Present',
    current: true,
    bullets: [
      'Contribute to research and initiatives promoting responsible AI adoption, including organising open-to-all university hackathons (Makeathon).',
      'Manage all information, notes and materials for the open events run throughout the year to promote AI and its responsible use cases.',
    ],
    techStack: ['Responsible AI', 'Research', 'Community'],
  },
  {
    id: 'ifg',
    role: 'Administrative Secretary',
    company: 'Institut français de Grèce',
    period: 'Sep — Oct 2025',
    bullets: [
      'Bilingual FR/EL support across institutional correspondence, document management and internal administrative workflows.',
    ],
    techStack: ['FR/EL Bilingual', 'Document Management', 'Operations'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'nexus',
    title: 'NEXUS',
    subtitle: 'Real Estate Matching Platform',
    accent: 'cyan',
    bullets: [
      'Engineered a scoring engine ranking properties 0–100 across budget, location, size and lifestyle criteria, served through role-based REST APIs (BUYER/OWNER/ADMIN) over a purpose-designed 10+ table schema.',
      'Built a rule-based NLP query parser and Leaflet.js heatmap, reducing free-text searches to structured filters with no external ML dependency.',
    ],
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'JWT'],
  },
  {
    id: 'island-drive',
    title: 'Island Drive Rentals',
    subtitle: 'Vehicle Rental Platform',
    accent: 'green',
    bullets: [
      'Delivered a production booking platform with RBAC, a dynamic pricing engine and atomic booking transactions.',
      'Integrated Stripe Checkout validated by webhook integrity checks, with i18n coverage across 8 languages.',
    ],
    tags: ['Next.js 15', 'TypeScript', 'Prisma', 'Stripe'],
  },
  {
    id: 'risk-classifier',
    title: 'Financial Transaction Risk Classifier',
    subtitle: 'Applied ML Pipeline',
    accent: 'purple',
    bullets: [
      'Built a leak-proof classification pipeline (feature engineering, scaling, one-hot encoding, log transforms).',
      'Structured it as a modular four-layer architecture that allows classifiers to be swapped without touching business logic.',
    ],
    tags: ['Python', 'Scikit-learn'],
  },
  {
    id: 'cyberbus',
    title: 'CYBERBUS',
    subtitle: 'Smart Transit PWA',
    accent: 'purple',
    bullets: [
      'Developed a progressive web app with separate passenger and driver interfaces.',
      'Integrated Gemini Vision for real-time landmark recognition and a conversational guide, with no dedicated ML backend.',
    ],
    tags: ['Node.js', 'Express', 'Gemini Vision AI', 'PWA'],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    accent: 'cyan',
    items: ['Java', 'Python', 'TypeScript', 'C#', 'SQL'],
  },
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    accent: 'purple',
    items: [
      'Scikit-learn',
      'Vision-language document extraction',
      'Gemini Vision',
      'Anthropic Claude API',
      'LLM output validation',
      'Leak-proof ML pipelines',
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Data',
    accent: 'cyan',
    items: [
      'Spring Boot',
      'FastAPI',
      'Node.js',
      'REST APIs',
      'PostgreSQL',
      'MySQL',
      'Prisma ORM',
      'JDBC',
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    accent: 'cyan',
    items: ['React', 'Next.js', 'TanStack Start', 'Tailwind CSS'],
  },
  {
    id: 'platform',
    label: 'Platform & Tooling',
    accent: 'cyan',
    items: ['Docker', 'Git', 'Maven', 'Supabase', 'Cloudflare Workers'],
  },
  {
    id: 'maritime',
    label: 'Maritime Domain',
    accent: 'green',
    items: [
      'Charter party laytime & demurrage',
      'GENCON 94',
      'Statements of Facts',
      'Voyage operations',
    ],
  },
];

/**
 * How LayGrounded turns a scanned Statement of Facts into a defensible claim.
 * Every stage is drawn from the LayGrounded bullets above — nothing here
 * describes work that the CV does not.
 */
export const PIPELINE: PipelineStage[] = [
  {
    id: 'intake',
    label: 'Intake',
    title: 'A scanned Statement of Facts arrives',
    body: 'The port agent sends a PDF — often a photocopy of a fax. Every hour of laytime in the eventual claim traces back to this one document.',
    tags: ['PDF', 'Multi-tenant intake'],
    accent: 'green',
  },
  {
    id: 'extract',
    label: 'Extract',
    title: 'A vision-language model reads the port events',
    body: 'Events come back as editable, source-traceable suggestions rather than silent overwrites. Output is schema-validated, and the model falls back automatically if a call fails.',
    tags: ['Gemini Vision', 'Schema validation', 'Model fallback'],
    accent: 'purple',
  },
  {
    id: 'compute',
    label: 'Compute',
    title: 'A deterministic rules engine applies the charter party',
    body: 'NOR validity, timezone-aware SHEX/SSHEX exclusions, weather and shifting exceptions, once on demurrage. Dependency-pure, so the same inputs always produce the same statement.',
    tags: ['GENCON 94', 'ASBATANKVOY', 'Open source'],
    accent: 'cyan',
  },
  {
    id: 'verify',
    label: 'Verify',
    title: 'Third-party evidence checks the counterparty',
    body: 'Weather archives, AIS vessel movement and sanctions screening test the claimed facts independently — so a line is backed by evidence, not just by the other side’s own SOF.',
    tags: ['Weather archive', 'AIS', 'Sanctions screening'],
    accent: 'green',
  },
  {
    id: 'claim',
    label: 'Claim',
    title: 'The claim drafts itself, with citations',
    body: 'Clause flagging by severity, time-bar tracking and sensitivity analysis feed an LLM-drafted letter that cites the source line behind every figure.',
    tags: ['Time-bar tracking', 'Sensitivity analysis', 'Cited drafting'],
    accent: 'purple',
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    id: 'piraeus',
    institution: 'University of Piraeus',
    degree: 'BSc Computer Science',
    period: 'Sep 2023 — Present',
    details: [
      'GPA 8.0/10 · 185 ECTS · 37 of 37 courses passed',
      'Algorithms · Databases · Operating Systems · Networks · Software Engineering',
    ],
  },
  {
    id: 'leonin',
    institution: 'Lycée Léonin, Nea Smyrni',
    degree: 'Baccalauréat Hellénique',
    period: '2020 — 2023',
    details: ['Final grade 19.2/20', 'Mention Très Bien'],
  },
];

export const CERTIFICATIONS: Certification[] = [
  { name: 'Claude 101', issuer: 'Anthropic', year: '2026' },
  { name: 'AI Skills Passport', issuer: 'EY', year: '2026' },
  { name: 'Responsible AI', issuer: 'Microsoft', year: '2026' },
];

export const LANGUAGES: LanguageEntry[] = [
  { name: 'Greek', level: 'Native' },
  { name: 'English', level: 'C2' },
  { name: 'French', level: 'B2' },
];

export const NAV_ITEMS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Process', href: '#process' },
  { label: 'Stack', href: '#skills' },
  { label: 'Work', href: '#projects' },
  { label: 'Education', href: '#education' },
] as const;
