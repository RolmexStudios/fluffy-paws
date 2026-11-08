const HERO_LOGO = "[data-hero-logo]";
const NAV_LOGO = "[data-nav-logo]";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function heroLogoElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>(HERO_LOGO);
}

function navLogoElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>(NAV_LOGO);
}

function logoImage(root: HTMLElement | null): HTMLImageElement | null {
  if (!root) return null;
  if (root instanceof HTMLImageElement) return root;
  return root.querySelector("img");
}

function ensureClone(): HTMLImageElement {
  const existing = document.querySelector<HTMLImageElement>(
    "[data-hero-logo-clone]",
  );
  if (existing) return existing;

  const clone = document.createElement("img");
  clone.setAttribute("data-hero-logo-clone", "");
  clone.alt = "";
  clone.style.position = "fixed";
  clone.style.zIndex = "80";
  clone.style.margin = "0";
  clone.style.padding = "0";
  clone.style.maxWidth = "none";
  clone.style.maxHeight = "none";
  clone.style.pointerEvents = "none";
  clone.style.objectFit = "contain";
  clone.style.objectPosition = "left center";
  clone.style.display = "none";
  document.body.appendChild(clone);
  return clone;
}

function hideClone(clone: HTMLImageElement) {
  clone.style.display = "none";
}

export function hideHeroLogoClone() {
  const clone = document.querySelector<HTMLImageElement>(
    "[data-hero-logo-clone]",
  );
  if (clone) hideClone(clone);
}

function placeClone(
  clone: HTMLImageElement,
  src: string,
  left: number,
  top: number,
  width: number,
  height: number,
  shadow: number,
) {
  if (clone.getAttribute("src") !== src) {
    clone.src = src;
  }
  clone.style.display = "block";
  clone.style.left = `${left}px`;
  clone.style.top = `${top}px`;
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.filter =
    shadow > 0.02
      ? `drop-shadow(0 0.45rem 1.1rem rgba(0, 0, 0, ${0.4 * shadow}))`
      : "none";
}

/**
 * Scroll-links the cover-hero logo into the nav brand slot once it
 * meets the bar. Returns whether the nav should show its own logo.
 */
export function syncHeroLogoHandoff(header: HTMLElement): boolean {
  const reveal = header.getAttribute("data-logo-reveal");
  if (reveal !== "after-hero") {
    hideClone(ensureClone());
    const hero = heroLogoElement();
    if (hero) hero.style.opacity = "";
    return true;
  }

  const hero = heroLogoElement();
  const nav = navLogoElement();
  const heroImg = logoImage(hero);
  const clone = ensureClone();

  if (!hero || !nav || !heroImg?.src) {
    hideClone(clone);
    if (hero) hero.style.opacity = "";
    return header.getBoundingClientRect().bottom <= 0;
  }

  const from = hero.getBoundingClientRect();
  const to = nav.getBoundingClientRect();
  if (from.width < 8 || from.height < 8 || to.width < 8 || to.height < 8) {
    hideClone(clone);
    hero.style.opacity = "";
    return false;
  }

  const gap = from.top - header.getBoundingClientRect().bottom;
  const approach = 12;
  const travel = Math.max(40, Math.min(from.height * 0.5, 64));
  const progress = clamp((approach - gap) / travel, 0, 1);

  if (prefersReducedMotion()) {
    hideClone(clone);
    const parked = progress >= 0.45;
    hero.style.opacity = parked ? "0" : "";
    return parked;
  }

  if (progress <= 0) {
    hideClone(clone);
    hero.style.opacity = "";
    return false;
  }

  const src = heroImg.currentSrc || heroImg.src;
  const parked = progress >= 1;
  const t = parked ? 1 : easeOutCubic(progress);
  placeClone(
    clone,
    src,
    lerp(from.left, to.left, t),
    lerp(from.top, to.top, t),
    lerp(from.width, to.width, t),
    lerp(from.height, to.height, t),
    parked ? 0 : 1 - t,
  );
  hero.style.opacity = "0";

  // Keep the clone covering the nav slot until React paints
  // `data-past-hero` (otherwise one frame has no logo).
  if (parked && header.getAttribute("data-past-hero") === "true") {
    hideClone(clone);
  }

  return parked;
}

export function disposeHeroLogoHandoff() {
  const clone = document.querySelector<HTMLImageElement>(
    "[data-hero-logo-clone]",
  );
  clone?.remove();
  const hero = heroLogoElement();
  if (hero) hero.style.opacity = "";
}
