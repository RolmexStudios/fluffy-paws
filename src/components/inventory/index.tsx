"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyInventoryBlueprint } from "@/components/inventory/blueprint";
import { inventoryTemplates } from "@/components/inventory/templates";
import type {
  BrochureBlockProps,
  BrochureInventoryContent,
} from "@/types/brochure";

export function Inventory({
  instanceId = "BrochureInventory_1",
  data = emptyInventoryBlueprint(),
}: BrochureBlockProps<BrochureInventoryContent>) {
  const Template = inventoryTemplates[data.variant] ?? inventoryTemplates.teaser;
  return (
    <BrochureBlock size={data.sectionSize}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Inventory.displayName = "BrochureInventory";

export const BrochureInventory = Inventory;
