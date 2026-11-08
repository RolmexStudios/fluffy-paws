import { TextSlot } from "@/components/shared/text-slot";
import { NavSurfaceHeader } from "@/components/shared/nav-surface";
import { fieldPath } from "@/components/shared/field-path";
import { emptyNavBlueprint } from "@/components/navs/blueprint";
import type { BrochureBlockProps, BrochureNavContent } from "@/types/brochure";
import {
  BROCHURE_QUOTE_CTA,
  brochureContactHref,
} from "../../links";
import { NavLogoMark } from "../../logo-mark";
import styles from "./bar.module.scss";

export function BarNav({
  instanceId = "BrochureSiteNav_1",
  data = emptyNavBlueprint(),
}: BrochureBlockProps<BrochureNavContent>) {
  const navLinks = data.links;
  const contactHref = brochureContactHref(navLinks);
  const showBrandName = data.brandDisplay === "logo-and-name";
  const brandClassName = showBrandName
    ? styles.brand
    : `${styles.brand} ${styles.brandLogoOnly}`;

  return (
    <NavSurfaceHeader
      className={styles.header}
      data-logo-reveal={data.logoReveal}
    >
      <div className={styles.inner}>
        <a href="#top" className={brandClassName} aria-label={data.businessName || "Home"}>
          <span data-nav-logo="" className={styles.navLogo}>
            <NavLogoMark instanceId={instanceId} data={data} />
          </span>

          {showBrandName ? (
            <TextSlot
              value={data.businessName}
              jsonPath={fieldPath(instanceId, "businessName")}
              as="span"
              className={styles.brandName}
            />
          ) : null}
        </a>

        <nav className={styles.links} aria-label="Primary">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
          <a href={contactHref} className={styles.phone}>
            {BROCHURE_QUOTE_CTA.label}
          </a>
        </nav>

        <a href={contactHref} className={styles.callMobile}>
          {BROCHURE_QUOTE_CTA.label}
        </a>
      </div>
    </NavSurfaceHeader>
  );
}
