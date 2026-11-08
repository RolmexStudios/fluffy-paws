import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyAboutBlueprint } from "@/components/abouts/blueprint";
import type { BrochureBlockProps, BrochureAboutContent } from "@/types/brochure";
import styles from "./split.module.scss";

export function SplitAbout({
  instanceId = "BrochureAbout_1",
  data = emptyAboutBlueprint(),
}: BrochureBlockProps<BrochureAboutContent>) {
  const services = data.services;

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <SectionHeading
              instanceId={instanceId}
              eyebrow={data.eyebrow}
              title={data.title}
              eyebrowClassName={styles.eyebrow}
              titleClassName={styles.title}
            />
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

          {services.some((s) => s.title.trim() || s.description.trim()) ? (
            <ol className={styles.services}>
              {services.map((service, index) =>
                service.title.trim() || service.description.trim() ? (
                  <li
                    key={`${instanceId}-service-${index}`}
                    className={styles.service}
                  >
                    <span className={styles.index} aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <TextSlot
                        value={service.title}
                        jsonPath={fieldPath(instanceId, `services[${index}].title`)}
                        as="h3"
                        className={styles.serviceTitle}
                      />
                      <TextSlot
                        value={service.description}
                        jsonPath={fieldPath(
                          instanceId,
                          `services[${index}].description`,
                        )}
                        as="p"
                        className={styles.serviceBody}
                      />
                    </div>
                  </li>
                ) : null,
              )}
            </ol>
          ) : null}
        </div>
      </div>
    </section>
  );
}
