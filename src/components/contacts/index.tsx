"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyContactBlueprint } from "@/components/contacts/blueprint";
import { contactTemplates } from "@/components/contacts/templates";
import type {
  BrochureBlockProps,
  BrochureContactContent,
} from "@/types/brochure";

export function Contact({
  instanceId = "BrochureContact_1",
  data = emptyContactBlueprint(),
}: BrochureBlockProps<BrochureContactContent>) {
  const Template = contactTemplates[data.variant] ?? contactTemplates.form;
  return (
    <BrochureBlock size={data.sectionSize} reveal={data.variant !== "plate"}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Contact.displayName = "BrochureContact";

export const BrochureContact = Contact;
