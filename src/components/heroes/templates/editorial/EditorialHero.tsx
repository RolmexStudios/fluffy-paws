import { ArrowDown } from "lucide-react";
import type { ReactNode } from "react";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot, hasSlotText } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyHeroBlueprint } from "@/components/heroes/blueprint";
import type {
  BrochureBlockProps,
  BrochureHeroContent,
  BrochureHeroEditorialContent,
} from "@/types/brochure";
import styles from "./editorial.module.scss";

function renderHeadline(headline: string, emphasis: string): ReactNode {
  const word = emphasis.trim();
  if (!word) {
    return headline;
  }
  const index = headline.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) {
    return (
      <>
        {headline} <em className={styles.emphasis}>{word}</em>
      </>
    );
  }
  return (
    <>
      {headline.slice(0, index)}
      <em className={styles.emphasis}>{headline.slice(index, index + word.length)}</em>
      {headline.slice(index + word.length)}
    </>
  );
}

export function EditorialHero({
  instanceId = "BrochureHero_1",
  data = emptyHeroBlueprint(),
}: BrochureBlockProps<BrochureHeroContent>) {
  const hero: BrochureHeroEditorialContent =
    data.variant === "editorial"
      ? data
      : {
          variant: "editorial",
          eyebrow: "",
          headline: "",
          subheadline: "",
          ctaLabel: "Enter the showroom",
          sectionSize: "full",
          backgroundImageUrl: "",
          imageAlt: "",
          catalogNote: "",
          emphasisWord: "",
        };

  const ctaLabel = hero.ctaLabel.trim() || "Enter the showroom";
  const headline = hero.headline.trim();

  return (
    <section id={instanceId} className={styles.root}>
      <MediaSlot
        url={hero.backgroundImageUrl}
        slotId={instanceId}
        jsonPath={fieldPath(instanceId, "backgroundImageUrl")}
        alt={hero.imageAlt}
        className={styles.media}
      />
      <div className={styles.scrim} aria-hidden />

      <div className={styles.inner}>
        <div className={styles.topRow}>
          {hasSlotText(hero.eyebrow) ? (
            <TextSlot
              value={hero.eyebrow}
              jsonPath={fieldPath(instanceId, "eyebrow")}
              as="p"
              className={styles.eyebrow}
            />
          ) : null}
          {hero.catalogNote.trim() ? (
            <p className={styles.catalog}>{hero.catalogNote}</p>
          ) : null}
        </div>

        {headline ? (
          <h1 className={styles.headline}>
            {renderHeadline(hero.headline, hero.emphasisWord)}
          </h1>
        ) : (
          <TextSlot
            value={hero.headline}
            jsonPath={fieldPath(instanceId, "headline")}
            as="h1"
            className={styles.headline}
          />
        )}

        <div className={styles.footerRow}>
          <TextSlot
            value={hero.subheadline}
            jsonPath={fieldPath(instanceId, "subheadline")}
            as="p"
            className={styles.subheadline}
          />
          <a href="#BrochureInventory_1" className={styles.cta}>
            {ctaLabel}
            <ArrowDown className={styles.ctaIcon} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
