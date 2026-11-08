import { readFileSync } from "node:fs";
import path from "node:path";
import type {
  BrochureBlueprint,
  BrochureInstanceContent,
  BrochureInstanceRef,
} from "@/types/brochure";
import { brochureComponentRegistry } from "@/lib/brochure/registry";
import { BROCHURE_COMPONENT_DIRS } from "@/lib/brochure/scan-template";

function loadComponentBlueprintJson(
  componentDir: string,
  repoRoot = process.cwd(),
): object {
  const file = path.join(
    repoRoot,
    "src/components",
    componentDir,
    "blueprint.json",
  );
  return JSON.parse(readFileSync(file, "utf8")) as object;
}

export function composeEmptyBlueprint(
  instances: readonly BrochureInstanceRef[],
  repoRoot = process.cwd(),
): BrochureBlueprint {
  const blueprint: BrochureBlueprint = {};

  for (const { instanceId, component } of instances) {
    const dir = BROCHURE_COMPONENT_DIRS[component];
    const empty = loadComponentBlueprintJson(dir, repoRoot);
    const parsed = brochureComponentRegistry[component].schema.parse(
      empty,
    ) as object;
    blueprint[instanceId] = {
      component,
      ...parsed,
    } as BrochureInstanceContent;
  }

  return blueprint;
}
