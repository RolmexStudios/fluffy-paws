import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureDividerContent,
  BrochureDividerVariant,
} from "@/types/brochure";
import { StatsDivider } from "@/components/dividers/templates/stats/StatsDivider";
import { SwapDivider } from "@/components/dividers/templates/swap/SwapDivider";

export type DividerTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureDividerContent>
>;

export const dividerTemplates: Record<
  BrochureDividerVariant,
  DividerTemplateComponent
> = {
  stats: StatsDivider,
  swap: SwapDivider,
};
