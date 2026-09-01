/**
 * Content model for the portfolio.
 *
 * Everything rendered on the page is derived from `constants.ts`, which is the
 * single source of truth and is kept in sync with Georgakopoulos_CV.docx.
 * Components render this data; they never hard-code copy.
 */

/** Accent colour token, mapped to concrete classes in `components/accents.ts`. */
export type Accent = 'cyan' | 'purple' | 'green';

export interface Socials {
  github: string;
  linkedin: string;
  x: string;
  website: string;
}

export interface ResumeData {
  /** Display name used in the hero and nav. */
  name: string;
  /** Legal name, used for structured data and the CV download. */
  fullName: string;
  /** Primary professional label. */
  title: string;
  /** One-line hook shown under the title. */
  tagline: string;
  /** CV summary paragraph. */
  summary: string;
  location: string;
  email: string;
  phone: string;
  /** What the site visitor is being asked for. */
  availability: string;
  /** Short badge form of `availability`, for the hero and contact pills. */
  availabilityBadge: string;
  /** Follow-on sentence that widens the ask beyond one industry. */
  availabilityNote: string;
  socials: Socials;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  /** Context line under the company (stack, product one-liner). */
  subtitle?: string;
  /** Achievement bullets, in CV order. */
  bullets: string[];
  techStack: string[];
  /** Renders the "current" pulse indicator on the timeline. */
  current?: boolean;
}

export interface Project {
  id: string;
  title: string;
  /** Short descriptor shown beside the title. */
  subtitle: string;
  bullets: string[];
  tags: string[];
  link?: string;
  accent: Accent;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
  accent: Accent;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  period: string;
  details: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface LanguageEntry {
  name: string;
  level: string;
}

export interface Stat {
  value: string;
  label: string;
  accent: Accent;
}
