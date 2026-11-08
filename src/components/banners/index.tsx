"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyBannerBlueprint } from "@/components/banners/blueprint";
import { bannerTemplates } from "@/components/banners/templates";
import dockStyles from "@/components/banners/templates/dock/dock.module.scss";
import type {
  BrochureBannerContent,
  BrochureBlockProps,
} from "@/types/brochure";

export function Banner({
  instanceId = "BrochureBanner_1",
  data = emptyBannerBlueprint(),
}: BrochureBlockProps<BrochureBannerContent>) {
  const Template = bannerTemplates[data.variant] ?? bannerTemplates.dock;
  return (
    <BrochureBlock
      size={data.sectionSize}
      reveal={false}
      className={data.variant === "dock" ? dockStyles.pin : undefined}
      style={{ zIndex: 30 }}
    >
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Banner.displayName = "BrochureBanner";

export const BrochureBanner = Banner;
