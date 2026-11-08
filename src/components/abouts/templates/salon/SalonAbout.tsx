import { MediaSlot } from "@/components/shared/media";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyAboutBlueprint } from "@/components/abouts/blueprint";
import type { BrochureBlockProps, BrochureAboutContent } from "@/types/brochure";
import styles from "./salon.module.scss";

export function SalonAbout({
  instanceId = "BrochureAbout_1",
  data = emptyAboutBlueprint(),
}: BrochureBlockProps<BrochureAboutContent>) {
  const paragraphs = data.paragraphs.filter((paragraph) => paragraph.trim());

  return (
    <section
      id={instanceId}
      className={styles.section}
      data-bg="#faf8f4"
      data-theme="light"
      data-nav="on-light"
      aria-labelledby={`${instanceId}-title`}
    >
      <div className={styles.frame} data-image={data.imageSide === "left" ? "left" : "right"}>
        <ScrollReveal compact className={styles.copy}>
          <TextSlot
            value={data.eyebrow}
            jsonPath={fieldPath(instanceId, "eyebrow")}
            as="p"
            className={styles.eyebrow}
            hideWhenEmpty
          />
          <h2 id={`${instanceId}-title`} className={styles.title}>
            <TextSlot
              value={data.title}
              jsonPath={fieldPath(instanceId, "title")}
              as="span"
            />
          </h2>
          {paragraphs.length > 0 ? <span className={styles.rule} aria-hidden /> : null}
          <div className={styles.prose}>
            {paragraphs.map((paragraph, index) => (
              <TextSlot
                key={`${instanceId}-p-${index}`}
                value={paragraph}
                jsonPath={fieldPath(instanceId, `paragraphs[${index}]`)}
                as="p"
                className={styles.paragraph}
              />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal compact className={styles.figure} delayMs={90}>
          <figure className={styles.plate}>
            <MediaSlot
              url={data.imageUrl}
              slotId={`${instanceId}_image`}
              jsonPath={fieldPath(instanceId, "imageUrl")}
              alt={data.imageAlt.trim() || data.title}
              className={styles.image}
            />
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
}
