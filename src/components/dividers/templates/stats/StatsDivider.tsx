import type { CSSProperties } from "react";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyDividerBlueprint } from "@/components/dividers/blueprint";
import type {
  BrochureBlockProps,
  BrochureDividerContent,
} from "@/types/brochure";
import styles from "./stats.module.scss";

export function StatsDivider({
  instanceId = "BrochureDivider_1",
  data = emptyDividerBlueprint(),
}: BrochureBlockProps<BrochureDividerContent>) {
  if (data.variant !== "stats") return null;
  const stats = data.items.filter(
    (item) => item.label.trim() || item.value.trim(),
  );
  const columns = Math.max(stats.length, 1);

  return (
    <section
      id={instanceId}
      className={styles.section}
      aria-label={data.eyebrow.trim() || "Figures"}
      style={{ "--stat-count": String(columns) } as CSSProperties}
    >
      <div className={styles.inner}>
        {data.eyebrow.trim() ? (
          <TextSlot
            value={data.eyebrow}
            jsonPath={fieldPath(instanceId, "eyebrow")}
            as="p"
            className={styles.eyebrow}
          />
        ) : null}

        {stats.length > 0 ? (
          <dl className={styles.stats}>
            {stats.map((stat, index) => (
              <div key={`${instanceId}-stat-${index}`} className={styles.stat}>
                <dt>
                  <TextSlot
                    value={stat.label}
                    jsonPath={fieldPath(instanceId, `items[${index}].label`)}
                    as="span"
                    className={styles.label}
                  />
                </dt>
                <dd>
                  <TextSlot
                    value={stat.value}
                    jsonPath={fieldPath(instanceId, `items[${index}].value`)}
                    as="span"
                    className={styles.value}
                  />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
