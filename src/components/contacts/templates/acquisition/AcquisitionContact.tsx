"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { telHref } from "@/components/shared/media";
import { sendBrochureInquiry, whatsappHref } from "@/components/shared/form-submit";
import { emptyContactBlueprint } from "@/components/contacts/blueprint";
import type {
  BrochureBlockProps,
  BrochureContactContent,
} from "@/types/brochure";
import styles from "../concierge/concierge.module.scss";

type SubmitState = "idle" | "sending" | "sent" | "error";

export function AcquisitionContact({
  instanceId = "BrochureContact_1",
  data = emptyContactBlueprint(),
}: BrochureBlockProps<BrochureContactContent>) {
  const [state, setState] = useState<SubmitState>("idle");
  const call = telHref(data.phone);
  const wa = whatsappHref(
    data.whatsapp || data.phone,
    "Hello — I would like to discuss a private acquisition.",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);

    if ((payload.get("company") as string)?.trim()) {
      setState("sent");
      form.reset();
      return;
    }

    const name = (payload.get("name") as string)?.trim() ?? "";
    const email = (payload.get("email") as string)?.trim() ?? "";
    const brief = (payload.get("brief") as string)?.trim() ?? "";
    const budget = (payload.get("budget") as string)?.trim() ?? "";
    const offMarket = payload.get("offMarket") ? "Yes" : "No";

    setState("sending");
    try {
      await sendBrochureInquiry(
        data.email,
        {
          Name: name,
          Email: email,
          "Specific piece requested": brief || "(not specified)",
          "Budget range": budget || "(not specified)",
          "Discreet off-market search": offMarket,
        },
        {
          subject: "Private acquisition — new brief",
          replyTo: email,
        },
      );
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section id={instanceId} className={styles.section} aria-labelledby={`${instanceId}-title`}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <SectionHeading
            instanceId={instanceId}
            eyebrow={data.eyebrow}
            title={data.title}
            titleId={`${instanceId}-title`}
            eyebrowClassName={styles.eyebrow}
            titleClassName={styles.title}
            titleInnerClassName={styles.titleText}
          />
          <TextSlot
            value={data.intro}
            jsonPath={fieldPath(instanceId, "intro")}
            as="p"
            className={styles.lede}
          />

          <dl className={styles.contactMeta}>
            {call || data.phone.trim() ? (
              <div className={styles.metaRow}>
                <dt>Direct line</dt>
                <dd>
                  {call ? (
                    <a href={call} className={styles.metaLink}>
                      {data.phone}
                    </a>
                  ) : (
                    data.phone
                  )}
                </dd>
              </div>
            ) : null}
            {data.hours.trim() ? (
              <div className={styles.metaRow}>
                <dt>By appointment</dt>
                <dd>{data.hours}</dd>
              </div>
            ) : null}
            {data.serviceArea.trim() ? (
              <div className={styles.metaRow}>
                <dt>Showroom</dt>
                <dd>{data.serviceArea}</dd>
              </div>
            ) : null}
            {(data.links ?? [])
              .filter((item) => item.href.trim() && item.label.trim())
              .map((item) => {
                const href = item.href.trim();
                const external = /^https?:\/\//i.test(href);
                const display = href
                  .replace(/^https?:\/\//i, "")
                  .replace(/\/$/, "");
                return (
                  <div className={styles.metaRow} key={href}>
                    <dt>{item.label}</dt>
                    <dd>
                      <a
                        href={href}
                        className={styles.metaLink}
                        {...(external
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {display}
                      </a>
                    </dd>
                  </div>
                );
              })}
          </dl>

          {wa ? (
            <a
              href={wa}
              className={styles.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className={styles.whatsappIcon} aria-hidden />
              A private word on WhatsApp
            </a>
          ) : null}
        </div>

        <div className={styles.formCol}>
          {state === "sent" ? (
            <div className={styles.success} role="status">
              <p className={styles.successTitle}>Your brief is received.</p>
              <p className={styles.successBody}>
                We will be in touch personally to discuss the search. Expect a
                considered reply, not an automated one.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.honeypot} aria-hidden>
                <label htmlFor={`${instanceId}-company`}>Company</label>
                <input
                  id={`${instanceId}-company`}
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Name</span>
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={styles.input}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={styles.input}
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Specific piece requested</span>
                <textarea
                  name="brief"
                  rows={4}
                  required
                  className={styles.input}
                  placeholder="Maison, reference, era, colour, condition…"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Budget range</span>
                <input
                  name="budget"
                  type="text"
                  className={styles.input}
                  placeholder="A range is enough"
                />
              </label>

              <label className={styles.checkbox}>
                <input name="offMarket" type="checkbox" />
                <span>
                  Include a discreet off-market search among pieces not
                  publicly offered.
                </span>
              </label>

              {state === "error" ? (
                <p className={styles.error} role="alert">
                  That did not send. Please try again, or reach us directly.
                </p>
              ) : null}

              <button
                type="submit"
                className={styles.submit}
                disabled={state === "sending"}
              >
                {state === "sending"
                  ? "Sending…"
                  : data.ctaLabel.trim() || "Begin the search"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
