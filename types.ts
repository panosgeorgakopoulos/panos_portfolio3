export type Visibility = 'public' | 'private' | 'live';

export interface Socials {
  github: string;
  linkedin: string;
  twitter: string;
}

export interface Profile {
  name: string;
  role: string;
  status: string;
  location: string;
  email: string;
  socials: Socials;
  availability: string;
}

export type DemoKind = 'pipeline' | 'sophie' | 'medbot' | 'nexus' | 'metascribe' | 'panhellenic';

export interface Capture {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  kind: string;          // what it is, in a few words
  year: string;
  visibility: Visibility;
  link?: string;         // public repo or live URL; never set for private repos
  summary: string;
  facts: string[];       // verifiable specifics
  boundary: {            // where the model stops and deterministic code begins
    model: string;
    code: string;
  };
  stack: string[];
  skills: string[];      // ids of network input nodes this project draws on
  demo: DemoKind;
  captures: Capture[];
}

export interface MoreItem {
  title: string;
  note: string;
  stack: string[];
  year: string;
  visibility: Visibility;
  link?: string;
  capture?: Capture;
}

export interface Fact {
  id: string;
  answer: string;
  source: string;        // project or record it rests on
  keywords: string[];
}

export interface Record {
  period: string;
  role: string;
  org: string;
  tagline?: string;
  points: string[];
}

export interface SkillNode {
  id: string;
  label: string;
}
