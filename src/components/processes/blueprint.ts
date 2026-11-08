import processJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureProcessContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureProcess" as const;

export const processStepSchema = z.object({
  title: z.string().default(""),
  body: z.string().default(""),
});

export const processBlueprintSchema = z.object({
  variant: z.enum(["steps"]).default("steps"),
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  intro: z.string().default(""),
  /** Optional closing link to the contact block. Empty hides it. */
  ctaLabel: z.string().default(""),
  sectionSize: sectionSizeSchema,
  steps: z.array(processStepSchema).default([]),
});

export function emptyProcessBlueprint(): BrochureProcessContent {
  return processBlueprintSchema.parse(processJson);
}
