"use client";

import { ShowroomChrome } from "@/components/inventory/page-chrome";
import { ShowroomInventory } from "@/components/inventory/templates/showroom/ShowroomInventory";
import { INVENTORY_INSTANCE_ID } from "@/components/inventory/data";
import type { BrochureInventoryContent } from "@/types/brochure";

export type ShowroomViewProps = {
  content: BrochureInventoryContent;
  businessName: string;
  logoUrl?: string;
  instanceId?: string;
};

/** Full showroom page: shared across the demo route and produced sites. */
export function ShowroomView({
  content,
  businessName,
  logoUrl,
  instanceId = INVENTORY_INSTANCE_ID,
}: ShowroomViewProps) {
  return (
    <ShowroomChrome businessName={businessName} logoUrl={logoUrl}>
      <ShowroomInventory
        instanceId={instanceId}
        data={{ ...content, variant: "showroom", sectionSize: "auto" }}
      />
    </ShowroomChrome>
  );
}
