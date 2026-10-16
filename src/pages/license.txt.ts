import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const GET: APIRoute = async () => {
  const license = await readFile(resolve("LICENSE"), "utf8");
  const notice = await readFile(resolve("NOTICE"), "utf8");
  return new Response(`${license}\n${notice}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
