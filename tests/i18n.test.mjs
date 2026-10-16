import test from "node:test";
import assert from "node:assert/strict";
import { en } from "../src/i18n/en.ts";
import { fr } from "../src/i18n/fr.ts";
import { getLocaleHash } from "../src/i18n/routing.ts";
import { presentProjects } from "../src/config/projectPresentation.ts";

function strings(value, prefix = "") {
  return Object.entries(value).flatMap(([key, item]) => typeof item === "string"
    ? [[`${prefix}${key}`, item]] : strings(item, `${prefix}${key}.`));
}

test("both locale dictionaries contain the same nonempty keys and valid Unicode", () => {
  const english = strings(en);
  const french = strings(fr);
  assert.deepEqual(english.map(([key]) => key).sort(), french.map(([key]) => key).sort());
  for (const [key, text] of [...english, ...french]) {
    assert.ok(text.trim(), `Empty translation: ${key}`);
    assert.doesNotMatch(text, /\uFFFD|\u00c3[\u0080-\u00bf]|\u00e2\u20ac/, `Damaged Unicode: ${key}`);
  }
  assert.equal(fr.reader.previousPage, "Page précédente");
  assert.equal(fr.experiences.present, "Aujourd’hui");
  assert.notEqual(en.skills.labels["Database Design"], fr.skills.labels["Database Design"]);
});

test("language switching preserves source chapters and drops locale-specific continuation numbers", () => {
  for (const hash of ["#about", "#contact", "#projects-3", "#skills-2"]) assert.equal(getLocaleHash(hash), hash);
  assert.equal(getLocaleHash("#projects-3--part-12"), "#projects-3");
  assert.equal(getLocaleHash("#about--part-2"), "#about");
  for (const hash of ["", "#unknown", "https://example.com", "#projects/../../"]) assert.equal(getLocaleHash(hash), "");
});

test("French private-project summaries are localized without exposing source content", () => {
  const [project] = presentProjects([{ name: "saay-studio", summary: "English repository description", tags: [], image: {}, linkSource: "", linkPreview: "" }], "fr");
  assert.match(project.summary, /assistance au développement/);
  assert.doesNotMatch(project.summary, /English repository/);
  assert.equal(project.linkSource, "");
});
