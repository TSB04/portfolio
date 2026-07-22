import type { SiteConfig, SiteContent } from "../types";

export const SITE_CONFIG: SiteConfig = {
  title: "Thierno Sadou BARRY — Full Stack Engineer",
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
  siteLogo: "/profile-small.jpg",

  navLinks: [
    { text: "Experience", href: "#experience" },
    { text: "Projects", href: "#projects" },
    { text: "About", href: "#about" },
    { text: "Contact", href: "#contact" },
  ],

  socialLinks: [
    {
      text: "LinkedIn",
      href: "https://linkedin.com/in/tsb04",
    },
    {
      text: "GitHub",
      href: "https://github.com/tsb04",
    },
    {
      text: "Portfolio",
      href: "https://tsb-dev.fr",
    },
  ],

  socialImage: "/og-image.png",
  canonicalURL: "https://tsb-dev.fr",
};

export const SITE_CONTENT: SiteContent = {
  hero: {
    name: "Thierno Sadou BARRY",
    specialty: "Full Stack Engineer • Java • Spring Boot • React • AI",
    summary:
      "I architect and ship enterprise-grade software—scalable backends, AI-integrated systems, and cloud-native infrastructure. Currently building financial SaaS platforms and exploring local AI infrastructure with LLMs and autonomous agents.",
    email: "thierno.sadou.barry98@gmail.com",
    availability: "Open to freelance & full-time opportunities",
    location: "France", // Add if accurate
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
      image: "/projects/saay-agent.png",
      tags: ["Rust", "FastAPI", "Ollama", "ChromaDB", "LLM", "RAG"],
    },
    {
      name: "Enterprise Invoice Platform",
      summary:
        "End-to-end invoice management system integrating French PDP providers for electronic invoicing compliance. Features workflow automation, real-time document synchronization, and secure API gateways for B2B transactions.",
      linkPreview: "/projects/invoice-platform",
      linkSource: "https://github.com/tsb04",
      image: "/projects/invoice.png",
      tags: ["Spring Boot", "React", "PostgreSQL", "Docker", "PDP APIs", "E-invoicing"],
    },
    {
      name: "SunuFlix",
      summary:
        "High-performance streaming platform built with Next.js and a microservices backend. Optimized for content delivery, user personalization, and horizontal scalability on cloud infrastructure.",
      linkPreview: "/projects/sunuflix",
      linkSource: "https://github.com/tsb04",
      image: "/projects/sunuflix.png",
      tags: ["Next.js", "Microservices", "Cloud-Native", "Streaming"],
    },
    {
      name: "Personal Homelab",
      summary:
        "Self-hosted development and production infrastructure running Docker, Traefik reverse proxy, PostgreSQL clusters, AI inference services (Ollama), and automated CI/CD pipelines on bare metal.",
      linkPreview: "/projects/homelab",
      linkSource: "https://github.com/tsb04",
      image: "/projects/homelab.png",
      tags: ["Docker", "Traefik", "PostgreSQL", "Self-Hosting", "DevOps", "Homelab"],
    },
  ],

  about: {
    description: `I'm a Full Stack Software Engineer focused on building systems that solve real business problems at scale.

My core stack is Java, Spring Boot, React, TypeScript, and PostgreSQL—backed by Docker and modern cloud-native practices. I specialize in enterprise SaaS architecture, financial systems, and AI integration.

Recently, I've been deep in France's e-invoicing ecosystem, designing compliant workflow engines and secure API integrations. I'm also actively exploring local AI infrastructure—running LLMs with Ollama, building RAG pipelines with vector databases, and experimenting with autonomous agent architectures.

Outside of client work, I maintain a homelab for continuous experimentation with distributed systems, DevOps tooling, and emerging backend technologies.`,
    image: "/profile-large.jpg",
  },

  skills: {
    backend: ["Java", "Spring Boot", "FastAPI", "REST API Design", "GraphQL", "JPA/Hibernate", "OAuth2/JWT"],
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn/ui"],
    database: ["MySQL","PostgreSQL", "ChromaDB", "Redis", "Database Design"],
    devops: ["Docker", "Traefik", "Linux", "CI/CD", "Cloud Infrastructure"],
    ai: ["LLM Integration", "Ollama", "RAG", "Vector Databases", "Autonomous Agents"],
  },
};