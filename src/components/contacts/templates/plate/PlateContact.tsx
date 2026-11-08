"use client";

import { AmbientVideo } from "@/components/shared/ambient-video";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { videoSources } from "@/components/shared/video-sources";
import { emptyContactBlueprint } from "@/components/contacts/blueprint";
import type { BrochureBlockProps, BrochureContactContent } from "@/types/brochure";
import styles from "./plate.module.scss";

function mailtoHref(email: string, subject: string) {
  const address = email.trim();
  if (!address) return "";
  const line = subject.trim();
  return line
    ? `mailto:${address}?subject=${encodeURIComponent(line)}`
    : `mailto:${address}`;
}

export function PlateContact({
  instanceId = "BrochureContact_1",
  data = emptyContactBlueprint(),
}: BrochureBlockProps<BrochureContactContent>) {
  if (data.variant !== "plate") return null;
  const sources = data.videoSrc.trim() ? videoSources(data.videoSrc) : [];
  const hasVideo = sources.length > 0;
  const logo = data.logoImageUrl.trim();
  const href = mailtoHref(data.email, data.mailtoSubject);

  return (
    <section
      id={instanceId}
      className={hasVideo ? styles.section : `${styles.section} ${styles.sectionBand}`}
      data-bg={data.bg || "#f4f0e8"}
      data-theme={data.theme}
    >
      <div className={hasVideo ? styles.media : `${styles.media} ${styles.band}`}>
        {sources.length > 0 ? <AmbientVideo sources={sources} className={styles.video} /> : null}
        <div className={styles.overlay}>
          <ScrollReveal compact>
            <div className={styles.copy}>
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.logo} src={logo} alt="" aria-hidden="true" />
              ) : null}
              <TextSlot
                value={data.title}
                jsonPath={fieldPath(instanceId, "title")}
                as="p"
                className={styles.label}
              />
              <TextSlot
                value={data.intro}
                jsonPath={fieldPath(instanceId, "intro")}
                as="p"
                className={styles.lead}
              />
              {href ? (
                <a className={styles.button} href={href}>
                  <TextSlot
                    value={data.ctaLabel}
                    jsonPath={fieldPath(instanceId, "ctaLabel")}
                    as="span"
                  />
                </a>
              ) : (
                <TextSlot
                  value={data.ctaLabel}
                  jsonPath={fieldPath(instanceId, "ctaLabel")}
                  as="p"
                  className={styles.button}
                />
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
