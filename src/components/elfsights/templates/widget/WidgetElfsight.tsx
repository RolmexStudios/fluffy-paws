"use client";

import { useEffect } from "react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyElfsightBlueprint } from "@/components/elfsights/blueprint";
import type {
  BrochureBlockProps,
  BrochureElfsightContent,
} from "@/types/brochure";
import styles from "./widget.module.scss";

const PLATFORM_SRC = "https://elfsightcdn.com/platform.js";
const APP_ID_PATTERN = /^[a-z0-9][a-z0-9-]{8,}$/i;

function ensureElfsightPlatform() {
  if (document.querySelector(`script[src="${PLATFORM_SRC}"]`)) {
    return;
  }
  const script = document.createElement("script");
  script.src = PLATFORM_SRC;
  script.async = true;
  document.body.appendChild(script);
}

export function WidgetElfsight({
  instanceId = "BrochureElfsight_1",
  data = emptyElfsightBlueprint(),
}: BrochureBlockProps<BrochureElfsightContent>) {
  const appId = data.appId.trim();
  const validAppId = APP_ID_PATTERN.test(appId) ? appId : "";

  useEffect(() => {
    if (!validAppId) return;
    ensureElfsightPlatform();
  }, [validAppId]);

  return (
    <section
      id={instanceId}
      className={styles.section}
      data-bg="#ffffff"
      data-theme="light"
      data-nav="on-light"
    >
      <div className={styles.inner}>
        <ScrollReveal compact>
          <header className={styles.header}>
            <SectionHeading
              instanceId={instanceId}
              eyebrow={data.eyebrow}
              title={data.title}
              eyebrowClassName={styles.eyebrow}
              titleClassName={styles.title}
            />
            <TextSlot
              value={data.description}
              jsonPath={fieldPath(instanceId, "description")}
              as="p"
              className={styles.description}
            />
          </header>
        </ScrollReveal>

        <ScrollReveal compact delayMs={80}>
          {validAppId ? (
            <div className={styles.widget}>
              <div
                className={`elfsight-app-${validAppId}`}
                data-elfsight-app-lazy
              />
            </div>
          ) : (
            <div
              className={styles.placeholder}
              role="img"
              aria-label={`Placeholder ${instanceId}`}
            >
              <span className={styles.placeholderId}>{instanceId}</span>
              <span className={styles.placeholderPath}>
                {fieldPath(instanceId, "appId")}
              </span>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
