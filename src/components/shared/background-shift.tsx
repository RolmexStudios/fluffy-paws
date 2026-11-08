"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

function applySection(section: HTMLElement) {
  const bg = section.dataset.bg;
  const theme = section.dataset.theme ?? "light";
  if (bg) {
    document.documentElement.style.setProperty("--color-bg", bg);
  }
  document.documentElement.dataset.theme = theme;
}

function resetSurface() {
  document.documentElement.style.removeProperty("--color-bg");
  document.documentElement.dataset.theme = "light";
  document.documentElement.dataset.nav = "on-light";
}

function navTone(section: HTMLElement): "on-dark" | "on-light" {
  const marked = section.dataset.nav;
  if (marked === "on-dark" || marked === "on-light") return marked;
  return section.dataset.theme === "dark" ? "on-dark" : "on-light";
}

function headerRect(): DOMRect | null {
  const header = document.querySelector("header");
  const rect = header?.getBoundingClientRect();
  if (!rect || rect.height <= 0) return null;
  return rect;
}

function overlapY(a: DOMRect, b: DOMRect) {
  return Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
}

function overlapX(a: DOMRect, b: DOMRect) {
  return Math.min(a.right, b.right) - Math.max(a.left, b.left);
}

/**
 * Header contrast follows the layout box under the bar, not hit-testing.
 * Scaled media can still occupy the probe point after it has visually left.
 */
function applyNav() {
  const bar = headerRect();
  if (!bar) return;

  const minOverlap = bar.height * 0.55;
  let tone: "on-dark" | "on-light" | null = null;
  let best = 0;
  for (const el of document.querySelectorAll<HTMLElement>("[data-nav]")) {
    if (
      el === document.documentElement ||
      el === document.body ||
      el.closest("header")
    ) {
      continue;
    }
    const marked = el.dataset.nav;
    if (marked !== "on-dark" && marked !== "on-light") continue;
    const rect = el.getBoundingClientRect();
    const y = overlapY(rect, bar);
    const x = overlapX(rect, bar);
    if (y < minOverlap || x <= 0) continue;
    if (y >= best) {
      best = y;
      tone = marked;
    }
  }
  if (tone) {
    document.documentElement.dataset.nav = tone;
    return;
  }

  const x = Math.min(window.innerWidth / 2, window.innerWidth - 1);
  const y = Math.min(
    Math.max(bar.top + bar.height / 2, 0),
    window.innerHeight - 1,
  );
  const top = document
    .elementsFromPoint(x, y)
    .find(
      (node): node is Element =>
        node instanceof Element && !node.closest("header"),
    );
  const target =
    top instanceof Element ? top.closest<HTMLElement>("[data-bg]") : null;
  document.documentElement.dataset.nav = target ? navTone(target) : "on-light";
}

/**
 * Writes `--color-bg` and `data-theme` on `<html>` when a `[data-bg]` section
 * is on screen. If several qualify, the later one wins, so a sticky plate
 * that stays in the viewport does not keep the previous theme.
 * Reduced motion applies the first section and stops.
 */
export function BackgroundShift() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;
    let stopped = false;

    const start = () => {
      observer?.disconnect();
      observer = null;
      const sections = [...document.querySelectorAll<HTMLElement>("[data-bg]")];
      const first = sections[0];
      if (!first) {
        resetSurface();
        return;
      }

      // Client navigations keep <html> theme from the previous route.
      // Apply this page immediately; the observer only handles in-page shifts.
      applySection(first);
      applyNav();

      if (reduceQuery.matches) return;

      const visible = new Set<HTMLElement>();
      const pick = () => {
        const chosen = [...sections].reverse().find((section) => visible.has(section));
        if (chosen) {
          applySection(chosen);
          applyNav();
        }
      };

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const section = entry.target as HTMLElement;
            if (entry.isIntersecting) visible.add(section);
            else visible.delete(section);
          }
          pick();
        },
        // Any pixel is enough. A 35% threshold left the logos band on the
        // sticky hero's dark wash until it was already on screen.
        { threshold: 0 },
      );
      sections.forEach((section) => observer?.observe(section));
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => applyNav());
    };

    start();
    onScroll();
    const onChange = () => {
      if (!stopped) start();
    };
    reduceQuery.addEventListener("change", onChange);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      reduceQuery.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
