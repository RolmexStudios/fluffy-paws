import type { BrochureComponentId, BrochureInstanceRef } from "@/types/brochure";

export type BrochureNavLink = {
  href: string;
  label: string;
};

export const BROCHURE_CONTACT_HREF = "#BrochureContact_1";

export const BROCHURE_QUOTE_CTA = {
  href: BROCHURE_CONTACT_HREF,
  label: "Get a quote today",
} as const;

const NAV_LABELS: Partial<Record<BrochureComponentId, string>> = {
  BrochureGallery: "Work",
  BrochureInventory: "Showroom",
  BrochureAbout: "About",
  BrochureElfsight: "Reviews",
  BrochureBooking: "Book",
  BrochureProcess: "Process",
  BrochureNewsletter: "Letters",
  BrochureShop: "Shop",
  BrochureContact: "Contact",
};

/** In-page nav targets for brochure sections present in the layout JSX. */
export function buildBrochureNavLinks(
  instances: readonly BrochureInstanceRef[],
): BrochureNavLink[] {
  // One link per label: a second Inventory (e.g. the archive) should not add
  // another "Showroom". The first instance in document order wins.
  const seen = new Set<string>();
  return instances.flatMap(({ component, instanceId }) => {
    const label = NAV_LABELS[component];
    if (!label || seen.has(label)) {
      return [];
    }
    seen.add(label);
    return [{ href: `#${instanceId}`, label }];
  });
}

export function brochureContactHref(links: readonly BrochureNavLink[]): string {
  return (
    // Match by instance id, not by the English label.
    links.find((item) => item.href.includes("BrochureContact"))?.href ??
    BROCHURE_CONTACT_HREF
  );
}
