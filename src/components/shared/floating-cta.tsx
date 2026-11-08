"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { HashLink } from "@/components/shared/hash-link";
import styles from "./floating-cta.module.scss";

export type FloatingCtaProps = {
  href: string;
  label?: string;
  /** `right` (default) keeps the button clear of system UI on the left. */
  side?: "left" | "right";
};

function contactSectionVisible(href: string): boolean {
  if (!href.startsWith("#") || href.length < 2) {
    return false;
  }

  const target = document.getElementById(decodeURIComponent(href.slice(1)));
  if (!target) {
    return false;
  }

  const rect = target.getBoundingClientRect();
  const viewHeight = window.innerHeight;
  const visible = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
  return visible >= Math.min(rect.height * 0.28, viewHeight * 0.32);
}

/** Fixed quote button that stays on screen until the contact section is in view. */
export function FloatingCta({
  href,
  label = "Get a quote today",
  side = "right",
}: FloatingCtaProps) {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setReady(true), 700);

    const sync = () => {
      setHidden(contactSectionVisible(href));
    };

    sync();

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [href]);

  return (
    <HashLink
      href={href}
      className={styles.root}
      data-side={side}
      data-ready={ready ? "true" : undefined}
      data-hidden={hidden ? "true" : undefined}
      aria-hidden={hidden ? true : undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <span className={styles.pulse} aria-hidden />
      <span className={styles.label}>{label}</span>
      <ArrowRight className={styles.icon} aria-hidden />
    </HashLink>
  );
}
