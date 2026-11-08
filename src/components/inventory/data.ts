import inventoryJson from "./blueprint.json";
import { inventoryBlueprintSchema } from "@/components/inventory/blueprint";
import type {
  BrochureInventoryContent,
  BrochureVehicle,
  BrochureVehicleStatus,
} from "@/types/brochure";

/** Default instance id for the showroom block in both demo and produced sites. */
export const INVENTORY_INSTANCE_ID = "BrochureInventory_1";

export const VEHICLE_STATUS_LABELS: Record<BrochureVehicleStatus, string> = {
  available: "Available",
  incoming: "Arriving",
  private: "Private sale",
  sold: "Sold",
};

/** Cars still on offer. Sold records stay off the teaser and showroom grid. */
export function isListedVehicle(vehicle: BrochureVehicle): boolean {
  return vehicle.status !== "sold";
}

/** Stable slug from the vehicle id — never from translated or edited titles. */
export function slugifyVehicleId(id: string): string {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function vehicleSlug(vehicle: BrochureVehicle): string {
  return vehicle.slug.trim() || slugifyVehicleId(vehicle.id);
}

export function showroomHref(): string {
  return "/showroom";
}

export function vehicleHref(vehicle: BrochureVehicle): string {
  return `/showroom/${vehicleSlug(vehicle)}`;
}

export function vehicleTitle(vehicle: BrochureVehicle): string {
  return [vehicle.year, vehicle.make, vehicle.model]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

type BlueprintLike = Record<string, unknown> | null | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Parse the inventory slice out of a full blueprint object (produced-site content). */
export function readInventorySlice(
  blueprint: BlueprintLike,
  instanceId: string = INVENTORY_INSTANCE_ID,
): BrochureInventoryContent | null {
  if (!isRecord(blueprint)) {
    return null;
  }
  const raw = blueprint[instanceId];
  if (!isRecord(raw)) {
    return null;
  }
  const fields = { ...raw };
  delete fields.component;
  return inventoryBlueprintSchema.parse(fields);
}

export function getInventoryVehicles(
  blueprint: BlueprintLike,
  instanceId: string = INVENTORY_INSTANCE_ID,
): BrochureVehicle[] {
  return readInventorySlice(blueprint, instanceId)?.vehicles ?? [];
}

/** Every inventory slice in a blueprint (showroom, teaser, archive). */
export function listInventoryInstanceIds(blueprint: BlueprintLike): string[] {
  if (!isRecord(blueprint)) {
    return [];
  }
  return Object.keys(blueprint).filter((key) => {
    const raw = blueprint[key];
    return isRecord(raw) && raw.component === "BrochureInventory";
  });
}

/** Listed and sold cars, first unique slug wins. */
export function getAllInventoryVehicles(
  blueprint: BlueprintLike,
): BrochureVehicle[] {
  const seen = new Set<string>();
  const vehicles: BrochureVehicle[] = [];
  for (const instanceId of listInventoryInstanceIds(blueprint)) {
    for (const vehicle of getInventoryVehicles(blueprint, instanceId)) {
      const slug = vehicleSlug(vehicle);
      if (!slug || seen.has(slug)) {
        continue;
      }
      seen.add(slug);
      vehicles.push(vehicle);
    }
  }
  return vehicles;
}

export function getVehicleBySlug(
  blueprint: BlueprintLike,
  slug: string,
  instanceId?: string,
): BrochureVehicle | undefined {
  const vehicles = instanceId
    ? getInventoryVehicles(blueprint, instanceId)
    : getAllInventoryVehicles(blueprint);
  return vehicles.find((vehicle) => vehicleSlug(vehicle) === slug);
}

/** Demo convenience: the block's own sample fiction (no scrape, no content file). */
export function getSampleInventory(): BrochureInventoryContent {
  return inventoryBlueprintSchema.parse(inventoryJson);
}

export function getSampleVehicles(): BrochureVehicle[] {
  return getSampleInventory().vehicles;
}
