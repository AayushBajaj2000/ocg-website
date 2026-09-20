export const FOUNDER_BOOK_DEFAULTS = Object.freeze({
  scrollDistance: 480,
  onOpenChange: null,
});

const STATUS_OPEN = "Founders Talk. Book open. Drag a joke to move it.";
const STATUS_CLOSED = "Scroll down to open the book.";
const MIN_FIT = 0.7;
const MOVES = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function createFounderBook(host, options = {}) {
  let opts = { ...FOUNDER_BOOK_DEFAULTS, ...options };

  const book = host.querySelector("[data-book]");
  const spread = host.querySelector("[data-book-spread]");
  const face = host.querySelector("[data-book-face]");
  const back = host.querySelector("[data-book-back]");
  const status = host.querySelector("[data-book-status]");
  const scrollTargets = [...host.querySelectorAll("[data-book-scroll]")];
  const fitTargets = [...host.querySelectorAll("[data-book-fit]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const narrow = window.matchMedia("(max-width: 700px)");
  const controller = new AbortController();
  const { signal } = controller;
  const resyncByPaper = new Map();

  // Read from the DOM so a StrictMode remount picks up where the last instance left off.
  let isOpen = book.hasAttribute("data-open");
  let lastVisual = -1;
  let lastRead = -1;
  let overflows = scrollTargets.map(() => 0);
  let readDistance = 0;
  let frame = 0;
  let inView = false;
  let topLayer = 10;
  let headerOffset = 0;

  // The stage pins below the fixed header, so progress starts at that offset.
  function readHeaderOffset() {
    headerOffset = parseFloat(getComputedStyle(host).getPropertyValue("--header-offset")) || 0;
  }

  function measure() {
    readHeaderOffset();
    lastVisual = -1;
    schedule();
  }

  function overflowOf(target) {
    const clip = target.parentElement;
    const { paddingTop, paddingBottom } = getComputedStyle(clip);
    const viewport = clip.clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
    return Math.max(0, Math.ceil(target.offsetHeight - viewport));
  }

  // On wide screens the letter shrinks to fit its page, so an open book has nothing left to scroll.
  function fit(target) {
    target.style.removeProperty("--fit");
    if (narrow.matches || !overflowOf(target)) return;
    let low = MIN_FIT;
    let high = 1;
    for (let step = 0; step < 6; step++) {
      const mid = (low + high) / 2;
      target.style.setProperty("--fit", String(mid));
      if (overflowOf(target)) high = mid;
      else low = mid;
    }
    target.style.setProperty("--fit", low.toFixed(3));
  }

  // Page content never scrolls on its own; any overflow left after fitting is added to the
  // section's scroll length.
  function measureRead() {
    fitTargets.forEach(fit);
    overflows = scrollTargets.map(overflowOf);
    const next = Math.max(0, ...overflows);
    if (next !== readDistance) {
      readDistance = next;
      host.style.setProperty("--read-distance", `${next}px`);
    }
    lastRead = -1;
    schedule();
  }

  // On narrow screens the inside cover sits off-screen; its scraps live in the spread instead.
  function syncBack() {
    const active = isOpen && !narrow.matches;
    back.inert = !active;
    back.setAttribute("aria-hidden", String(!active));
  }

  function setOpen(next) {
    isOpen = next;
    book.toggleAttribute("data-open", next);
    book.toggleAttribute("data-revealed", next);
    spread.inert = !next;
    spread.setAttribute("aria-hidden", String(!next));
    face.setAttribute("aria-hidden", String(next));
    syncBack();
    status.textContent = next ? STATUS_OPEN : STATUS_CLOSED;
    opts.onOpenChange?.(next);
  }

  function update() {
    frame = 0;
    const distance = opts.scrollDistance;
    const scrolled = headerOffset - host.getBoundingClientRect().top;
    const progress = clamp(scrolled, 0, distance) / distance;
    const visual = reducedMotion.matches ? (progress > 0.45 ? 1 : 0) : progress;
    const read = Math.round(clamp(scrolled - distance, 0, readDistance));

    if (visual !== lastVisual) {
      lastVisual = visual;
      book.style.setProperty("--book-angle", `${-180 * visual}deg`);
      book.style.setProperty("--book-shift", `${-25 * (1 - visual)}%`);
      book.style.setProperty("--page-shadow", String(0.75 * (1 - visual)));

      const next = visual >= 0.995;
      if (next !== isOpen) setOpen(next);
    }

    if (read !== lastRead) {
      lastRead = read;
      scrollTargets.forEach((target, index) => {
        const offset = Math.min(read, overflows[index]);
        target.style.transform = offset ? `translateY(${-offset}px)` : "";
      });
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function makeDraggable(card) {
    const paper = card.parentElement;
    let drag = null;

    function place(x, y) {
      const maxX = Math.max(0, paper.clientWidth - card.offsetWidth);
      const maxY = Math.max(0, paper.clientHeight - card.offsetHeight);
      const left = clamp(x, 0, maxX);
      const top = clamp(y, 0, maxY);
      card.style.left = `${left}px`;
      card.style.top = `${top}px`;
      card.style.right = "auto";
      card.style.bottom = "auto";
      card.dataset.x = String(maxX ? left / maxX : 0);
      card.dataset.y = String(maxY ? top / maxY : 0);
    }

    function lift() {
      card.style.transform = "rotate(0deg)";
      card.style.zIndex = String(++topLayer);
    }

    function drop() {
      drag = null;
      card.removeAttribute("data-dragging");
    }

    card.addEventListener(
      "pointerdown",
      (event) => {
        if (!isOpen || event.button !== 0) return;
        event.preventDefault();
        lift();
        place(card.offsetLeft, card.offsetTop);
        const rect = paper.getBoundingClientRect();
        drag = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          left: card.offsetLeft,
          top: card.offsetTop,
          sx: rect.width / paper.clientWidth,
          sy: rect.height / paper.clientHeight,
        };
        card.setPointerCapture(event.pointerId);
        card.setAttribute("data-dragging", "");
        card.focus({ preventScroll: true });
      },
      { signal },
    );

    card.addEventListener(
      "pointermove",
      (event) => {
        if (!drag || event.pointerId !== drag.id) return;
        place(
          drag.left + (event.clientX - drag.x) / drag.sx,
          drag.top + (event.clientY - drag.y) / drag.sy,
        );
      },
      { signal },
    );

    card.addEventListener("pointerup", drop, { signal });
    card.addEventListener("pointercancel", drop, { signal });
    card.addEventListener("lostpointercapture", drop, { signal });

    card.addEventListener(
      "keydown",
      (event) => {
        const move = MOVES[event.key];
        if (!isOpen || !move) return;
        event.preventDefault();
        lift();
        const step = event.shiftKey ? 24 : 8;
        place(card.offsetLeft + move[0] * step, card.offsetTop + move[1] * step);
      },
      { signal },
    );

    const resync = () => {
      if (card.dataset.x === undefined) return;
      place(
        Number(card.dataset.x) * Math.max(0, paper.clientWidth - card.offsetWidth),
        Number(card.dataset.y) * Math.max(0, paper.clientHeight - card.offsetHeight),
      );
    };
    resyncByPaper.set(paper, [...(resyncByPaper.get(paper) ?? []), resync]);
  }

  host.querySelectorAll("[data-book-draggable]").forEach(makeDraggable);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      if (!target.clientWidth || !target.clientHeight) continue;
      resyncByPaper.get(target)?.forEach((resync) => resync());
    }
  });
  resyncByPaper.forEach((_, paper) => resizeObserver.observe(paper));

  const readObserver = new ResizeObserver(measureRead);
  scrollTargets.forEach((target) => {
    readObserver.observe(target);
    readObserver.observe(target.parentElement);
  });

  const intersectionObserver = new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1].isIntersecting;
    schedule();
  });
  intersectionObserver.observe(host);

  window.addEventListener("scroll", () => inView && schedule(), { passive: true, signal });
  window.addEventListener("resize", measure, { signal });
  window.addEventListener("pageshow", schedule, { signal });
  reducedMotion.addEventListener("change", schedule, { signal });
  narrow.addEventListener(
    "change",
    () => {
      syncBack();
      measureRead();
    },
    { signal },
  );

  syncBack();
  readHeaderOffset();
  measureRead();
  update();

  return {
    get isOpen() {
      return isOpen;
    },
    setOptions(next) {
      opts = { ...opts, ...next };
      lastVisual = -1;
      schedule();
    },
    destroy() {
      cancelAnimationFrame(frame);
      frame = 0;
      controller.abort();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      readObserver.disconnect();
      resyncByPaper.clear();
    },
  };
}
