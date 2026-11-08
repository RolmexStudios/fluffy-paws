import splitJson from "./blueprint.json";
import { z } from "zod";
import { heroSectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureHeroSplitContent } from "@/types/brochure";

export const BROCHURE_HERO_SLIDESHOW_SCAFFOLD_COUNT = 4;

export const heroSlideshowImageSchema = z.object({
  imageUrl: z.string().default(""),
  alt: z.string().default(""),
});

const heroCopyFields = {
  eyebrow: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  ctaLabel: z.string().default("View Our Work"),
  sectionSize: heroSectionSizeSchema,
};

export const splitHeroBlueprintSchema = z.object({
  variant: z.literal("split"),
  ...heroCopyFields,
  slideshowIntervalMs: z.number().int().min(2000).max(20000).default(5000),
  slideshowImages: z
    .array(heroSlideshowImageSchema)
    .default(
      Array.from({ length: BROCHURE_HERO_SLIDESHOW_SCAFFOLD_COUNT }, () => ({
        imageUrl: "",
        alt: "",
      })),
    ),
});

export function emptySplitHeroBlueprint(): BrochureHeroSplitContent {
  return splitHeroBlueprintSchema.parse(splitJson);
}
