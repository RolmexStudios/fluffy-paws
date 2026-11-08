import { z } from "zod";
import { BROCHURE_SECTION_SIZES } from "@/types/brochure";

export const sectionSizeSchema = z
  .enum(BROCHURE_SECTION_SIZES)
  .default("auto");

export const heroSectionSizeSchema = z
  .enum(BROCHURE_SECTION_SIZES)
  .default("full");
