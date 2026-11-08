import { MediaSlot, telHref } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { NavSurfaceHeader } from "@/components/shared/nav-surface";
import { fieldPath } from "@/components/shared/field-path";
import { emptyNavBlueprint } from "@/components/navs/blueprint";
import type { BrochureBlockProps, BrochureNavContent } from "@/types/brochure";
import styles from "./runway.module.scss";

export function RunwayNav({
  instanceId = "BrochureSiteNav_1",
  data = emptyNavBlueprint(),
}: BrochureBlockProps<BrochureNavContent>) {
  const businessName = data.businessName.trim() || "The House";
  const logoUrl = data.logoImageUrl.trim();
  const showLogo =
    logoUrl.length > 0 &&
    (data.brandDisplay === "logo-only" || data.brandDisplay === "logo-and-name");
  const showName =
    data.brandDisplay === "logo-and-name" || (!showLogo && businessName.length > 0);
  const phone = data.phone.trim();
  const phoneHref = telHref(phone);

  return (
    <NavSurfaceHeader className={styles.header} data-logo-reveal={data.logoReveal}>
      <div className={styles.inner}>
        <a href="#top" className={styles.wordmark} aria-label={businessName}>
          {showLogo ? (
            <MediaSlot
              url={logoUrl}
              slotId={instanceId}
              jsonPath={fieldPath(instanceId, "logoImageUrl")}
              alt=""
              className={styles.logo}
            />
          ) : null}
          {showName ? (
            <TextSlot
              value={businessName}
              jsonPath={fieldPath(instanceId, "businessName")}
              as="span"
              className={styles.name}
            />
          ) : null}
        </a>

        <nav className={styles.links} aria-label="Primary">
          {data.links.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        {phoneHref ? (
          <a href={phoneHref} className={styles.phone}>
            {phone}
          </a>
        ) : (
          <span className={styles.phone} />
        )}
      </div>
    </NavSurfaceHeader>
  );
}
