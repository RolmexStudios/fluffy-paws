"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyNewsletterBlueprint } from "@/components/newsletters/blueprint";
import { newsletterTemplates } from "@/components/newsletters/templates";
import type {
  BrochureBlockProps,
  BrochureNewsletterContent,
} from "@/types/brochure";

export function Newsletter({
  instanceId = "BrochureNewsletter_1",
  data = emptyNewsletterBlueprint(),
}: BrochureBlockProps<BrochureNewsletterContent>) {
  const Template =
    newsletterTemplates[data.variant] ?? newsletterTemplates.teaser;
  return (
    <BrochureBlock size={data.sectionSize}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Newsletter.displayName = "BrochureNewsletter";

export const BrochureNewsletter = Newsletter;
