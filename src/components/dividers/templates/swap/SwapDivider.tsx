"use client";

import { useRef, type CSSProperties } from "react";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { useIntroSwap } from "@/components/shared/intro-swap";
import { emptyDividerBlueprint } from "@/components/dividers/blueprint";
import type {
  BrochureBlockProps,
  BrochureDividerContent,
  BrochureDividerSwapContent,
} from "@/types/brochure";
import styles from "./swap.module.scss";

const emptySwap = (): BrochureDividerSwapContent => ({
  variant: "swap",
  kicker: "",
  lead: "",
  cue: "",
  label: "Selected Clients",
  logos: [],
  anchorId: "",
  navLabel: "",
  bg: "#f4f0e8",
  theme: "light",
  sectionSize: "auto",
});

export function SwapDivider({
  instanceId = "BrochureDivider_1",
  data = emptyDividerBlueprint(),
}: BrochureBlockProps<BrochureDividerContent>) {
  const swap = data.variant === "swap" ? data : emptySwap();
  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  useIntroSwap(sectionRef, taglineRef, logosRef);
  const sectionId = swap.anchorId.trim() || instanceId;

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={styles.section}
      data-intro-swap=""
      data-bg={swap.bg || "#f4f0e8"}
      data-theme={swap.theme}
      style={{ backgroundColor: swap.bg || "#f4f0e8" }}
    >
      <div className={styles.card}>
        <div ref={taglineRef} className={`${styles.layer} ${styles.tagline}`}>
          <div className={styles.copy}>
            <TextSlot
              value={swap.kicker}
              jsonPath={fieldPath(instanceId, "kicker")}
              as="p"
              className={styles.kicker}
            />
            <TextSlot
              value={swap.lead}
              jsonPath={fieldPath(instanceId, "lead")}
              as="p"
              className={styles.lead}
            />
            <TextSlot
              value={swap.cue}
              jsonPath={fieldPath(instanceId, "cue")}
              as="p"
              className={styles.cue}
            />
          </div>
        </div>
        <div ref={logosRef} className={`${styles.layer} ${styles.logos}`}>
          <p className={styles.label}>{swap.label.trim() || "Selected Clients"}</p>
          <div className={styles.row}>
            {swap.logos.map((logo, index) => {
              const name = logo.name.trim();
              const src = logo.src.trim();
              const text = logo.text.trim();
              const sub = logo.sub.trim();
              const scale = logo.scale && logo.scale > 0 ? logo.scale : 1;
              return (
                <span
                  key={`${name || src || index}`}
                  className={[styles.logo, logo.tone === "dark" ? styles.dark : ""]
                    .filter(Boolean)
                    .join(" ")}
                  style={
                    scale === 1
                      ? undefined
                      : ({ ["--logo-scale"]: String(scale) } as CSSProperties)
                  }
                  aria-label={name || undefined}
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src.replace(/ /g, "%20")} alt={name} />
                  ) : sub ? (
                    <span className={styles.stack}>
                      <span className={styles.stackMain}>{text}</span>
                      <span className={styles.stackSub}>{sub}</span>
                    </span>
                  ) : (
                    text
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
