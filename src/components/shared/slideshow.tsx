"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { MediaSlot, Photo } from "@/components/shared/media";
import styles from "./slideshow.module.scss";

export type SlideshowSlide = {
  imageUrl: string;
  alt?: string;
  /** When set with `slotId`, renders `MediaSlot` for blueprint editing. */
  jsonPath?: string;
  slotId?: string;
  /** CSS object-position for this slide's crop, e.g. "50% 70%". */
  position?: string;
};

export type SlideshowProps = {
  slides: SlideshowSlide[];
  intervalMs?: number;
  className?: string;
  mediaClassName?: string;
  dotsLabel?: string;
  /** Hide the dot pager when the parent supplies its own controls. */
  showDots?: boolean;
  /**
   * Controlled mode: pass the active slide's position in the visible sequence
   * and a setter. Autoplay then asks the parent to advance, and restarts its
   * timer whenever the index changes (so manual paging resets the clock).
   */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  /** When false, slides only change via pager, dots, or swipe. Default true. */
  autoplay?: boolean;
};

function visibleSlideIndices(slides: SlideshowSlide[]) {
  const withUrl = slides
    .map((slide, index) => (slide.imageUrl.trim().length > 0 ? index : -1))
    .filter((index) => index >= 0);
  if (withUrl.length > 0) return withUrl;
  return slides.map((_, index) => index);
}

export function Slideshow({
  slides,
  intervalMs = 5000,
  className,
  mediaClassName,
  dotsLabel = "Slides",
  showDots = true,
  activeIndex,
  onActiveIndexChange,
  autoplay = true,
}: SlideshowProps) {
  const visibleIndices = useMemo(() => visibleSlideIndices(slides), [slides]);
  const [internalIndex, setActiveSequenceIndex] = useState(0);
  const controlled = activeIndex !== undefined && onActiveIndexChange !== undefined;
  const activeSequenceIndex = controlled ? (activeIndex ?? 0) : internalIndex;
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const sequenceLength = visibleIndices.length;
  const activeSlideIndex =
    sequenceLength > 0
      ? visibleIndices[activeSequenceIndex % sequenceLength]
      : 0;

  const swipeX = useRef<number | null>(null);
  const swipeY = useRef<number | null>(null);

  const pauseAutoplay = useCallback(() => setAutoplayPaused(true), []);
  const resumeAutoplay = useCallback(() => setAutoplayPaused(false), []);

  const goToSequenceIndex = useCallback(
    (index: number) => {
      if (sequenceLength <= 0) return;
      const next = ((index % sequenceLength) + sequenceLength) % sequenceLength;
      if (controlled) {
        onActiveIndexChange?.(next);
      } else {
        setActiveSequenceIndex(next);
      }
      pauseAutoplay();
    },
    [controlled, onActiveIndexChange, sequenceLength, pauseAutoplay],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pauseAutoplay();
      if (sequenceLength <= 1) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      swipeX.current = event.clientX;
      swipeY.current = event.clientY;
    },
    [pauseAutoplay, sequenceLength],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (swipeX.current == null || swipeY.current == null) return;
      const dx = event.clientX - swipeX.current;
      const dy = event.clientY - swipeY.current;
      swipeX.current = null;
      swipeY.current = null;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      goToSequenceIndex(activeSequenceIndex + (dx < 0 ? 1 : -1));
    },
    [activeSequenceIndex, goToSequenceIndex],
  );

  const onPointerCancel = useCallback(() => {
    swipeX.current = null;
    swipeY.current = null;
  }, []);

  useEffect(() => {
    if (!autoplay || !controlled) return;
    if (sequenceLength <= 1 || autoplayPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setTimeout(() => {
      onActiveIndexChange?.((activeSequenceIndex + 1) % sequenceLength);
    }, intervalMs);

    return () => window.clearTimeout(id);
  }, [
    controlled,
    activeSequenceIndex,
    onActiveIndexChange,
    intervalMs,
    sequenceLength,
    autoplayPaused,
    autoplay,
  ]);

  useEffect(() => {
    if (!autoplay || controlled) return;
    if (sequenceLength <= 1 || autoplayPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActiveSequenceIndex((current) => (current + 1) % sequenceLength);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [autoplay, controlled, intervalMs, sequenceLength, autoplayPaused]);

  useEffect(() => {
    if (controlled) return;
    if (activeSequenceIndex >= sequenceLength && sequenceLength > 0) {
      setActiveSequenceIndex(0);
    }
  }, [controlled, activeSequenceIndex, sequenceLength]);

  const mediaClass = [styles.media, mediaClassName].filter(Boolean).join(" ");

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      onPointerEnter={pauseAutoplay}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={resumeAutoplay}
    >
      <div className={styles.stack} aria-live="polite">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={styles.slide}
            data-active={index === activeSlideIndex || undefined}
            aria-hidden={index !== activeSlideIndex}
            style={
              slide.position
                ? ({ "--slide-position": slide.position } as CSSProperties)
                : undefined
            }
          >
            {slide.jsonPath && slide.slotId ? (
              <MediaSlot
                url={slide.imageUrl}
                slotId={slide.slotId}
                jsonPath={slide.jsonPath}
                alt={slide.alt ?? ""}
                className={mediaClass}
                playing={index === activeSlideIndex}
              />
            ) : (
              <Photo
                src={slide.imageUrl}
                alt={slide.alt ?? ""}
                className={mediaClass}
              />
            )}
          </div>
        ))}
      </div>

      {showDots && sequenceLength > 1 && (
        <div className={styles.dots} role="tablist" aria-label={dotsLabel}>
          {visibleIndices.map((slideIndex, index) => (
            <button
              key={slideIndex}
              type="button"
              role="tab"
              aria-selected={index === activeSequenceIndex}
              aria-label={`Show slide ${index + 1}`}
              className={styles.dot}
              data-active={index === activeSequenceIndex || undefined}
              onClick={() => goToSequenceIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
