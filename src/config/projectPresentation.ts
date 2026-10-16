import type { Locale, ProjectItem } from "@types";
import { frenchProjectSummaries } from "./projectTranslations.ts";

const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
const displayNames: Record<string, string> = { saay: "SAAY", sunustream: "SunuStream", invora: "Invora", automationtool: "Automation Tools", automationtools: "Automation Tools" };
const priorities = ["saay", "sunustream", "invora", "automationtool", "automationtools"];
// Editorial descriptions use owner-provided portfolio content and approved repository metadata.
// Private READMEs and source files are never fetched to generate these overviews.
const overviews: Record<string, Record<Locale, string[]>> = {
  saay: {
    en: ["SAAY is a local-first AI engineering environment that connects portable developer tools to AI services running in a personal homelab. A USB client opens a secure tunnel into the environment, bringing the workspace to the machine being used.", "The umbrella repository brings together Studio for project-aware coding assistance, API tooling for endpoint testing and orchestration, the USB launcher, the AI core, and the homelab and edge components. The component cards below show how these repositories fit together and which revisions the workspace uses."],
    fr: ["SAAY est un environnement d’ingénierie IA local qui relie des outils de développement portables à des services IA hébergés dans un homelab personnel. Un client USB ouvre un tunnel sécurisé vers cet environnement pour retrouver son espace de travail depuis la machine utilisée.", "Le dépôt principal rassemble Studio pour l’assistance au code, les outils API pour tester et orchestrer les endpoints, le lanceur USB, le cœur IA et les composants homelab et edge. Les fiches ci-dessous présentent ces dépôts et les révisions utilisées par le workspace."],
  },
  sunustream: {
    en: ["SunuStream is my streaming-platform project, bringing the viewer-facing experience and the services behind content delivery into one product. It builds on my work with Next.js, microservices and containerized infrastructure.", "The project connects frontend development with the operational side of a streaming service: organizing the viewing experience, delivering media and running the supporting application services. It provides a setting for working across interface design, application services and deployment."],
    fr: ["SunuStream est mon projet de plateforme de streaming : il réunit l’expérience de visionnage et les services qui assurent la diffusion des contenus. Il s’appuie sur mon travail avec Next.js, les microservices et les infrastructures conteneurisées.", "Le projet associe le développement frontend aux besoins d’exploitation d’un service de streaming : organiser le parcours de visionnage, diffuser les médias et faire fonctionner les services applicatifs. Il permet de travailler sur les interfaces, les services et leur déploiement."],
  },
  invora: {
    en: ["Invora is an AI-powered invoice intelligence platform that turns invoice documents into structured electronic invoices. It focuses on the transition from a document intended for a person to data that an invoicing workflow can process.", "The project brings document understanding and electronic invoicing together in a Java-based codebase. The architecture illustration provides a wider view of the platform; open it at full size to inspect the individual services and their connections."],
    fr: ["Invora est une plateforme d’analyse de factures par IA qui transforme des documents en factures électroniques structurées. Elle traite le passage d’un document destiné à une personne vers des données exploitables dans un processus de facturation.", "Le projet réunit la compréhension documentaire et la facturation électronique dans une base de code Java. Le schéma d’architecture présente la plateforme dans son ensemble ; ouvrez-le en grand pour examiner les services et leurs connexions."],
  },
  automationtool: {
    en: ["Automation Tools automates the search for driving-exam appointments on the official French booking platform. It covers the workflow from detecting an available slot to notifying the user and handling a reservation.", "The repository is implemented primarily in Go, with Docker and shell tooling alongside the application. Its purpose is to replace repeated manual availability checks with a repeatable detection, notification and booking workflow."],
    fr: ["Automation Tools automatise la recherche de créneaux d’examen de conduite sur la plateforme officielle française. Il couvre le parcours allant de la détection d’un créneau disponible à la notification de l’utilisateur et à la réservation.", "Le dépôt est principalement développé en Go, avec des outils Docker et shell autour de l’application. Il vise à remplacer les vérifications manuelles répétées par un processus reproductible de détection, notification et réservation."],
  },
};

export function presentProjects(projects: ProjectItem[], locale: Locale): ProjectItem[] {
  const rank = (project: ProjectItem) => {
    const index = priorities.indexOf(key(project.name));
    return index < 0 ? priorities.length : index === 4 ? 3 : index;
  };
  return projects.map((project) => {
    const id = key(project.name);
    const editorial = overviews[id === "automationtools" ? "automationtool" : id]?.[locale];
    const summary = locale === "fr" ? frenchProjectSummaries[id] ?? project.summary : project.summary;
    const overview = editorial ? [...editorial] : [summary];
    const languages = project.github?.languages.slice(0, 4).map((language) => language.name) ?? [];
    if (!editorial && languages.length) overview.push(locale === "fr"
      ? `Le code de ce dépôt utilise ${languages.join(", ")}. La répartition ci-dessous indique la place de chaque langage dans le projet.`
      : `This repository uses ${languages.join(", ")}. The breakdown below shows how these languages contribute to the codebase.`);
    const components = project.github?.submodules ?? [];
    if (!editorial && components.length) overview.push(locale === "fr"
      ? `Le projet relie ${components.length} composants : ${components.map((component) => component.name).join(", ")}. Leurs chemins et révisions sont détaillés ci-dessous.`
      : `The project links ${components.length} components: ${components.map((component) => component.name).join(", ")}. Their paths and pinned revisions are listed below.`);
    return { ...project, name: displayNames[id] ?? project.name, summary: overview[0], overview, featured: rank(project) < priorities.length };
  }).sort((a, b) => rank(a) - rank(b)); // Stable: preserve GitHub recency within the remaining projects.
}
