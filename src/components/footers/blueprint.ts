import footerJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureFooterContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureFooter" as const;

const footerLinkSchema = z.object({
  href: z.string().default(""),
  label: z.string().default(""),
});

export const footerBlueprintSchema = z.object({
  variant: z.enum(["simple", "stacked", "editorial"]).default("simple"),
  businessName: z.string().default(""),
  logoImageUrl: z.string().default(""),
  tagline: z.string().default(""),
  phone: z.string().default(""),
  serviceArea: z.string().default(""),
  hours: z.string().default(""),
  colophon: z.string().default(""),
  links: z.array(footerLinkSchema).default([]),
  sectionSize: sectionSizeSchema,
});

export function emptyFooterBlueprint(): BrochureFooterContent {
  return footerBlueprintSchema.parse(footerJson);
}
