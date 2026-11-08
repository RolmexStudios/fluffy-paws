import { ArrowDown } from "lucide-react";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot, hasSlotText } from "@/components/shared/text-slot";
import headingStyles from "@/components/shared/section-heading.module.scss";
import { fieldPath } from "@/components/shared/field-path";
import { emptyHeroBlueprint } from "@/components/heroes/blueprint";
import type {
  BrochureBlockProps,
  BrochureHeroContent,
  BrochureHeroCoverContent,
} from "@/types/brochure";
import styles from "./cover.module.scss";

function coverLogoSizeClass(
  layout: BrochureHeroCoverContent["logoLayout"],
  size: BrochureHeroCoverContent["logoSize"],
): string {
  if (layout === "square") {
    if (size === "small") return styles.logoSquareSmall;
    if (size === "large") return styles.logoSquareLarge;
    return styles.logoSquareMedium;
  }
  if (size === "small") return styles.logoHorizontalSmall;
  if (size === "large") return styles.logoHorizontalLarge;
  return styles.logoHorizontalMedium;
}

export function CoverHero({
  instanceId = "BrochureHero_1",
  data = emptyHeroBlueprint(),
}: BrochureBlockProps<BrochureHeroContent>) {
  const hero: BrochureHeroCoverContent =
    data.variant === "cover"
      ? data
      : (emptyHeroBlueprint() as BrochureHeroCoverContent);
  const ctaLabel = hero.ctaLabel.trim() || "View Our Work";
  const logoUrl = hero.logoImageUrl.trim();
  const logoClassName = [
    styles.logo,
    hero.logoLayout === "square" ? styles.logoSquare : styles.logoHorizontal,
    coverLogoSizeClass(hero.logoLayout, hero.logoSize),
  ].join(" ");
  const headlineText = hero.headline.trim();
  const headingClass = hasSlotText(hero.eyebrow)
    ? styles.headline
    : `${styles.headline} ${headingStyles.flush}`;
  const logoHeadingClass = hasSlotText(hero.eyebrow)
    ? styles.logoHeadline
    : `${styles.logoHeadline} ${headingStyles.flush}`;

  return (
    <section
      id={instanceId}
      className={styles.root}
      data-copy-align={hero.copyAlign}
    >
      <MediaSlot
        url={hero.backgroundImageUrl}
        slotId={instanceId}
        jsonPath={fieldPath(instanceId, "backgroundImageUrl")}
        alt=""
        className={styles.media}
      />
      <div
        className={`${styles.overlay} ${
          hero.copyAlign === "center" ? styles.overlayCenter : styles.overlayLeft
        }`}
        aria-hidden
      />
      <div
        className={`${styles.copy} ${
          hero.copyAlign === "center" ? styles.copyCenter : styles.copyLeft
        }`}
      >
        <TextSlot
          value={hero.eyebrow}
          jsonPath={fieldPath(instanceId, "eyebrow")}
          as="p"
          className={styles.eyebrow}
          hideWhenEmpty
        />
        {logoUrl ? (
          <h1 className={logoHeadingClass}>
            <span data-hero-logo="" className={styles.logoFly}>
              <MediaSlot
                url={logoUrl}
                slotId={`${instanceId}-logo`}
                jsonPath={fieldPath(instanceId, "logoImageUrl")}
                alt={headlineText || "Logo"}
                className={logoClassName}
              />
            </span>
          </h1>
        ) : (
          <TextSlot
            value={hero.headline}
            jsonPath={fieldPath(instanceId, "headline")}
            as="h1"
            className={headingClass}
          />
        )}
        <TextSlot
          value={hero.subheadline}
          jsonPath={fieldPath(instanceId, "subheadline")}
          as="p"
          className={styles.subheadline}
        />
        <a href="#BrochureGallery_1" className={styles.cta}>
          {ctaLabel}
          <ArrowDown className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}
