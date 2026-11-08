import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureNewsletterContent,
  BrochureNewsletterVariant,
} from "@/types/brochure";
import { TeaserNewsletter } from "@/components/newsletters/templates/teaser/TeaserNewsletter";
import { IndexNewsletter } from "@/components/newsletters/templates/directory/IndexNewsletter";

export type NewsletterTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureNewsletterContent>
>;

export const newsletterTemplates: Record<
  BrochureNewsletterVariant,
  NewsletterTemplateComponent
> = {
  teaser: TeaserNewsletter,
  index: IndexNewsletter,
};
