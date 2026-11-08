import { ArrowDown } from "lucide-react";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyHeroBlueprint } from "@/components/heroes/blueprint";
import type {
  BrochureBlockProps,
  BrochureHeroContent,
  BrochureHeroRunwayContent,
} from "@/types/brochure";
import styles from "./runway.module.scss";

export function RunwayHero({
  instanceId = "BrochureHero_1",
  data = emptyHeroBlueprint(),
}: BrochureBlockProps<BrochureHeroContent>) {
  const hero: BrochureHeroRunwayContent =
    data.variant === "runway"
      ? data
      : {
          variant: "runway",
          eyebrow: "",
          headline: "",
          subheadline: "",
          ctaLabel: "",
          sectionSize: "full",
          backgroundImageUrl: "",
        };
  const ctaLabel = hero.ctaLabel.trim() || "Enter the vault";

  return (
    <section id={instanceId} className={styles.root}>
      <MediaSlot
        url={hero.backgroundImageUrl}
        slotId={instanceId}
        jsonPath={fieldPath(instanceId, "backgroundImageUrl")}
        alt=""
        className={styles.media}
      />
      <div className={styles.shade} aria-hidden />
      <p className={styles.rail}>By appointment only</p>
      <div className={styles.copy}>
        <TextSlot
          value={hero.eyebrow}
          jsonPath={fieldPath(instanceId, "eyebrow")}
          as="p"
          className={styles.eyebrow}
          hideWhenEmpty
        />
        <TextSlot
          value={hero.headline}
          jsonPath={fieldPath(instanceId, "headline")}
          as="h1"
          className={styles.headline}
        />
        <TextSlot
          value={hero.subheadline}
          jsonPath={fieldPath(instanceId, "subheadline")}
          as="p"
          className={styles.subheadline}
          hideWhenEmpty
        />
        <a href="#BrochureGallery_1" className={styles.cta}>
          {ctaLabel}
          <ArrowDown className={styles.ctaIcon} aria-hidden />
        </a>
      </div>
    </section>
  );
}
