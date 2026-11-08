"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { MediaSlot } from "@/components/shared/media";
import styles from "./image-showcase.module.scss";

export type ImageShowcaseSlide = {
  id: string;
  imageUrl: string;
  alt: string;
  slotId: string;
  jsonPath: string;
  /** Shown as a quiet labelled tile when `imageUrl` is empty (e.g. "Rear three quarter"). */
  placeholderLabel?: string;
};

export type ImageShowcaseProps = {
  slides: ImageShowcaseSlide[];
  className?: string;
  label?: string;
  stageRef?: Ref<HTMLDivElement>;
  overlay?: ReactNode;
  /** Show the prev/next arrows on desktop too (default: phones only). */
  alwaysShowArrows?: boolean;
  /** "large" makes the thumbnail strip big enough to read each shot's angle. */
  thumbSize?: "compact" | "large";
};

function SlideMedia({
  slide,
  slotId,
  alt,
  className,
  placeholderClassName,
}: {
  slide: ImageShowcaseSlide;
  slotId: string;
  alt: string;
  className: string;
  placeholderClassName: string;
}) {
  if (!slide.imageUrl.trim() && slide.placeholderLabel) {
    return (
      <div className={`${className} ${placeholderClassName}`} role="img" aria-label={`${slide.placeholderLabel}, photo to come`}>
        <span>{slide.placeholderLabel}</span>
      </div>
    );
  }
  return (
    <MediaSlot
      url={slide.imageUrl}
      slotId={slotId}
      jsonPath={slide.jsonPath}
      alt={alt}
      className={className}
    />
  );
}

export function ImageShowcase({
  slides,
  className,
  label = "Photos",
  stageRef,
  overlay = null,
  alwaysShowArrows = false,
  thumbSize = "compact",
}: ImageShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(0, slides.length - 1));
  const slideShare = slides.length > 0 ? 100 / slides.length : 100;
  const stripRef = useRef<HTMLDivElement>(null);

  // Large strip scrolls: keep the active thumbnail in view, sideways only
  // (scrollIntoView would also move the page).
  useEffect(() => {
    if (thumbSize !== "large") return;
    const strip = stripRef.current;
    const thumb = strip?.children[safeIndex] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft || left + thumb.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      strip.scrollTo({
        left: left - (strip.clientWidth - thumb.offsetWidth) / 2,
        behavior: reduce ? "auto" : "smooth",
      });
    }
  }, [safeIndex, thumbSize]);

  function step(delta: number) {
    if (slides.length < 2) return;
    setActiveIndex((current) => {
      const from = Math.min(current, slides.length - 1);
      return (from + delta + slides.length) % slides.length;
    });
  }

  return (
    <div
      className={[styles.viewer, className].filter(Boolean).join(" ")}
      data-arrows={alwaysShowArrows ? "always" : undefined}
      data-thumbs={thumbSize === "large" ? "large" : undefined}
    >
      <div ref={stageRef} className={styles.stage}>
        <figure className={styles.mainFigure}>
          {overlay ? (
            <div className={styles.stageOverlay}>{overlay}</div>
          ) : null}
          <div className={styles.mainViewport} aria-live="polite">
            {slides.length > 0 ? (
              <div
                className={styles.mainTrack}
                style={{
                  width: `${slides.length * 100}%`,
                  transform: `translateX(-${(safeIndex * 100) / slides.length}%)`,
                }}
              >
                {slides.map((slide, slideIndex) => (
                  <div
                    key={slide.id}
                    className={styles.mainSlide}
                    style={{ flexBasis: `${slideShare}%` }}
                    aria-hidden={slideIndex !== safeIndex}
                  >
                    <SlideMedia
                      slide={slide}
                      slotId={slide.slotId}
                      alt={slide.alt}
                      className={styles.mainImage}
                      placeholderClassName={styles.placeholder}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.mainImage} aria-hidden />
            )}
          </div>
        </figure>
        {slides.length > 1 ? (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              aria-label="Previous photo"
              onClick={() => step(-1)}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              aria-label="Next photo"
              onClick={() => step(1)}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className={styles.carouselWrap}>
          <div ref={stripRef} className={styles.carousel} role="tablist" aria-label={label}>
            {slides.map((slide, thumbIndex) => {
              const selected = thumbIndex === safeIndex;
              return (
                <button
                  key={`${slide.id}-thumb`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`${styles.thumb} ${selected ? styles.thumbActive : ""}`}
                  onClick={() => setActiveIndex(thumbIndex)}
                >
                  <SlideMedia
                    slide={slide}
                    slotId={`${slide.slotId}-thumb`}
                    alt=""
                    className={styles.thumbImage}
                    placeholderClassName={styles.placeholderThumb}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
