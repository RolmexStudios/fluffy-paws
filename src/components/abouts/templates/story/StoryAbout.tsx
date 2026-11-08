import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyAboutBlueprint } from "@/components/abouts/blueprint";
import type { BrochureBlockProps, BrochureAboutContent } from "@/types/brochure";
import styles from "./story.module.scss";

export function StoryAbout({
  instanceId = "BrochureAbout_1",
  data = emptyAboutBlueprint(),
}: BrochureBlockProps<BrochureAboutContent>) {
  const services = data.services.filter(
    (service) => service.title.trim() || service.description.trim(),
  );
  const quote = data.testimonials.find(
    (item) => item.quote.trim() || item.author.trim(),
  );

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          instanceId={instanceId}
          eyebrow={data.eyebrow}
          title={data.title}
          as="header"
          className={styles.header}
          eyebrowClassName={styles.eyebrow}
          titleClassName={styles.title}
        />

        <div className={styles.story}>
          <figure className={styles.figure}>
            <MediaSlot
              url={data.imageUrl}
              slotId={`${instanceId}_image`}
              jsonPath={fieldPath(instanceId, "imageUrl")}
              alt={data.imageAlt.trim() || data.title}
              className={styles.image}
            />
          </figure>

          <div className={styles.copy}>
            {data.paragraphs.map((paragraph, index) => (
              <TextSlot
                key={`${instanceId}-p-${index}`}
                value={paragraph}
                jsonPath={fieldPath(instanceId, `paragraphs[${index}]`)}
                as="p"
                className={styles.paragraph}
              />
            ))}
            {quote ? (
              <blockquote className={styles.quote}>
                <TextSlot
                  value={quote.quote}
                  jsonPath={fieldPath(instanceId, "testimonials[0].quote")}
                  as="p"
                  className={styles.quoteText}
                />
                <TextSlot
                  value={quote.author}
                  jsonPath={fieldPath(instanceId, "testimonials[0].author")}
                  as="p"
                  className={styles.quoteAuthor}
                />
              </blockquote>
            ) : null}
          </div>
        </div>

        {services.length > 0 ? (
          <ul className={styles.capabilities}>
            {services.map((service, index) => (
              <li
                key={`${instanceId}-service-${index}`}
                className={styles.capability}
              >
                <span className={styles.capabilityIndex} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <TextSlot
                  value={service.title}
                  jsonPath={fieldPath(instanceId, `services[${index}].title`)}
                  as="h3"
                  className={styles.capabilityTitle}
                />
                <TextSlot
                  value={service.description}
                  jsonPath={fieldPath(
                    instanceId,
                    `services[${index}].description`,
                  )}
                  as="p"
                  className={styles.capabilityBody}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
