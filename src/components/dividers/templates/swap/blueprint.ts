import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";

export const swapLogoSchema = z.object({
  name: z.string().default(""),
  src: z.string().default(""),
  text: z.string().default(""),
  sub: z.string().default(""),
  tone: z.enum(["dark"]).optional(),
  scale: z.number().positive().optional(),
});

/** Tagline that yields to a client-logo row. Not the stats band. */
export const swapDividerBlueprintSchema = z.object({
  variant: z.literal("swap"),
  kicker: z.string().default(""),
  lead: z.string().default(""),
  cue: z.string().default(""),
  label: z.string().default("Selected Clients"),
  logos: z.array(swapLogoSchema).default([]),
  anchorId: z.string().default(""),
  navLabel: z.string().default(""),
  bg: z.string().default("#f4f0e8"),
  theme: z.enum(["light", "dark"]).default("light"),
  sectionSize: sectionSizeSchema,
});
