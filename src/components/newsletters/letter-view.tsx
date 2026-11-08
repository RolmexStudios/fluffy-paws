"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { ShowroomChrome } from "@/components/inventory/page-chrome";
import {
  NEWSLETTER_INSTANCE_ID,
  newsletterHref,
} from "@/components/newsletters/data";
import type { BrochureNewsletterPost } from "@/types/brochure";
import styles from "./letter-view.module.scss";

type LetterViewProps = {
  post: BrochureNewsletterPost;
  postIndex: number;
  instanceId?: string;
  businessName: string;
  logoUrl?: string;
};

export function LetterView({
  post,
  postIndex,
  instanceId = NEWSLETTER_INSTANCE_ID,
  businessName,
  logoUrl,
}: LetterViewProps) {
  const prefix = `posts[${postIndex}]`;

  return (
    <ShowroomChrome businessName={businessName} logoUrl={logoUrl}>
      <article className={styles.article}>
        <div className={styles.cover}>
          <MediaSlot
            url={post.heroImageUrl}
            slotId={`${instanceId}_${post.slug || postIndex}_hero`}
            jsonPath={fieldPath(instanceId, `${prefix}.heroImageUrl`)}
            alt={post.heroImageAlt.trim() || post.title}
            className={styles.hero}
          />
        </div>

        <div className={styles.column}>
          <Link href={newsletterHref()} className={styles.back}>
            <ArrowLeft className={styles.backIcon} aria-hidden />
            The letters
          </Link>

          <header className={styles.masthead}>
            <TextSlot
              value={post.date}
              jsonPath={fieldPath(instanceId, `${prefix}.date`)}
              as="p"
              className={styles.date}
            />
            <TextSlot
              value={post.title}
              jsonPath={fieldPath(instanceId, `${prefix}.title`)}
              as="h1"
              className={styles.title}
            />
          </header>

          <div className={styles.body}>
            {post.blocks.map((block, index) => {
              const path = `${prefix}.blocks[${index}]`;
              if (block.type === "heading") {
                return (
                  <TextSlot
                    key={`${path}.text`}
                    value={block.text}
                    jsonPath={fieldPath(instanceId, `${path}.text`)}
                    as="h2"
                    className={styles.heading}
                  />
                );
              }
              if (block.type === "paragraph") {
                return (
                  <TextSlot
                    key={`${path}.text`}
                    value={block.text}
                    jsonPath={fieldPath(instanceId, `${path}.text`)}
                    as="p"
                    className={styles.paragraph}
                  />
                );
              }
              const align = block.align || "left";
              const plateClass =
                align === "right"
                  ? styles.plateRight
                  : align === "full"
                    ? styles.plateFull
                    : styles.plateLeft;
              return (
                <figure
                  key={`${path}.imageUrl`}
                  className={`${styles.plate} ${plateClass}`}
                >
                  <MediaSlot
                    url={block.imageUrl}
                    slotId={`${instanceId}_${post.slug || postIndex}_block_${index}`}
                    jsonPath={fieldPath(instanceId, `${path}.imageUrl`)}
                    alt={block.alt.trim() || post.title}
                    className={styles.plateImage}
                  />
                  {block.caption.trim() ? (
                    <TextSlot
                      value={block.caption}
                      jsonPath={fieldPath(instanceId, `${path}.caption`)}
                      as="p"
                      className={styles.caption}
                    />
                  ) : null}
                </figure>
              );
            })}
          </div>
        </div>
      </article>
    </ShowroomChrome>
  );
}
