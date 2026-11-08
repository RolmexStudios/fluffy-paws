"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyFooterBlueprint } from "@/components/footers/blueprint";
import { footerTemplates } from "@/components/footers/templates";
import type {
  BrochureBlockProps,
  BrochureFooterContent,
} from "@/types/brochure";

export function Footer({
  instanceId = "BrochureFooter_1",
  data = emptyFooterBlueprint(),
}: BrochureBlockProps<BrochureFooterContent>) {
  const Template = footerTemplates[data.variant] ?? footerTemplates.simple;
  return (
    <BrochureBlock size={data.sectionSize} navSurface="dark">
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Footer.displayName = "BrochureFooter";

export const BrochureFooter = Footer;
