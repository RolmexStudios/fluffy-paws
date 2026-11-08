"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { emptyShopBlueprint } from "@/components/shops/blueprint";
import { ProductCard } from "@/components/shops/product-card";
import {
  isListedItem,
  shopCategoryGroups,
  shopCategoryHref,
  shopCategorySlug,
  shopHref,
  shopItemHref,
} from "@/components/shops/data";
import type { BrochureBlockProps, BrochureShopContent } from "@/types/brochure";
import styles from "./gallery.module.scss";

export function GalleryShop({
  instanceId = "BrochureShop_1",
  data = emptyShopBlueprint(),
}: BrochureBlockProps<BrochureShopContent>) {
  const params = useSearchParams();
  const categorySlug = shopCategorySlug(params.get("category") ?? "");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, [categorySlug]);
  const listed = data.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => isListedItem(item));
  const activeName = ready
    ? (listed.find(({ item }) => shopCategorySlug(item.category) === categorySlug)?.item
        .category.trim() ?? "")
    : "";
  const visible = activeName
    ? listed.filter(({ item }) => shopCategorySlug(item.category) === categorySlug)
    : listed;
  const galleryTitle = data.galleryTitle.trim();
  const heading = activeName || galleryTitle || data.title;
  const headingPath = galleryTitle ? "galleryTitle" : "title";
  const categories = shopCategoryGroups(data.items);

  return (
    <section
      id={instanceId}
      className={styles.section}
      data-bg="#ffffff"
      data-theme="light"
      data-nav="on-light"
      aria-labelledby={`${instanceId}-title`}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <SectionHeading
            instanceId={instanceId}
            title={heading}
            titlePath={headingPath}
            titleAs="h1"
            titleId={`${instanceId}-title`}
            className={styles.heading}
            eyebrowClassName={styles.eyebrow}
            titleClassName={styles.title}
          >
            {activeName ? (
              <h1 id={`${instanceId}-title`} className={styles.title}>
                {activeName}
              </h1>
            ) : undefined}
          </SectionHeading>
        </header>

        {categories.length > 0 ? (
          <nav className={styles.filters} aria-label="Shop by type">
            <Link
              href={shopHref()}
              className={styles.filter}
              aria-current={ready && !activeName ? "page" : undefined}
            >
              All
            </Link>
            {categories.map((group) => (
              <Link
                key={group.slug}
                href={shopCategoryHref(group.name)}
                className={styles.filter}
                aria-current={
                  ready && shopCategorySlug(group.name) === categorySlug
                    ? "page"
                    : undefined
                }
              >
                {group.name}
              </Link>
            ))}
          </nav>
        ) : null}

        {visible.length > 0 ? (
          <ul className={styles.grid}>
            {visible.map(({ item, index }) => (
              <li key={`${item.id || "item"}-${index}`}>
                <ProductCard
                  item={item}
                  instanceId={instanceId}
                  index={index}
                  href={shopItemHref(item)}
                />
              </li>
            ))}
          </ul>
        ) : data.items.length > 0 ? (
          <p className={styles.empty}>Nothing available right now.</p>
        ) : null}
      </div>
    </section>
  );
}
