import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type {
  BrochureBlueprint,
  BrochureComponentId,
  BrochureInstanceRef,
  BrochureNavLink,
} from "@/types/brochure";
import { buildBrochureNavLinks } from "@/components/navs/links";
import { BROCHURE_COMPONENT_TAGS } from "@/lib/brochure/scan-template";
import { brochureComponentRegistry } from "@/lib/brochure/registry";

const TAGS = new Set<string>(BROCHURE_COMPONENT_TAGS);

function componentName(type: unknown): string | undefined {
  if (typeof type !== "function") {
    return undefined;
  }
  const fn = type as { displayName?: string; name?: string };
  return fn.displayName ?? fn.name;
}

function collectBrochureInstances(node: ReactNode): BrochureInstanceRef[] {
  const counts: Partial<Record<BrochureComponentId, number>> = {};
  const instances: BrochureInstanceRef[] = [];

  function walk(n: ReactNode) {
    Children.forEach(n, (child) => {
      if (!isValidElement(child)) {
        return;
      }

      const name = componentName(child.type);
      if (name && TAGS.has(name)) {
        const component = name as BrochureComponentId;
        const index = (counts[component] ?? 0) + 1;
        counts[component] = index;
        instances.push({
          component,
          instanceId: `${component}_${index}`,
        });
      }

      const children = (child.props as { children?: ReactNode }).children;
      if (children) {
        walk(children);
      }
    });
  }

  walk(node);
  return instances;
}

function contentFromBlueprint(
  blueprint: BrochureBlueprint,
  instanceId: string,
  component: BrochureComponentId,
) {
  const instance = blueprint[instanceId];
  if (instance) {
    const { component: _c, ...data } = instance;
    return data;
  }
  return brochureComponentRegistry[component].schema.parse({});
}

function anchorNavLinks(
  blueprint: BrochureBlueprint,
  instances: readonly BrochureInstanceRef[],
): BrochureNavLink[] {
  const links: BrochureNavLink[] = [];
  for (const { instanceId } of instances) {
    const slice = blueprint[instanceId];
    if (!slice || !("anchorId" in slice) || !("navLabel" in slice)) continue;
    const anchorId = slice.anchorId.trim();
    const navLabel = slice.navLabel.trim();
    if (!anchorId || !navLabel) continue;
    links.push({ href: `#${anchorId}`, label: navLabel });
  }
  return links;
}

export function injectBrochureInstances(
  node: ReactNode,
  blueprint: BrochureBlueprint,
): ReactNode {
  const layoutInstances = collectBrochureInstances(node);
  const navLinks = [
    ...anchorNavLinks(blueprint, layoutInstances),
    ...buildBrochureNavLinks(layoutInstances),
  ];
  const counts: Partial<Record<BrochureComponentId, number>> = {};

  function walk(n: ReactNode): ReactNode {
    return Children.map(n, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      const name = componentName(child.type);
      let next: ReactElement = child;

      if (name && TAGS.has(name)) {
        const component = name as BrochureComponentId;
        const index = (counts[component] ?? 0) + 1;
        counts[component] = index;
        const instanceId = `${component}_${index}`;
        const data = contentFromBlueprint(
          blueprint,
          instanceId,
          component,
        ) as Record<string, unknown>;
        const withLinks =
          component === "BrochureSiteNav" || component === "BrochureFooter"
            ? { ...data, links: navLinks }
            : data;
        next = cloneElement(next, {
          instanceId,
          data: withLinks,
        } as never);
      }

      const children = (next.props as { children?: ReactNode }).children;
      if (children) {
        next = cloneElement(next, { children: walk(children) } as never);
      }

      return next;
    });
  }

  return walk(node);
}
