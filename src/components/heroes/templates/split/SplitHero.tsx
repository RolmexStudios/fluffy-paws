import { ArrowDown } from "lucide-react";
import { fieldPath } from "@/components/shared/field-path";
import { Slideshow } from "@/components/shared/slideshow";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { emptyHeroBlueprint } from "@/components/heroes/blueprint";
import { emptySplitHeroBlueprint } from "@/components/heroes/templates/split/blueprint";
import type {
  BrochureBlockProps,
  BrochureHeroContent,
  BrochureHeroSplitContent,
} from "@/types/brochure";
import styles from "./split.module.scss";

export function SplitHero({
  instanceId = "BrochureHero_1",
  data = emptyHeroBlueprint(),
}: BrochureBlockProps<BrochureHeroContent>) {
  const hero: BrochureHeroSplitContent =
    data.variant === "split" ? data : emptySplitHeroBlueprint();
  const ctaLabel = hero.ctaLabel.trim() || "View Our Work";

  return (
    <section id={instanceId} className={styles.root}>
      <div className={styles.copy}>
        <SectionHeading
          instanceId={instanceId}
          eyebrow={hero.eyebrow}
          title={hero.headline}
          titlePath="headline"
          titleAs="h1"
          eyebrowClassName={styles.eyebrow}
          titleClassName={styles.headline}
        />
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

      <div className={styles.mediaColumn}>
        <div className={styles.mediaPanel}>
          <Slideshow
            slides={hero.slideshowImages.map((slide, index) => ({
              imageUrl: slide.imageUrl,
              alt: slide.alt,
              slotId: `${instanceId}-slide-${index}`,
              jsonPath: fieldPath(
                instanceId,
                `slideshowImages.${index}.imageUrl`,
              ),
            }))}
            intervalMs={hero.slideshowIntervalMs}
            mediaClassName={styles.media}
            dotsLabel="Hero slides"
          />
        </div>
      </div>
    </section>
  );
}
