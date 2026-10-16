/** Continuation sheet numbers vary by language; retain the stable source chapter. */
export function getLocaleHash(hash: string): string {
  const section = hash.replace(/^#/, "").replace(/--part-\d+$/, "");
  return /^(hero|contents|experience(?:-\d+)?|projects(?:-\d+)?|skills(?:-\d+)?|about|education|principles|community|contact)$/.test(section)
    ? `#${section}` : "";
}
