"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyElfsightBlueprint } from "@/components/elfsights/blueprint";
import { elfsightTemplates } from "@/components/elfsights/templates";
import type {
  BrochureBlockProps,
  BrochureElfsightContent,
} from "@/types/brochure";

export function Elfsight({
  instanceId = "BrochureElfsight_1",
  data = emptyElfsightBlueprint(),
}: BrochureBlockProps<BrochureElfsightContent>) {
  const Template = elfsightTemplates[data.variant] ?? elfsightTemplates.widget;
  return (
    <BrochureBlock size={data.sectionSize} reveal={false}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Elfsight.displayName = "BrochureElfsight";

export const BrochureElfsight = Elfsight;
