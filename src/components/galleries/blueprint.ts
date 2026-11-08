import galleryJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureGalleryContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureGallery" as const;

export const galleryItemSchema = z.object({
  imageUrl: z.string().default(""),
  title: z.string().default(""),
  category: z.string().default(""),
  alt: z.string().default(""),
});

export const galleryCategorySchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
});

export const galleryBlueprintSchema = z.object({
  title: z.string().default("Our work"),
  description: z.string().default(""),
  variant: z.enum(["grid", "showcase", "cards", "tabs", "lookbook"]).default("grid"),
  browseAxis: z.enum(["vertical", "horizontal"]).default("vertical"),
  tabLayout: z.enum(["grid", "row"]).default("grid"),
  dimInactiveTabs: z.boolean().default(true),
  sectionSize: sectionSizeSchema,
  items: z.array(galleryItemSchema).default([]),
  categories: z.array(galleryCategorySchema).default([]),
});

export function emptyGalleryBlueprint(): BrochureGalleryContent {
  return galleryBlueprintSchema.parse(galleryJson);
}
