import bookingJson from "./blueprint.json";
import { z } from "zod";
import { sectionSizeSchema } from "@/components/shared/section-size";
import type { BrochureBookingContent } from "@/types/brochure";

export const COMPONENT_ID = "BrochureBooking" as const;

export const bookingBlueprintSchema = z.object({
  variant: z.enum(["widget"]).default("widget"),
  eyebrow: z.string().default(""),
  title: z.string().default("Schedule a visit"),
  description: z.string().default(""),
  calLink: z.string().default(""),
  origin: z.string().default("https://app.cal.com"),
  theme: z.enum(["light", "dark", "auto"]).default("light"),
  brandColor: z.string().default("#c45c3e"),
  hideEventTypeDetails: z.boolean().default(true),
  hideBranding: z.boolean().default(false),
  layout: z.enum(["month_view", "week_view", "column_view"]).default("month_view"),
  sectionSize: sectionSizeSchema,
});

export function emptyBookingBlueprint(): BrochureBookingContent {
  return bookingBlueprintSchema.parse(bookingJson);
}
