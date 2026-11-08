"use client";

import { useRef } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { useSmoothHorizontalWheelScroll } from "@/components/shared/smooth-horizontal-wheel";
import { emptyShopBlueprint } from "@/components/shops/blueprint";
import { CategoryIndex } from "@/components/shops/category-index";
import { ProductCard } from "@/components/shops/product-card";
import {
  isListedItem,
  shopCategoryGroups,
  shopHref,
  shopItemHref,
} from "@/components/shops/data";
import type { BrochureBlockProps, BrochureShopContent } from "@/types/brochure";
import styles from "./rail.module.scss";

export function RailShop({
  instanceId = "BrochureShop_1",
  data = emptyShopBlueprint(),
}: BrochureBlockProps<BrochureShopContent>) {
  const trackRef = useRef<HTMLUListElement>(null);
  useSmoothHorizontalWheelScroll(trackRef, true, { mapVertical: false });
  const limit = Math.max(1, data.teaserLimit);
  const preview = data.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => isListedItem(item))
    .slice(0, limit);
  const viewAll = data.viewAllLabel.trim();
  const categories = shopCategoryGroups(data.items);

  return (
    <>
      <section
        id={instanceId}
        className={
          categories.length > 0
            ? `${styles.section} ${styles.sectionLeads}`
            : styles.section
        }
        data-bg="#ffffff"
        data-theme="light"
        data-nav="on-light"
        aria-labelledby={`${instanceId}-title`}
      >
        <ScrollReveal compact>
          <header className={styles.header}>
            <SectionHeading
              instanceId={instanceId}
              title={data.title}
              titleAs="h2"
              titleId={`${instanceId}-title`}
              className={styles.heading}
              eyebrowClassName={styles.eyebrow}
              titleClassName={styles.title}
            />
            {viewAll ? (
              <Link href={shopHref()} className={styles.viewAll}>
                {viewAll}
              </Link>
            ) : null}
          </header>
        </ScrollReveal>

        <ScrollReveal compact delayMs={80}>
          <ul ref={trackRef} className={styles.track}>
            {preview.map(({ item, index }) => (
              <li key={`${item.id || "item"}-${index}`} className={styles.item}>
                <ProductCard
                  item={item}
                  instanceId={instanceId}
                  index={index}
                  href={shopItemHref(item)}
                />
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>
      <CategoryIndex
        instanceId={instanceId}
        title={data.categoriesTitle}
        groups={categories}
      />
    </>
  );
}
