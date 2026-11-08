import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyAboutBlueprint } from "@/components/abouts/blueprint";
import type { BrochureBlockProps, BrochureAboutContent } from "@/types/brochure";
import styles from "./editorial.module.scss";

export function EditorialAbout({
  instanceId = "BrochureAbout_1",
  data = emptyAboutBlueprint(),
}: BrochureBlockProps<BrochureAboutContent>) {
  const pullQuote = data.testimonials[0];

  return (
    <section id={instanceId} className={styles.section} aria-labelledby={`${instanceId}-title`}>
      <div className={styles.inner}>
        <SectionHeading
          instanceId={instanceId}
          eyebrow={data.eyebrow}
          title={data.title}
          titleId={`${instanceId}-title`}
          as="header"
          className={styles.header}
          eyebrowClassName={styles.eyebrow}
          titleClassName={styles.title}
          titleInnerClassName={styles.titleText}
        />

        <figure className={styles.figure}>
          <MediaSlot
            url={data.imageUrl}
            slotId={`${instanceId}_feature`}
            jsonPath={fieldPath(instanceId, "imageUrl")}
            alt={data.imageAlt.trim() || data.title.trim() || "Feature photograph"}
            className={styles.image}
          />
        </figure>

        <div className={styles.spread}>
          <div className={styles.quoteCol}>
            {pullQuote && (pullQuote.quote.trim() || pullQuote.author.trim()) ? (
              <blockquote className={styles.quote}>
                <TextSlot
                  value={pullQuote.quote}
                  jsonPath={fieldPath(instanceId, "testimonials[0].quote")}
                  as="p"
                  className={styles.quoteText}
                />
                {pullQuote.author.trim() ? (
                  <TextSlot
                    value={pullQuote.author}
                    jsonPath={fieldPath(instanceId, "testimonials[0].author")}
                    as="p"
                    className={styles.quoteAuthor}
                  />
                ) : null}
              </blockquote>
            ) : null}
          </div>

          <div className={styles.proseCol}>
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
        </div>
      </div>
    </section>
  );
}
