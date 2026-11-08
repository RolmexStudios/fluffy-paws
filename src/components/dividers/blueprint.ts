import dividerJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import { swapDividerBlueprintSchema } from "@/components/dividers/templates/swap/blueprint";
import type { BrochureDividerContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureDivider" as const;

const itemSchema = z.object({
  label: z.string().default(""),
  value: z.string().default(""),
});

export const statsDividerBlueprintSchema = z.object({
  variant: z.literal("stats"),
  eyebrow: z.string().default(""),
  items: z.array(itemSchema).default([]),
  sectionSize: sectionSizeSchema,
});

export const dividerBlueprintSchema = z.discriminatedUnion("variant", [
  statsDividerBlueprintSchema,
  swapDividerBlueprintSchema,
]);

export function emptyDividerBlueprint(): BrochureDividerContent {
  return dividerBlueprintSchema.parse(dividerJson);
}
