"use client";

import { emptyProjectBlueprint } from "@/components/projects/blueprint";
import {
  isPhotography,
  recordIndex,
  sortProjects,
  videoHref,
} from "@/components/projects/data";
import { ProjectPlate } from "@/components/projects/project-plate";
import type { BrochureBlockProps, BrochureProjectContent } from "@/types/brochure";
import styles from "./plates.module.scss";

export function PlatesProject({
  instanceId = "BrochureProject_1",
  data = emptyProjectBlueprint(),
}: BrochureBlockProps<BrochureProjectContent>) {
  const films = sortProjects(data.projects.filter((project) => !isPhotography(project)));

  return (
    <div id={instanceId} className={styles.reel}>
      {films.map((project) => (
        <ProjectPlate
          key={project.slug || project.id || project.title}
          project={project}
          index={recordIndex(data.projects, project)}
          instanceId={instanceId}
          href={videoHref(project)}
        />
      ))}
    </div>
  );
}
