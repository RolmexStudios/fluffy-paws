"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyGalleryBlueprint } from "@/components/galleries/blueprint";
import type {
  BrochureBlockProps,
  BrochureGalleryContent,
} from "@/types/brochure";
import styles from "./cards.module.scss";

export function ImageCardsGallery({
  instanceId = "BrochureGallery_1",
  data = emptyGalleryBlueprint(),
}: BrochureBlockProps<BrochureGalleryContent>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const items = data.items;

  const syncScrollState = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) {
      return;
    }

    const slides = Array.from(root.children) as HTMLElement[];
    if (slides.length === 0) {
      setCurrentSlide(0);
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const midpoint = root.scrollLeft + root.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    slides.forEach((slide, index) => {
      const center = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - midpoint);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });

    setCurrentSlide(nearest);
    setCanScrollPrev(root.scrollLeft > 8);
    setCanScrollNext(
      root.scrollLeft + root.clientWidth < root.scrollWidth - 8,
    );
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) {
      return;
    }

    syncScrollState();
    root.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      root.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [items.length, syncScrollState]);

  function scrollToIndex(index: number) {
    const root = scrollerRef.current;
    const slide = root?.children[index] as HTMLElement | undefined;
    if (!root || !slide) {
      return;
    }
    root.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }

  function scrollByDirection(direction: -1 | 1) {
    scrollToIndex(Math.min(items.length - 1, Math.max(0, currentSlide + direction)));
  }

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.headerInner}>
        <div className={styles.headerRow}>
          <div className={styles.copy}>
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
            />
          </div>
          <div className={styles.arrows} aria-hidden={items.length < 2}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByDirection(-1)}
              disabled={!canScrollPrev}
              aria-label="Previous projects"
            >
              <ArrowLeft className={styles.arrowIcon} />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByDirection(1)}
              disabled={!canScrollNext}
              aria-label="Next projects"
            >
              <ArrowRight className={styles.arrowIcon} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.trackWrap}>
        <div ref={scrollerRef} className={styles.track}>
          {items.map((item, index) => {
            const slotId = `${instanceId}_${index + 1}`;
            const title =
              item.category.trim() ||
              item.alt.trim() ||
              `Project ${index + 1}`;
            const alt = item.alt.trim() || title;

            return (
              <article key={slotId} className={styles.slide}>
                <div className={styles.card}>
                  <MediaSlot
                    url={item.imageUrl}
                    slotId={slotId}
                    jsonPath={fieldPath(instanceId, `items[${index}].imageUrl`)}
                    alt={alt}
                    className={styles.image}
                  />
                  <div className={styles.scrim} aria-hidden />
                  <div className={styles.cardCopy}>
                    <TextSlot
                      value={item.category}
                      jsonPath={fieldPath(instanceId, `items[${index}].category`)}
                      as="h3"
                      className={styles.cardTitle}
                    />
                    <TextSlot
                      value={item.alt}
                      jsonPath={fieldPath(instanceId, `items[${index}].alt`)}
                      as="p"
                      className={styles.cardBody}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {items.length > 1 ? (
        <div className={styles.dots} role="tablist" aria-label="Gallery slides">
          {items.map((_, index) => (
            <button
              key={`${instanceId}-dot-${index}`}
              type="button"
              role="tab"
              aria-selected={currentSlide === index}
              aria-label={`Go to slide ${index + 1}`}
              className={`${styles.dot} ${currentSlide === index ? styles.dotActive : ""}`}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
