import aboutJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureAboutContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureAbout" as const;

const serviceSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
});

const teamMemberSchema = z.object({
  name: z.string().default(""),
  title: z.string().default(""),
  bio: z.string().default(""),
  photoUrl: z.string().default(""),
});

const testimonialSchema = z.object({
  quote: z.string().default(""),
  author: z.string().default(""),
});

const aboutRowSchema = z.object({
  label: z.string().default(""),
  value: z.string().default(""),
});

export const aboutBlueprintSchema = z.object({
  variant: z.enum(["split", "story", "values", "editorial", "rows", "salon"]).default("split"),
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  paragraphs: z.array(z.string()).default([]),
  imageUrl: z.string().default(""),
  imageAlt: z.string().default(""),
  imageSide: z.enum(["left", "right"]).default("right"),
  services: z.array(serviceSchema).default([]),
  team: z.array(teamMemberSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
  teamSectionLabel: z.string().default("Our team"),
  rows: z.array(aboutRowSchema).default([]),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
  sectionSize: sectionSizeSchema,
});

export function emptyAboutBlueprint(): BrochureAboutContent {
  return aboutBlueprintSchema.parse(aboutJson);
}
