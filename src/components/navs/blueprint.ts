import navJson from "./blueprint.json";
import { z } from "zod";
import type { BrochureNavContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureSiteNav" as const;

const navLinkSchema = z.object({
  href: z.string().default(""),
  label: z.string().default(""),
});

export const navBlueprintSchema = z.object({
  variant: z.enum(["bar", "editorial", "runway", "studio"]).default("bar"),
  businessName: z.string().default(""),
  phone: z.string().default(""),
  logoMark: z.string().default(""),
  logoImageUrl: z.string().default(""),
  logoLayout: z.enum(["square", "horizontal"]).default("square"),
  brandDisplay: z.enum(["logo-only", "logo-and-name"]).default("logo-and-name"),
  logoReveal: z.enum(["always", "after-hero"]).default("always"),
  links: z.array(navLinkSchema).default([]),
  routeLinks: z.array(navLinkSchema).default([]),
  description: z.string().default(""),
  faviconUrl: z.string().default(""),
  shareImageUrl: z.string().default(""),
});

export function emptyNavBlueprint(): BrochureNavContent {
  return navBlueprintSchema.parse(navJson);
}
