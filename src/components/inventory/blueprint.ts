import inventoryJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureInventoryContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureInventory" as const;

export const vehicleProvenanceSchema = z.object({
  year: z.string().default(""),
  label: z.string().default(""),
});

export const vehicleSchema = z.object({
  id: z.string().default(""),
  slug: z.string().default(""),
  year: z.string().default(""),
  make: z.string().default(""),
  model: z.string().default(""),
  chassis: z.string().default(""),
  transmission: z.string().default(""),
  status: z.enum(["available", "incoming", "private", "sold"]).default("available"),
  price: z.string().default(""),
  metricLabel: z.string().default(""),
  metricValue: z.string().default(""),
  imageUrl: z.string().default(""),
  imageAlt: z.string().default(""),
  galleryImageUrls: z.array(z.string()).default([]),
  provenance: z.array(vehicleProvenanceSchema).default([]),
  placedNote: z.string().default(""),
  /** Longer write-up for the vehicle page. Blank lines split paragraphs. */
  description: z.string().default(""),
});

export const inventoryBlueprintSchema = z.object({
  variant: z.enum(["showroom", "teaser", "archive"]).default("showroom"),
  eyebrow: z.string().default(""),
  title: z.string().default("The showroom"),
  intro: z.string().default(""),
  teaserLimit: z.number().int().min(1).max(12).default(3),
  viewAllLabel: z.string().default(""),
  sectionSize: sectionSizeSchema,
  vehicles: z.array(vehicleSchema).default([]),
});

export function emptyInventoryBlueprint(): BrochureInventoryContent {
  return inventoryBlueprintSchema.parse(inventoryJson);
}
