"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyDividerBlueprint } from "@/components/dividers/blueprint";
import { dividerTemplates } from "@/components/dividers/templates";
import type {
  BrochureBlockProps,
  BrochureDividerContent,
} from "@/types/brochure";

export function Divider({
  instanceId = "BrochureDivider_1",
  data = emptyDividerBlueprint(),
}: BrochureBlockProps<BrochureDividerContent>) {
  const Template = dividerTemplates[data.variant] ?? dividerTemplates.stats;
  return (
    <BrochureBlock size={data.sectionSize}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Divider.displayName = "BrochureDivider";

export const BrochureDivider = Divider;
