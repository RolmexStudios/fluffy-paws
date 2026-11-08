import elfsightJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureElfsightContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureElfsight" as const;

export const elfsightBlueprintSchema = z.object({
  variant: z.enum(["widget"]).default("widget"),
  eyebrow: z.string().default(""),
  title: z.string().default("What customers say"),
  description: z.string().default(""),
  appId: z.string().default(""),
  sectionSize: sectionSizeSchema,
});

export function emptyElfsightBlueprint(): BrochureElfsightContent {
  return elfsightBlueprintSchema.parse(elfsightJson);
}
