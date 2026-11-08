"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyProcessBlueprint } from "@/components/processes/blueprint";
import { processTemplates } from "@/components/processes/templates";
import type {
  BrochureBlockProps,
  BrochureProcessContent,
} from "@/types/brochure";

export function Process({
  instanceId = "BrochureProcess_1",
  data = emptyProcessBlueprint(),
}: BrochureBlockProps<BrochureProcessContent>) {
  const Template = processTemplates[data.variant] ?? processTemplates.steps;
  return (
    <BrochureBlock size={data.sectionSize}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Process.displayName = "BrochureProcess";

export const BrochureProcess = Process;
