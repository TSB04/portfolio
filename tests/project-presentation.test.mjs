import test from "node:test";
import assert from "node:assert/strict";
import { presentProjects } from "../src/config/projectPresentation.ts";
const project = (name) => ({ name, summary: "Description", linkSource: "", linkPreview: "", image: {}, tags: [] });
test("priority projects lead in the requested order while other projects preserve recency", () => {
 const input = ["recent", "Invora", "automation-tool", "older", "sunustream", "saay"] .map(project);
 const output = presentProjects(input, "en");
 assert.deepEqual(output.map((item) => item.name), ["SAAY", "SunuStream", "Invora", "Automation Tools", "recent", "older"]);
 assert.equal(output.filter((item) => item.featured).length, 4);
 assert.ok(output.slice(0, 4).every((item) => item.overview.length === 2 && item.summary.length > 100));
 assert.equal(input[0].overview, undefined);
});
test("French editorial text and metadata context do not need private README or source links", () => {
 const [featured] = presentProjects([project("Invora")], "fr");
 assert.match(featured.summary, /factures/);
 const privateProject = { ...project("private"), github: { private: true, languages: [{ name: "Go", percent: 100 }], submodules: [{ name: "worker" }] } };
 const [output] = presentProjects([privateProject], "en");
 assert.equal(output.overview.length, 3);
 assert.match(output.overview[1], /Go/); assert.match(output.overview[2], /worker/);
 assert.equal(output.linkSource, "");
});
