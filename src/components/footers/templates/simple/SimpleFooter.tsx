import { telHref } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyFooterBlueprint } from "@/components/footers/blueprint";
import type {
  BrochureBlockProps,
  BrochureFooterContent,
} from "@/types/brochure";
import styles from "./simple.module.scss";

export function SimpleFooter({
  instanceId = "BrochureFooter_1",
  data = emptyFooterBlueprint(),
}: BrochureBlockProps<BrochureFooterContent>) {
  const call = telHref(data.phone);
  const year = new Date().getFullYear();
  const copyrightName = data.businessName.trim() || "Your business";

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <TextSlot
          value={data.businessName}
          jsonPath={fieldPath(instanceId, "businessName")}
          as="p"
          className={styles.brand}
        />
        <nav className={styles.links}>
          <a href="#top">Home</a>
          {data.links.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          {call ? <a href={call}>{data.phone}</a> : null}
        </nav>
      </div>
      <p className={styles.copy}>
        © {year} {copyrightName}. All rights reserved.
      </p>
    </footer>
  );
}
