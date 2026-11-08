"use client";

import Link from "next/link";
import { Photo } from "@/components/shared/media";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { hasSlotText } from "@/components/shared/text-slot";
import {
  shopCategoryHref,
  type ShopCategoryGroup,
} from "@/components/shops/data";
import styles from "./category-index.module.scss";

type CategoryIndexProps = {
  instanceId: string;
  title: string;
  groups: ShopCategoryGroup[];
};

export function CategoryIndex({
  instanceId,
  title,
  groups,
}: CategoryIndexProps) {
  if (groups.length === 0) return null;

  const heading = title.trim();

  return (
    <section
      id={`${instanceId}-categories`}
      className={styles.section}
      data-bg="#ffffff"
      data-theme="light"
      data-nav="on-light"
      aria-label={heading || "Shop by type"}
      aria-labelledby={heading ? `${instanceId}-categories-title` : undefined}
    >
      {hasSlotText(heading) ? (
        <ScrollReveal compact>
          <SectionHeading
            instanceId={instanceId}
            title={heading}
            titlePath="categoriesTitle"
            titleAs="h2"
            titleId={`${instanceId}-categories-title`}
            className={styles.heading}
            eyebrowClassName={styles.eyebrow}
            titleClassName={styles.title}
          />
        </ScrollReveal>
      ) : null}

      <ScrollReveal compact delayMs={heading ? 80 : 0}>
        <ul className={styles.grid}>
          {groups.map((group) => {
            const countLabel =
              group.count === 1 ? "1 piece" : `${group.count} pieces`;
            return (
              <li key={group.slug} className={styles.cell}>
                <Link
                  href={shopCategoryHref(group.name)}
                  className={styles.tile}
                  aria-label={`${group.name}, ${countLabel}`}
                >
                  <span className={styles.plate}>
                    {group.imageUrl ? (
                      <Photo
                        src={group.imageUrl}
                        alt=""
                        className={styles.image}
                      />
                    ) : (
                      <span className={styles.placeholder} aria-hidden />
                    )}
                    <span className={styles.overlay} aria-hidden />
                  </span>
                  <span className={styles.copy}>
                    <span className={styles.name}>{group.name}</span>
                    <span className={styles.kicker}>{countLabel}</span>
                    <span className={styles.cta}>View</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </ScrollReveal>
    </section>
  );
}
