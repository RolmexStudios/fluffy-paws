"use client";

import { useEffect, useRef } from "react";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AutoplayVideo({
  src,
  className,
  ariaLabel,
  playing = true,
}: {
  src: string;
  className?: string;
  ariaLabel?: string;
  /** When false (hidden slideshow slide), pause so only the visible clip runs. */
  playing?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const syncPlayback = () => {
      if (!playing || prefersReducedMotion()) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        /* autoplay blocked */
      });
    };

    syncPlayback();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", syncPlayback);
    return () => motionQuery.removeEventListener("change", syncPlayback);
  }, [src, playing]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay={playing}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
