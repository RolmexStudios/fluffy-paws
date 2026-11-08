"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MediaSlot } from "@/components/shared/media";
import { useSmoothHorizontalWheelScroll } from "@/components/shared/smooth-horizontal-wheel";
import styles from "./image-lightbox.module.scss";

export type LightboxImage = {
  url: string;
  alt: string;
  slotId: string;
  jsonPath: string;
};

export type ImageLightboxProps = {
  images: LightboxImage[];
  index: number;
  title?: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** `paper` is the studio overlay: image contained, translucent page color. */
  tone?: "dark" | "paper";
};

const SLIDE_MS = 550;
const SLIDE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function wrapIndex(index: number, count: number) {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Frame({ image }: { image: LightboxImage }) {
  return (
    <figure className={styles.slide}>
      <MediaSlot
        url={image.url}
        slotId={image.slotId}
        jsonPath={image.jsonPath}
        alt={image.alt}
        className={styles.image}
      />
    </figure>
  );
}

export function ImageLightbox({
  images,
  index,
  title,
  onClose,
  onIndexChange,
  tone = "dark",
}: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const sliding = useRef(false);
  const count = images.length;
  const safeIndex = wrapIndex(index, count);
  const current = images[safeIndex];

  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [activeThumb, setActiveThumb] = useState(safeIndex);
  const [windowSlides, setWindowSlides] = useState(() => ({
    prev: wrapIndex(safeIndex - 1, count),
    curr: safeIndex,
    next: wrapIndex(safeIndex + 1, count),
  }));

  useSmoothHorizontalWheelScroll(stripRef, count > 4, {
    sensitivity: 0.42,
    friction: 0.86,
  });

  const settleAt = useCallback(
    (at: number) => {
      sliding.current = false;
      setAnimate(false);
      setOffset(0);
      setActiveThumb(at);
      setWindowSlides({
        prev: wrapIndex(at - 1, count),
        curr: at,
        next: wrapIndex(at + 1, count),
      });
      onIndexChange(at);
    },
    [count, onIndexChange],
  );

  const navigate = useCallback(
    (to: number, forcedDir?: 1 | -1) => {
      if (count < 2 || sliding.current) return;
      const target = wrapIndex(to, count);
      if (target === safeIndex) return;

      if (prefersReducedMotion()) {
        settleAt(target);
        return;
      }

      const forward = wrapIndex(target - safeIndex, count);
      const dir = forcedDir ?? (forward <= count - forward ? 1 : -1);

      sliding.current = true;
      setActiveThumb(target);
      setAnimate(false);
      setOffset(0);
      setWindowSlides((currentWindow) =>
        dir === 1
          ? { ...currentWindow, next: target }
          : { ...currentWindow, prev: target },
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
          setOffset(dir);
        });
      });
    },
    [count, safeIndex, settleAt],
  );

  const go = useCallback(
    (delta: number) => {
      if (delta === 0) return;
      navigate(safeIndex + delta, delta > 0 ? 1 : -1);
    },
    [navigate, safeIndex],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.querySelector(
      `[data-thumb="${activeThumb}"]`,
    ) as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2;
    strip.scrollTo({
      left,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeThumb]);

  if (!current || typeof document === "undefined") {
    return null;
  }

  const label = `${activeThumb + 1} of ${count}`;
  const prevImage = images[windowSlides.prev] ?? current;
  const currImage = images[windowSlides.curr] ?? current;
  const nextImage = images[windowSlides.next] ?? current;
  const shifted =
    offset === 1 ? -66.666667 : offset === -1 ? 0 : -33.333333;

  return createPortal(
    <div
      className={[styles.root, tone === "paper" ? styles.paper : ""]
        .filter(Boolean)
        .join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} photographs` : "Photographs"}
      onClick={onClose}
    >
      <header className={styles.bar} onClick={(event) => event.stopPropagation()}>
        {tone === "paper" ? null : <p className={styles.title}>{title}</p>}
        {tone === "paper" && count < 2 ? null : (
          <p className={styles.count} aria-live="polite">
            {label}
          </p>
        )}
        <button
          ref={closeRef}
          type="button"
          className={styles.iconButton}
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X aria-hidden />
        </button>
      </header>

      <div
        className={styles.stage}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") {
            touchStart.current = event.clientX;
          }
        }}
        onPointerUp={(event) => {
          if (touchStart.current == null) return;
          const delta = event.clientX - touchStart.current;
          touchStart.current = null;
          if (Math.abs(delta) < 48) return;
          go(delta < 0 ? 1 : -1);
        }}
      >
        {count > 1 ? (
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={() => go(-1)}
            aria-label="Previous photograph"
          >
            <ChevronLeft aria-hidden />
          </button>
        ) : null}

        {count > 1 ? (
          <div className={styles.viewport}>
            <div
              ref={trackRef}
              className={styles.track}
              style={{
                transform: `translateX(${shifted}%)`,
                transition: animate
                  ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}`
                  : "none",
              }}
              onTransitionEnd={(event) => {
                if (event.target !== trackRef.current) return;
                if (event.propertyName !== "transform") return;
                if (offset === 0) return;
                settleAt(activeThumb);
              }}
            >
              <Frame image={prevImage} />
              <Frame image={currImage} />
              <Frame image={nextImage} />
            </div>
          </div>
        ) : (
          <Frame image={current} />
        )}

        {count > 1 ? (
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={() => go(1)}
            aria-label="Next photograph"
          >
            <ChevronRight aria-hidden />
          </button>
        ) : null}
      </div>

      {count > 1 ? (
        <div className={styles.film} onClick={(event) => event.stopPropagation()}>
          <div
            ref={stripRef}
            className={styles.strip}
            role="listbox"
            aria-label="Photographs"
          >
            {images.map((image, imageIndex) => {
              const selected = imageIndex === activeThumb;
              return (
                <button
                  key={image.slotId}
                  type="button"
                  role="option"
                  data-thumb={imageIndex}
                  aria-selected={selected}
                  aria-label={image.alt}
                  className={styles.thumb}
                  data-active={selected || undefined}
                  onClick={() => navigate(imageIndex)}
                >
                  <MediaSlot
                    url={image.url}
                    slotId={`${image.slotId}_thumb`}
                    jsonPath={image.jsonPath}
                    alt=""
                    className={styles.thumbImage}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
