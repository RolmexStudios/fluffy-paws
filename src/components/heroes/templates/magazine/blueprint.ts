import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";

export const magazineHeroSlideSchema = z.object({
  imageUrl: z.string().default(""),
  alt: z.string().default(""),
  /** CSS object-position for the wide crop, e.g. "50% 70%". Empty centres it. */
  position: z.string().default(""),
});

/**
 * Magazine hero: one wide photograph at a time, advanced by the pager, with
 * a quiet headline and a short note beneath. No overlay text.
 */
export const magazineHeroBlueprintSchema = z.object({
  variant: z.literal("magazine"),
  eyebrow: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  /** Optional small link under the note. Empty hides it. */
  ctaLabel: z.string().default(""),
  sectionSize: sectionSizeSchema,
  slideshowIntervalMs: z.number().int().min(2000).max(20000).default(6000),
  slideshowImages: z.array(magazineHeroSlideSchema).default([]),
});
