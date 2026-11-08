"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyShopBlueprint } from "@/components/shops/blueprint";
import { shopTemplates } from "@/components/shops/templates";
import type { BrochureBlockProps, BrochureShopContent } from "@/types/brochure";

export function Shop({
  instanceId = "BrochureShop_1",
  data = emptyShopBlueprint(),
}: BrochureBlockProps<BrochureShopContent>) {
  const Template = shopTemplates[data.variant] ?? shopTemplates.rail;
  return (
    <BrochureBlock size={data.sectionSize} reveal={false}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Shop.displayName = "BrochureShop";

export const BrochureShop = Shop;
