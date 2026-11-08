import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureProcessContent,
  BrochureProcessVariant,
} from "@/types/brochure";
import { StepsProcess } from "@/components/processes/templates/steps/StepsProcess";

export type ProcessTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureProcessContent>
>;

export const processTemplates: Record<
  BrochureProcessVariant,
  ProcessTemplateComponent
> = {
  steps: StepsProcess,
};
