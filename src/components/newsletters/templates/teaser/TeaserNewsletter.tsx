"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyNewsletterBlueprint } from "@/components/newsletters/blueprint";
import {
  letterHref,
  letterSlug,
  newsletterHref,
} from "@/components/newsletters/data";
import type {
  BrochureBlockProps,
  BrochureNewsletterContent,
} from "@/types/brochure";
import styles from "./teaser.module.scss";

export function TeaserNewsletter({
  instanceId = "BrochureNewsletter_1",
  data = emptyNewsletterBlueprint(),
}: BrochureBlockProps<BrochureNewsletterContent>) {
  const limit = Math.max(1, data.teaserLimit);
  const preview = data.posts
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => Boolean(letterSlug(post)))
    .slice(0, limit);
  const viewAll = data.viewAllLabel.trim() || "Read the letters";

  return (
    <section id={instanceId} className={styles.section} aria-label="Letters">
      <div className={styles.inner}>
        <header className={styles.header}>
          <SectionHeading
            instanceId={instanceId}
            eyebrow={data.eyebrow}
            title={data.title}
            className={styles.heading}
            eyebrowClassName={styles.eyebrow}
            titleClassName={styles.title}
          />
          <div className={styles.asideCol}>
            {data.intro.trim() ? (
              <TextSlot
                value={data.intro}
                jsonPath={fieldPath(instanceId, "intro")}
                as="p"
                className={styles.intro}
              />
            ) : null}
            <Link href={newsletterHref()} className={styles.viewAll}>
              {viewAll}
              <ArrowRight className={styles.viewAllIcon} aria-hidden />
            </Link>
          </div>
        </header>

        <ol className={styles.list}>
          {preview.map(({ post, index }) => (
            <li key={letterSlug(post) || `${instanceId}-${index}`}>
              <Link href={letterHref(post)} className={styles.item}>
                <TextSlot
                  value={post.date}
                  jsonPath={fieldPath(instanceId, `posts[${index}].date`)}
                  as="p"
                  className={styles.date}
                />
                <div className={styles.itemBody}>
                  <TextSlot
                    value={post.title}
                    jsonPath={fieldPath(instanceId, `posts[${index}].title`)}
                    as="h3"
                    className={styles.itemTitle}
                  />
                  <TextSlot
                    value={post.excerpt}
                    jsonPath={fieldPath(instanceId, `posts[${index}].excerpt`)}
                    as="p"
                    className={styles.excerpt}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <Link href={newsletterHref()} className={styles.viewAllMobile}>
          {viewAll}
          <ArrowRight className={styles.viewAllIcon} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
