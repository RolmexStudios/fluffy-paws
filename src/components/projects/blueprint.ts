import projectJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureProjectContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureProject" as const;

const clipSchema = z.object({
  src: z.string().default(""),
  shape: z.enum(["vertical", "portrait", "horizontal", "square"]).default("horizontal"),
});

export const projectRecordSchema = z.object({
  id: z.string().default(""),
  slug: z.string().default(""),
  title: z.string().default(""),
  client: z.string().default(""),
  year: z.number().default(0),
  role: z.string().default(""),
  location: z.string().default(""),
  category: z.string().default(""),
  description: z.string().default(""),
  story: z.array(z.string()).default([]),
  videoSrc: z.string().default(""),
  vimeoId: z.string().default(""),
  youtubeUrl: z.string().default(""),
  imageSrc: z.string().default(""),
  images: z.array(z.string()).default([]),
  media: z.array(clipSchema).default([]),
  bg: z.string().default("#f4f0e8"),
  focalY: z.number().min(0).max(100).optional(),
});

export const projectBlueprintSchema = z.object({
  variant: z.enum(["plates", "grid", "essay", "still"]).default("plates"),
  sectionSize: sectionSizeSchema,
  minSlots: z.number().int().min(0).max(24).default(6),
  projects: z.array(projectRecordSchema).default([]),
});

export function emptyProjectBlueprint(): BrochureProjectContent {
  return projectBlueprintSchema.parse(projectJson);
}
