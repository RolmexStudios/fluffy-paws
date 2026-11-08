import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureFooterContent,
  BrochureFooterVariant,
} from "@/types/brochure";
import { SimpleFooter } from "@/components/footers/templates/simple/SimpleFooter";
import { StackedFooter } from "@/components/footers/templates/stacked/StackedFooter";
import { EditorialFooter } from "@/components/footers/templates/editorial/EditorialFooter";

export type FooterTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureFooterContent>
>;

export const footerTemplates: Record<
  BrochureFooterVariant,
  FooterTemplateComponent
> = {
  simple: SimpleFooter,
  stacked: StackedFooter,
  editorial: EditorialFooter,
};
