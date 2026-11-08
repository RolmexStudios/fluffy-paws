import type { BrochureComponentId, BrochureInstanceRef } from "@/types/brochure";

export const BROCHURE_COMPOSITION_SOURCE =
  "src/app/page.tsx";

export const BROCHURE_COMPONENT_TAGS: readonly BrochureComponentId[] = [
  "BrochureSiteNav",
  "BrochureHero",
  "BrochureGallery",
  "BrochureInventory",
  "BrochureDivider",
  "BrochureAbout",
  "BrochureElfsight",
  "BrochureBooking",
  "BrochureContact",
  "BrochureProcess",
  "BrochureNewsletter",
  "BrochureMusic",
  "BrochureProject",
  "BrochureShop",
  "BrochureBanner",
  "BrochureFooter",
];

/** JSX tags in layouts. Short names are aliases for the blueprint component ids. */
export const LAYOUT_TAG_TO_COMPONENT: Record<string, BrochureComponentId> = {
  SiteNav: "BrochureSiteNav",
  BrochureSiteNav: "BrochureSiteNav",
  Hero: "BrochureHero",
  BrochureHero: "BrochureHero",
  Gallery: "BrochureGallery",
  BrochureGallery: "BrochureGallery",
  Inventory: "BrochureInventory",
  BrochureInventory: "BrochureInventory",
  Divider: "BrochureDivider",
  BrochureDivider: "BrochureDivider",
  About: "BrochureAbout",
  BrochureAbout: "BrochureAbout",
  Elfsight: "BrochureElfsight",
  BrochureElfsight: "BrochureElfsight",
  Booking: "BrochureBooking",
  BrochureBooking: "BrochureBooking",
  Contact: "BrochureContact",
  BrochureContact: "BrochureContact",
  Process: "BrochureProcess",
  BrochureProcess: "BrochureProcess",
  Newsletter: "BrochureNewsletter",
  BrochureNewsletter: "BrochureNewsletter",
  Music: "BrochureMusic",
  BrochureMusic: "BrochureMusic",
  Project: "BrochureProject",
  BrochureProject: "BrochureProject",
  Shop: "BrochureShop",
  BrochureShop: "BrochureShop",
  Banner: "BrochureBanner",
  BrochureBanner: "BrochureBanner",
  Footer: "BrochureFooter",
  BrochureFooter: "BrochureFooter",
};

export const BROCHURE_COMPONENT_DIRS: Record<BrochureComponentId, string> = {
  BrochureSiteNav: "navs",
  BrochureHero: "heroes",
  BrochureGallery: "galleries",
  BrochureInventory: "inventory",
  BrochureDivider: "dividers",
  BrochureAbout: "abouts",
  BrochureElfsight: "elfsights",
  BrochureBooking: "bookings",
  BrochureContact: "contacts",
  BrochureProcess: "processes",
  BrochureNewsletter: "newsletters",
  BrochureMusic: "music",
  BrochureProject: "projects",
  BrochureShop: "shops",
  BrochureBanner: "banners",
  BrochureFooter: "footers",
};

const TAG_PATTERN = new RegExp(
  `<(${Object.keys(LAYOUT_TAG_TO_COMPONENT).join("|")})\\b`,
  "g",
);

export function instanceIdFor(
  component: BrochureComponentId,
  index: number,
): string {
  return `${component}_${index}`;
}

/** Count `<Hero />` / `<BrochureHero />` (etc.) in template source, in document order. */
export function scanBrochureJsx(source: string): BrochureInstanceRef[] {
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  const counts: Partial<Record<BrochureComponentId, number>> = {};
  const instances: BrochureInstanceRef[] = [];

  for (const match of stripped.matchAll(TAG_PATTERN)) {
    const component = LAYOUT_TAG_TO_COMPONENT[match[1]];
    if (!component) {
      continue;
    }
    const next = (counts[component] ?? 0) + 1;
    counts[component] = next;
    instances.push({
      component,
      instanceId: instanceIdFor(component, next),
    });
  }

  return instances;
}

export function parseInstanceKey(
  key: string,
): { component: BrochureComponentId; index: number } | null {
  for (const component of BROCHURE_COMPONENT_TAGS) {
    const prefix = `${component}_`;
    if (key.startsWith(prefix)) {
      const index = Number(key.slice(prefix.length));
      if (Number.isInteger(index) && index >= 1) {
        return { component, index };
      }
    }
  }
  return null;
}
