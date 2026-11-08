import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureGalleryContent,
  BrochureGalleryVariant,
} from "@/types/brochure";
import { ImageCardsGallery } from "@/components/galleries/templates/cards/ImageCardsGallery";
import { GridGallery } from "@/components/galleries/templates/grid/GridGallery";
import { ShowcaseGallery } from "@/components/galleries/templates/showcase/ShowcaseGallery";
import { TabsGallery } from "@/components/galleries/templates/tabs/TabsGallery";
import { LookbookGallery } from "@/components/galleries/templates/lookbook/LookbookGallery";

export type GalleryTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureGalleryContent>
>;

export const galleryTemplates: Record<
  BrochureGalleryVariant,
  GalleryTemplateComponent
> = {
  grid: GridGallery,
  showcase: ShowcaseGallery,
  cards: ImageCardsGallery,
  tabs: TabsGallery,
  lookbook: LookbookGallery,
};
