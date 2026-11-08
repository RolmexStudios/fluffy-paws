"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageLightbox, type LightboxImage } from "@/components/shared/image-lightbox";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import {
  shopCategoryHref,
  shopHref,
  shopParagraphs,
  shopPhotos,
} from "@/components/shops/data";
import type { BrochureShopItem } from "@/types/brochure";
import styles from "./product-view.module.scss";

type ProductViewProps = {
  item: BrochureShopItem;
  index: number;
  instanceId: string;
  inquiryHref: string;
  inquiryLabel: string;
};

export function ProductView({
  item,
  index,
  instanceId,
  inquiryHref,
  inquiryLabel,
}: ProductViewProps) {
  const photos = shopPhotos(item);
  const paragraphs = shopParagraphs(item.description);
  const details = item.details.filter((row) => row.label.trim() && row.value.trim());
  const sold = item.status === "sold";
  const title = item.title.trim() || item.brand.trim() || "Piece";
  const [selected, setSelected] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const safeSelected = photos.length ? Math.min(selected, photos.length - 1) : 0;
  const base = `items[${index}]`;

  const frames = useMemo<LightboxImage[]>(() => {
    const cover = item.imageUrl.trim();
    return photos.map((url, photoIndex) => {
      const extraIndex = item.images.findIndex((entry) => entry.trim() === url);
      return {
        url,
        alt: item.imageAlt.trim() || title,
        slotId: `${instanceId}-${item.id || index}-photo-${photoIndex + 1}`,
        jsonPath:
          url === cover
            ? fieldPath(instanceId, `${base}.imageUrl`)
            : fieldPath(instanceId, `${base}.images[${Math.max(extraIndex, 0)}]`),
      };
    });
  }, [base, index, instanceId, item.id, item.imageAlt, item.imageUrl, item.images, photos, title]);

  const current = frames[safeSelected];

  return (
    <article
      className={styles.page}
      data-bg="#ffffff"
      data-theme="light"
      data-nav="on-light"
    >
      <div className={styles.inner}>
        <Link href={shopHref()} className={styles.back}>
          <ArrowLeft className={styles.backIcon} aria-hidden />
          Shop
        </Link>

        <div className={styles.layout}>
          <div className={styles.media}>
            {current ? (
              <button
                type="button"
                className={styles.stage}
                onClick={() => setLightboxIndex(safeSelected)}
                aria-label={`View ${title}`}
              >
                <MediaSlot
                  url={current.url}
                  slotId={current.slotId}
                  jsonPath={current.jsonPath}
                  alt={current.alt}
                  className={styles.image}
                />
              </button>
            ) : (
              <div className={styles.stage}>
                <MediaSlot
                  url=""
                  slotId={`${instanceId}-item-${index + 1}`}
                  jsonPath={fieldPath(instanceId, `${base}.imageUrl`)}
                  alt=""
                  className={styles.image}
                />
              </div>
            )}

            {frames.length > 1 ? (
              <ul className={styles.thumbs}>
                {frames.map((frame, photoIndex) => (
                  <li key={`${frame.slotId}-${photoIndex}`}>
                    <button
                      type="button"
                      className={styles.thumb}
                      aria-current={photoIndex === safeSelected ? "true" : undefined}
                      aria-label={`Photo ${photoIndex + 1} of ${frames.length}`}
                      onClick={() => setSelected(photoIndex)}
                    >
                      <MediaSlot
                        url={frame.url}
                        slotId={frame.slotId}
                        jsonPath={frame.jsonPath}
                        alt=""
                        className={styles.thumbImage}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className={styles.copy}>
            <TextSlot
              value={item.brand}
              jsonPath={fieldPath(instanceId, `${base}.brand`)}
              as="p"
              className={styles.brand}
            />
            <TextSlot
              value={item.title}
              jsonPath={fieldPath(instanceId, `${base}.title`)}
              as="h1"
              className={styles.title}
            />
            {sold ? (
              <p className={styles.sold}>Sold</p>
            ) : (
              <TextSlot
                value={item.price}
                jsonPath={fieldPath(instanceId, `${base}.price`)}
                as="p"
                className={styles.price}
              />
            )}

            {item.category.trim() ? (
              <Link href={shopCategoryHref(item.category)} className={styles.more}>
                Shop all {item.category.trim()}
              </Link>
            ) : null}

            {paragraphs.length > 0 ? (
              <div className={styles.description}>
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <TextSlot
                value=""
                jsonPath={fieldPath(instanceId, `${base}.description`)}
                as="p"
                className={styles.description}
              />
            )}

            {details.length > 0 ? (
              <dl className={styles.details}>
                {details.map((row) => (
                  <div key={`${row.label}-${row.value}`} className={styles.row}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {inquiryHref ? (
              <a className={styles.inquiry} href={inquiryHref}>
                {inquiryLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && frames.length > 0 ? (
        <ImageLightbox
          images={frames}
          index={lightboxIndex}
          title={title}
          tone="paper"
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      ) : null}
    </article>
  );
}
