"use client";

import { MediaSlot } from "@/components/shared/media";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyAboutBlueprint } from "@/components/abouts/blueprint";
import type { BrochureBlockProps, BrochureAboutContent } from "@/types/brochure";
import styles from "./rows.module.scss";

export function RowsAbout({
  instanceId = "BrochureAbout_1",
  data = emptyAboutBlueprint(),
}: BrochureBlockProps<BrochureAboutContent>) {
  return (
    <section
      id={instanceId}
      className={styles.section}
      data-bg="#f4f0e8"
      data-theme="light"
    >
      <div className={styles.inner}>
        <ScrollReveal className={styles.portrait}>
          <MediaSlot
            url={data.imageUrl}
            slotId={instanceId}
            jsonPath={fieldPath(instanceId, "imageUrl")}
            alt={data.imageAlt || data.title}
            className={styles.image}
          />
        </ScrollReveal>
        <div className={styles.info}>
          {data.rows.map((row, index) => (
            <ScrollReveal key={`${row.label}-${index}`} delayMs={100 + index * 90}>
              <div className={styles.row}>
                <TextSlot
                  value={row.label}
                  jsonPath={fieldPath(instanceId, `rows.${index}.label`)}
                  as="p"
                  className={styles.label}
                />
                <TextSlot
                  value={row.value}
                  jsonPath={fieldPath(instanceId, `rows.${index}.value`)}
                  as="p"
                  className={styles.value}
                />
              </div>
            </ScrollReveal>
          ))}
          {data.ctaHref.trim() && data.ctaLabel.trim() ? (
            <ScrollReveal delayMs={100 + data.rows.length * 90}>
              <a className={styles.button} href={data.ctaHref.trim()}>
                <TextSlot
                  value={data.ctaLabel}
                  jsonPath={fieldPath(instanceId, "ctaLabel")}
                  as="span"
                />
              </a>
            </ScrollReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
