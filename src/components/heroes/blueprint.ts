import heroJson from "./blueprint.json";
import { z } from "zod";
import type { BrochureHeroContent } from "@/types/brochure";
import { heroSectionSizeSchema } from "@/components/shared/section-size";
import { splitHeroBlueprintSchema } from "@/components/heroes/templates/split/blueprint";
import { editorialHeroBlueprintSchema } from "@/components/heroes/templates/editorial/blueprint";
import { magazineHeroBlueprintSchema } from "@/components/heroes/templates/magazine/blueprint";
import { plateHeroBlueprintSchema } from "@/components/heroes/templates/plate/blueprint";

export const COMPONENT_ID = "BrochureHero" as const;

const heroCopyFields = {
  eyebrow: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  ctaLabel: z.string().default("View Our Work"),
  sectionSize: heroSectionSizeSchema,
};

export const runwayHeroBlueprintSchema = z.object({
  variant: z.literal("runway"),
  ...heroCopyFields,
  backgroundImageUrl: z.string().default(""),
});

export const coverHeroBlueprintSchema = z.object({
  variant: z.literal("cover"),
  ...heroCopyFields,
  backgroundImageUrl: z.string().default(""),
  logoImageUrl: z.string().default(""),
  logoLayout: z.enum(["horizontal", "square"]).default("horizontal"),
  logoSize: z.enum(["small", "medium", "large"]).default("medium"),
  copyAlign: z.enum(["left", "center"]).default("left"),
});

export const heroBlueprintSchema = z.discriminatedUnion("variant", [
  coverHeroBlueprintSchema,
  splitHeroBlueprintSchema,
  editorialHeroBlueprintSchema,
  magazineHeroBlueprintSchema,
  runwayHeroBlueprintSchema,
  plateHeroBlueprintSchema,
]);

export function emptyHeroBlueprint(): BrochureHeroContent {
  return heroBlueprintSchema.parse(heroJson);
}
