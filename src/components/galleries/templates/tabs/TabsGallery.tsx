"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import {
  TabImageSelector,
  type TabImageItem,
} from "@/components/shared/tab-image-selector";
import { ImageShowcase } from "@/components/shared/image-showcase";
import { emptyGalleryBlueprint } from "@/components/galleries/blueprint";
import type {
  BrochureBlockProps,
  BrochureGalleryContent,
  BrochureGalleryItem,
} from "@/types/brochure";
import styles from "./tabs.module.scss";

const OVERVIEW = "";
const MOBILE_STICKY_TOP_INSET_PX = 72;

type IndexedItem = { item: BrochureGalleryItem; index: number };

function visiblePxInViewport(rect: DOMRect, viewBottom: number): number {
  return (
    Math.min(rect.bottom, viewBottom) -
    Math.max(rect.top, MOBILE_STICKY_TOP_INSET_PX)
  );
}

function tabsMostlyVisible(target: HTMLElement): boolean {
  const rect = target.getBoundingClientRect();
  const viewBottom = window.innerHeight;
  if (rect.bottom <= MOBILE_STICKY_TOP_INSET_PX || rect.top >= viewBottom) {
    return false;
  }

  const visiblePx = visiblePxInViewport(rect, viewBottom);
  const minVisible = Math.min(rect.height * 0.55, 56);
  return visiblePx >= minVisible;
}

function showcaseMostlyVisible(target: HTMLElement): boolean {
  const rect = target.getBoundingClientRect();
  const viewBottom = window.innerHeight;
  if (rect.bottom <= MOBILE_STICKY_TOP_INSET_PX || rect.top >= viewBottom) {
    return false;
  }

  const visiblePx = visiblePxInViewport(rect, viewBottom);
  const minVisible = Math.min(rect.height * 0.4, 140);
  return visiblePx >= minVisible;
}

function hasRoomForShowcaseBelowTabs(tabs: HTMLElement): boolean {
  const viewBottom = window.innerHeight;
  const roomBelow = viewBottom - tabs.getBoundingClientRect().bottom;
  return roomBelow >= Math.min(200, viewBottom * 0.32);
}

function mobileBrowseLooksGood(
  tabs: HTMLElement,
  showcase: HTMLElement | null,
): boolean {
  if (!tabsMostlyVisible(tabs)) {
    return false;
  }
  if (!showcase) {
    return true;
  }

  const showcaseHeight = showcase.getBoundingClientRect().height;
  if (showcaseHeight < 48) {
    return hasRoomForShowcaseBelowTabs(tabs);
  }

  return showcaseMostlyVisible(showcase);
}

function scrollMobileBrowseIntoView(
  tabs: HTMLElement,
  behavior: ScrollBehavior,
) {
  const pad = 10;
  const tabsTop = tabs.getBoundingClientRect().top + window.scrollY;
  const targetY = tabsTop - MOBILE_STICKY_TOP_INSET_PX - pad;
  window.scrollTo({ top: Math.max(0, targetY), behavior });
}

function uniqueCategories(items: BrochureGalleryItem[]) {
  return Array.from(
    new Set(items.map((item) => item.category.trim()).filter(Boolean)),
  );
}

function firstItemPerCategory(items: IndexedItem[], categories: string[]) {
  return categories.flatMap((category) => {
    const match = items.find(({ item }) => item.category.trim() === category);
    return match ? [match] : [];
  });
}

export function TabsGallery({
  instanceId = "BrochureGallery_1",
  data = emptyGalleryBlueprint(),
}: BrochureBlockProps<BrochureGalleryContent>) {
  const items = data.items;
  const categories = useMemo(() => uniqueCategories(items), [items]);
  const indexed = useMemo<IndexedItem[]>(
    () => items.map((item, index) => ({ item, index })),
    [items],
  );

  const [active, setActive] = useState(OVERVIEW);
  const [paneCategory, setPaneCategory] = useState(OVERVIEW);
  const [expandOpen, setExpandOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const showcaseStageRef = useRef<HTMLDivElement>(null);

  const isOverview = active === OVERVIEW;
  const shownCategory = paneCategory || active;
  const filtered = indexed.filter(
    ({ item }) => item.category.trim() === shownCategory,
  );

  const selectorItems = useMemo<TabImageItem[]>(
    () =>
      firstItemPerCategory(indexed, categories).map(({ item, index }) => {
        const category = item.category.trim();
        const count = indexed.filter(
          (row) => row.item.category.trim() === category,
        ).length;
        const service = data.categories.find(
          (row) => row.title.trim() === category,
        );
        return {
          id: `${instanceId}-${index}-${category || index}`,
          title: category || `Project ${index + 1}`,
          subtitle: count === 1 ? "1 project" : `${count} projects`,
          description: service?.description ?? "",
          imageUrl: item.imageUrl,
        };
      }),
    [categories, data.categories, indexed, instanceId],
  );

  const selectedId =
    selectorItems.find((item) => item.title === active)?.id ?? "";

  useEffect(() => {
    if (active !== OVERVIEW && !categories.includes(active)) {
      setActive(OVERVIEW);
    }
  }, [categories, active]);

  useEffect(() => {
    if (active === OVERVIEW) {
      setExpandOpen(false);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        setPaneCategory(OVERVIEW);
      }
      return;
    }

    setPaneCategory(active);
    let frame2 = 0;
    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        setExpandOpen(true);
      });
    });
    return () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
    };
  }, [active]);

  function onExpandTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (active !== OVERVIEW) return;
    if (
      event.propertyName !== "grid-template-rows" &&
      event.propertyName !== "margin-top"
    ) {
      return;
    }
    setPaneCategory(OVERVIEW);
  }

  useEffect(() => {
    if (isOverview) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior = reduceMotion ? "auto" : "smooth";
    let cancelled = false;
    let frame = 0;

    const scrollBrowseIntoView = () => {
      if (cancelled) return;
      const tabs = tabsRef.current;
      if (!tabs) return;

      const showcase = showcaseStageRef.current;
      if (mobileBrowseLooksGood(tabs, showcase)) {
        return;
      }

      scrollMobileBrowseIntoView(tabs, behavior);
    };

    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(scrollBrowseIntoView);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [active, isOverview]);

  function selectCategory(category: string) {
    if (!category) return;
    setActive((current) => (current === category ? OVERVIEW : category));
  }

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
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
        </header>

        <div ref={tabsRef} className={styles.tabsAnchor}>
          <TabImageSelector
            items={selectorItems}
            selectedId={selectedId}
            label="Project types"
            className={styles.selector}
            dimInactiveTabs={data.dimInactiveTabs}
            layout={data.tabLayout}
            onSelect={(item) => selectCategory(item.title)}
          />
        </div>

        <div
          className={styles.expand}
          data-open={expandOpen ? "true" : undefined}
          onTransitionEnd={onExpandTransitionEnd}
        >
          <div className={styles.expandInner}>
            {shownCategory ? (
              <div key={shownCategory} className={styles.categoryPane}>
                <span className={styles.swoosh} aria-hidden />
                <ImageShowcase
                  key={shownCategory}
                  label={`${shownCategory} photos`}
                  stageRef={showcaseStageRef}
                  slides={filtered.map(({ item, index }) => {
                    const category = item.category.trim();
                    return {
                      id: `${instanceId}_${index + 1}`,
                      imageUrl: item.imageUrl,
                      alt:
                        item.alt.trim() ||
                        (category ? `${category} project` : "Project photo"),
                      slotId: `${instanceId}_${index + 1}`,
                      jsonPath: fieldPath(
                        instanceId,
                        `items[${index}].imageUrl`,
                      ),
                    };
                  })}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
