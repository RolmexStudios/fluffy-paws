"use client";

import { useState } from "react";
import { ImageLightbox, type LightboxImage } from "@/components/shared/image-lightbox";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { fieldPath } from "@/components/shared/field-path";
import { emptyProjectBlueprint } from "@/components/projects/blueprint";
import {
  isPhotography,
  projectGallery,
  recordIndex,
  sortProjects,
} from "@/components/projects/data";
import type { BrochureBlockProps, BrochureProjectContent } from "@/types/brochure";
import styles from "./grid.module.scss";

type OpenState = {
  title: string;
  images: LightboxImage[];
};

export function GridProject({
  instanceId = "BrochureProject_1",
  data = emptyProjectBlueprint(),
}: BrochureBlockProps<BrochureProjectContent>) {
  const photos = sortProjects(data.projects.filter(isPhotography));
  const emptyCount = Math.max(0, data.minSlots - photos.length);
  const [open, setOpen] = useState<OpenState | null>(null);
  const [index, setIndex] = useState(0);

  return (
    <section
      id={instanceId}
      className={styles.section}
      data-bg="#f4f0e8"
      data-theme="light"
      aria-label="Photography"
    >
      <div className={styles.grid}>
        {photos.map((project) => {
          const record = recordIndex(data.projects, project);
          const gallery = projectGallery(project);
          const cover = gallery[0] ?? "";
          const title = project.title.trim() || "Untitled";
          const alt = `${title} — ${project.category}`;
          const slides: LightboxImage[] = gallery.map((url, frame) => ({
            url,
            alt,
            slotId: instanceId,
            jsonPath:
              frame === 0
                ? fieldPath(instanceId, `projects.${record}.imageSrc`)
                : fieldPath(instanceId, `projects.${record}.images.${frame - 1}`),
          }));
          const focal =
            project.focalY != null ? { objectPosition: `center ${project.focalY}%` } : undefined;

          return (
            <ScrollReveal key={project.slug || project.id || title} compact>
              <button
                type="button"
                className={styles.item}
                data-nav="on-dark"
                aria-label={`Expand ${title}`}
                onClick={() => {
                  if (!slides.length) return;
                  setIndex(0);
                  setOpen({ title, images: slides });
                }}
              >
                {cover ? (
                  // Cover crop uses focalY from the record.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={alt} style={focal} />
                ) : null}
                <span className={styles.overlay}>Expand</span>
              </button>
            </ScrollReveal>
          );
        })}
        {Array.from({ length: emptyCount }, (_, slot) => (
          <ScrollReveal key={`empty-${slot}`} compact>
            <div className={`${styles.item} ${styles.empty}`} aria-hidden="true">
              <span>+</span>
            </div>
          </ScrollReveal>
        ))}
      </div>
      {open ? (
        <ImageLightbox
          images={open.images}
          index={index}
          title={open.title}
          tone="paper"
          onClose={() => setOpen(null)}
          onIndexChange={setIndex}
        />
      ) : null}
    </section>
  );
}
