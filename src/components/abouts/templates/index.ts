import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureAboutContent,
  BrochureAboutVariant,
} from "@/types/brochure";
import { SplitAbout } from "@/components/abouts/templates/split/SplitAbout";
import { StoryAbout } from "@/components/abouts/templates/story/StoryAbout";
import { ValuesAbout } from "@/components/abouts/templates/values/ValuesAbout";
import { EditorialAbout } from "@/components/abouts/templates/editorial/EditorialAbout";
import { RowsAbout } from "@/components/abouts/templates/rows/RowsAbout";
import { SalonAbout } from "@/components/abouts/templates/salon/SalonAbout";

export type AboutTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureAboutContent>
>;

export const aboutTemplates: Record<
  BrochureAboutVariant,
  AboutTemplateComponent
> = {
  split: SplitAbout,
  story: StoryAbout,
  values: ValuesAbout,
  editorial: EditorialAbout,
  rows: RowsAbout,
  salon: SalonAbout,
};
