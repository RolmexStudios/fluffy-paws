import { emptyNavBlueprint } from "@/components/navs/blueprint";
import { navTemplates } from "@/components/navs/templates";
import { FloatingCta } from "@/components/shared/floating-cta";
import { brochureContactHref, BROCHURE_QUOTE_CTA } from "@/components/navs/links";
import type { BrochureBlockProps, BrochureNavContent } from "@/types/brochure";

export function SiteNav({
  instanceId = "BrochureSiteNav_1",
  data = emptyNavBlueprint(),
}: BrochureBlockProps<BrochureNavContent>) {
  const Template = navTemplates[data.variant] ?? navTemplates.bar;
  const contactHref = brochureContactHref(data.links);
  return (
    <>
      <Template instanceId={instanceId} data={data} />
      {data.variant === "editorial" ||
      data.variant === "runway" ||
      data.variant === "studio" ? null : (
        <FloatingCta href={contactHref} label={BROCHURE_QUOTE_CTA.label} />
      )}
    </>
  );
}

SiteNav.displayName = "BrochureSiteNav";

export const BrochureSiteNav = SiteNav;
