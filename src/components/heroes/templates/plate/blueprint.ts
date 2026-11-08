import { z } from "zod";
import { heroSectionSizeSchema } from "@/components/shared/section-size";

/** Full-bleed ambient video or still, optional center logo and retail lockup. */
export const plateHeroBlueprintSchema = z.object({
  variant: z.literal("plate"),
  videoSrc: z.string().default(""),
  imageSrc: z.string().default(""),
  imageAlt: z.string().default(""),
  logoImageUrl: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  bg: z.string().default("#141413"),
  theme: z.enum(["light", "dark"]).default("dark"),
  scrim: z.boolean().default(true),
  sectionSize: heroSectionSizeSchema,
});
