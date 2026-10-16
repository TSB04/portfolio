import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, verify, randomUUID } from "node:crypto";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const moduleURL = new URL("../src/lib/github.ts", import.meta.url);
const envKeys = ["GITHUB_APP_ID", "GITHUB_CLIENT_ID", "GITHUB_INSTALLATION_ID", "GITHUB_PRIVATE_KEY_PATH", "GITHUB_PRIVATE_KEY", "GITHUB_OWNER", "GITHUB_REPOSITORIES", "GITHUB_PROJECT_LIMIT"];
const fallback = [{ name: "Local", summary: "Local fallback", linkSource: "", linkPreview: "", image: { src: "/local.webp", width: 1, height: 1, format: "webp" }, tags: [] }];
const json = (data, status = 200) => new Response(JSON.stringify(data), { status });
const repo = (name, overrides = {}) => ({ id: 1, name, full_name: `TSB04/${name}`, owner: { login: "TSB04" }, private: false, visibility: "public", fork: false, archived: false, disabled: false, description: "Repository description", html_url: `https://github.com/TSB04/${name}`, homepage: "demo.example.com", language: "TypeScript", topics: ["web"], stargazers_count: 3, forks_count: 2, pushed_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-02T00:00:00Z", license: { spdx_id: "MIT", name: "MIT License" }, ...overrides });
const fresh = () => import(`${moduleURL.href}?test=${randomUUID()}`);

async function fixture(run) {
  const previousCwd = process.cwd();
  const previousFetch = globalThis.fetch;
  const previousEnv = Object.fromEntries(envKeys.map((name) => [name, process.env[name]]));
  const directory = await mkdtemp(join(tmpdir(), "portfolio-github-test-"));
  envKeys.forEach((name) => delete process.env[name]);
  process.chdir(directory);
  try { await run(directory); }
  finally {
    process.chdir(previousCwd); globalThis.fetch = previousFetch;
    envKeys.forEach((name) => { if (previousEnv[name] === undefined) delete process.env[name]; else process.env[name] = previousEnv[name]; });
    assert.ok(directory.startsWith(join(tmpdir(), "portfolio-github-test-")));
    await rm(directory, { recursive: true, force: true });
  }
}
function publicAPI(repositories, calls = []) {
  return async (url, options) => {
    calls.push({ url, options });
    if (url.includes("/users/")) return json(repositories);
    if (url.endsWith("/languages")) return json({ TypeScript: 750, CSS: 250 });
    if (url.endsWith("/readme")) return json({ encoding: "base64", content: Buffer.from("# Title\n\n[badge-image]: https://badges.example.com/status?token=fixture-badge\n\nA useful repository description from its README, with [documentation](https://example.com) and **readable text**.").toString("base64") });
    throw new Error("Unexpected API request");
  };
}

test("public mode filters private, forked, archived, disabled and foreign repositories before enrichment", async () => fixture(async () => {
  const calls = [];
  globalThis.fetch = publicAPI([
    repo("visible"), repo("private", { private: true, visibility: "private" }), repo("fork", { fork: true }),
    repo("archived", { archived: true }), repo("disabled", { disabled: true }),
    repo("foreign", { owner: { login: "someone-else" } }), repo("TSB04"),
  ], calls);
  const { getGitHubProjects } = await fresh();
  const projects = await getGitHubProjects("en", fallback);
  assert.deepEqual(projects.map((project) => project.name), ["visible"]);
  assert.equal(projects[0].linkPreview, "https://demo.example.com/");
  assert.deepEqual(projects[0].github.languages, [{ name: "TypeScript", percent: 75 }, { name: "CSS", percent: 25 }]);
  assert.match(projects[0].github.readmeExcerpt, /documentation and readable text/);
  assert.ok(!projects[0].github.readmeExcerpt.includes("fixture-badge"));
  assert.ok(!calls.some(({ url }) => /\/repos\/TSB04\/(private|fork|archived|disabled|foreign|TSB04)\//.test(url)));
  const cached = await readFile(".cache/github-projects.json", "utf8");
  assert.ok(!cached.includes('"fullName":"TSB04/private"'));
}));

test("App authentication signs an RS256 JWT and requests only read-only metadata; tokens never enter cache", async () => fixture(async () => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  process.env.GITHUB_CLIENT_ID = "test-client-id";
  process.env.GITHUB_INSTALLATION_ID = "123";
  process.env.GITHUB_REPOSITORIES = "public,private";
  process.env.GITHUB_PRIVATE_KEY = privateKey.export({ type: "pkcs8", format: "pem" });
  let authenticatedList = false;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/access_tokens")) {
      assert.deepEqual(JSON.parse(options.body), { permissions: { metadata: "read" } });
      const [header, claims, signature] = options.headers.Authorization.slice(7).split(".");
      assert.equal(JSON.parse(Buffer.from(header, "base64url")).alg, "RS256");
      const payload = JSON.parse(Buffer.from(claims, "base64url"));
      assert.equal(payload.iss, "test-client-id");
      assert.ok(payload.exp - payload.iat <= 600);
      assert.ok(verify("RSA-SHA256", Buffer.from(`${header}.${claims}`), publicKey, Buffer.from(signature, "base64url")));
      return json({ token: "fixture-installation-token" });
    }
    if (url.includes("/installation/repositories")) {
      authenticatedList = options.headers.Authorization === "Bearer fixture-installation-token";
      return json({ repositories: [repo("public"), repo("private", { private: true, visibility: "private" })] });
    }
    if (url.endsWith("/languages")) return json({ TypeScript: 10 });
    if (url.endsWith("/readme")) { assert.equal(options.headers.Authorization, undefined); return json({}, 404); }
    throw new Error("Unexpected API request");
  };
  const projects = await (await fresh()).getGitHubProjects("en", fallback);
  assert.deepEqual(new Set(projects.map((project) => project.name)), new Set(["public", "private"])); assert.ok(authenticatedList);
  const privateProject = projects.find((project) => project.github.private);
  assert.equal(privateProject.linkSource, "");
  assert.equal(privateProject.github.readmeUrl, "");
  assert.equal(privateProject.github.readmeExcerpt, "");
  const cache = await readFile(".cache/github-projects.json", "utf8");
  for (const forbidden of ["fixture-installation-token", "PRIVATE KEY", "test-client-id"]) assert.ok(!cache.includes(forbidden));
}));

test("explicit repository selection remains newest-first regardless of stars and configured order and safely rejects invalid homepage URLs", async () => fixture(async () => {
  process.env.GITHUB_REPOSITORIES = "second,first";
  globalThis.fetch = publicAPI([repo("first", { pushed_at: "2026-05-01T00:00:00Z", stargazers_count: 100 }), repo("second", { pushed_at: "2026-06-01T00:00:00Z", homepage: "javascript:alert(1)" }), repo("unselected", { stargazers_count: 100 })]);
  const projects = await (await fresh()).getGitHubProjects("fr", fallback);
  assert.deepEqual(projects.map((project) => project.name), ["second", "first"]);
  assert.equal(projects[0].linkPreview, "");
}));

test("placeholder key paths use the public API without requiring production secrets locally", async () => fixture(async () => {
  process.env.GITHUB_APP_ID = "fixture-app"; process.env.GITHUB_INSTALLATION_ID = "123";
  process.env.GITHUB_PRIVATE_KEY_PATH = join(process.cwd(), "missing.pem");
  globalThis.fetch = publicAPI([repo("public")]);
  assert.equal((await (await fresh()).getGitHubProjects("en", fallback))[0].name, "public");
}));

test("fresh cache avoids API calls; stale public cache survives rate limits; cold failures preserve local projects", async () => fixture(async () => {
  globalThis.fetch = publicAPI([repo("cached")]);
  await (await fresh()).getGitHubProjects("en", fallback);
  let calls = 0;
  globalThis.fetch = async () => { calls++; return json({}, 403); };
  assert.equal((await (await fresh()).getGitHubProjects("fr", fallback))[0].name, "cached");
  assert.equal(calls, 0);
  const file = ".cache/github-projects.json";
  const cache = JSON.parse(await readFile(file, "utf8")); cache.fetchedAt = 0;
  await writeFile(file, JSON.stringify(cache));
  assert.equal((await (await fresh()).getGitHubProjects("en", fallback))[0].name, "cached");
  assert.ok(calls > 0);
  await rm(file);
  assert.deepEqual(await (await fresh()).getGitHubProjects("en", fallback), fallback);
}));

 test("projects sort by last push with updated-date fallback before applying the limit", async () => fixture(async () => {
  process.env.GITHUB_PROJECT_LIMIT = "2";
  globalThis.fetch = publicAPI([repo("old-popular", { stargazers_count: 1000 }), repo("new", { pushed_at: "2026-09-01T00:00:00Z", stargazers_count: 0 }), repo("no-push", { pushed_at: null, updated_at: "2026-10-01T00:00:00Z" })]);
  const projects = await (await fresh()).getGitHubProjects("en", fallback);
  assert.deepEqual(projects.map((project) => project.name), ["no-push", "new"]);
}));

test("App access alone does not publish private repository metadata", async () => fixture(async () => {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  process.env.GITHUB_APP_ID = "fixture-app";
  process.env.GITHUB_INSTALLATION_ID = "123";
  process.env.GITHUB_PRIVATE_KEY = privateKey.export({ type: "pkcs8", format: "pem" });
  const calls = [];
  const publicFetch = publicAPI([], calls);
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/access_tokens")) return json({ token: "fixture-installation-token" });
    if (url.includes("/installation/repositories")) return json({ repositories: [repo("visible"), repo("unselected-private", { private: true, visibility: "private" })] });
    return publicFetch(url, options);
  };
  const projects = await (await fresh()).getGitHubProjects("en", fallback);
  assert.deepEqual(projects.map((project) => project.name), ["visible"]);
  assert.ok(!calls.some(({ url }) => url.includes("unselected-private")));
  const cache = await readFile(".cache/github-projects.json", "utf8");
  assert.ok(!cache.includes("unselected-private"));
}));
