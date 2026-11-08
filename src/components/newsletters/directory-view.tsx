"use client";

import { ShowroomChrome } from "@/components/inventory/page-chrome";
import { IndexNewsletter } from "@/components/newsletters/templates/directory/IndexNewsletter";
import { NEWSLETTER_INSTANCE_ID } from "@/components/newsletters/data";
import type { BrochureNewsletterContent } from "@/types/brochure";

export type DirectoryViewProps = {
  content: BrochureNewsletterContent;
  businessName: string;
  logoUrl?: string;
  instanceId?: string;
};

/** Full letters directory: shared across the demo route and produced sites. */
export function DirectoryView({
  content,
  businessName,
  logoUrl,
  instanceId = NEWSLETTER_INSTANCE_ID,
}: DirectoryViewProps) {
  return (
    <ShowroomChrome businessName={businessName} logoUrl={logoUrl}>
      <IndexNewsletter
        instanceId={instanceId}
        data={{ ...content, variant: "index", sectionSize: "auto" }}
      />
    </ShowroomChrome>
  );
}
