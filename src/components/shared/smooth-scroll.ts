import { hasMomentumScroll, momentumScrollTo } from "./momentum-scroll";

export function scrollToInPageHash(href: string): boolean {
  if (!href.startsWith("#") || href.length < 2) {
    return false;
  }

  const id = decodeURIComponent(href.slice(1));
  const target = document.getElementById(id);
  if (!target) {
    return false;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const pad = Number.parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  );
  const offset = Number.isFinite(pad) ? pad : 0;
  const top = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - offset,
  );

  if (!reduceMotion && hasMomentumScroll()) {
    momentumScrollTo(top);
  } else {
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }
  window.history.replaceState(null, "", `#${id}`);
  return true;
}
