import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureProjectContent,
  BrochureProjectVariant,
} from "@/types/brochure";
import { PlatesProject } from "@/components/projects/templates/plates/PlatesProject";
import { GridProject } from "@/components/projects/templates/grid/GridProject";
import { EssayProject } from "@/components/projects/templates/essay/EssayProject";
import { StillProject } from "@/components/projects/templates/still/StillProject";

export type ProjectTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureProjectContent>
>;

export const projectTemplates: Record<BrochureProjectVariant, ProjectTemplateComponent> = {
  plates: PlatesProject,
  grid: GridProject,
  essay: EssayProject,
  still: StillProject,
};
