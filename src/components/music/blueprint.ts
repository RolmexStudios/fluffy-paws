import musicJson from "./blueprint.json";
import { z } from "zod";
import type { BrochureMusicContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureMusic" as const;

const trackSchema = z.object({
  title: z.string().default(""),
  artist: z.string().default(""),
  src: z.string().default(""),
});

export const musicBlueprintSchema = z.object({
  variant: z.literal("bar").default("bar"),
  label: z.string().default(""),
  tracks: z.array(trackSchema).default([]),
});

export function emptyMusicBlueprint(): BrochureMusicContent {
  return musicBlueprintSchema.parse(musicJson);
}
