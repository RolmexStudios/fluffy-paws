"use client";

import { ImageShowcase } from "@/components/shared/image-showcase";
import { fieldPath } from "@/components/shared/field-path";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { emptyGalleryBlueprint } from "@/components/galleries/blueprint";
import type {
  BrochureBlockProps,
  BrochureGalleryContent,
  BrochureGalleryItem,
} from "@/types/brochure";
import styles from "./showcase.module.scss";

/** Preview the type with a handful of categories, each as its own section. */
const SHOWCASE_CATEGORY_LIMIT = 3;

type IndexedItem = { item: BrochureGalleryItem; index: number };

function categoriesInOrder(items: BrochureGalleryItem[]) {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const item of items) {
    const key = item.category.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    order.push(key);
    if (order.length >= SHOWCASE_CATEGORY_LIMIT) break;
  }
  return order;
}

export function ShowcaseGallery({
  instanceId = "BrochureGallery_1",
  data = emptyGalleryBlueprint(),
}: BrochureBlockProps<BrochureGalleryContent>) {
  const indexed: IndexedItem[] = data.items.map((item, index) => ({
    item,
    index,
  }));
  const categories = categoriesInOrder(data.items);

  if (categories.length === 0) {
    return (
      <section id={instanceId} className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.title}>{data.title.trim() || "Selected work"}</h2>
        </div>
      </section>
    );
  }

  return (
    <div className={styles.stack}>
      {categories.map((category, sectionIndex) => {
        const rows = indexed.filter(
          ({ item }) => item.category.trim() === category,
        );
        const description =
          data.categories
            .find((row) => row.title.trim() === category)
            ?.description.trim() ?? "";
        const headingId = `${instanceId}-heading-${sectionIndex + 1}`;

        return (
          <ScrollReveal
            key={category}
            className={styles.reveal}
            style={{ minHeight: 0, flex: "0 1 auto" }}
          >
            <section
              id={sectionIndex === 0 ? instanceId : undefined}
              className={styles.section}
              aria-labelledby={headingId}
            >
              <div className={styles.inner}>
                <header className={styles.header}>
                  <h2 id={headingId} className={styles.title}>
                    {category}
                  </h2>
                  {description ? (
                    <p className={styles.description}>{description}</p>
                  ) : null}
                </header>
                <ImageShowcase
                  label={`${category} photos`}
                  slides={rows.map(({ item, index }) => ({
                    id: `${instanceId}_${index + 1}`,
                    imageUrl: item.imageUrl,
                    alt:
                      item.alt.trim() ||
                      `${category} installation`,
                    slotId: `${instanceId}_${index + 1}`,
                    jsonPath: fieldPath(instanceId, `items[${index}].imageUrl`),
                  }))}
                />
              </div>
            </section>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
