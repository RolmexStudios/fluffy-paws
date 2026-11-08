import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyAboutBlueprint } from "@/components/abouts/blueprint";
import type { BrochureBlockProps, BrochureAboutContent } from "@/types/brochure";
import styles from "./values.module.scss";

export function ValuesAbout({
  instanceId = "BrochureAbout_1",
  data = emptyAboutBlueprint(),
}: BrochureBlockProps<BrochureAboutContent>) {
  const services = data.services.filter(
    (service) => service.title.trim() || service.description.trim(),
  );

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <SectionHeading
            instanceId={instanceId}
            eyebrow={data.eyebrow}
            title={data.title}
            eyebrowClassName={styles.eyebrow}
            titleClassName={styles.title}
          />
          <div className={styles.lede}>
            {data.paragraphs.map((paragraph, index) => (
              <TextSlot
                key={`${instanceId}-p-${index}`}
                value={paragraph}
                jsonPath={fieldPath(instanceId, `paragraphs[${index}]`)}
                as="p"
                className={styles.paragraph}
              />
            ))}
          </div>
        </header>

        {services.length > 0 ? (
          <ul className={styles.grid}>
            {services.map((service, index) => (
              <li
                key={`${instanceId}-service-${index}`}
                className={styles.card}
                data-featured={index === 0 ? "true" : undefined}
              >
                <span className={styles.watermark} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <TextSlot
                  value={service.title}
                  jsonPath={fieldPath(instanceId, `services[${index}].title`)}
                  as="h3"
                  className={styles.cardTitle}
                />
                <TextSlot
                  value={service.description}
                  jsonPath={fieldPath(
                    instanceId,
                    `services[${index}].description`,
                  )}
                  as="p"
                  className={styles.cardBody}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
