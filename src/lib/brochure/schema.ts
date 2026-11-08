import type {
  BrochureBlueprint,
  BrochureInstanceContent,
  BrochureInstanceRef,
} from "@/types/brochure";
import { brochureComponentRegistry } from "@/lib/brochure/registry";
import { parseInstanceKey } from "@/lib/brochure/scan-template";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseBrochureBlueprint(
  input: unknown,
  instances?: readonly BrochureInstanceRef[],
): BrochureBlueprint {
  const raw = isRecord(input) ? input : {};
  const keys = instances?.map((item) => item.instanceId) ?? Object.keys(raw);
  const blueprint: BrochureBlueprint = {};

  for (const key of keys) {
    const parsedKey = parseInstanceKey(key);
    const fromLayout = instances?.find((item) => item.instanceId === key);
    const component = fromLayout?.component ?? parsedKey?.component;
    if (!component) {
      continue;
    }

    const def = brochureComponentRegistry[component];
    const rawSlice = raw[key];
    const slice: Record<string, unknown> = isRecord(rawSlice) ? rawSlice : {};
    const fields = { ...slice };
    delete fields.component;
    const parsed = def.schema.parse(fields) as Record<string, unknown>;
    blueprint[key] = {
      component,
      ...parsed,
    } as BrochureInstanceContent;
  }

  return blueprint;
}
