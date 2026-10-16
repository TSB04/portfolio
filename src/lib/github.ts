// Build/server only. Import this module exclusively from Astro frontmatter.
import { createPrivateKey, sign } from "node:crypto";
import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { homedir } from "node:os";
import type { Locale, ProjectItem } from "@types";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  private: boolean;
  visibility?: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  updated_at: string;
  license: { spdx_id: string; name: string } | null;
}
interface GitHubProject {
  private: boolean;
  fullName: string;
  name: string;
  description: string;
  url: string;
  homepage: string;
  topics: string[];
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  license: string | null;
  languages: { name: string; percent: number }[];
  readmeExcerpt: string;
}

const API = "https://api.github.com";
const cacheFile = resolve(".cache/github-projects.json");
const cacheTTL = 60 * 60 * 1000;
const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "tsb-portfolio-build" };
const env = (name: string): string => import.meta.env?.[name] || process.env[name] || "";
let pending: Promise<GitHubProject[]> | undefined;
let pendingUntil = 0;

class GitHubError extends Error {
  status: number;
  constructor(status: number) { super(`GitHub HTTP ${status}`); this.status = status; }
}
async function request<T>(path: string, token?: string, body?: object): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new GitHubError(response.status);
  return response.json() as Promise<T>;
}
async function installationToken(): Promise<string | undefined> {
  const issuer = env("GITHUB_CLIENT_ID") || env("GITHUB_APP_ID");
  const installation = env("GITHUB_INSTALLATION_ID");
  const path = env("GITHUB_PRIVATE_KEY_PATH");
  const pem = env("GITHUB_PRIVATE_KEY");
  if (!issuer || !installation || (!path && !pem)) return;
  let keyText = pem.replace(/\\n/g, "\n");
  if (!keyText) {
    try {
      const expanded = path.replace(/^~(?=[/\\])/, homedir()).replace(/%([^%]+)%/g, (_, name: string) => process.env[name] || "");
      keyText = await readFile(resolve(expanded), "utf8");
    } catch {
      console.info("[github] App key file unavailable in this environment; using public GitHub data.");
      return;
    }
  }
  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iat: now - 60, exp: now + 540, iss: issuer })}`;
  const jwt = `${unsigned}.${sign("RSA-SHA256", Buffer.from(unsigned), createPrivateKey(keyText)).toString("base64url")}`;
  const auth = await request<{ token: string }>(`/app/installations/${encodeURIComponent(installation)}/access_tokens`, jwt, { permissions: { metadata: "read" } });
  return auth.token;
}
function safeWebURL(value: string | null): string {
  if (!value) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch { return ""; }
}
function readmeText(markdown: string): string {
  const cleaned = markdown.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, "")
    .replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "")
    .replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\r/g, "");
  const paragraphs = cleaned.split(/\n\s*\n/).map((p) => p.trim()).filter((p) =>
    p.length > 45 && !/^(?:#{1,6}\s|[|>\[]|[-*]\s|https?:\/\/)/.test(p));
  const text = (paragraphs[0] || "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
  return text.length > 600 ? `${text.slice(0, 597).replace(/\s+\S*$/, "")}…` : text;
}
async function enrich(repo: Repository, token?: string): Promise<GitHubProject> {
  const endpoint = `/repos/${repo.full_name.split("/").map(encodeURIComponent).join("/")}`;
  const [languages, readme] = await Promise.allSettled([
    request<Record<string, number>>(`${endpoint}/languages`, token),
    // Private source content stays private; only project metadata is displayed.
    repo.private ? Promise.resolve({} as { content?: string; encoding?: string }) : request<{ content?: string; encoding?: string }>(`${endpoint}/readme`),
  ]);
  const entries = languages.status === "fulfilled" ? Object.entries(languages.value).filter(([, size]) => typeof size === "number" && size > 0).sort((a, b) => b[1] - a[1]) : [];
  const bytes = entries.reduce((sum, [, size]) => sum + size, 0);
  const excerpt = readme.status === "fulfilled" && readme.value.encoding === "base64" && readme.value.content && readme.value.content.length < 1_000_000
    ? readmeText(Buffer.from(readme.value.content, "base64").toString("utf8")) : "";
  return {
    private: repo.private, fullName: repo.full_name, name: repo.name, description: repo.description || "", url: repo.html_url,
    homepage: safeWebURL(repo.homepage), topics: (repo.topics || []).slice(0, 10), language: repo.language,
    stars: repo.stargazers_count, forks: repo.forks_count, updatedAt: repo.pushed_at || repo.updated_at,
    license: repo.license ? (repo.license.spdx_id === "NOASSERTION" ? repo.license.name : repo.license.spdx_id) : null,
    languages: entries.map(([name, size]) => ({ name, percent: Math.round(size / bytes * 1000) / 10 })), readmeExcerpt: excerpt,
  };
}
async function load(owner: string): Promise<GitHubProject[]> {
  const include = env("GITHUB_REPOSITORIES").split(/[\s,]+/).filter(Boolean).map((name) => name.includes("/") ? name.toLowerCase() : `${owner}/${name}`.toLowerCase());
  const limit = Math.min(24, Math.max(1, Number.parseInt(env("GITHUB_PROJECT_LIMIT"), 10) || 12));
  const key = JSON.stringify({ version: 4, owner: owner.toLowerCase(), include, limit, installation: env("GITHUB_INSTALLATION_ID"), authenticated: !!((env("GITHUB_CLIENT_ID") || env("GITHUB_APP_ID")) && (env("GITHUB_PRIVATE_KEY_PATH") || env("GITHUB_PRIVATE_KEY"))) });
  let cached: { key: string; fetchedAt: number; projects: GitHubProject[] } | undefined;
  try {
    const data = JSON.parse(await readFile(cacheFile, "utf8"));
    if (data.key === key && Array.isArray(data.projects) && (!JSON.parse(key).authenticated || data.authenticated === true)) cached = data;
  } catch { /* A cache is optional and never contains credentials. */ }
  if (cached && Date.now() - cached.fetchedAt < cacheTTL) return cached.projects;
  try {
    const token = await installationToken();
    const repos: Repository[] = [];
    for (let page = 1; page <= 10; page++) {
      const data = token
        ? await request<{ repositories: Repository[] }>(`/installation/repositories?per_page=100&page=${page}`, token).then((data) => data.repositories)
        : await request<Repository[]>(`/users/${encodeURIComponent(owner)}/repos?type=owner&sort=pushed&per_page=100&page=${page}`);
      // Private metadata requires both App access and explicit repository selection.
      repos.push(...data.filter((repo) => ((!repo.private && (!repo.visibility || repo.visibility === "public")) || (token && repo.private && include.includes(repo.full_name.toLowerCase()))) && !repo.fork && !repo.archived && !repo.disabled && repo.owner.login.toLowerCase() === owner.toLowerCase() && repo.name.toLowerCase() !== owner.toLowerCase() && /^[\w.-]+\/[\w.-]+$/.test(repo.full_name)));
      if (data.length < 100) break;
    }
    const selected = repos.filter((repo) => !include.length || include.includes(repo.full_name.toLowerCase())).sort((a, b) =>
      (b.pushed_at || b.updated_at).localeCompare(a.pushed_at || a.updated_at) || a.full_name.localeCompare(b.full_name)
    ).slice(0, limit);
    const projects: GitHubProject[] = [];
    for (let i = 0; i < selected.length; i += 4) projects.push(...await Promise.all(selected.slice(i, i + 4).map((repo) => enrich(repo, token))));
    if (!projects.length) throw new Error("No matching projects");
    try {
      await mkdir(resolve(".cache"), { recursive: true });
      const temporary = `${cacheFile}.${process.pid}.tmp`;
      await writeFile(temporary, JSON.stringify({ key, authenticated: !!token, fetchedAt: Date.now(), projects }));
      await rename(temporary, cacheFile);
    } catch { console.warn("[github] Project metadata loaded; local cache could not be written."); }
    console.info(`[github] Loaded ${projects.length} projects, including ${projects.filter((project) => project.private).length} private (${token ? "GitHub App" : "public API"}).`);
    return projects;
  } catch (error) {
    const reason = error instanceof GitHubError ? `HTTP ${error.status}` : "connection or App configuration unavailable";
    if (cached?.projects.length) { console.warn(`[github] ${reason}; using previously fetched project metadata.`); return cached.projects; }
    console.warn(`[github] ${reason}; using configured portfolio projects.`);
    return [];
  }
}

export async function getGitHubProjects(locale: Locale, fallback: ProjectItem[], owner = "tsb04"): Promise<ProjectItem[]> {
  if (!fallback.length || !/^[\w-]+$/.test(env("GITHUB_OWNER") || owner)) return fallback;
  if (Date.now() > pendingUntil) { pending = undefined; pendingUntil = Date.now() + 60_000; }
  const projects = await (pending ??= load(env("GITHUB_OWNER") || owner));
  if (!projects.length) return fallback;
  return projects.map((repo) => {
    const custom = fallback.find((project) => project.linkSource.toLowerCase() === repo.url.toLowerCase());
    return {
      name: repo.name, summary: repo.description || repo.readmeExcerpt || (locale === "fr" ? "Consultez le dépôt pour découvrir ce projet." : "Explore the repository to learn about this project."),
      linkSource: repo.private ? "" : repo.url, linkPreview: repo.homepage, image: custom?.image || fallback[0].image,
      tags: [...new Set([repo.language, ...repo.topics].filter((tag): tag is string => !!tag))],
      github: { private: repo.private, fullName: repo.fullName, stars: repo.stars, forks: repo.forks, updatedAt: repo.updatedAt, license: repo.license, language: repo.language, languages: repo.languages, readmeUrl: repo.private ? "" : `${repo.url}#readme`, readmeExcerpt: repo.description ? repo.readmeExcerpt : "", hasImage: !!custom },
    };
  });
}
