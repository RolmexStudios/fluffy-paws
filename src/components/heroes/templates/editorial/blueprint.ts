import { z } from "zod";
import { heroSectionSizeSchema } from "@/components/shared/section-size";

const heroCopyFields = {
  eyebrow: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  ctaLabel: z.string().default("Enter the showroom"),
  sectionSize: heroSectionSizeSchema,
};

export const editorialHeroBlueprintSchema = z.object({
  variant: z.literal("editorial"),
  ...heroCopyFields,
  backgroundImageUrl: z.string().default(""),
  imageAlt: z.string().default(""),
  catalogNote: z.string().default(""),
  emphasisWord: z.string().default(""),
});
