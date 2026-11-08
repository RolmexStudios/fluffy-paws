import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureContactContent,
  BrochureContactVariant,
} from "@/types/brochure";
import { FormContact } from "@/components/contacts/templates/form/FormContact";
import { SplitContact } from "@/components/contacts/templates/split/SplitContact";
import { ConciergeContact } from "@/components/contacts/templates/concierge/ConciergeContact";
import { AcquisitionContact } from "@/components/contacts/templates/acquisition/AcquisitionContact";
import { PlateContact } from "@/components/contacts/templates/plate/PlateContact";

export type ContactTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureContactContent>
>;

export const contactTemplates: Record<
  BrochureContactVariant,
  ContactTemplateComponent
> = {
  form: FormContact,
  split: SplitContact,
  concierge: ConciergeContact,
  acquisition: AcquisitionContact,
  plate: PlateContact,
};
