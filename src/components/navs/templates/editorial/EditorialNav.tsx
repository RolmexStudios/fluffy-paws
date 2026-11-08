import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { NavSurfaceHeader } from "@/components/shared/nav-surface";
import { fieldPath } from "@/components/shared/field-path";
import { emptyNavBlueprint } from "@/components/navs/blueprint";
import { brochureContactHref } from "@/components/navs/links";
import type { BrochureBlockProps, BrochureNavContent } from "@/types/brochure";
import styles from "./editorial.module.scss";

export function EditorialNav({
  instanceId = "BrochureSiteNav_1",
  data = emptyNavBlueprint(),
}: BrochureBlockProps<BrochureNavContent>) {
  const navLinks = data.links;
  const contactHref = brochureContactHref(navLinks);
  const businessName = data.businessName.trim() || "The Marque";
  const logoUrl = data.logoImageUrl.trim();
  const showLogo = logoUrl.length > 0;
  const showName =
    data.brandDisplay === "logo-and-name" || (!showLogo && businessName.length > 0);

  return (
    <NavSurfaceHeader className={styles.header} data-logo-reveal={data.logoReveal}>
      <div className={styles.inner}>
        <nav className={styles.left} aria-label="Primary">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#top" className={styles.wordmark} aria-label={businessName}>
          {showLogo ? (
            <MediaSlot
              url={logoUrl}
              slotId={instanceId}
              jsonPath={fieldPath(instanceId, "logoImageUrl")}
              alt={businessName}
              className={styles.logoImage}
            />
          ) : null}
          {showName ? (
            <TextSlot
              value={businessName}
              jsonPath={fieldPath(instanceId, "businessName")}
              as="span"
              className={styles.wordmarkText}
            />
          ) : null}
        </a>

        <div className={styles.right}>
          <a href={contactHref} className={styles.inquire}>
            Private inquiry
          </a>
        </div>
      </div>
    </NavSurfaceHeader>
  );
}
