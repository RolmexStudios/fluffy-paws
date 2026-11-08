"use client";

import { useState } from "react";
import { AmbientVideo } from "@/components/shared/ambient-video";
import { ParallaxFrame } from "@/components/shared/parallax";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import {
  isImagePath,
  normalizeVideoUrl,
  videoSources,
  youtubeId,
} from "@/components/shared/video-sources";
import { emptyProjectBlueprint } from "@/components/projects/blueprint";
import { essayItems, recordIndex } from "@/components/projects/data";
import type { BrochureBlockProps, BrochureProjectContent } from "@/types/brochure";
import styles from "./essay.module.scss";

const META = [
  ["client", "Client"],
  ["role", "Role"],
  ["location", "Location"],
  ["category", "Category"],
] as const;

export function EssayProject({
  instanceId = "BrochureProject_1",
  data = emptyProjectBlueprint(),
}: BrochureBlockProps<BrochureProjectContent>) {
  const project = data.projects[0];
  const [watching, setWatching] = useState(false);
  if (!project) return null;

  const index = recordIndex(data.projects, project);
  const path = (field: string) => fieldPath(instanceId, `projects.${index}.${field}`);
  const sources = project.videoSrc.trim() ? videoSources(project.videoSrc) : [];
  const yt = youtubeId(project.youtubeUrl);
  const items = essayItems(project);

  return (
    <article className={styles.essay} data-bg="#faf8f4" data-theme="light">
      {sources.length > 0 ? (
        <section className={styles.hero}>
          <div className={styles.frame}>
            {watching && yt ? (
              <iframe
                className={styles.iframe}
                src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`}
                title="Project video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <AmbientVideo sources={sources} className={styles.video} />
                {yt ? (
                  <button type="button" className={styles.play} onClick={() => setWatching(true)}>
                    <svg className={styles.playIcon} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                    Watch video
                  </button>
                ) : null}
              </>
            )}
          </div>
        </section>
      ) : null}

      <section className={styles.intro}>
        <ScrollReveal>
          <TextSlot
            value={project.title}
            jsonPath={path("title")}
            as="h1"
            className={styles.title}
          />
          <div className={styles.columns}>
            {META.map(([key, label]) => (
              <div key={key} className={styles.column}>
                <p className={styles.meta}>{label}</p>
                <TextSlot
                  value={project[key]}
                  jsonPath={path(key)}
                  as="p"
                  className={styles.value}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {items.length > 0 ? (
        <section className={styles.storySection}>
          <div className={styles.story}>
            {items.map((item) => {
              if (item.type === "text") {
                return (
                  <ScrollReveal compact key={`text-${item.storyIndex}`}>
                    <TextSlot
                      value={item.text}
                      jsonPath={path(`story.${item.storyIndex}`)}
                      as="p"
                    />
                  </ScrollReveal>
                );
              }

              const src = normalizeVideoUrl(item.src);
              const media = isImagePath(src) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" />
              ) : (
                <AmbientVideo sources={videoSources(src)} />
              );
              const shapeClass =
                item.type === "float" && item.shape === "portrait"
                  ? styles.portrait
                  : item.type === "float" && item.shape === "square"
                    ? styles.square
                    : styles.vertical;

              if (item.type === "wide") {
                return (
                  <ParallaxFrame
                    key={`wide-${item.mediaIndex}`}
                    strength={0.1}
                    className={styles.wide}
                  >
                    <ScrollReveal>{media}</ScrollReveal>
                  </ParallaxFrame>
                );
              }

              return (
                <ParallaxFrame
                  key={`float-${item.mediaIndex}`}
                  strength={0.12}
                  className={`${styles.float} ${item.side === "left" ? styles.left : styles.right} ${shapeClass}`}
                >
                  <ScrollReveal>{media}</ScrollReveal>
                </ParallaxFrame>
              );
            })}
          </div>
        </section>
      ) : null}
    </article>
  );
}
