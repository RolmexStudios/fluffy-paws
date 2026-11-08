"use client";

import { emptyProjectBlueprint } from "@/components/projects/blueprint";
import { recordIndex } from "@/components/projects/data";
import { ProjectPlate } from "@/components/projects/project-plate";
import type { BrochureBlockProps, BrochureProjectContent } from "@/types/brochure";

/** One photograph, full viewport, light header theme. */
export function StillProject({
  instanceId = "BrochureProject_1",
  data = emptyProjectBlueprint(),
}: BrochureBlockProps<BrochureProjectContent>) {
  const project = data.projects[0];
  if (!project) return null;
  return (
    <ProjectPlate
      project={project}
      index={recordIndex(data.projects, project)}
      instanceId={instanceId}
      theme="light"
      fit="contain"
    />
  );
}
