import { PageFlip } from "page-flip";
import { paginate } from "./paginate";

type View = "start" | "book" | "end";
let dispose: (() => void) | undefined;

function initBook() {
  dispose?.();
  const book = document.querySelector<HTMLElement>("#book");
  const opening = document.getElementById("hero");
  const reading = document.getElementById("reading");
  const ending = document.getElementById("contact");
  if (!book || !opening || !reading || !ending) return;
  const sources = Array.from(book.querySelectorAll<HTMLElement>(".booklet-page")).map((page) => page.cloneNode(true) as HTMLElement);
  if (sources.length < 2) return;
  const stages = { start: opening, book: reading, end: ending };
  const controller = new AbortController();
  const { signal } = controller;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.getElementById("site-header");
  const ui = Array.from(document.querySelectorAll<HTMLElement>("[data-reader-ui]"));
  const uiTimers = new Map<HTMLElement, number>();
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-book-step]"));
  const progress = document.querySelector<HTMLElement>("[data-book-progress]");
  const continued = book.dataset.continued ?? "Continued";
  let view: View = "start";
  let busy = false;
  let cooldown = 0;
  let wheelTotal = 0;
  let wheelTime = 0;
  let resizeTimer = 0;
  let entrance: Animation[] = [];
  let stageAnimation: Animation | undefined;
  document.body.classList.add("book-turn-active");
  document.body.dataset.portfolioView = view;

  const size = () => ({ width: book.clientWidth < 960 ? book.clientWidth : book.clientWidth / 2, height: book.clientHeight });
  const geometry = size();
  let pages = paginate(sources, geometry.width, geometry.height, continued);
  book.replaceChildren(...pages);
  let pageMap = new Map(pages.map((page, index) => [page.id, index]));
  const flip = new PageFlip(book, {
    ...geometry, size: "stretch", minWidth: 480, maxWidth: 10000, minHeight: 100, maxHeight: 10000,
    showCover: false, usePortrait: true, autoSize: false, mobileScrollSupport: true,
    maxShadowOpacity: .38, drawShadow: true, flippingTime: reduced.matches ? 1 : 850,
    disableFlipByClick: true, showPageCorners: !reduced.matches, startZIndex: 10,
  });
  const isLastSpread = () => flip.getCurrentPageIndex() + (flip.getOrientation() === "landscape" ? 2 : 1) >= pages.length;

  function hideChrome() {
    ui.forEach((element) => { clearTimeout(uiTimers.get(element)); element.classList.remove("is-near"); });
  }
  function reveal(element: HTMLElement, transient = false) {
    clearTimeout(uiTimers.get(element));
    element.classList.add("is-near");
    if (transient) uiTimers.set(element, window.setTimeout(() => element.classList.remove("is-near"), 2400));
  }
  // Pointer proximity is checked at most once per rendered frame.
  let pointerFrame = 0;
  let pointer = { x: -1000, y: -1000 };
  function updateProximity() {
    pointerFrame = 0;
    if (view !== "book") return;
    ui.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const near = pointer.x >= rect.left - 48 && pointer.x <= rect.right + 48 && pointer.y >= rect.top - 48 && pointer.y <= rect.bottom + 48;
      if (near) reveal(element);
      else if (!element.matches(":has(:focus-visible), :hover")) {
        clearTimeout(uiTimers.get(element));
        uiTimers.set(element, window.setTimeout(() => element.classList.remove("is-near"), 450));
      }
    });
  }
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!pointerFrame) pointerFrame = requestAnimationFrame(updateProximity);
  }, { passive: true, signal });
  document.documentElement.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "touch") hideChrome();
  }, { signal });
  ui.forEach((element) => {
    element.addEventListener("focusin", () => reveal(element), { signal });
    element.addEventListener("focusout", () => {
      uiTimers.set(element, window.setTimeout(() => { if (!element.matches(":has(:focus-visible), :hover")) element.classList.remove("is-near"); }, 450));
    }, { signal });
  });
  function sync(index: number, animate = true) {
    const landscape = flip.getOrientation() === "landscape";
    document.body.dataset.bookOrientation = landscape ? "landscape" : "portrait";
    const visible = new Set([index]);
    if (landscape && index < pages.length - 1) visible.add(index + 1);
    const moveFocus = pages.some((page, i) => !visible.has(i) && page.contains(document.activeElement));
    pages.forEach((page, i) => { page.inert = !visible.has(i); });
    if (moveFocus && view === "book") stages.book.focus({ preventScroll: true });
    const section = view === "book" ? pages[index].dataset.bookSection : view === "end" ? "contact" : "hero";
    document.querySelectorAll<HTMLAnchorElement>(".nav-item, [data-tab-for]").forEach((link) => {
      const active = link.hash === `#${section}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
    });
    if (progress) progress.textContent = `${String(index + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
    book?.style.setProperty("--reading-progress", `${Math.min(100, ((index + (landscape ? 2 : 1)) / pages.length) * 100)}%`);
    entrance.forEach((animation) => animation.cancel()); entrance = [];
    if (animate && view === "book" && !reduced.matches) visible.forEach((i) => {
      pages[i]?.querySelectorAll<HTMLElement>(".page-heading, .timeline-entry, .project-card, .skill-card, .portrait, .contents-link, .note-card").forEach((target, n) => {
        entrance.push(target.animate([{ opacity: .3, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 500, delay: Math.min(n * 45, 270), easing: "cubic-bezier(.22,1,.36,1)" }));
      });
    });
  }
  function changeView(next: View, focus = false) {
    const changed = view !== next;
    const moveFocus = focus || (changed && (stages[view].contains(document.activeElement) || !!document.activeElement?.closest(".book-controls, .tab-nav")));
    view = next;
    document.body.dataset.portfolioView = next;
    Object.entries(stages).forEach(([key, stage]) => {
      stage.inert = key !== next;
      stage.setAttribute("aria-hidden", String(key !== next));
    });
    document.querySelectorAll<HTMLElement>(".book-controls, .tab-nav").forEach((element) => { element.inert = next !== "book"; });
    hideChrome();
    stageAnimation?.cancel();
    if (changed && !reduced.matches) stageAnimation = stages[next].animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 500, easing: "cubic-bezier(.22,1,.36,1)" });
    sync(flip.getCurrentPageIndex());
    if (moveFocus) stages[next].focus({ preventScroll: true });
    cooldown = performance.now() + (reduced.matches ? 200 : 650);
    wheelTotal = 0;
  }
  function remember(hash: string) { history.replaceState(null, "", `#${hash}`); }
  function navigate(id: string, focus = false, animate = true) {
    if (id === "hero" || id === "contact") {
      changeView(id === "hero" ? "start" : "end", focus); remember(id); return true;
    }
    const index = pageMap.get(id);
    if (index === undefined) return false;
    if (view !== "book") {
      flip.turnToPage(index); changeView("book", focus);
    } else {
      hideChrome();
      if (animate) flip.flip(index, index > flip.getCurrentPageIndex() ? "bottom" : "top"); else flip.turnToPage(index);
      if (focus) stages.book.focus({ preventScroll: true });
    }
    remember(id); return true;
  }
  flip.on("flip", ({ data }) => {
    sync(data);
    if (view === "book") remember(pages[data].id);
  });
  flip.on("changeState", ({ data }) => {
    busy = data === "flipping" || data === "user_fold";
    if (!busy) cooldown = performance.now() + 200;
  });
  flip.loadFromHTML(pages);
  if (!navigate(location.hash.slice(1), false, false)) changeView("start");

  book.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") ui.forEach((element) => reveal(element, true));
    else hideChrome();
  }, { signal });
  document.addEventListener("keydown", (event) => {
    if (document.querySelector("dialog[open]")) return;
    if (event.key === "Escape" && view === "book") {
      if (ui.some((element) => element.contains(document.activeElement))) stages.book.focus({ preventScroll: true });
      hideChrome();
    }
  }, { signal });

  let previousSize = `${geometry.width}:${geometry.height}`;
  function reflow(force = false) {
    if (signal.aborted) return;
    if (busy) { resizeTimer = window.setTimeout(() => reflow(force), 150); return; }
    const geometry = size();
    const key = `${geometry.width}:${geometry.height}`;
    if (!force && key === previousSize) return;
    previousSize = key;
    const sourceId = pages[flip.getCurrentPageIndex()]?.dataset.sourceId;
    const newPages = paginate(sources, geometry.width, geometry.height, continued);
    entrance.forEach((animation) => animation.cancel());
    flip.turnToPage(0);
    pages = newPages; pageMap = new Map(pages.map((page, index) => [page.id, index]));
    Object.assign(flip.getSettings(), geometry);
    flip.updateFromHtml(pages); flip.update();
    flip.turnToPage(Math.max(0, pages.findIndex((page) => page.dataset.sourceId === sourceId)));
    sync(flip.getCurrentPageIndex(), false);
  }
  const resize = new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => reflow(), 180); });
  resize.observe(book);
  void document.fonts.ready.then(() => reflow(true));

  function step(direction: number) {
    if (busy || performance.now() < cooldown) return;
    if (view === "start") { if (direction > 0) navigate("contents"); return; }
    if (view === "end") {
      if (direction < 0) { flip.turnToPage(pages.length - 1); changeView("book"); remember(pages[flip.getCurrentPageIndex()].id); }
      return;
    }
    hideChrome();
    if (direction < 0 && flip.getCurrentPageIndex() === 0) { navigate("hero"); return; }
    if (direction > 0 && isLastSpread()) { navigate("contact"); return; }
    if (direction > 0) flip.flipNext("bottom"); else flip.flipPrev("top");
  }
  buttons.forEach((button) => button.addEventListener("click", () => step(Number(button.dataset.bookStep)), { signal }));
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin || url.pathname.replace(/\/$/, "") !== location.pathname.replace(/\/$/, "")) return;
    if (!["hero", "contact"].includes(url.hash.slice(1)) && !pageMap.has(url.hash.slice(1))) return;
    event.preventDefault();
    if (!busy) navigate(url.hash.slice(1), true);
  }, { signal });
  window.addEventListener("hashchange", () => { navigate(location.hash.slice(1), false, false); }, { signal });
  const editable = (target: EventTarget | null) => target instanceof Element && !!target.closest("input, textarea, select, [contenteditable=true]");
  window.addEventListener("wheel", (event) => {
    if (document.querySelector("dialog[open]")) return;
    if (event.ctrlKey || editable(event.target) || (event.target instanceof Element && event.target.closest("#site-header, .tab-nav"))) return;
    const down = event.deltaY > 0;
    if (view !== "book") {
      const cover = stages[view];
      const canScroll = down ? cover.scrollTop + cover.clientHeight < cover.scrollHeight - 2 : cover.scrollTop > 2;
      if (canScroll || (view === "start" && !down) || (view === "end" && down)) return;
    }
    event.preventDefault();
    if (busy || performance.now() < cooldown) return;
    const now = performance.now();
    if (now - wheelTime > 180 || Math.sign(wheelTotal) !== Math.sign(event.deltaY)) wheelTotal = 0;
    wheelTime = now; wheelTotal += event.deltaY;
    if (Math.abs(wheelTotal) >= 60) { wheelTotal = 0; step(down ? 1 : -1); }
  }, { passive: false, signal });
  window.addEventListener("keydown", (event) => {
    if (document.querySelector("dialog[open]")) return;
    if (editable(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;
    const direction = ["ArrowRight", "PageDown"].includes(event.key) ? 1 : ["ArrowLeft", "PageUp"].includes(event.key) ? -1 : 0;
    if (direction) { event.preventDefault(); step(direction); }
  }, { signal });
  // Native page gestures handle interior spreads; boundary swipes leave the book.
  let touch: { x: number; y: number; edge: boolean } | undefined;
  document.getElementById("portfolio")?.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) { touch = undefined; return; }
    touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, edge: view !== "book" || flip.getCurrentPageIndex() === 0 || isLastSpread() };
  }, { passive: true, signal });
  document.getElementById("portfolio")?.addEventListener("touchend", (event) => {
    if (!touch || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    if (touch.edge && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (view !== "book" || (dx > 0 && flip.getCurrentPageIndex() === 0) || (dx < 0 && isLastSpread())) step(dx < 0 ? 1 : -1);
    }
    touch = undefined;
  }, { passive: true, signal });
  dispose = () => {
    controller.abort(); clearTimeout(resizeTimer); resize.disconnect();
    entrance.forEach((animation) => animation.cancel()); stageAnimation?.cancel();
    Object.values(stages).forEach((stage) => { stage.inert = false; stage.removeAttribute("aria-hidden"); });
    if (header) header.inert = false;
    cancelAnimationFrame(pointerFrame);
    uiTimers.forEach((timer) => clearTimeout(timer));
    hideChrome();
    flip.destroy(); document.body.classList.remove("book-turn-active");
    delete document.body.dataset.portfolioView;
  };
}
document.addEventListener("astro:page-load", initBook);
document.addEventListener("astro:before-swap", () => dispose?.());
