"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Slideshow } from "@/components/shared/slideshow";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { showroomHref } from "@/components/inventory/data";
import type {
  BrochureBlockProps,
  BrochureHeroContent,
  BrochureHeroMagazineContent,
} from "@/types/brochure";
import styles from "./magazine.module.scss";

const EMPTY: BrochureHeroMagazineContent = {
  variant: "magazine",
  eyebrow: "",
  headline: "",
  subheadline: "",
  ctaLabel: "",
  sectionSize: "auto",
  slideshowIntervalMs: 6000,
  slideshowImages: [],
};

/** Clean printed-page opener: one wide photograph at a time, then the words. */
export function MagazineHero({
  instanceId = "BrochureHero_1",
  data,
}: BrochureBlockProps<BrochureHeroContent>) {
  const hero = data?.variant === "magazine" ? data : EMPTY;
  const slides = hero.slideshowImages.filter((slide) => slide.imageUrl.trim());
  const count = slides.length;
  const [active, setActive] = useState(0);

  const go = useCallback(
    (index: number) => {
      if (count > 0) {
        setActive(((index % count) + count) % count);
      }
    },
    [count],
  );

  const cta = hero.ctaLabel.trim();
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id={instanceId} className={styles.root} aria-label="Introduction">
      {/* The plate runs almost edge to edge; the words keep the page column. */}
      <div className={styles.bleed}>
        <div className={styles.frame}>
          <Slideshow
            slides={hero.slideshowImages.map((slide, index) => ({
              imageUrl: slide.imageUrl,
              alt: slide.alt,
              position: slide.position.trim() || undefined,
              slotId: `${instanceId}_${index + 1}`,
              jsonPath: fieldPath(instanceId, `slideshowImages[${index}].imageUrl`),
            }))}
            intervalMs={hero.slideshowIntervalMs}
            autoplay={false}
            showDots={false}
            activeIndex={active}
            onActiveIndexChange={go}
            dotsLabel="Photographs"
          />
          {count > 1 ? (
            <div className={styles.platePager}>
              <button
                type="button"
                className={styles.plateControl}
                onClick={() => go(active - 1)}
                aria-label="Previous photograph"
              >
                <ChevronLeft aria-hidden />
              </button>
              <span className={styles.plateCounter} aria-live="polite">
                {pad(active + 1)} / {pad(count)}
              </span>
              <button
                type="button"
                className={styles.plateControl}
                onClick={() => go(active + 1)}
                aria-label="Next photograph"
              >
                <ChevronRight aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <div>
            {hero.eyebrow.trim() ? (
              <TextSlot
                value={hero.eyebrow}
                jsonPath={fieldPath(instanceId, "eyebrow")}
                as="p"
                className={styles.eyebrow}
              />
            ) : null}
            <TextSlot
              value={hero.headline}
              jsonPath={fieldPath(instanceId, "headline")}
              as="h1"
              className={styles.headline}
            />
          </div>

          <div className={styles.aside}>
            {count > 1 ? (
              <div className={styles.controls}>
                <span className={styles.counter} aria-live="polite">
                  {pad(active + 1)} / {pad(count)}
                </span>
                <button
                  type="button"
                  className={styles.control}
                  onClick={() => go(active - 1)}
                  aria-label="Previous photograph"
                >
                  <ChevronLeft aria-hidden />
                </button>
                <button
                  type="button"
                  className={styles.control}
                  onClick={() => go(active + 1)}
                  aria-label="Next photograph"
                >
                  <ChevronRight aria-hidden />
                </button>
              </div>
            ) : null}
            <TextSlot
              value={hero.subheadline}
              jsonPath={fieldPath(instanceId, "subheadline")}
              as="p"
              className={styles.note}
            />
            {cta ? (
              <Link href={showroomHref()} className={styles.cta}>
                {cta}
                <ArrowRight className={styles.ctaIcon} aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
