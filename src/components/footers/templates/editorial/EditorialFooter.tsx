import Link from "next/link";
import { MediaSlot, telHref } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { brochureContactHref } from "@/components/navs/links";
import { emptyFooterBlueprint } from "@/components/footers/blueprint";
import type {
  BrochureBlockProps,
  BrochureFooterContent,
} from "@/types/brochure";
import styles from "./editorial.module.scss";

export function EditorialFooter({
  instanceId = "BrochureFooter_1",
  data = emptyFooterBlueprint(),
}: BrochureBlockProps<BrochureFooterContent>) {
  const call = telHref(data.phone);
  const contactHref = brochureContactHref(data.links);
  const year = new Date().getFullYear();
  const name = data.businessName.trim() || "The Marque";
  const colophon =
    data.colophon.trim() || "Established dealing in motorcars of consequence.";
  const logoUrl = data.logoImageUrl.trim();

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.masthead}>
          {logoUrl ? (
            <a href="#top" className={styles.brand} aria-label={name}>
              <MediaSlot
                url={logoUrl}
                slotId={`${instanceId}_logo`}
                jsonPath={fieldPath(instanceId, "logoImageUrl")}
                alt={name}
                className={styles.logoImage}
              />
            </a>
          ) : (
            <TextSlot
              value={data.businessName}
              jsonPath={fieldPath(instanceId, "businessName")}
              as="p"
              className={styles.wordmark}
            />
          )}
          <TextSlot
            value={data.tagline}
            jsonPath={fieldPath(instanceId, "tagline")}
            as="p"
            className={styles.tagline}
          />
          <a href={contactHref} className={styles.cta}>
            Make a private inquiry
          </a>
        </div>

        <nav className={styles.nav} aria-label="Footer">
          <p className={styles.colLabel}>Index</p>
          <Link href="/#top">Home</Link>
          <Link href="/showroom">Showroom</Link>
          <Link href="/newsletter">Letters</Link>
          {/* Showroom and letters are linked above as their own pages. */}
          {data.links
            .filter(
              (item) =>
                !item.href.includes("BrochureInventory") &&
                !item.href.includes("BrochureNewsletter"),
            )
            .map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
        </nav>

        <div className={styles.meta}>
          <p className={styles.colLabel}>Office</p>
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

      <div className={styles.rule} aria-hidden />

      <p className={styles.colophon}>
        {name} — {colophon} © {year}. All rights reserved.
      </p>
    </footer>
  );
}
