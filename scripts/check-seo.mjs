import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dist = new URL("../dist/", import.meta.url);
const read = (path) => readFile(new URL(path, dist), "utf8");
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([tag]) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])));
const localAsset = async (url) => {
  const parsed = new URL(url, "https://tsb-dev.fr");
  if (parsed.origin === "https://tsb-dev.fr") await access(new URL(parsed.pathname.slice(1), dist));
};

const expected = ["https://tsb-dev.fr/en/", "https://tsb-dev.fr/fr/"];
const sitemapIndex = await read("sitemap-index.xml");
assert.ok(sitemapIndex.includes("https://tsb-dev.fr/sitemap-0.xml"));
const sitemap = await read("sitemap-0.xml");
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url).sort(), expected);
assert.equal((sitemap.match(/hreflang="x-default"/g) || []).length, 2);
const robots = await read("robots.txt");
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert.match(robots, /Sitemap: https:\/\/tsb-dev\.fr\/sitemap-index\.xml/);
assert.ok(!/Disallow:\s*\//.test(robots));

for (const locale of ["en", "fr"]) {
  const html = await read(`${locale}/index.html`);
  const meta = tags(html, "meta");
  const links = tags(html, "link");
  const value = (key) => meta.find((tag) => tag.name === key || tag.property === key)?.content;
  assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`));
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && title.length < 75);
  assert.equal((title.match(/Thierno Sadou BARRY/g) || []).length, 1);
  assert.ok(value("description")?.length >= 100 && value("description").length <= 165);
  assert.ok(value("robots")?.includes("index, follow") && !value("robots").includes("noindex"));
  const canonical = links.filter((tag) => tag.rel === "canonical");
  assert.equal(canonical.length, 1);
  assert.equal(canonical[0].href, `https://tsb-dev.fr/${locale}/`);
  assert.equal(value("og:url"), canonical[0].href);
  assert.equal(value("og:title"), title);
  for (const lang of ["en", "fr", "x-default"]) {
    const target = `https://tsb-dev.fr/${lang === "x-default" ? "en" : lang}/`;
    assert.equal(links.find((tag) => tag.hreflang === lang)?.href, target);
  }
  assert.equal(value("og:image:width"), "1200");
  assert.equal(value("og:image:height"), "630");
  assert.equal(value("twitter:card"), "summary_large_image");
  assert.equal(value("twitter:image"), value("og:image"));
  await localAsset(value("og:image"));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const id of ["hero", "contents", "experience", "projects", "skills", "about", "contact"]) {
    assert.ok(html.includes(`id="${id}"`), `Server-rendered ${id} missing in ${locale}`);
  }
  const json = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, "Structured data missing");
  const graph = JSON.parse(json)["@graph"];
  assert.ok(graph.some((node) => node["@type"] === "WebSite"));
  const person = graph.find((node) => node["@type"] === "Person");
  const page = graph.find((node) => node["@type"] === "ProfilePage");
  assert.equal(page.url, canonical[0].href);
  assert.equal(page.mainEntity["@id"], person["@id"]);
  if (person.image) await localAsset(person.image);
  for (const tag of links.filter((tag) => ["icon", "apple-touch-icon", "manifest"].includes(tag.rel))) await localAsset(tag.href);
  for (const img of tags(html, "img")) {
    assert.ok("alt" in img && Number(img.width) > 0 && Number(img.height) > 0);
    await localAsset(img.src);
  }
  const legacy = await read(`${locale}/card/index.html`);
  assert.match(legacy, new RegExp(`url=/${locale}/`, "i"));
  console.log(`SEO checks passed: /${locale}/`);
}
const image = await sharp(fileURLToPath(new URL("og-image.png", dist))).metadata();
assert.equal(image.width, 1200);
assert.equal(image.height, 630);
console.log("Sitemap, robots, metadata, structured data, social card, and local asset checks passed.");
