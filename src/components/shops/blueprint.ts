import shopJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureShopContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureShop" as const;

const shopDetailSchema = z.object({
  label: z.string().default(""),
  value: z.string().default(""),
});

export const shopItemSchema = z.object({
  id: z.string().default(""),
  slug: z.string().default(""),
  brand: z.string().default(""),
  category: z.string().default(""),
  title: z.string().default(""),
  price: z.string().default(""),
  imageUrl: z.string().default(""),
  imageAlt: z.string().default(""),
  images: z.array(z.string()).default([]),
  description: z.string().default(""),
  details: z.array(shopDetailSchema).default([]),
  status: z.enum(["available", "sold"]).default("available"),
});

export const shopBlueprintSchema = z.object({
  variant: z.enum(["rail", "gallery"]).default("rail"),
  sectionSize: sectionSizeSchema,
  title: z.string().default(""),
  galleryTitle: z.string().default(""),
  categoriesTitle: z.string().default(""),
  viewAllLabel: z.string().default("View all"),
  teaserLimit: z.number().int().min(1).max(24).default(8),
  items: z.array(shopItemSchema).default([]),
});

export function emptyShopBlueprint(): BrochureShopContent {
  return shopBlueprintSchema.parse(shopJson);
}
