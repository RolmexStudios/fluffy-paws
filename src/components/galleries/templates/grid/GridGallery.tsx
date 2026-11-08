"use client";

import { useMemo, useState } from "react";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyGalleryBlueprint } from "@/components/galleries/blueprint";
import type {
  BrochureBlockProps,
  BrochureGalleryContent,
} from "@/types/brochure";
import styles from "./grid.module.scss";

const ALL_CATEGORY = "All";

export function GridGallery({
  instanceId = "BrochureGallery_1",
  data = emptyGalleryBlueprint(),
}: BrochureBlockProps<BrochureGalleryContent>) {
  const items = data.items;
  const categories = useMemo(() => {
    const titles = items.map((item) => item.category.trim()).filter(Boolean);
    return [ALL_CATEGORY, ...Array.from(new Set(titles))];
  }, [items]);

  const [active, setActive] = useState(ALL_CATEGORY);
  const indexed = items.map((item, index) => ({ item, index }));
  const filtered =
    active === ALL_CATEGORY
      ? indexed
      : indexed.filter(({ item }) => item.category.trim() === active);
  const showFilters = categories.length > 1;

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.headerRow}>
          <TextSlot
            value={data.title}
            jsonPath={fieldPath(instanceId, "title")}
            as="h2"
            className={styles.title}
          />
          {showFilters ? (
            <div className={styles.chips} role="tablist" aria-label="Gallery categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active === cat}
                  onClick={() => setActive(cat)}
                  className={`${styles.chip} ${active === cat ? styles.chipActive : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.grid}>
          {filtered.map(({ item, index }) => {
            const slotId = `${instanceId}_${index + 1}`;
            const jsonPath = fieldPath(instanceId, `items[${index}].imageUrl`);
            const alt =
              item.alt.trim() ||
              (item.category.trim() ? `${item.category} installation` : "Project photo");

            return (
              <figure key={slotId} className={styles.figure}>
                <MediaSlot
                  url={item.imageUrl}
                  slotId={slotId}
                  jsonPath={jsonPath}
                  alt={alt}
                  className={styles.image}
                />
                {item.category.trim() ? (
                  <figcaption className={styles.caption}>{item.category}</figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
