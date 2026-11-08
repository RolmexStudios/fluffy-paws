import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureInventoryContent,
  BrochureInventoryVariant,
} from "@/types/brochure";
import { ShowroomInventory } from "@/components/inventory/templates/showroom/ShowroomInventory";
import { ArchiveInventory } from "@/components/inventory/templates/archive/ArchiveInventory";
import { TeaserInventory } from "@/components/inventory/templates/teaser/TeaserInventory";

export type InventoryTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureInventoryContent>
>;

export const inventoryTemplates: Record<
  BrochureInventoryVariant,
  InventoryTemplateComponent
> = {
  showroom: ShowroomInventory,
  teaser: TeaserInventory,
  archive: ArchiveInventory,
};
