import contactJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureContactContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureContact" as const;

const contactLinkSchema = z.object({
  label: z.string().default(""),
  href: z.string().default(""),
});

export const contactBlueprintSchema = z.object({
  variant: z.enum(["form", "split", "concierge", "acquisition", "plate"]).default("form"),
  eyebrow: z.string().default(""),
  title: z.string().default("Get a free estimate"),
  intro: z.string().default(""),
  ctaLabel: z.string().default("Send message"),
  phone: z.string().default(""),
  serviceArea: z.string().default(""),
  hours: z.string().default(""),
  email: z.string().default(""),
  whatsapp: z.string().default(""),
  links: z.array(contactLinkSchema).default([]),
  videoSrc: z.string().default(""),
  logoImageUrl: z.string().default(""),
  bg: z.string().default("#f4f0e8"),
  theme: z.enum(["light", "dark"]).default("light"),
  mailtoSubject: z.string().default(""),
  sectionSize: sectionSizeSchema,
});

export function emptyContactBlueprint(): BrochureContactContent {
  return contactBlueprintSchema.parse(contactJson);
}
