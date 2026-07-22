// src/types.ts

export interface NavLink {
  text: string;
  href: string;
}

export interface SocialLink {
  text: string;
  href: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string[];
  technologies: string[];
}

export interface ProjectItem {
  name: string;
  summary: string;
  linkPreview: string;
  linkSource: string;
  image: string;
  tags: string[];
}

export interface Skills {
  backend: string[];
  frontend: string[];
  database: string[];
  devops: string[];
  ai: string[];
}

export interface HeroContent {
  name: string;
  specialty: string;
  summary: string;
  email: string;
  availability: string;
  location: string;
}

export interface AboutContent {
  description: string;
  image: string;
}

export interface SiteContent {
  hero: HeroContent;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  about: AboutContent;
  skills: Skills;
}

export interface SiteConfig {
  title: string;
  author: string;
  description: string;
  keywords: string[];
  lang: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  socialImage: string;
  canonicalURL: string;
}

// i18n types
export type Locale = "en" | "fr";

export interface TranslationKeys {
  nav: {
    experience: string;
    projects: string;
    about: string;
    contact: string;
  };
  hero: {
    availability: string;
    ctaContact: string;
    ctaProjects: string;
    role: string;
  };
  experiences: {
    title: string;
    present: string;
    technologies: string;
  };
  projects: {
    title: string;
    viewProject: string;
    sourceCode: string;
  };
  about: {
    title: string;
  };
  contact: {
    title: string;
    emailMe: string;
    copyEmail: string;
    copied: string;
  };
  footer: {
    builtWith: string;
    rights: string;
  };
  theme: {
    light: string;
    dark: string;
    toggle: string;
  };
  language: {
    en: string;
    fr: string;
    toggle: string;
  };
}