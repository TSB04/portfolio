/** Lay out real sheets at the current reading size, moving overflow to new sheets. */
export function paginate(sources: HTMLElement[], width: number, height: number, continued: string) {
  const measure = document.createElement("div");
  measure.className = "book-measure";
  measure.inert = true;
  measure.setAttribute("aria-hidden", "true");
  Object.assign(measure.style, { width: `${width}px`, height: `${height}px` });
  document.body.append(measure);
  const pages: HTMLElement[] = [];
  try {
    for (const source of sources) {
      const original = source.querySelector<HTMLElement>(".page-content, .cover-content");
      if (!original) continue;
      let part = 0;
      let inner: HTMLElement;
      let content: HTMLElement;
      let paths = new Map<Element, HTMLElement>();
      const label = source.getAttribute("aria-label") ?? source.querySelector(".page-eyebrow")?.textContent ?? "";
      function next() {
        const page = source.cloneNode(false) as HTMLElement;
        page.className = "booklet-page carnet-page";
        page.removeAttribute("data-density");
        page.removeAttribute("aria-labelledby");
        page.dataset.bookSection = source.id.replace(/-\d+$/, "");
        page.dataset.sourceId = source.id;
        page.id = part ? `${source.id}--part-${part + 1}` : source.id;
        page.setAttribute("aria-label", part ? `${label} · ${continued} ${part + 1}` : label);
        inner = document.createElement("div"); inner.className = "page-inner";
        content = document.createElement("div"); content.className = "page-content";
        const eyebrow = document.createElement("p"); eyebrow.className = "page-eyebrow";
        eyebrow.textContent = part ? `${label} · ${continued} ${part + 1}` : label;
        content.append(eyebrow); inner.append(content); page.append(inner);
        const number = document.createElement("span"); number.className = "page-number"; number.setAttribute("aria-hidden", "true"); page.append(number);
        measure.replaceChildren(page); pages.push(page); paths = new Map(); part++;
      }
      function parent(ancestors: Element[]) {
        let target = content;
        for (const ancestor of ancestors) {
          let wrapper = paths.get(ancestor);
          if (!wrapper) {
            wrapper = ancestor.cloneNode(false) as HTMLElement;
            wrapper.removeAttribute("id"); target.append(wrapper); paths.set(ancestor, wrapper);
          }
          target = wrapper;
        }
        return target;
      }
      const fits = () => inner.scrollHeight <= inner.clientHeight + 1 && content.scrollWidth <= inner.clientWidth;
      function append(node: Node, ancestors: Element[] = []) {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) return;
        let target = parent(ancestors);
        let clone = node.cloneNode(true);
        target.append(clone);
        if (fits()) return;
        const padding = getComputedStyle(inner);
        const available = inner.clientHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom) - 48;
        const oversized = clone instanceof Element && clone.getBoundingClientRect().height > available;
        clone.parentNode?.removeChild(clone);
        // Prefer keeping cards, paragraphs, headings, and list items together.
        if (!oversized && (content.textContent!.trim() !== content.querySelector(".page-eyebrow")!.textContent!.trim() || content.querySelector("img"))) {
          next(); target = parent(ancestors); clone = node.cloneNode(true); target.append(clone);
          if (fits()) return;
          clone.parentNode?.removeChild(clone);
        }
        if (node instanceof Element && node.childNodes.length) {
          Array.from(node.childNodes).forEach((child) => append(child, [...ancestors, node]));
        } else if (node.nodeType === Node.TEXT_NODE) {
          // Unusually long prose is divided at word boundaries at the same font size.
          const words = (node.textContent ?? "").trim().split(/\s+/);
          while (words.length) {
            target = parent(ancestors);
            const text = document.createTextNode(""); target.append(text);
            let lo = 1, hi = words.length, count = 0;
            while (lo <= hi) {
              const mid = Math.floor((lo + hi) / 2); text.textContent = words.slice(0, mid).join(" ");
              if (fits()) { count = mid; lo = mid + 1; } else hi = mid - 1;
            }
            // CSS bounds indivisible media; this guard prevents loops at extreme zoom.
            count = Math.max(1, count); text.textContent = words.splice(0, count).join(" ");
            if (words.length) next();
          }
        } else {
          parent(ancestors).append(node.cloneNode(true));
        }
      }
      next();
      Array.from(original.childNodes).filter((node) => !(node instanceof Element && node.matches(".page-eyebrow"))).forEach((node) => append(node));
    }
    pages.forEach((page, index) => { page.querySelector(".page-number")!.textContent = `${String(index + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`; });
    return pages;
  } finally { measure.remove(); }
}
