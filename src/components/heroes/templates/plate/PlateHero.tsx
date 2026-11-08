"use client";

import Link from "next/link";
import { AmbientVideo } from "@/components/shared/ambient-video";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot, hasSlotText } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { videoSources } from "@/components/shared/video-sources";
import { emptyHeroBlueprint } from "@/components/heroes/blueprint";
import type {
  BrochureBlockProps,
  BrochureHeroContent,
  BrochureHeroPlateContent,
} from "@/types/brochure";
import styles from "./plate.module.scss";

export function PlateHero({
  instanceId = "BrochureHero_1",
  data = emptyHeroBlueprint(),
}: BrochureBlockProps<BrochureHeroContent>) {
  const plate: BrochureHeroPlateContent =
    data.variant === "plate"
      ? data
      : {
          variant: "plate",
          videoSrc: "",
          imageSrc: "",
          imageAlt: "",
          logoImageUrl: "",
          headline: "",
          subheadline: "",
          ctaLabel: "",
          ctaHref: "",
          bg: "#141413",
          theme: "dark",
          scrim: true,
          sectionSize: "full",
        };
  const sources = plate.videoSrc.trim() ? videoSources(plate.videoSrc) : [];
  const logo = plate.logoImageUrl.trim();
  const ctaHref = plate.ctaHref.trim();
  const showCopy =
    hasSlotText(plate.headline) ||
    hasSlotText(plate.subheadline) ||
    (hasSlotText(plate.ctaLabel) && ctaHref.length > 0);
  const ctaClass = styles.cta;

  return (
    <section
      id={instanceId}
      className={styles.plate}
      data-bg={plate.bg || "#141413"}
      data-theme={plate.theme}
      data-nav={showCopy ? "on-dark" : undefined}
      data-copy={showCopy ? "true" : undefined}
    >
      <div className={styles.mediaWrap}>
        {sources.length > 0 ? (
          <AmbientVideo sources={sources} className={styles.media} />
        ) : (
          <MediaSlot
            url={plate.imageSrc}
            slotId={instanceId}
            jsonPath={fieldPath(instanceId, "imageSrc")}
            alt={plate.imageAlt}
            className={styles.media}
          />
        )}
      </div>
      {plate.scrim || showCopy ? (
        <div
          className={showCopy ? `${styles.scrim} ${styles.scrimCopy}` : styles.scrim}
          aria-hidden="true"
        />
      ) : null}
      {showCopy ? (
        <div className={styles.copy}>
          <TextSlot
            value={plate.headline}
            jsonPath={fieldPath(instanceId, "headline")}
            as="h1"
            className={styles.headline}
            hideWhenEmpty
          />
          <TextSlot
            value={plate.subheadline}
            jsonPath={fieldPath(instanceId, "subheadline")}
            as="p"
            className={styles.subheadline}
            hideWhenEmpty
          />
          {hasSlotText(plate.ctaLabel) && ctaHref ? (
            ctaHref.startsWith("/") ? (
              <Link href={ctaHref} className={ctaClass}>
                {plate.ctaLabel.trim()}
              </Link>
            ) : (
              <a href={ctaHref} className={ctaClass}>
                {plate.ctaLabel.trim()}
              </a>
            )
          ) : null}
        </div>
      ) : null}
      {logo ? (
        <div className={styles.logo} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" />
        </div>
      ) : null}
    </section>
  );
}
