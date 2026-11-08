"use client";

import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { telHref } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyContactBlueprint } from "@/components/contacts/blueprint";
import type {
  BrochureBlockProps,
  BrochureContactContent,
} from "@/types/brochure";
import styles from "./form.module.scss";

export function FormContact({
  instanceId = "BrochureContact_1",
  data = emptyContactBlueprint(),
}: BrochureBlockProps<BrochureContactContent>) {
  const call = telHref(data.phone);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id={instanceId} className={styles.section}>
      <div className={styles.inner}>
        <TextSlot
          value={data.title}
          jsonPath={fieldPath(instanceId, "title")}
          as="h2"
          className={styles.title}
        />
        <TextSlot
          value={data.intro}
          jsonPath={fieldPath(instanceId, "intro")}
          as="p"
          className={styles.intro}
        />

        <div className={styles.grid}>
          <div className={styles.meta}>
            {call ? (
              <a
                href={call}
                className="flex items-start gap-3 text-[#1c1916] transition hover:text-[#c45c3e]"
              >
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#c45c3e]" />
                <div>
                  <p className="text-sm font-medium text-[#5c5348]">Phone</p>
                  <p className="text-lg font-semibold">{data.phone}</p>
                </div>
              </a>
            ) : (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#c45c3e]" />
                <div>
                  <p className="text-sm font-medium text-[#5c5348]">Phone</p>
                  <TextSlot
                    value={data.phone}
                    jsonPath={fieldPath(instanceId, "phone")}
                    as="p"
                    className="text-lg font-semibold"
                  />
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#c45c3e]" />
              <div>
                <p className="text-sm font-medium text-[#5c5348]">Service area</p>
                <TextSlot
                  value={data.serviceArea}
                  jsonPath={fieldPath(instanceId, "serviceArea")}
                  as="p"
                  className="leading-7 text-[#1c1916]"
                />
                <TextSlot
                  value={data.hours}
                  jsonPath={fieldPath(instanceId, "hours")}
                  as="p"
                  className="mt-2 text-sm text-[#5c5348]"
                />
              </div>
            </div>
          </div>

          {submitted ? (
            <div
              className="rounded-2xl border border-[#e8e2d9] bg-[#faf8f5] p-8 text-center"
              role="status"
            >
              <p className="font-medium text-[#1c1916]">Thanks for reaching out.</p>
              <p className="mt-2 text-sm text-[#5c5348]">
                This demo form does not send messages—we&apos;ll wire that up later.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label
                  htmlFor={`${instanceId}-name`}
                  className="text-sm font-medium text-[#1c1916]"
                >
                  Name
                </label>
                <input
                  id={`${instanceId}-name`}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={styles.input}
                />
              </div>
              <div>
                <label
                  htmlFor={`${instanceId}-email`}
                  className="text-sm font-medium text-[#1c1916]"
                >
                  Email
                </label>
                <input
                  id={`${instanceId}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={styles.input}
                />
              </div>
              <div>
                <label
                  htmlFor={`${instanceId}-message`}
                  className="text-sm font-medium text-[#1c1916]"
                >
                  Message
                </label>
                <textarea
                  id={`${instanceId}-message`}
                  name="message"
                  required
                  rows={4}
                  className={styles.input}
                />
              </div>
              <button type="submit" className={styles.submit}>
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
