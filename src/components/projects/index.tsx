"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyProjectBlueprint } from "@/components/projects/blueprint";
import { projectTemplates } from "@/components/projects/templates";
import type {
  BrochureBlockProps,
  BrochureProjectContent,
} from "@/types/brochure";

export function Project({
  instanceId = "BrochureProject_1",
  data = emptyProjectBlueprint(),
}: BrochureBlockProps<BrochureProjectContent>) {
  const Template = projectTemplates[data.variant] ?? projectTemplates.plates;
  return (
    <BrochureBlock size={data.sectionSize}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Project.displayName = "BrochureProject";

export const BrochureProject = Project;
