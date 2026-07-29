import type { SiteConfig, SiteContent, Locale } from "../types";

import logo from "@images/logo.png";
import saayAgent from "@images/saay-agent.png";
import invoice from "@images/invoice.jpeg";
import sunuflix from "@images/sunuflix.jpg";
import homelab from "@images/homelab.avif";
import profile from "@images/profile-large.jpg";
import profileLarge from "@images/profile-large.jpg";

const baseConfig: SiteConfig = {
  title: "TSB — Full Stack Engineer",
  author: "Thierno Sadou BARRY",
  description:
    "Senior Full Stack Software Engineer specializing in Java, Spring Boot, React, and AI-powered enterprise SaaS. Building scalable backend systems, cloud infrastructure, and intelligent web applications.",
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
  ],
  lang: "en",
  siteLogo: logo,
  navLinks: [
    { text: "Experience", href: "#experience" },
    { text: "Projects", href: "#projects" },
    { text: "About", href: "#about" },
    { text: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { text: "LinkedIn", href: "https://linkedin.com/in/tsb04" },
    { text: "GitHub", href: "https://github.com/tsb04" },
    { text: "Portfolio", href: "https://tsb-dev.fr" },
  ],
  socialImage: "/og-image.png",
  canonicalURL: "https://tsb-dev.fr",
};

const baseContent: SiteContent = {
  hero: {
    name: "Thierno Sadou BARRY",
    specialty: "Full Stack Engineer • Java • Spring Boot • React • AI",
    summary:
      "I architect and ship enterprise-grade software—scalable backends, AI-integrated systems, and cloud-native infrastructure. Currently building financial SaaS platforms and exploring local AI infrastructure with LLMs and autonomous agents.",
    email: "thierno.sadou.barry98@gmail.com",
    availability: "Open to freelance & full-time opportunities",
    location: "France",
  },
  experience: [
    {
      company: "MTAE",
      position: "Full Stack Software Engineer",
      startDate: "2025",
      endDate: "Present",
      location: "France",
      summary: [
        "Architected enterprise SaaS modules with Spring Boot, React, and MySQL, serving production workloads for B2B financial clients.",
        "Led the design and implementation of invoice lifecycle workflows, ensuring full compliance with France's upcoming mandatory B2B e-invoicing regulations (PDP/Cecurity integration).",
        "Built secure, event-driven integrations with external financial platforms, handling OAuth2 authentication flows and resilient webhook processing.",
        "Optimized backend performance through JPA query tuning, API caching strategies, and asynchronous job processing.",
        "Owned features end-to-end—from database schema design to React frontend implementation and Docker-based deployment.",
      ],
      technologies: ["Java", "Spring Boot", "React", "JavaScript", "MySQL", "Docker", "REST APIs", "OAuth2"],
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
      tags: ["Rust", "FastAPI", "Ollama", "ChromaDB", "LLM", "RAG"],
    },
    {
      name: "Enterprise Invoice Platform",
      summary:
        "End-to-end invoice management system integrating French PDP providers for electronic invoicing compliance. Features workflow automation, real-time document synchronization, and secure API gateways for B2B transactions.",
      linkPreview: "/projects/invoice-platform",
      linkSource: "https://github.com/tsb04",
      image: invoice,
      tags: ["Spring Boot", "React", "PostgreSQL", "Docker", "PDP APIs", "E-invoicing"],
    },
    {
      name: "SunuFlix",
      summary:
        "High-performance streaming platform built with Next.js and a microservices backend. Optimized for content delivery, user personalization, and horizontal scalability on cloud infrastructure.",
      linkPreview: "/projects/sunuflix",
      linkSource: "https://github.com/tsb04",
      image: sunuflix,
      tags: ["Next.js", "Microservices", "Cloud-Native", "Streaming"],
    },
    {
      name: "Personal Homelab",
      summary:
        "Self-hosted development and production infrastructure running Docker, Traefik reverse proxy, PostgreSQL clusters, AI inference services (Ollama), and automated CI/CD pipelines on bare metal.",
      linkPreview: "/projects/homelab",
      linkSource: "https://github.com/tsb04",
      image: homelab,
      tags: ["Docker", "Traefik", "PostgreSQL", "Self-Hosting", "DevOps", "Homelab"],
    },
  ],
  about: {
    description: `I'm a Full Stack Software Engineer focused on building systems that solve real business problems at scale.

My core stack is Java, Spring Boot, React, TypeScript, and PostgreSQL—backed by Docker and modern cloud-native practices. I specialize in enterprise SaaS architecture, financial systems, and AI integration.

Recently, I've been deep in France's e-invoicing ecosystem, designing compliant workflow engines and secure API integrations. I'm also actively exploring local AI infrastructure—running LLMs with Ollama, building RAG pipelines with vector databases, and experimenting with autonomous agent architectures.

Outside of client work, I maintain a homelab for continuous experimentation with distributed systems, DevOps tooling, and emerging backend technologies.`,
    image: profile,
  },
  skills: {
    backend: ["Java", "Spring Boot", "FastAPI", "REST API Design", "GraphQL", "JPA/Hibernate", "OAuth2/JWT"],
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn/ui"],
    database: ["MySQL", "PostgreSQL", "ChromaDB", "Redis", "Database Design"],
    devops: ["Docker", "Traefik", "Linux", "CI/CD", "Cloud Infrastructure"],
    ai: ["LLM Integration", "Ollama", "RAG", "Vector Databases", "Autonomous Agents"],
  },
};

// French localized content
const frContent: SiteContent = {
  ...baseContent,
  hero: {
    ...baseContent.hero,
    specialty: "Ingénieur Full Stack • Java • Spring Boot • React • IA",
    summary:
      "Je conçois et livre des logiciels enterprise—backends scalables, systèmes intégrés à l'IA, et infrastructure cloud-native. Actuellement, je construis des plateformes SaaS financières et explore l'infrastructure IA locale avec les LLMs et les agents autonomes.",
    availability: "Disponible pour missions freelance",
  },
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
      ],
    },
  ],
  about: {
    description: `Je suis un Ingénieur Logiciel Full Stack concentré sur la construction de systèmes qui résolvent de vrais problèmes business à grande échelle.

Mon stack principal est Java, Spring Boot, React, TypeScript et PostgreSQL—soutenu par Docker et les pratiques cloud-native modernes. Je me spécialise dans l'architecture SaaS enterprise, les systèmes financiers et l'intégration IA.

Récemment, j'ai plongé dans l'écosystème de la facturation électronique française, concevant des moteurs de workflow conformes et des intégrations API sécurisées. J'explore aussi activement l'infrastructure IA locale—exécution de LLMs avec Ollama, construction de pipelines RAG avec des bases de données vectorielles, et expérimentation avec des architectures d'agents autonomes.

En dehors du travail client, je maintiens un homelab pour l'expérimentation continue avec les systèmes distribués, les outils DevOps et les technologies backend émergentes.`,
    image: profileLarge,
  },
};

export function getSiteConfig(locale: Locale = "en"): SiteConfig {
  return {
    ...baseConfig,
    lang: locale,
    title:
      locale === "fr"
        ? "TSB — Ingénieur Full Stack"
        : baseConfig.title,
    description:
      locale === "fr"
        ? "Ingénieur Logiciel Full Stack Senior spécialisé en Java, Spring Boot, React et SaaS enterprise propulsé par l'IA. Construction de systèmes backend scalables, infrastructure cloud et applications web intelligentes."
        : baseConfig.description,
  };
}

export function getSiteContent(locale: Locale = "en"): SiteContent {
  return locale === "fr" ? frContent : baseContent;
}

// Backward compatibility
export const SITE_CONFIG = getSiteConfig("en");
export const SITE_CONTENT = getSiteContent("en");