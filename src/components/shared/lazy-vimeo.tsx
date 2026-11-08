"use client";

import { useEffect, useRef } from "react";

export type LazyVimeoProps = {
  id: string;
  title?: string;
  className?: string;
};

/** Background Vimeo plate. Embeds when the frame nears the viewport. */
export function LazyVimeo({ id, title = "Project video", className }: LazyVimeoProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    const vimeoId = id.trim();
    if (!container || !vimeoId) return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const iframe = document.createElement("iframe");
      iframe.src = `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?background=1&muted=1&autoplay=${reduce ? "0" : "1"}&loop=1`;
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.title = title;
      iframe.loading = "lazy";
      container.replaceChildren(iframe);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      load();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        load();
        observer.disconnect();
      },
      { threshold: 0.25, rootMargin: "50px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [id, title]);

  return (
    <div
      ref={ref}
      className={className}
      data-vimeo-id={id}
      role="img"
      aria-label={title}
    />
  );
}
