"use client";

import { useState } from "react";
import { ImageLightbox, type LightboxImage } from "@/components/shared/image-lightbox";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot, hasSlotText } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyGalleryBlueprint } from "@/components/galleries/blueprint";
import type {
  BrochureBlockProps,
  BrochureGalleryContent,
} from "@/types/brochure";
import styles from "./lookbook.module.scss";

export function LookbookGallery({
  instanceId = "BrochureGallery_1",
  data = emptyGalleryBlueprint(),
}: BrochureBlockProps<BrochureGalleryContent>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const plates = data.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.imageUrl.trim().length > 0);

  const slides: LightboxImage[] = plates.map(({ item, index }) => ({
    url: item.imageUrl,
    alt: item.alt.trim() || item.title.trim() || item.category.trim(),
    slotId: `${instanceId}-item-${index}`,
    jsonPath: fieldPath(instanceId, `items.${index}.imageUrl`),
  }));

  const openPlate = openIndex == null ? null : plates[openIndex];

  return (
    <section id={instanceId} className={styles.section} aria-labelledby={`${instanceId}-title`}>
      <header className={styles.intro}>
        <p className={styles.kicker}>The vault</p>
        <TextSlot
          value={data.title}
          jsonPath={fieldPath(instanceId, "title")}
          as="h2"
          className={styles.title}
        />
        <TextSlot
          value={data.description}
          jsonPath={fieldPath(instanceId, "description")}
          as="p"
          className={styles.description}
          hideWhenEmpty
        />
      </header>

      <ul className={styles.grid}>
        {plates.map(({ item, index }, plateIndex) => {
          const name = item.title.trim();
          const category = item.category.trim();
          const label = [category, name].filter(Boolean).join(". ") || "Piece";
          return (
            <li key={`${item.imageUrl}-${index}`} className={styles.cell}>
              <button
                type="button"
                className={styles.plate}
                onClick={() => setOpenIndex(plateIndex)}
                aria-label={label}
              >
                <MediaSlot
                  url={item.imageUrl}
                  slotId={instanceId}
                  jsonPath={fieldPath(instanceId, `items.${index}.imageUrl`)}
                  alt={item.alt}
                  className={styles.image}
                />
                <span className={styles.caption}>
                  {category ? <span className={styles.category}>{category}</span> : null}
                  {name ? <span className={styles.name}>{name}</span> : null}
                  {!category && !name && hasSlotText(item.alt) ? (
                    <span className={styles.name}>{item.alt.trim()}</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {openIndex != null && slides.length > 0 ? (
        <ImageLightbox
          images={slides}
          index={openIndex}
          title={openPlate?.item.title.trim() || openPlate?.item.category.trim()}
          onClose={() => setOpenIndex(null)}
          onIndexChange={(next) => setOpenIndex(next)}
        />
      ) : null}
    </section>
  );
}
