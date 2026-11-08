"use client";

import { useEffect, useId, useRef } from "react";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyBookingBlueprint } from "@/components/bookings/blueprint";
import {
  mountCalInline,
  resolveCalTarget,
} from "@/components/bookings/cal-embed";
import type {
  BrochureBlockProps,
  BrochureBookingContent,
} from "@/types/brochure";
import styles from "./widget.module.scss";

function calNamespace(instanceId: string, reactId: string) {
  const raw = `${instanceId}-${reactId}`;
  return raw.replace(/[^a-zA-Z0-9_-]/g, "") || "booking";
}

let mountSeq = 0;

export function WidgetBooking({
  instanceId = "BrochureBooking_1",
  data = emptyBookingBlueprint(),
}: BrochureBlockProps<BrochureBookingContent>) {
  const reactId = useId();
  const mountRef = useRef<HTMLDivElement>(null);
  const mountedKeyRef = useRef("");
  const target = resolveCalTarget(data.calLink, data.origin);
  const brandColor = data.brandColor.trim() || "#c45c3e";
  const calOrigin = target?.origin;
  const calLink = target?.calLink;

  useEffect(() => {
    const element = mountRef.current;
    if (!calOrigin || !calLink || !element) {
      return;
    }

    const key = [
      calOrigin,
      calLink,
      data.layout,
      data.theme,
      brandColor,
      String(data.hideEventTypeDetails),
      String(data.hideBranding),
    ].join("|");
    if (mountedKeyRef.current === key) {
      return;
    }
    mountedKeyRef.current = key;

    element.replaceChildren();
    mountSeq += 1;
    mountCalInline({
      element,
      namespace: calNamespace(instanceId, `${reactId}${mountSeq}`),
      origin: calOrigin,
      calLink,
      layout: data.layout,
      theme: data.theme,
      ui: {
        theme: data.theme,
        hideEventTypeDetails: data.hideEventTypeDetails,
        hideBranding: data.hideBranding,
        layout: data.layout,
        styles: {
          branding: { brandColor },
        },
        cssVarsPerTheme: {
          light: { "cal-brand": brandColor },
          dark: { "cal-brand": brandColor },
        },
      },
    });
  }, [
    brandColor,
    calLink,
    calOrigin,
    data.hideBranding,
    data.hideEventTypeDetails,
    data.layout,
    data.theme,
    instanceId,
    reactId,
  ]);

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.inner}>
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

        {target ? (
          <div className={styles.widget}>
            <div
              ref={mountRef}
              className={styles.mount}
              data-cal-origin={target.origin}
              data-cal-link={target.calLink}
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
              {fieldPath(instanceId, "calLink")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
