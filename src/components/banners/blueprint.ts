import bannerJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureBannerContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureBanner" as const;

const bannerCueSchema = z.object({
  targetId: z.string().default(""),
  line: z.string().default(""),
});

export const bannerBlueprintSchema = z.object({
  variant: z.enum(["dock"]).default("dock"),
  sectionSize: sectionSizeSchema,
  line: z.string().default(""),
  cues: z.array(bannerCueSchema).default([]),
});

export function emptyBannerBlueprint(): BrochureBannerContent {
  return bannerBlueprintSchema.parse(bannerJson);
}
