class HeroSummary extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    this.cleanup?.();
    const items = Array.from(this.querySelectorAll<HTMLElement>(".summary-item"));
    if (!items.length) return;
    const writing = items.map((item) => item.querySelector<HTMLElement>(".summary-writing")!);
    const texts = writing.map((element) => Array.from(element.textContent ?? ""));
    const controls = this.querySelector<HTMLElement>(".summary-controls")!;
    const pause = this.querySelector<HTMLButtonElement>("[data-summary-pause]")!;
    const count = this.querySelector<HTMLElement>(".summary-count")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    const { signal } = controller;
    let index = 0;
    let position = 0;
    let hold = 0;
    let paused = motion.matches;
    let visible = false;
    let timer = 0;

    const updatePause = () => {
      pause.textContent = paused ? "▶" : "Ⅱ";
      pause.setAttribute("aria-label", (paused ? pause.dataset.playLabel : pause.dataset.pauseLabel) ?? "");
    };
    const select = (next: number) => {
      index = (next + items.length) % items.length;
      position = motion.matches ? texts[index].length : 0;
      hold = 0;
      items.forEach((item, i) => {
        item.classList.toggle("is-current", i === index);
        item.inert = i !== index;
        item.setAttribute("aria-hidden", String(i !== index));
      });
      writing[index].textContent = texts[index].slice(0, position).join("");
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      this.classList.toggle("is-typing", position < texts[index].length && !paused);
    };
    const tick = () => {
      if (visible && !document.hidden && !this.closest('[aria-hidden="true"]') && !paused && !motion.matches) {
        if (position < texts[index].length) {
          position = Math.min(position + 2, texts[index].length);
          writing[index].textContent = texts[index].slice(0, position).join("");
          this.classList.toggle("is-typing", position < texts[index].length);
        } else if (++hold > 150 && items.length > 1 && !this.matches(":hover, :focus-within")) select(index + 1);
      }
      timer = window.setTimeout(tick, visible && !document.hidden && !paused && !this.closest('[aria-hidden="true"]') ? 35 : 250);
    };
    this.querySelector("[data-summary-prev]")?.addEventListener("click", () => select(index - 1), { signal });
    this.querySelector("[data-summary-next]")?.addEventListener("click", () => select(index + 1), { signal });
    pause.addEventListener("click", () => {
      paused = !paused;
      // Reduced motion always presents complete text, with manual navigation.
      if (motion.matches) paused = true;
      this.classList.toggle("is-typing", !paused && position < texts[index].length);
      updatePause();
    }, { signal });
    motion.addEventListener("change", () => {
      paused = motion.matches;
      select(index);
      updatePause();
      pause.hidden = motion.matches;
    }, { signal });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(this);
    controls.hidden = false;
    pause.hidden = motion.matches;
    select(0);
    updatePause();
    tick();
    this.cleanup = () => { clearTimeout(timer); observer.disconnect(); controller.abort(); };
  }

  disconnectedCallback() { this.cleanup?.(); }
}

if (!customElements.get("hero-summary")) customElements.define("hero-summary", HeroSummary);
