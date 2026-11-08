"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/shared/media";
import { useSmoothHorizontalWheelScroll } from "@/components/shared/smooth-horizontal-wheel";
import styles from "./tab-image-selector.module.scss";

export type TabImageItem = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
};

const DEFAULT_IDLE_EYEBROW = "Our portfolio";
const DEFAULT_IDLE_TITLE = "Check out our projects";
const DEFAULT_IDLE_BODY =
  "Browse by project type to see recent installs—from patio covers and carports to pergolas and commercial shade.";

export type TabImageSelectorProps = {
  items: TabImageItem[];
  selectedId?: string;
  onSelect?: (item: TabImageItem) => void;
  className?: string;
  label?: string;
  idleEyebrow?: string;
  idleTitle?: string;
  idleBody?: string;
  /** Desktop hover: dim/blur non-hovered cards. Hovered card still enlarges when false. */
  dimInactiveTabs?: boolean;
  /** Wrapping grid of cards, or a single horizontally scrolling row. */
  layout?: "grid" | "row";
};

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const NARROW_VIEWPORT = "(max-width: 767px)";

export function TabImageSelector({
  items,
  selectedId,
  onSelect,
  className,
  label = "Categories",
  idleEyebrow = DEFAULT_IDLE_EYEBROW,
  idleTitle = DEFAULT_IDLE_TITLE,
  idleBody = DEFAULT_IDLE_BODY,
  dimInactiveTabs = true,
  layout = "grid",
}: TabImageSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const compact = Boolean(selectedId);
  const horizontal = layout === "row" || compact;
  const preview = items.find((item) => item.id === hoveredId) ?? null;

  useSmoothHorizontalWheelScroll(scrollerRef, horizontal, {
    sensitivity: 0.38,
    friction: 0.84,
  });

  useEffect(() => {
    const hoverMedia = window.matchMedia(FINE_POINTER);
    const narrowMedia = window.matchMedia(NARROW_VIEWPORT);
    const sync = () => {
      setFinePointer(hoverMedia.matches && !narrowMedia.matches);
    };
    sync();
    hoverMedia.addEventListener("change", sync);
    narrowMedia.addEventListener("change", sync);
    return () => {
      hoverMedia.removeEventListener("change", sync);
      narrowMedia.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!compact || !selectedId) return;
    const scroller = scrollerRef.current;
    const active = scroller?.querySelector<HTMLElement>(
      `[data-tab-id="${CSS.escape(selectedId)}"]`,
    );
    if (!scroller || !active) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const extra = 12;
    const left = active.offsetLeft - extra;
    const right = active.offsetLeft + active.offsetWidth + extra;
    const viewLeft = scroller.scrollLeft;
    const viewRight = viewLeft + scroller.clientWidth;
    if (left >= viewLeft && right <= viewRight) return;

    scroller.scrollTo({
      left: Math.max(0, left - scroller.clientWidth * 0.12),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [compact, selectedId]);

  const hoverActive = finePointer && hoveredId !== null;
  const hoverDimOthers = dimInactiveTabs && hoverActive && !compact;

  return (
    <div
      className={[styles.wrap, className].filter(Boolean).join(" ")}
      data-pointer={finePointer ? "fine" : "coarse"}
      data-layout={layout}
      data-compact={compact ? "true" : undefined}
      data-hover-active={hoverActive ? "true" : undefined}
      data-hover-reveal={hoverDimOthers ? "true" : undefined}
      onPointerLeave={() => setHoveredId(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHoveredId(null);
        }
      }}
    >
      <div
        ref={scrollerRef}
        role="list"
        aria-label={label}
        className={styles.root}
        data-smooth-wheel={horizontal ? "" : undefined}
      >
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <div
              key={item.id}
              role="listitem"
              className={styles.item}
              data-tab-id={item.id}
            >
              <button
                type="button"
                className={styles.card}
                data-selected={isSelected ? "true" : undefined}
                aria-pressed={isSelected}
                aria-label={
                  item.subtitle ? `${item.title}, ${item.subtitle}` : item.title
                }
                onPointerEnter={() => setHoveredId(item.id)}
                onFocus={() => setHoveredId(item.id)}
                onClick={() => onSelect?.(item)}
              >
                {item.imageUrl.trim() ? (
                  <Photo src={item.imageUrl} alt="" className={styles.image} />
                ) : (
                  <span className={styles.placeholder} aria-hidden />
                )}
                <span className={styles.overlay} aria-hidden />
                <span className={styles.copy}>
                  {item.subtitle ? (
                    <span className={styles.subtitle}>{item.subtitle}</span>
                  ) : null}
                  <span className={styles.title}>{item.title}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {!compact ? (
        <div className={styles.details} aria-live="polite">
          {preview ? (
            <div key={preview.id} className={styles.detailsInner}>
              {preview.subtitle ? (
                <p className={styles.detailsKicker}>{preview.subtitle}</p>
              ) : null}
              <p className={styles.detailsTitle}>{preview.title}</p>
              <p className={styles.detailsBody}>
                {preview.description?.trim() ||
                  `Browse photos from ${preview.title}.`}
              </p>
            </div>
          ) : (
            <div className={styles.detailsInner}>
              <p className={styles.detailsKicker}>{idleEyebrow}</p>
              <p className={styles.detailsTitle}>{idleTitle}</p>
              <p className={styles.detailsBody}>{idleBody}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
