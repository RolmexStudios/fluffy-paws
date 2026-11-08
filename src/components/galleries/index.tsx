"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyGalleryBlueprint } from "@/components/galleries/blueprint";
import { galleryTemplates } from "@/components/galleries/templates";
import type {
  BrochureBlockProps,
  BrochureGalleryContent,
} from "@/types/brochure";

export function Gallery({
  instanceId = "BrochureGallery_1",
  data = emptyGalleryBlueprint(),
}: BrochureBlockProps<BrochureGalleryContent>) {
  const Template = galleryTemplates[data.variant] ?? galleryTemplates.grid;
  return (
    <BrochureBlock
      size={data.sectionSize}
      navSurface={data.variant === "lookbook" ? "dark" : undefined}
    >
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Gallery.displayName = "BrochureGallery";

export const BrochureGallery = Gallery;
