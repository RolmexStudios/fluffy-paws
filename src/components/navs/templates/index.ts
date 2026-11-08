import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureNavContent,
  BrochureNavVariant,
} from "@/types/brochure";
import { BarNav } from "@/components/navs/templates/bar/BarNav";
import { EditorialNav } from "@/components/navs/templates/editorial/EditorialNav";
import { RunwayNav } from "@/components/navs/templates/runway/RunwayNav";
import { StudioNav } from "@/components/navs/templates/studio/StudioNav";

export type NavTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureNavContent>
>;

export const navTemplates: Record<BrochureNavVariant, NavTemplateComponent> = {
  bar: BarNav,
  editorial: EditorialNav,
  runway: RunwayNav,
  studio: StudioNav,
};
