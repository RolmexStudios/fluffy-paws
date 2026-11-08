import type { ComponentType } from "react";
import type {
  BrochureBannerContent,
  BrochureBannerVariant,
  BrochureBlockProps,
} from "@/types/brochure";
import { DockBanner } from "@/components/banners/templates/dock/DockBanner";

export type BannerTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureBannerContent>
>;

export const bannerTemplates: Record<
  BrochureBannerVariant,
  BannerTemplateComponent
> = {
  dock: DockBanner,
};
