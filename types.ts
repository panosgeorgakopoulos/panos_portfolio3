export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  techStack: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link?: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Databases' | 'Software Development';
}

export interface Socials {
  github: string;
  linkedin: string;
  twitter: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  socials: Socials;
}