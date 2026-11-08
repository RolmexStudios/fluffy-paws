import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureElfsightContent,
  BrochureElfsightVariant,
} from "@/types/brochure";
import { WidgetElfsight } from "@/components/elfsights/templates/widget/WidgetElfsight";

export type ElfsightTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureElfsightContent>
>;

export const elfsightTemplates: Record<
  BrochureElfsightVariant,
  ElfsightTemplateComponent
> = {
  widget: WidgetElfsight,
};
