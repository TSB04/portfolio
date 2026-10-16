import type { SiteConfig, SiteContent, Locale } from "../types";

import logo from "@images/logo.png";
import saayAgent from "@images/projects/saay/saay-studio-logo.png";
import invoice from "@images/projects/invora/invora.png";
import sunuflix from "@images/projects/sunustream/colored-logo.png";
import homelab from "@images/homelab.png";
import profile from "@images/profil/tsb-blue&white.png";
import profileBlack from "@images/profil/tsb-black.png";
import profileLarge from "@images/profil/tsb-green.png";
// Reuse locally available optimized imagery until dedicated assets are added.
const soin = sunuflix;
const greennext = homelab;
const avela = profile;
const esmartlock = invoice;
const msEstiam = saayAgent;
const svgIcons = logo;
const tsbbCli = homelab;
const goSlotChecker = homelab;
const portfolio = logo;

const baseConfig: SiteConfig = {
  title: "TSB — Full Stack Engineer",
  author: "Thierno Sadou BARRY",
  description:
    "Thierno Sadou BARRY, Full Stack Engineer in Paris. Java, Spring Boot, React and AI integration. Explore my projects, experience and freelance availability.",
  keywords: [
    "Full Stack Engineer",
    "Java Developer",
    "Spring Boot",
    "React",
    "JavaScript",
    "TypeScript",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AI Integration",
    "Enterprise SaaS",
    "Cloud Infrastructure",
    "Open Source",
    "DevOps",
    "LLM",
    "RAG",
  ],
  lang: "en",
  siteLogo: logo,
  navLinks: [
    { text: "Experience", href: "#experience" },
    { text: "Projects", href: "#projects" },
    { text: "Skills", href: "#skills" },
    { text: "About", href: "#about" },
    { text: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { text: "LinkedIn", href: "https://linkedin.com/in/tsb04" },
    { text: "GitHub", href: "https://github.com/tsb04" },
    { text: "Portfolio", href: "https://tsb-dev.fr" },
    { text: "NPM", href: "https://npmjs.com/~tsb04" },
    { text: "Dev.to", href: "https://dev.to/tsb04" },
  ],
  socialImage: "/og-image.png",
  canonicalURL: "https://tsb-dev.fr",
};

const baseContent: SiteContent = {
  hero: {
    image: profileBlack,
    imageDark: profile,
    name: "Thierno Sadou BARRY",
    email: "thierno.sadou.barry98@gmail.com",
    specialty: "Full Stack Engineer • Java • Spring Boot • React • AI",
    summary: [
      {
        title: "Full-Stack Engineer",
        text: "I design, build, and ship software, from user interfaces to backend services and production infrastructure. My work spans enterprise applications, accounting and invoicing platforms, and AI integration, with a focus on turning complex requirements into dependable software.",
      },
      {
        title: "Enterprise Software at MTAE",
        text: "At MTAE, I develop applications for accounting and electronic invoicing. I led the development of an invoice reception module used by more than 800 clients, implementing business workflows, API integrations, and document processing to support their daily operations.",
      },
      {
        title: "My Technical Foundation",
        text: "I work primarily with Java, Spring Boot, React, Next.js, and PostgreSQL. Across frontend and backend development, I focus on clear architecture, secure authentication, maintainable code, and interfaces that make complex workflows easier to navigate.",
      },
      {
        title: "SAAY: Exploring Local and Hybrid AI",
        text: "I’m building SAAY, a modular project combining AI services, developer tooling, and infrastructure. I work with local LLMs, cloud inference, and secure access, while exploring how autonomous agents can support development workflows with appropriate controls.",
      },
      {
        title: "SunuStream: Building Across Screens",
        text: "I’m developing SunuStream, a streaming platform aimed at Senegal and surrounding markets. It combines web and Smart TV applications, media discovery, live TV integration, and video transcoding pipelines. The project is still evolving, with VOD content sourcing remaining an active area of work.",
      },
      {
        title: "Infrastructure and Delivery",
        text: "I run a Proxmox homelab where I deploy and maintain containerized applications, configure networking and remote access, and manage monitoring. I also build CI/CD workflows with GitHub Actions, connecting application development with repeatable deployment and production operations.",
      },
      {
        title: "Background and Motivation",
        text: "Originally from Senegal and based in France since 2019, I completed an MSc in Web and Mobile Development at ESTIAM. I’m motivated by practical problems and the opportunity to build useful products, whether that means improving a business workflow or developing tools for communities I know.",
      },
    ],
    availability: "Open to freelance & full-time opportunities",
    location: "Paris, France",
    ctaLabel: "Open the notebook",
    ctaTarget: "#experience",
  },

  sections: [
    { id: "experience", tab: "E", eyebrow: "Chapter 01", title: "Experience" },
    { id: "projects", tab: "P", eyebrow: "Chapter 02", title: "Projects" },
    { id: "skills", tab: "S", eyebrow: "Chapter 03", title: "Skills" },
    { id: "about", tab: "A", eyebrow: "Chapter 04", title: "About" },
    { id: "contact", tab: "C", eyebrow: "Back cover", title: "Contact" },
  ],
  contact: {
    heading: "Let's build something together",
    message:
      "Whether it's a full-time role, a freelance mission, or a technical challenge worth solving — my inbox is open.",
    email: "thierno.sadou.barry98@gmail.com",
    location: "Paris, France",
    availability: "Open to freelance & full-time opportunities",
  },

  experience: [
    {
      company: "MTAE",
      position: "Full Stack Software Engineer",
      startDate: "2023",
      endDate: "Present",
      location: "Paris, France",
      summary: [
        "Architected enterprise SaaS modules with Spring Boot, React, and MySQL, serving production workloads for B2B financial clients.",
        "Led the design and implementation of invoice lifecycle workflows, ensuring full compliance with France's upcoming mandatory B2B e-invoicing regulations (PDP/Cecurity integration).",
        "Built secure, event-driven integrations with external financial platforms, handling OAuth2 authentication flows and resilient webhook processing.",
        "Optimized backend performance through JPA query tuning, API caching strategies, and asynchronous job processing.",
        "Owned features end-to-end—from database schema design to React frontend implementation and Docker-based deployment.",
        "Designed and implemented a complete declarative portal (Portail Déclaratif) for tax filing and transmission metrics dashboards.",
        "Refactored legacy payroll interfaces into modern React dashboards with dynamic filtering, data visualization, and multi-role access control.",
      ],
      technologies: [
        "Java",
        "Spring Boot",
        "React",
        "JavaScript",
        "MySQL",
        "Docker",
        "REST APIs",
        "OAuth2",
        "JWT",
        "JPA/Hibernate",
      ],
    },
    {
      company: "ESTIAM Paris",
      position: "Full Stack Developer — Apprenticeship",
      startDate: "2021",
      endDate: "2022",
      location: "Paris, France",
      summary: [
        "Developed an internal pedagogical management platform for student tracking, GitHub integration, and assignment submissions.",
        "Built the backend API with NestJS and the frontend interface with Next.js.",
        "Integrated GitHub API to centralize student repository tracking and code review workflows.",
        "Set up CI/CD pipelines with GitHub Actions and containerized deployments with Docker.",
        "Collaborated directly with administrative staff to align technical workflows with pedagogical needs.",
      ],
      technologies: [
        "Next.js",
        "NestJS",
        "TypeScript",
        "GitHub API",
        "Docker",
        "GitHub Actions",
        "MongoDB",
      ],
    },
    {
      company: "Freelance",
      position: "Full Stack Developer & Consultant",
      startDate: "2020",
      endDate: "Present",
      location: "Remote / France",
      summary: [
        "Designed and deployed So'in, a web and mobile platform for Afro hair and body care services with role-based access, live chat, and booking management.",
        "Built Avela, an educational and psychological support platform for youth and families with secure tracking and beneficiary management.",
        "Developed Web Bluetooth prototypes for IoT and connected health devices (temperature monitoring, home automation).",
        "Created multiple e-commerce prototypes and REST APIs for catalog management, shopping carts, and order processing.",
      ],
      technologies: [
        "Next.js",
        "NestJS",
        "React Native",
        "Socket.io",
        "MongoDB",
        "Tailwind CSS",
        "Web Bluetooth API",
        "Firebase",
      ],
    },
  ],

  education: [
    {
      institution: "ESTIAM Paris",
      degree: "Master Informatique Appliquée",
      field: "Web & Mobile Development (WMD)",
      startDate: "2023",
      endDate: "2025",
      location: "Paris, France",
      highlights: [
        "Specialized in full stack development, cloud-native architectures, and distributed systems.",
        "Led multiple agile projects and hackathon participations (GreenNext, Swift Student Challenge).",
        "Explored advanced topics: microservices, DevOps, AI integration, and cross-platform mobile development.",
      ],
    },
    {
      institution: "ESTIAM Paris",
      degree: "Bachelor Informatique Appliquée",
      field: "Software Engineering",
      startDate: "2019",
      endDate: "2022",
      location: "Paris, France",
      highlights: [
        "Foundation in software engineering, databases, networks, and system design.",
        "Completed Cisco CCNA 1-2-3 certifications alongside academic curriculum.",
        "First professional experience via internal apprenticeship program.",
      ],
    },
    {
      institution: "Université Cheikh Anta Diop (UCAD)",
      degree: "Licence 1 MPI",
      field: "Mathematics – Physics – Computer Science",
      startDate: "2018",
      endDate: "2019",
      location: "Dakar, Senegal",
      highlights: [
        "Strong foundation in algorithmics, mathematics, and scientific computing.",
        "Transitioned to France to pursue specialized engineering training.",
      ],
    },
    {
      institution: "Lycée Seydina Limamoulaye",
      degree: "Baccalauréat Scientifique",
      field: "Science",
      startDate: "2018",
      endDate: "2018",
      location: "Dakar, Senegal",
      highlights: ["Obtained with honors (Mention)."],
    },
  ],

  certifications: [
    {
      name: "RNCP Niveau 6",
      issuer: "France Compétences",
      year: "2022",
      description:
        "Bachelor-level professional certification in software development.",
    },
    {
      name: "CCNA 1, 2, 3",
      issuer: "Cisco",
      year: "2021",
      description:
        "Network fundamentals, routing, switching, and security concepts.",
    },
    {
      name: "AWS Cloud Practitioner (In Progress)",
      issuer: "Amazon Web Services",
      year: "2026",
      description: "Foundational cloud knowledge and AWS services overview.",
    },
  ],

  projects: [
    {
      name: "Saay Agent",
      summary:
        "Local-first AI coding assistant built with Rust and FastAPI. Features semantic code search via ChromaDB, autonomous task execution with Ollama LLMs, and a privacy-focused architecture that runs entirely on-device.",
      linkPreview: "/projects/saay-agent",
      linkSource: "https://github.com/tsb04",
      image: saayAgent,
      tags: [
        "Rust",
        "FastAPI",
        "Ollama",
        "ChromaDB",
        "LLM",
        "RAG",
        "Autonomous Agents",
      ],
    },
    {
      name: "Enterprise Invoice Platform",
      summary:
        "End-to-end invoice management system integrating French PDP providers for electronic invoicing compliance. Features workflow automation, real-time document synchronization, and secure API gateways for B2B transactions.",
      linkPreview: "/projects/invoice-platform",
      linkSource: "https://github.com/tsb04",
      image: invoice,
      tags: [
        "Spring Boot",
        "React",
        "PostgreSQL",
        "Docker",
        "PDP APIs",
        "E-invoicing",
        "OAuth2",
      ],
    },
    {
      name: "SunuFlix",
      summary:
        "High-performance streaming platform built with Next.js and a microservices backend. Optimized for content delivery, user personalization, and horizontal scalability on cloud infrastructure.",
      linkPreview: "/projects/sunuflix",
      linkSource: "https://github.com/tsb04",
      image: sunuflix,
      tags: ["Next.js", "Microservices", "Cloud-Native", "Streaming", "Docker"],
    },
    {
      name: "So'in Platform",
      summary:
        "Web and mobile platform dedicated to Afro hair and body care services. Features dynamic role management (admin, professional, client), real-time booking, live chat, dashboard analytics, and push notifications.",
      linkPreview: "https://www.afro-soin.com/",
      linkSource: "https://github.com/tsb04",
      image: soin,
      tags: [
        "Next.js",
        "NestJS",
        "React Native",
        "Socket.io",
        "MongoDB",
        "Tailwind CSS",
      ],
    },
    {
      name: "GreenNext",
      summary:
        "Eco-responsible campus management prototype built during a hackathon. Intelligent platform for automated attendance, access control, weather monitoring, and energy optimization via IoT.",
      linkPreview: "/projects/greennext",
      linkSource: "https://github.com/tsb04",
      image: greennext,
      tags: ["React", "Firebase", "Web APIs", "IoT", "Charting", "Hackathon"],
    },
    {
      name: "Avela",
      summary:
        "Educational and psychological support platform for youth and families. Provides a secure, interconnected framework for tracking and supporting beneficiaries with role-based access.",
      linkPreview: "/projects/avela",
      linkSource: "https://github.com/tsb04",
      image: avela,
      tags: ["Next.js", "NestJS", "MongoDB", "Education", "Healthcare"],
    },
    {
      name: "Universal SVG Icons",
      summary:
        "Framework-agnostic SVG icon library for modern frontend stacks (React, Vue, Angular, Svelte). Focuses on accessibility, customization, and universal integration across any environment.",
      linkPreview: "https://www.npmjs.com/package/universal-svg-icons",
      linkSource: "https://github.com/tsb04/universal-svg-icons",
      image: svgIcons,
      tags: [
        "TypeScript",
        "NPM",
        "Rollup",
        "SVG",
        "Open Source",
        "Accessibility",
      ],
    },
    {
      name: "TSBB CLI",
      summary:
        "Command-line toolbox for TypeScript projects. Features scaffolding, log cleanup, module generation, and static analysis—designed to accelerate developer workflows.",
      linkPreview: "/projects/tsbb-cli",
      linkSource: "https://github.com/tsb04",
      image: homelab,
      tags: ["Node.js", "TypeScript", "CLI", "Developer Tools", "Automation"],
    },
    {
      name: "Personal Homelab",
      summary:
        "Self-hosted development and production infrastructure running Docker, Traefik reverse proxy, PostgreSQL clusters, AI inference services (Ollama), and automated CI/CD pipelines on bare metal.",
      linkPreview: "/projects/homelab",
      linkSource: "https://github.com/tsb04",
      image: homelab,
      tags: [
        "Docker",
        "Traefik",
        "PostgreSQL",
        "Self-Hosting",
        "DevOps",
        "Homelab",
        "Ollama",
      ],
    },
    {
      name: "eSmartLock (eSL)",
      summary:
        "Cross-platform mobile application for academic environment management: students, teachers, schedules, and access control. Built as a multi-platform academic project.",
      linkPreview: "/projects/esmartlock",
      linkSource: "https://github.com/tsb04",
      image: esmartlock,
      tags: ["React Native", "Firebase", "Mobile", "Academic"],
    },
    {
      name: "ms_estiam",
      summary:
        "Multi-service management application for academic environments. Modules for class management, grades, and internal digital services.",
      linkPreview: "/projects/ms-estiam",
      linkSource: "https://github.com/tsb04",
      image: msEstiam,
      tags: ["NestJS", "Angular", "TypeScript", "Academic", "Management"],
    },
  ],

  openSource: [
    {
      name: "universal-svg-icons",
      summary:
        "Framework-agnostic SVG icon library for React, Vue, Angular, and Svelte.",
      linkPreview: "/...",
      linkSource: "https://github.com/tsb04/universal-svg-icons",
      image: svgIcons,
      tags: ["TypeScript", "NPM", "SVG", "Accessibility"],
    },
    {
      name: "TSBB CLI",
      summary:
        "CLI toolbox for TypeScript projects with scaffolding and static analysis.",
      linkPreview: "/projects/ms-estiam",
      linkSource: "https://github.com/tsb04/tsbb-cli",
      image: tsbbCli,
      tags: ["Node.js", "CLI", "Developer Tools"],
    },
    {
      name: "go-slot-checker",
      summary:
        "Go CLI tool for automating driving exam slot search with HTML scraping and webhook alerts.",
      linkPreview: "/projects/ms-estiam",
      linkSource: "https://github.com/tsb04/go-slot-checker",
      image: goSlotChecker,
      tags: ["Go", "Scraping", "Automation"],
    },
    {
      name: "portfolio",
      summary:
        "Personal portfolio site built with Astro, featuring i18n, theme toggling, and book-like design.",
      linkPreview: "/projects/ms-estiam",
      linkSource: "https://github.com/tsb04/portfolio",
      image: portfolio,
      tags: ["Astro", "TypeScript", "Tailwind CSS", "i18n"],
    },
  ],

  about: {
    description: `I'm a Full Stack Software Engineer focused on building systems that solve real business problems at scale.

My core stack is Java, Spring Boot, React, TypeScript, and PostgreSQL—backed by Docker and modern cloud-native practices. I specialize in enterprise SaaS architecture, financial systems, and AI integration.

Recently, I've been deep in France's e-invoicing ecosystem, designing compliant workflow engines and secure API integrations. I'm also actively exploring local AI infrastructure—running LLMs with Ollama, building RAG pipelines with vector databases, and experimenting with autonomous agent architectures.

I believe in a holistic approach to software engineering: understanding low-level systems, networks, and protocols as deeply as user interfaces and product experience. I deliberately avoided early specialization to cultivate a universal developer profile—capable of navigating backend, frontend, mobile, DevOps, and cloud layers.

Beyond code, I'm committed to digital sovereignty, open source, and ethical technology. My long-term vision includes contributing to Africa's tech autonomy through open-source tools, lightweight architectures, and knowledge transmission.

Outside of client work, I maintain a homelab for continuous experimentation with distributed systems, DevOps tooling, and emerging backend technologies. I also enjoy repairing electronics, exploring IoT, and mentoring junior developers.`,
    image: profileLarge,
    imageDark: profile,
  },

  skills: {
    backend: [
      "Java",
      "Spring Boot",
      "NestJS",
      "FastAPI",
      "Node.js",
      "REST API Design",
      "GraphQL",
      "JPA/Hibernate",
      "OAuth2/JWT",
      "Microservices",
    ],
    frontend: [
      "React",
      "Next.js",
      "Angular",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Shadcn/ui",
      "Astro",
      "HTML/CSS",
    ],
    database: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "ChromaDB",
      "Redis",
      "Database Design",
      "JPA/Hibernate",
    ],
    devops: [
      "Docker",
      "Traefik",
      "Linux",
      "CI/CD",
      "GitHub Actions",
      "Cloud Infrastructure",
      "AWS",
      "Azure",
      "Self-Hosting",
    ],
    ai: [
      "LLM Integration",
      "Ollama",
      "RAG",
      "Vector Databases",
      "Autonomous Agents",
      "ChromaDB",
      "FastAPI",
    ],
    mobile: ["React Native", "Swift", "Kotlin", "Flutter"],
    other: [
      "Go",
      "Python",
      "C/C++",
      "C#",
      "R",
      "Ruby",
      "PHP",
      "Web Bluetooth API",
      "IoT",
      "Git",
      "Agile/Scrum",
    ],
  },

  languages: [
    { name: "French", level: "Native / Bilingual" },
    { name: "Wolof", level: "Native" },
    { name: "English", level: "Professional Working Proficiency" },
    { name: "Arabic", level: "Beginner (Learning)" },
  ],

  awards: [
    {
      title: "Hackathon GreenNext",
      year: "2022",
      description:
        "Built an eco-responsible campus management prototype with IoT integration.",
    },
    {
      title: "Swift Student Challenge",
      year: "2023",
      description: "Participated in Apple's global student coding challenge.",
    },
  ],

  philosophy: {
    quote:
      "An unhandled exception—whether global or specific—is a door left open.",
    vision:
      "I strive to build technology that is useful, durable, sovereign, and inclusive. Every line of code is a brick in a larger system where quality, readability, security, and ethics must coexist.",
    principles: [
      "Systemic understanding of software and hardware environments",
      "Critical thinking—questioning ready-made solutions",
      "Collaboration across multidisciplinary teams",
      "Resilience and prevention in architecture and code",
      "Accessibility and inclusive design (WCAG compliance)",
      "Open source and digital sovereignty",
    ],
  },
};

// ─────────────────────────────────────────────
// FRENCH LOCALIZED CONTENT
// ─────────────────────────────────────────────

const frContent: SiteContent = {
  ...baseContent,

  hero: {
    ...baseContent.hero,
    specialty: "Ingénieur Full Stack • Java • Spring Boot • React • IA",
    summary: [
      { title: "Ingénieur Full Stack", text: "Je conçois, développe et livre des logiciels, des interfaces aux services backend et à l’infrastructure de production. Mon travail couvre les applications d’entreprise, la comptabilité, la facturation et l’intégration de l’IA, pour transformer des besoins complexes en logiciels fiables." },
      { title: "Les logiciels métier chez MTAE", text: "Chez MTAE, je développe des applications de comptabilité et de facturation électronique. J’ai piloté le développement d’un module de réception de factures utilisé par plus de 800 clients, avec des workflows métier, des intégrations API et du traitement documentaire." },
      { title: "Mes fondations techniques", text: "Je travaille principalement avec Java, Spring Boot, React, Next.js et PostgreSQL. Je privilégie une architecture claire, une authentification sécurisée, du code maintenable et des interfaces qui simplifient les processus complexes." },
      { title: "SAAY : IA locale et hybride", text: "Je construis SAAY, un projet modulaire associant services d’IA, outils de développement et infrastructure. J’explore les LLM locaux, l’inférence cloud et les accès sécurisés, ainsi que l’assistance au développement par des agents autonomes avec des contrôles adaptés." },
      { title: "SunuStream : du web à la télévision", text: "Je développe SunuStream, une plateforme de streaming destinée au Sénégal et aux marchés voisins : applications web et Smart TV, découverte de médias, télévision en direct et transcodage vidéo. Le projet évolue encore, notamment sur l’approvisionnement en contenus VOD." },
      { title: "Infrastructure et livraison", text: "Dans mon homelab Proxmox, je déploie et maintiens des applications conteneurisées, configure le réseau, les accès distants et la supervision. Je construis aussi des workflows CI/CD avec GitHub Actions pour relier développement et déploiements reproductibles." },
      { title: "Parcours et motivation", text: "Originaire du Sénégal et installé en France depuis 2019, j’ai obtenu un MSc en développement web et mobile à ESTIAM. Les problèmes concrets et les produits utiles me motivent, qu’il s’agisse d’améliorer un processus métier ou de créer des outils pour les communautés que je connais." },
    ],
    availability: "Disponible pour missions freelance et CDI",
    location: "Paris, France",
    ctaLabel: "Ouvrir le carnet",
  },

  sections: [
    { id: "experience", tab: "E", eyebrow: "Chapitre 01", title: "Expérience" },
    { id: "projects", tab: "P", eyebrow: "Chapitre 02", title: "Projets" },
    { id: "skills", tab: "S", eyebrow: "Chapitre 03", title: "Compétences" },
    { id: "about", tab: "A", eyebrow: "Chapitre 04", title: "À propos" },
    {
      id: "contact",
      tab: "C",
      eyebrow: "Quatrième de couverture",
      title: "Contact",
    },
  ],
  contact: {
    heading: "Construisons quelque chose ensemble",
    message:
      "Que ce soit pour un poste, une mission freelance ou un défi technique à résoudre — ma boîte mail est ouverte.",
    email: "thierno.sadou.barry98@gmail.com",
    location: "Paris, France",
    availability: "Disponible pour missions freelance et CDI",
  },

  education: [
    {
      ...baseContent.education[0],
      degree: "Master Informatique Appliquée",
      field: "Web & Mobile Development (WMD)",
      highlights: [
        "Spécialisation en développement full stack, architectures cloud-native et systèmes distribués.",
        "Direction de multiples projets agiles et participations à des hackathons (GreenNext, Swift Student Challenge).",
        "Exploration de sujets avancés : microservices, DevOps, intégration IA et développement mobile cross-platform.",
      ],
    },
    {
      ...baseContent.education[1],
      degree: "Bachelor Informatique Appliquée",
      field: "Génie Logiciel",
      highlights: [
        "Fondements en génie logiciel, bases de données, réseaux et conception de systèmes.",
        "Certifications Cisco CCNA 1-2-3 en parallèle du cursus académique.",
        "Première expérience professionnelle via le programme d'alternance interne.",
      ],
    },
    {
      ...baseContent.education[2],
      degree: "Licence 1 MPI",
      field: "Mathématiques – Physique – Informatique",
      highlights: [
        "Fondements solides en algorithmique, mathématiques et calcul scientifique.",
        "Transition vers la France pour poursuivre une formation d'ingénieur spécialisé.",
      ],
    },
    {
      ...baseContent.education[3],
      degree: "Baccalauréat Scientifique",
      field: "Sciences",
      highlights: ["Obtenu avec mention."],
    },
  ],

  certifications: [
    {
      ...baseContent.certifications[0],
      description:
        "Certification professionnelle de niveau Bachelor en développement logiciel.",
    },
    {
      ...baseContent.certifications[1],
      description:
        "Fondamentaux des réseaux, routage, commutation et concepts de sécurité.",
    },
    {
      ...baseContent.certifications[2],
      description:
        "Connaissances fondamentales du cloud et aperçu des services AWS.",
    },
  ],

  experience: [
    {
      ...baseContent.experience[0],
      position: "Ingénieur Logiciel Full Stack",
      summary: [
        "Conception de modules SaaS enterprise avec Spring Boot, React et MySQL, servant des charges de production pour des clients financiers B2B.",
        "Direction de la conception et implémentation des workflows de cycle de vie des factures, en assurant la conformité totale avec la future réglementation française obligatoire de facturation électronique B2B (intégration PDP/Cecurity).",
        "Construction d'intégrations sécurisées et event-driven avec des plateformes financières externes, gérant les flux d'authentification OAuth2 et le traitement résilient des webhooks.",
        "Optimisation des performances backend via le tuning des requêtes JPA, les stratégies de cache API et le traitement asynchrone des jobs.",
        "Responsabilité end-to-end des fonctionnalités—de la conception du schéma de base de données à l'implémentation frontend React et au déploiement Docker.",
        "Conception et implémentation d'un portail déclaratif complet pour la déclaration fiscale et les tableaux de bord de métriques de transmission.",
        "Refonte d'interfaces legacy de paie en dashboards React modernes avec filtrage dynamique, visualisation de données et contrôle d'accès multi-rôles.",
      ],
    },
    {
      ...baseContent.experience[1],
      position: "Développeur Full Stack — Alternance",
      summary: [
        "Développement d'une plateforme interne de gestion pédagogique pour le suivi des étudiants, l'intégration GitHub et les soumissions de devoirs.",
        "Construction de l'API backend avec NestJS et de l'interface frontend avec Next.js.",
        "Intégration de l'API GitHub pour centraliser le suivi des dépôts étudiants et les workflows de code review.",
        "Mise en place de pipelines CI/CD avec GitHub Actions et de déploiements containerisés avec Docker.",
        "Collaboration directe avec l'équipe administrative pour aligner les workflows techniques avec les besoins pédagogiques.",
      ],
    },
    {
      ...baseContent.experience[2],
      position: "Développeur Full Stack & Consultant",
      summary: [
        "Conception et déploiement de So'in, plateforme web et mobile pour les services de soins capillaires et corporels afro avec gestion par rôles, chat en direct et réservation.",
        "Construction d'Avela, plateforme éducative et de soutien psychologique pour les jeunes et les familles avec suivi sécurisé.",
        "Développement de prototypes Web Bluetooth pour l'IoT et les dispositifs de santé connectée (surveillance de température, domotique).",
        "Création de multiples prototypes e-commerce et APIs REST pour la gestion de catalogues, paniers et traitement de commandes.",
      ],
    },
  ],

  about: {
    description: `Je suis un Ingénieur Logiciel Full Stack concentré sur la construction de systèmes qui résolvent de vrais problèmes business à grande échelle.

Mon stack principal est Java, Spring Boot, React, TypeScript et PostgreSQL—soutenu par Docker et les pratiques cloud-native modernes. Je me spécialise dans l'architecture SaaS enterprise, les systèmes financiers et l'intégration IA.

Récemment, j'ai plongé dans l'écosystème de la facturation électronique française, concevant des moteurs de workflow conformes et des intégrations API sécurisées. J'explore aussi activement l'infrastructure IA locale—exécution de LLMs avec Ollama, construction de pipelines RAG avec des bases de données vectorielles, et expérimentation avec des architectures d'agents autonomes.

Je crois en une approche holistique du génie logiciel : comprendre aussi profondément les systèmes bas niveau, les réseaux et les protocoles que les interfaces utilisateur et l'expérience produit. J'ai délibérément évité une spécialisation précoce pour cultiver un profil de développeur universel—capable de naviguer entre backend, frontend, mobile, DevOps et cloud.

Au-delà du code, je suis engagé envers la souveraineté numérique, l'open source et la technologie éthique. Ma vision à long terme inclut contribuer à l'autonomie technologique de l'Afrique à travers des outils open source, des architectures légères et la transmission des connaissances.

En dehors du travail client, je maintiens un homelab pour l'expérimentation continue avec les systèmes distribués, les outils DevOps et les technologies backend émergentes. J'apprécie aussi la réparation d'électronique, l'exploration de l'IoT et le mentorat de développeurs juniors.`,
    image: profileLarge,
    imageDark: profile,
  },

  philosophy: {
    quote:
      "Une exception non gérée, qu'elle soit globale ou spécifique, c'est une porte laissée ouverte.",
    vision:
      "Je m'efforce de construire une technologie utile, durable, souveraine et inclusive. Chaque ligne de code est une brique dans un système plus vaste où qualité, lisibilité, sécurité et éthique doivent coexister.",
    principles: [
      "Compréhension systémique des environnements logiciels et matériels",
      "Esprit critique—remettre en question les solutions toutes faites",
      "Collaboration au sein d'équipes pluridisciplinaires",
      "Résilience et prévention dans l'architecture et le code",
      "Accessibilité et design inclusif (conformité WCAG)",
      "Open source et souveraineté numérique",
    ],
  },
};

export function getSiteConfig(locale: Locale = "en"): SiteConfig {
  return {
    ...baseConfig,
    lang: locale,
    navLinks:
      locale === "fr"
        ? [
            { text: "Expérience", href: "#experience" },
            { text: "Projets", href: "#projects" },
            { text: "Compétences", href: "#skills" },
            { text: "À propos", href: "#about" },
            { text: "Contact", href: "#contact" },
          ]
        : baseConfig.navLinks,
    title: locale === "fr" ? "TSB — Ingénieur Full Stack" : baseConfig.title,
    description:
      locale === "fr"
        ? "Thierno Sadou BARRY, ingénieur Full Stack à Paris : Java, Spring Boot, React et IA. Découvrez mes projets, mon parcours et mes disponibilités freelance."
        : baseConfig.description,
  };
}

export function getSiteContent(locale: Locale = "en"): SiteContent {
  return locale === "fr" ? frContent : baseContent;
}

// Backward compatibility
export const SITE_CONFIG = getSiteConfig("en");
export const SITE_CONTENT = getSiteContent("en");
