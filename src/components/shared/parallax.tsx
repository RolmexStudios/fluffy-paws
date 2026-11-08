"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Item = {
  frame: HTMLElement;
  media: HTMLElement;
  strength: number;
  scale: number;
};

const items = new Set<Item>();
let listening = false;
let ticking = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function update() {
  ticking = false;
  if (prefersReducedMotion()) return;
  const vh = window.innerHeight;
  for (const { frame, media, strength, scale } of items) {
    const rect = frame.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) continue;
    const progress =
      (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
    const shift = -progress * strength * 100;
    media.style.transform = `translateY(${shift}%) scale(${scale})`;
  }
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(update);
}

function ensureListener() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

export type ParallaxFrameProps = {
  strength?: number;
  className?: string;
  children: ReactNode;
};

/** Light vertical drift on the first img or video inside the frame. */
export function ParallaxFrame({
  strength = 0.1,
  className,
  children,
}: ParallaxFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const media = frame.querySelector<HTMLElement>("img, video");
    if (!media || prefersReducedMotion()) return;

    const scale = 1 + Math.abs(strength) * 2;
    media.style.willChange = "transform";
    media.style.transform = `scale(${scale})`;
    const item: Item = { frame, media, strength, scale };
    items.add(item);
    ensureListener();
    update();

    return () => {
      items.delete(item);
      media.style.transform = "";
      media.style.willChange = "";
    };
  }, [strength]);

  return (
    <div ref={frameRef} className={className} data-parallax={String(strength)}>
      {children}
    </div>
  );
}
