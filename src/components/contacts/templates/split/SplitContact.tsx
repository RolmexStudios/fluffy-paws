"use client";

import { useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { telHref } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyContactBlueprint } from "@/components/contacts/blueprint";
import type {
  BrochureBlockProps,
  BrochureContactContent,
} from "@/types/brochure";
import styles from "./split.module.scss";

export function SplitContact({
  instanceId = "BrochureContact_1",
  data = emptyContactBlueprint(),
}: BrochureBlockProps<BrochureContactContent>) {
  const call = telHref(data.phone);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.panel}>
          <div className={styles.copy}>
            <SectionHeading
              instanceId={instanceId}
              eyebrow={data.eyebrow}
              title={data.title}
              eyebrowClassName={styles.eyebrow}
              titleClassName={styles.title}
            />
            <TextSlot
              value={data.intro}
              jsonPath={fieldPath(instanceId, "intro")}
              as="p"
              className={styles.intro}
            />

            <ul className={styles.facts}>
              <li className={styles.fact}>
                <span className={styles.factIcon} aria-hidden>
                  <Phone />
                </span>
                <div>
                  <p className={styles.factLabel}>Phone</p>
                  {call ? (
                    <a href={call} className={styles.factValue}>
                      {data.phone}
                    </a>
                  ) : (
                    <TextSlot
                      value={data.phone}
                      jsonPath={fieldPath(instanceId, "phone")}
                      as="p"
                      className={styles.factValue}
                    />
                  )}
                </div>
              </li>
              <li className={styles.fact}>
                <span className={styles.factIcon} aria-hidden>
                  <MapPin />
                </span>
                <div>
                  <p className={styles.factLabel}>Service area</p>
                  <TextSlot
                    value={data.serviceArea}
                    jsonPath={fieldPath(instanceId, "serviceArea")}
                    as="p"
                    className={styles.factValue}
                  />
                </div>
              </li>
              <li className={styles.fact}>
                <span className={styles.factIcon} aria-hidden>
                  <Clock />
                </span>
                <div>
                  <p className={styles.factLabel}>Hours</p>
                  <TextSlot
                    value={data.hours}
                    jsonPath={fieldPath(instanceId, "hours")}
                    as="p"
                    className={styles.factValue}
                  />
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.card}>
            {submitted ? (
              <div className={styles.success} role="status">
                <p className={styles.successTitle}>Thanks — we got it.</p>
                <p className={styles.successBody}>
                  This demo form does not send messages yet. We&apos;ll follow
                  up here once estimates are wired up.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <p className={styles.formLead}>Tell us about the project</p>
                <div className={styles.row}>
                  <label className={styles.field} htmlFor={`${instanceId}-name`}>
                    <span>Name</span>
                    <input
                      id={`${instanceId}-name`}
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                    />
                  </label>
                  <label
                    className={styles.field}
                    htmlFor={`${instanceId}-email`}
                  >
                    <span>Email</span>
                    <input
                      id={`${instanceId}-email`}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </label>
                </div>
                <label className={styles.field} htmlFor={`${instanceId}-phone`}>
                  <span>Phone</span>
                  <input
                    id={`${instanceId}-phone`}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                  />
                </label>
                <label
                  className={styles.field}
                  htmlFor={`${instanceId}-message`}
                >
                  <span>Project details</span>
                  <textarea
                    id={`${instanceId}-message`}
                    name="message"
                    required
                    rows={5}
                  />
                </label>
                <button type="submit" className={styles.submit}>
                  {data.ctaLabel.trim() || "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
