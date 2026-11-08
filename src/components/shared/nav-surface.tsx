"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  disposeHeroLogoHandoff,
  hideHeroLogoClone,
  syncHeroLogoHandoff,
} from "./hero-logo-handoff";

export const NAV_SURFACE_ATTR = "data-nav-surface";
export const NAV_SURFACE_DARK = "dark";

export type NavSurface = "dark" | "light";
export type NavTone = "on-light" | "on-dark";

function headerOverlapsDarkSurface(header: HTMLElement): boolean {
  const headerRect = header.getBoundingClientRect();
  if (headerRect.height <= 0) {
    return false;
  }

  const surfaces = document.querySelectorAll<HTMLElement>(
    `[${NAV_SURFACE_ATTR}="${NAV_SURFACE_DARK}"]`,
  );
  const minOverlap = headerRect.height * 0.55;

  for (const surface of surfaces) {
    const rect = surface.getBoundingClientRect();
    const overlapY =
      Math.min(rect.bottom, headerRect.bottom) -
      Math.max(rect.top, headerRect.top);
    const overlapX =
      Math.min(rect.right, headerRect.right) -
      Math.max(rect.left, headerRect.left);
    if (overlapY >= minOverlap && overlapX > 0) {
      return true;
    }
  }

  return false;
}

function heroBlockForNav(): HTMLElement | null {
  const hero = document.querySelector<HTMLElement>('[id^="BrochureHero"]');
  if (!hero) {
    return null;
  }
  return hero.closest<HTMLElement>("[data-section-size]") ?? hero;
}

function headerHasPassedHero(header: HTMLElement): boolean {
  const hero = heroBlockForNav();
  if (!hero) {
    return true;
  }
  return hero.getBoundingClientRect().bottom <= header.getBoundingClientRect().top;
}

type NavSurfaceHeaderProps = {
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"header">, "children">;

/**
 * Fixed header shell that flips `data-tone` when it overlaps a
 * `[data-nav-surface="dark"]` block (cover hero, dark footer, …).
 * Also sets `data-past-hero` once the brochure hero has scrolled out
 * from under the bar (`logoReveal: "after-hero"`).
 */
export function NavSurfaceHeader({
  children,
  className,
  ...rest
}: NavSurfaceHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  // Cover heroes sit under the bar on first paint; start dark so type
  // is readable before the overlap check runs.
  const [tone, setTone] = useState<NavTone>("on-light");
  const [pastHero, setPastHero] = useState(false);

  useLayoutEffect(() => {
    const header = ref.current;
    if (!header) {
      return;
    }

    const sync = () => {
      setTone(headerOverlapsDarkSurface(header) ? "on-dark" : "on-light");
      setPastHero(syncHeroLogoHandoff(header) || headerHasPassedHero(header));
    };

    sync();

    let frame = 0;
    const onScrollOrResize = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true, capture: true });
    window.addEventListener("resize", onScrollOrResize);
    window.visualViewport?.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onScrollOrResize);
    const observer = new ResizeObserver(onScrollOrResize);
    observer.observe(header);
    const heroLogo = document.querySelector<HTMLElement>("[data-hero-logo]");
    if (heroLogo) observer.observe(heroLogo);
    const heroImg = heroLogo?.querySelector("img") ?? (heroLogo instanceof HTMLImageElement ? heroLogo : null);
    heroImg?.addEventListener("load", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      window.visualViewport?.removeEventListener("scroll", onScrollOrResize);
      window.visualViewport?.removeEventListener("resize", onScrollOrResize);
      heroImg?.removeEventListener("load", onScrollOrResize);
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      disposeHeroLogoHandoff();
    };
  }, []);

  useLayoutEffect(() => {
    if (pastHero) hideHeroLogoClone();
  }, [pastHero]);

  return (
    <header
      ref={ref}
      className={className}
      {...rest}
      data-tone={tone}
      data-past-hero={pastHero ? "true" : "false"}
    >
      {children}
    </header>
  );
}
