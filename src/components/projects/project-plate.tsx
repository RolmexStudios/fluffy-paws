"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { AmbientVideo } from "@/components/shared/ambient-video";
import { LazyVimeo } from "@/components/shared/lazy-vimeo";
import { MediaSlot } from "@/components/shared/media";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { videoSources } from "@/components/shared/video-sources";
import {
  projectBackground,
  projectGallery,
  themeForBackground,
} from "@/components/projects/data";
import type { BrochureProjectRecord } from "@/types/brochure";
import styles from "./project-plate.module.scss";

const META = [
  ["client", "Client"],
  ["role", "Role"],
  ["location", "Location"],
  ["category", "Category"],
] as const;

export type ProjectPlateProps = {
  project: BrochureProjectRecord;
  index: number;
  instanceId: string;
  href?: string;
  /** Photo detail forces light. Home plates follow the background. */
  theme?: "light" | "dark";
  showEnter?: boolean;
  /** Photography stills sit inside the frame. Film plates stay cover. */
  fit?: "cover" | "contain";
};

export function ProjectPlate({
  project,
  index,
  instanceId,
  href,
  theme,
  showEnter = Boolean(href),
  fit = "cover",
}: ProjectPlateProps) {
  const bg = projectBackground(project);
  const plateTheme = theme ?? themeForBackground(bg);
  const title = project.title.trim();
  const alt = title
    ? `${title} — ${project.category}`
    : fieldPath(instanceId, `projects.${index}.title`);
  const sources = project.videoSrc.trim() ? videoSources(project.videoSrc) : [];
  const gallery = projectGallery(project);
  const still = gallery[0] ?? "";
  const path = (field: string) => fieldPath(instanceId, `projects.${index}.${field}`);
  const linked = Boolean(href);
  const innerClass = styles.inner;

  const media = sources.length > 0 ? (
    <AmbientVideo sources={sources} className={styles.media} />
  ) : project.vimeoId.trim() ? (
    <LazyVimeo id={project.vimeoId} title={alt} className={styles.vimeo} />
  ) : (
    <MediaSlot
      url={still}
      slotId={instanceId}
      jsonPath={path("imageSrc")}
      alt={alt}
      className={styles.media}
    />
  );

  const body = (
    <>
      <div className={styles.mediaWrap}>{media}</div>
      <div className={styles.scrim} aria-hidden="true" />
      {showEnter && linked ? <span className={styles.enter}>Enter project</span> : null}
      <ScrollReveal compact className={styles.details} threshold={0.1}>
        <div className={styles.caption}>
          {META.map(([key, label], index) => (
            <div key={key} className={styles.column}>
              <div className={styles.stack}>
                {index === 0 ? (
                  <TextSlot
                    value={project.title}
                    jsonPath={path("title")}
                    as="p"
                    className={styles.title}
                  />
                ) : null}
                <p className={styles.meta}>{label}</p>
                <TextSlot
                  value={project[key]}
                  jsonPath={path(key)}
                  as="p"
                  className={styles.value}
                />
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </>
  );

  const focal =
    project.focalY != null
      ? ({ "--focal-y": `${project.focalY}%` } as CSSProperties)
      : undefined;

  return (
    <section
      id={project.slug.trim() || project.id.trim() || undefined}
      className={[
        styles.plate,
        linked ? styles.linked : "",
        fit === "contain" ? styles.contain : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-bg={bg}
      data-theme={plateTheme}
      data-nav="on-dark"
      style={focal}
    >
      {href ? (
        <Link href={href} className={innerClass} aria-label={alt}>
          {body}
        </Link>
      ) : (
        <div className={innerClass}>{body}</div>
      )}
    </section>
  );
}
