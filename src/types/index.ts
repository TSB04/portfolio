export interface NavLink {
  text: string;
  href: string;
}

export interface SocialLink {
  text: string;
  href: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  highlights: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  description: string;
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

export interface ProjectSubmodule {
  name: string;
  fullName: string;
  path: string;
  summary: string;
  language: string | null;
  private: boolean;
  url: string;
  commit: string;
}

export interface ProjectItem {
  name: string;
  summary: string;
  linkPreview: string;
  linkSource: string;
  image: ImageMetadata;
  imageFit?: "cover" | "contain";
  imageKind?: "logo" | "illustration";
  overview?: string[];
  featured?: boolean;
  tags: string[];
  github?: {
    private?: boolean;
    fullName: string;
    stars: number;
    forks: number;
    updatedAt: string;
    license: string | null;
    language: string | null;
    languages: { name: string; percent: number }[];
    readmeUrl: string;
    readmeExcerpt: string;
    hasImage: boolean;
    createdAt?: string | null;
    defaultBranch?: string | null;
    openItems?: number;
    sizeKB?: number;
    release?: { name: string; url: string; publishedAt: string | null } | null;
    submodules?: ProjectSubmodule[];
  };
}

export interface Skills {
  backend: string[];
  frontend: string[];
  mobile: string[];
  database: string[];
  devops: string[];
  ai: string[];
  other: string[];
  languages?: LangItem[];
}

export interface LangItem {
  name: string;
  level: string;
}

export interface AwardItem {
  title: string;
  year: string;
  description: string;
}

export interface HeroContent {
  name: string;
  specialty: string;
  summary: string | { title: string; text: string }[];
  image?: ImageMetadata;
  imageDark?: ImageMetadata;
  email: string;
  availability: string;
  location: string;
  ctaLabel?: string;
  ctaTarget?: string;
}

export interface BookSection {
  id: "experience" | "projects" | "skills" | "about" | "contact";
  tab: string;
  eyebrow: string;
  title: string;
}

export interface ContactContent {
  heading: string;
  message: string;
  email: string;
  location: string;
  availability: string;
}

export interface AboutContent {
  description: string;
  image: ImageMetadata;
  imageDark?: ImageMetadata;
}

/** Legacy component compatibility; active components use the content types above. */
export type HeroProps = HeroContent;
export type AboutProps = AboutContent;

export interface PhilosophyContent {
  quote: string;
  vision: string;
  principles: string[];
}

export interface SiteContent {
  hero: HeroContent;
  education: EducationItem[];
  certifications: CertificationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  openSource: ProjectItem[];
  about: AboutContent;
  philosophy: PhilosophyContent;
  skills: Skills;
  languages?: LangItem[];
  awards?: AwardItem[];
  sections: BookSection[];
  contact: ContactContent;
}

export interface SiteConfig {
  title: string;
  author: string;
  description: string;
  keywords: string[];
  lang: string;
  siteLogo: ImageMetadata;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  socialImage: string;
  canonicalURL: string;
}

// i18n types
export type Locale = "en" | "fr";

export interface TranslationKeys {
  book: { continued: string; community: string; contents: string; intro: string; education: string; certifications: string; principles: string; hint: string; edition: string };
  reader: { turnPages: string; previousPage: string; nextPage: string };
  nav: {
    menu: string;
    home: string;
    experience: string;
    projects: string;
    skills: string;
    about: string;
    contact: string;
  };
  hero: {
    availability: string;
    ctaContact: string;
    ctaProjects: string;
    ctaNotebook: string;
    summaryPrevious: string;
    summaryNext: string;
    summaryPause: string;
    summaryPlay: string;
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
    readme: string;
    stars: string;
    forks: string;
    updated: string;
    license: string;
    languages: string;
    repositoryNotes: string;
    overview: string;
    featured: string;
    enlargeImage: string;
    closeImage: string;
    zoomImage: string;
    originalImage: string;
    created: string;
    defaultBranch: string;
    openItems: string;
    repositorySize: string;
    latestRelease: string;
    submodules: string;
    componentSource: string;
    pinnedCommit: string;
    privateRepository: string;
    publicRepository: string;
  };
  about: {
    title: string;
  };
  skills: {
    title: string;
    intro: string;
    technology: string;
    practice: string;
    categories: { title: string; note: string }[];
    labels: Record<string, string>;
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
    backToTop: string;
    tagline: string;
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
