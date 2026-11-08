import { telHref } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import {
  BROCHURE_QUOTE_CTA,
  brochureContactHref,
} from "@/components/navs/links";
import { emptyFooterBlueprint } from "@/components/footers/blueprint";
import type {
  BrochureBlockProps,
  BrochureFooterContent,
} from "@/types/brochure";
import styles from "./stacked.module.scss";

export function StackedFooter({
  instanceId = "BrochureFooter_1",
  data = emptyFooterBlueprint(),
}: BrochureBlockProps<BrochureFooterContent>) {
  const call = telHref(data.phone);
  const contactHref = brochureContactHref(data.links);
  const year = new Date().getFullYear();
  const copyrightName = data.businessName.trim() || "Your business";
  const copyright = copyrightName.endsWith(".")
    ? `© ${year} ${copyrightName} All rights reserved.`
    : `© ${year} ${copyrightName}. All rights reserved.`;

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <TextSlot
            value={data.businessName}
            jsonPath={fieldPath(instanceId, "businessName")}
            as="p"
            className={styles.brand}
          />
          <TextSlot
            value={data.tagline}
            jsonPath={fieldPath(instanceId, "tagline")}
            as="p"
            className={styles.tagline}
          />
          <a href={contactHref} className={styles.cta}>
            {BROCHURE_QUOTE_CTA.label}
          </a>
        </div>

        <nav className={styles.nav} aria-label="Footer">
          <p className={styles.colLabel}>Explore</p>
          <a href="#top">Home</a>
          {data.links.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.meta}>
          <p className={styles.colLabel}>Visit</p>
          {call ? (
            <a href={call} className={styles.metaLink}>
              {data.phone}
            </a>
          ) : (
            <TextSlot
              value={data.phone}
              jsonPath={fieldPath(instanceId, "phone")}
              as="p"
              className={styles.metaText}
            />
          )}
          <TextSlot
            value={data.serviceArea}
            jsonPath={fieldPath(instanceId, "serviceArea")}
            as="p"
            className={styles.metaText}
          />
          <TextSlot
            value={data.hours}
            jsonPath={fieldPath(instanceId, "hours")}
            as="p"
            className={styles.metaMuted}
          />
        </div>
      </div>

      <p className={styles.copy}>{copyright}</p>
    </footer>
  );
}
