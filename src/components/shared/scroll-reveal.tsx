"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./scroll-reveal.module.scss";

/** Any intersection is enough; tall blocks must not wait for % of full height. */
const DEFAULT_REVEAL_THRESHOLD = 0;
const DEFAULT_ROOT_MARGIN = "0px";
/** Opacity/transform on huge trees can composite as a blank layer on iOS. */
const TALL_BLOCK_VH = 1.15;

export type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Only play the entrance animation the first time the block enters view. */
  once?: boolean;
  /** Fraction of the element that must be visible (0–1). */
  threshold?: number;
  /** IntersectionObserver rootMargin (e.g. tighter bottom inset = later reveal). */
  rootMargin?: string;
  /** Delay before the transition runs after the block enters view (ms). */
  delayMs?: number;
  /**
   * Don't stretch to fill a flex parent. Needed for captions and for
   * paragraphs that must wrap around a float.
   */
  compact?: boolean;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Rise once the section has come up off the bottom edge, so the motion is visible. */
function hasEntered(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const line = window.innerHeight * 0.86;
  return rect.bottom > 0 && rect.top <= line;
}

export function ScrollReveal({
  children,
  className,
  style,
  once = true,
  threshold = DEFAULT_REVEAL_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
  delayMs = 0,
  compact = false,
}: ScrollRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(compact);
  const [revealed, setRevealed] = useState(!compact);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      setPending(false);
      setRevealed(true);
      return;
    }

    const tooTall =
      !compact &&
      element.getBoundingClientRect().height > window.innerHeight * TALL_BLOCK_VH;
    if (tooTall) {
      setPending(false);
      setRevealed(true);
      return;
    }

    let delayTimer = 0;
    let revealedLatch = false;
    let observer: IntersectionObserver | undefined;

    const reveal = () => {
      if (revealedLatch) return;
      revealedLatch = true;
      const show = () => {
        // Keep the pending class so the ease stays on the element as it rises.
        setPending(true);
        setRevealed(true);
      };
      if (delayMs > 0) {
        delayTimer = window.setTimeout(show, delayMs);
      } else {
        show();
      }
      observer?.disconnect();
    };

    const tryReveal = () => {
      if (revealedLatch) return;
      if (!hasEntered(element)) return;
      reveal();
    };

    setPending(true);
    setRevealed(false);

    if (hasEntered(element)) {
      window.requestAnimationFrame(reveal);
      if (once) return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!hasEntered(element)) continue;
          reveal();
          if (once) break;
        }
      },
      { threshold, rootMargin: rootMargin === DEFAULT_ROOT_MARGIN ? "0px 0px -14% 0px" : rootMargin },
    );
    observer.observe(element);

    window.addEventListener("scroll", tryReveal, { passive: true, capture: true });
    window.addEventListener("resize", tryReveal, { passive: true });
    window.visualViewport?.addEventListener("scroll", tryReveal, { passive: true });
    window.visualViewport?.addEventListener("resize", tryReveal);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", tryReveal, true);
      window.removeEventListener("resize", tryReveal);
      window.visualViewport?.removeEventListener("scroll", tryReveal);
      window.visualViewport?.removeEventListener("resize", tryReveal);
      window.clearTimeout(delayTimer);
    };
  }, [compact, delayMs, once, rootMargin, threshold]);

  return (
    <div
      ref={rootRef}
      className={[
        styles.root,
        compact ? styles.compact : "",
        pending ? styles.isPending : "",
        revealed ? styles.isRevealed : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      data-revealed={revealed ? "true" : undefined}
    >
      {children}
    </div>
  );
}
