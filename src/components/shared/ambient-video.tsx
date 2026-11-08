"use client";

import { useLayoutEffect, useRef } from "react";
import { videoSources, type VideoSource } from "@/components/shared/video-sources";
import styles from "./ambient-video.module.scss";

const bound = new Set<HTMLVideoElement>();
let runtimeInstalled = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function stripNativeUI(video: HTMLVideoElement) {
  if (video.controls || video.hasAttribute("controls")) {
    video.controls = false;
    video.removeAttribute("controls");
  }
}

function bindAmbientVideo(video: HTMLVideoElement) {
  if (bound.has(video)) return;
  bound.add(video);

  video.defaultMuted = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.tabIndex = -1;
  stripNativeUI(video);

  if (!video.hasAttribute("aria-hidden") && !video.getAttribute("aria-label")) {
    video.setAttribute("aria-hidden", "true");
  }

  const observer = new MutationObserver(() => stripNativeUI(video));
  observer.observe(video, { attributes: true, attributeFilter: ["controls"] });

  if (prefersReducedMotion()) {
    video.removeAttribute("autoplay");
    video.autoplay = false;
    try {
      video.pause();
    } catch {
      /* ignore */
    }
  }
}

function scan() {
  document.querySelectorAll<HTMLVideoElement>("video[data-ambient]").forEach(bindAmbientVideo);
}

function resumePaused() {
  if (prefersReducedMotion() || document.hidden) return;
  document.querySelectorAll<HTMLVideoElement>("video[data-ambient]").forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    stripNativeUI(video);
    if (video.paused) void video.play().catch(() => {});
  });
}

/** Document listeners, once. Does not call play() during the initial bind. */
function ensureAmbientRuntime() {
  if (runtimeInstalled || typeof document === "undefined") return;
  runtimeInstalled = true;
  scan();
  new MutationObserver(scan).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  document.addEventListener("pointerdown", resumePaused, { passive: true });
  document.addEventListener("touchstart", resumePaused, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) resumePaused();
  });
}

export type AmbientVideoProps = {
  src?: string;
  sources?: VideoSource[];
  className?: string;
  poster?: string;
  /** When set, the clip is exposed to assistive tech instead of aria-hidden. */
  label?: string;
};

/**
 * Background clip. Autoplay comes from the muted markup attribute.
 * play() is not called on load. Reduced motion pauses and strips autoplay.
 * A later gesture may retry a clip that is still paused.
 */
export function AmbientVideo({
  src,
  sources,
  className,
  poster,
  label,
}: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const list = sources ?? (src?.trim() ? videoSources(src) : []);

  useLayoutEffect(() => {
    const video = ref.current;
    if (!video) return;
    bindAmbientVideo(video);
    ensureAmbientRuntime();
    return () => {
      bound.delete(video);
    };
  }, [src, list.length]);

  return (
    <video
      ref={ref}
      className={[styles.video, className].filter(Boolean).join(" ")}
      poster={poster}
      data-ambient=""
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
      preload="auto"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      tabIndex={-1}
    >
      {list.map((source) => (
        <source key={`${source.type}:${source.src}`} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
