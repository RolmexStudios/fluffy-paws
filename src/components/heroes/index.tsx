"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyHeroBlueprint } from "@/components/heroes/blueprint";
import { heroTemplates } from "@/components/heroes/templates";
import plateStyles from "@/components/heroes/templates/plate/plate.module.scss";
import type { BrochureBlockProps, BrochureHeroContent } from "@/types/brochure";

export function Hero({
  instanceId = "BrochureHero_1",
  data = emptyHeroBlueprint(),
}: BrochureBlockProps<BrochureHeroContent>) {
  const Template = heroTemplates[data.variant] ?? heroTemplates.cover;
  return (
    <BrochureBlock
      size={data.sectionSize}
      className={data.variant === "plate" ? plateStyles.pin : undefined}
      reveal={data.variant !== "plate"}
      navSurface={
        data.variant === "cover" ||
        data.variant === "editorial" ||
        data.variant === "runway"
          ? "dark"
          : undefined
      }
    >
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Hero.displayName = "BrochureHero";

export const BrochureHero = Hero;
