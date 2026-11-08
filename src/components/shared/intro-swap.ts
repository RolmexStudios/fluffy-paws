"use client";

import { useEffect, type RefObject } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * One pinned panel. Tagline fades out over progress 0.30–0.50 and rises;
 * logos fade in over 0.52–0.72. Reduced motion shows both, with no transform.
 */
export function useIntroSwap(
  sectionRef: RefObject<HTMLElement | null>,
  taglineRef: RefObject<HTMLElement | null>,
  logosRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const tagline = taglineRef.current;
    const logos = logosRef.current;
    if (!section || !tagline || !logos) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      tagline.style.opacity = "1";
      tagline.style.transform = "none";
      logos.style.opacity = "1";
      logos.style.transform = "none";
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const progress = clamp(1 - (center - vh * 0.2) / (vh * 0.6), 0, 1);
      const out = clamp((progress - 0.3) / 0.2, 0, 1);
      const inn = clamp((progress - 0.52) / 0.2, 0, 1);
      tagline.style.opacity = String(1 - out);
      tagline.style.transform = `translateY(${-out * 30}px)`;
      logos.style.opacity = String(inn);
      logos.style.transform = `translateY(${(1 - inn) * 30}px)`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [logosRef, sectionRef, taglineRef]);
}
