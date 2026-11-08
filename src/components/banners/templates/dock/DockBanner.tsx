"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { fieldPath } from "@/components/shared/field-path";
import { TextSlot } from "@/components/shared/text-slot";
import type {
  BrochureBannerContent,
  BrochureBlockProps,
} from "@/types/brochure";
import styles from "./dock.module.scss";

type MergeMetrics = {
  width: number;
  navH: number;
  headerPad: number;
  restPad: number;
  restMin: number;
  restFont: number;
  dockPad: number;
  dockMin: number;
  dockFont: number;
  border: number;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function clearMergeStyles(bar: HTMLElement, header: HTMLElement | null) {
  bar.style.paddingTop = "";
  bar.style.paddingBottom = "";
  bar.style.minHeight = "";
  bar.style.height = "";
  bar.style.removeProperty("--banner-nav-inset");
  bar.style.removeProperty("--banner-line-left");
  bar.style.removeProperty("--banner-line-right");
  delete bar.dataset.merge;
  delete bar.dataset.dock;
  delete bar.dataset.pin;
  const line = bar.querySelector("p");
  if (line instanceof HTMLElement) line.style.fontSize = "";
  if (!header) return;
  header.style.height = "";
  header.style.paddingTop = "";
  header.style.paddingBottom = "";
}

/**
 * In-flow at the hero seam, then `position: sticky` holds it as the header.
 * JS only morphs the nav and type — it never moves the bar.
 */
export function DockBanner({
  instanceId = "BrochureBanner_1",
  data,
}: BrochureBlockProps<BrochureBannerContent>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<MergeMetrics | null>(null);
  const lineRef = useRef(data?.line ?? "");
  const [line, setLine] = useState(data?.line ?? "");
  const home = data?.line ?? "";
  const cues = data?.cues ?? [];

  useLayoutEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;

    let frame = 0;
    let lastMove = 0;

    const measure = (header: HTMLElement | null): MergeMetrics => {
      const bannerState = document.documentElement.dataset.banner;
      delete document.documentElement.dataset.banner;
      clearMergeStyles(bar, header);
      const line = bar.querySelector("p");
      const rest = getComputedStyle(bar);
      const restPad = parseFloat(rest.paddingTop) || 0;
      const restMin = parseFloat(rest.minHeight) || 0;
      const restFont = line ? parseFloat(getComputedStyle(line).fontSize) || 0 : 0;
      const border = parseFloat(rest.borderBottomWidth) || 0;
      bar.dataset.dock = "true";
      const dock = getComputedStyle(bar);
      const dockPad = parseFloat(dock.paddingTop) || 0;
      const dockMin = parseFloat(dock.minHeight) || 0;
      const dockFont = line ? parseFloat(getComputedStyle(line).fontSize) || 0 : 0;
      delete bar.dataset.dock;
      const navH = header?.offsetHeight ?? 0;
      const headerPad = header ? parseFloat(getComputedStyle(header).paddingTop) || 0 : 0;
      if (bannerState) document.documentElement.dataset.banner = bannerState;
      return {
        width: window.innerWidth,
        navH,
        headerPad,
        restPad,
        restMin,
        restFont,
        dockPad,
        dockMin,
        dockFont,
        border,
      };
    };

    const update = () => {
      const header = document.querySelector("header");
      let metrics = metricsRef.current;
      if (!metrics || metrics.width !== window.innerWidth) {
        metrics = measure(header);
        metricsRef.current = metrics;
      }

      const restH = metrics.restMin + metrics.restPad * 2 + metrics.border;
      const dockH = metrics.dockMin + metrics.dockPad * 2 + metrics.border;
      document.documentElement.style.setProperty("--banner-h", `${restH}px`);
      root.style.setProperty("--banner-h", `${restH}px`);

      const pin = root.closest("[data-section-size]") ?? root;
      const seam = pin.nextElementSibling;
      const pinTop = pin.getBoundingClientRect().top;
      const seamTop = seam?.getBoundingClientRect().top ?? pinTop + restH;
      const height = Math.max(
        dockH,
        Math.min(restH, seamTop - Math.max(pinTop, 0)),
      );
      bar.style.height = `${height}px`;

      const span = Math.max(metrics.navH, 1);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compress =
        restH <= dockH ? 0 : clamp01((restH - height) / (restH - dockH));
      const linear = reduce
        ? pinTop <= 0 ? 1 : 0
        : Math.max(compress, clamp01((span - pinTop) / span));

      if (linear <= 0) {
        bar.style.paddingTop = "";
        bar.style.paddingBottom = "";
        delete bar.dataset.merge;
        delete bar.dataset.pin;
        bar.dataset.nav = "on-dark";
        delete document.documentElement.dataset.banner;
        if (header) {
          header.style.height = "";
          header.style.paddingTop = "";
          header.style.paddingBottom = "";
        }
      } else {
        const pad = lerp(metrics.restPad, metrics.dockPad, linear);
        const font = lerp(metrics.restFont, metrics.dockFont, linear);
        const dockBarH = dockH;
        bar.style.paddingTop = `${pad}px`;
        bar.style.paddingBottom = `${pad}px`;
        const lineEl = bar.querySelector("p");
        if (lineEl instanceof HTMLElement) lineEl.style.fontSize = `${font}px`;
        bar.dataset.merge = "true";
        if (compress >= 1) {
          bar.dataset.pin = "true";
          bar.dataset.nav = "on-light";
        } else {
          delete bar.dataset.pin;
          bar.dataset.nav = "on-dark";
        }
        document.documentElement.dataset.banner = compress >= 1 ? "dock" : "merge";
        if (header) {
          header.style.height = `${lerp(metrics.navH, dockBarH, linear)}px`;
          const headerPad = lerp(metrics.headerPad, 0, linear);
          header.style.paddingTop = `${headerPad}px`;
          header.style.paddingBottom = `${headerPad}px`;
          const brand = header.querySelector("a");
          const nav = header.querySelector("nav");
          const brandBox = brand?.getBoundingClientRect();
          const navBox = nav?.getBoundingClientRect();
          const inset = Math.ceil(
            Math.max(brandBox?.width ?? 0, navBox?.width ?? 0) + 28,
          );
          bar.style.setProperty("--banner-nav-inset", `${inset * linear}px`);
          if (brandBox && navBox) {
            bar.style.setProperty(
              "--banner-line-left",
              `${Math.max(0, Math.ceil(brandBox.right) + 12)}px`,
            );
            bar.style.setProperty(
              "--banner-line-right",
              `${Math.max(0, Math.ceil(window.innerWidth - navBox.left) + 12)}px`,
            );
          }
        }
      }

      const cover = compress >= 1 ? dockH : metrics.navH;
      const stack = `${Math.round(cover)}px`;
      if (document.documentElement.style.scrollPaddingTop !== stack) {
        document.documentElement.style.scrollPaddingTop = stack;
      }

      const probe = window.innerHeight * 0.42;
      let next = home;
      for (const cue of cues) {
        const id = cue.targetId.trim();
        const text = cue.line.trim();
        if (!id || !text) continue;
        const section = document.getElementById(id);
        if (!section) continue;
        if (section.getBoundingClientRect().top <= probe) {
          next = text;
        }
      }
      if (next !== lineRef.current) {
        lineRef.current = next;
        setLine(next);
      }
    };

    const loop = () => {
      update();
      if (performance.now() - lastMove < 180) {
        frame = requestAnimationFrame(loop);
        return;
      }
      frame = 0;
    };

    const onScroll = () => {
      lastMove = performance.now();
      if (frame) return;
      frame = requestAnimationFrame(loop);
    };

    update();
    const observer = new ResizeObserver(onScroll);
    observer.observe(document.documentElement);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("touchmove", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("touchmove", onScroll);
      if (frame) cancelAnimationFrame(frame);
      clearMergeStyles(bar, document.querySelector("header"));
      delete document.documentElement.dataset.banner;
      document.documentElement.style.scrollPaddingTop = "";
      document.documentElement.style.removeProperty("--banner-h");
    };
  }, [cues, home, line]);

  const shown = line.trim();

  return (
    <div ref={rootRef} className={styles.anchor}>
      <div
        ref={barRef}
        className={styles.bar}
        data-bg="#f4f0e8"
        data-theme="light"
        data-nav="on-dark"
      >
        {shown ? (
          <p key={shown} className={styles.line} aria-live="polite">
            {shown}
          </p>
        ) : (
          <TextSlot
            value=""
            jsonPath={fieldPath(instanceId, "line")}
            as="p"
            className={styles.line}
          />
        )}
      </div>
    </div>
  );
}
