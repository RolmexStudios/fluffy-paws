import newsletterJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureNewsletterContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureNewsletter" as const;

export const newsletterParagraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  text: z.string().default(""),
});

export const newsletterHeadingBlockSchema = z.object({
  type: z.literal("heading"),
  text: z.string().default(""),
});

export const newsletterImageBlockSchema = z.object({
  type: z.literal("image"),
  imageUrl: z.string().default(""),
  alt: z.string().default(""),
  caption: z.string().default(""),
  align: z.enum(["left", "right", "full"]).default("left"),
});

export const newsletterBlockSchema = z.discriminatedUnion("type", [
  newsletterParagraphBlockSchema,
  newsletterHeadingBlockSchema,
  newsletterImageBlockSchema,
]);

export const newsletterPostSchema = z.object({
  slug: z.string().default(""),
  date: z.string().default(""),
  year: z.string().default(""),
  month: z.string().default(""),
  title: z.string().default(""),
  excerpt: z.string().default(""),
  heroImageUrl: z.string().default(""),
  heroImageAlt: z.string().default(""),
  blocks: z.array(newsletterBlockSchema).default([]),
});

export const newsletterBlueprintSchema = z.object({
  variant: z.enum(["teaser", "index"]).default("teaser"),
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  intro: z.string().default(""),
  viewAllLabel: z.string().default("Read the letters"),
  teaserLimit: z.number().int().min(1).max(12).default(3),
  sectionSize: sectionSizeSchema,
  posts: z.array(newsletterPostSchema).default([]),
});

export function emptyNewsletterBlueprint(): BrochureNewsletterContent {
  return newsletterBlueprintSchema.parse(newsletterJson);
}
