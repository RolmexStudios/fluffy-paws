"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyAboutBlueprint } from "@/components/abouts/blueprint";
import { aboutTemplates } from "@/components/abouts/templates";
import type { BrochureBlockProps, BrochureAboutContent } from "@/types/brochure";

export function About({
  instanceId = "BrochureAbout_1",
  data = emptyAboutBlueprint(),
}: BrochureBlockProps<BrochureAboutContent>) {
  const Template = aboutTemplates[data.variant] ?? aboutTemplates.split;
  return (
    <BrochureBlock
      size={data.sectionSize}
      navSurface={data.variant === "values" ? "dark" : undefined}
      reveal={data.variant !== "salon"}
    >
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

About.displayName = "BrochureAbout";

export const BrochureAbout = About;
