"use client";

import { ArrowRight } from "lucide-react";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { BROCHURE_CONTACT_HREF } from "@/components/navs/links";
import { emptyProcessBlueprint } from "@/components/processes/blueprint";
import type {
  BrochureBlockProps,
  BrochureProcessContent,
} from "@/types/brochure";
import styles from "./steps.module.scss";

/** Numbered ledger of how an engagement runs. */
export function StepsProcess({
  instanceId = "BrochureProcess_1",
  data = emptyProcessBlueprint(),
}: BrochureBlockProps<BrochureProcessContent>) {
  const cta = data.ctaLabel.trim();

  return (
    <section id={instanceId} className={styles.section} aria-label="Process">
      <div className={styles.inner}>
        <header className={styles.header}>
          <SectionHeading
            instanceId={instanceId}
            eyebrow={data.eyebrow}
            title={data.title}
            eyebrowClassName={styles.eyebrow}
            titleClassName={styles.title}
          />
          {data.intro.trim() ? (
            <TextSlot
              value={data.intro}
              jsonPath={fieldPath(instanceId, "intro")}
              as="p"
              className={styles.intro}
            />
          ) : null}
        </header>

        <ol className={styles.steps} style={{ ["--step-count" as string]: data.steps.length }}>
          {data.steps.map((step, index) => (
            <li key={`${instanceId}-step-${index}`} className={styles.step}>
              <span className={styles.number} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.stepBody}>
                <TextSlot
                  value={step.title}
                  jsonPath={fieldPath(instanceId, `steps[${index}].title`)}
                  as="h3"
                  className={styles.stepTitle}
                />
                <TextSlot
                  value={step.body}
                  jsonPath={fieldPath(instanceId, `steps[${index}].body`)}
                  as="p"
                  className={styles.stepText}
                />
              </div>
            </li>
          ))}
        </ol>

        {cta ? (
          <a href={BROCHURE_CONTACT_HREF} className={styles.cta}>
            {cta}
            <ArrowRight className={styles.ctaIcon} aria-hidden />
          </a>
        ) : null}
      </div>
    </section>
  );
}
