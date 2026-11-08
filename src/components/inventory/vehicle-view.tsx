"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ImageLightbox, type LightboxImage } from "@/components/shared/image-lightbox";
import { MediaSlot } from "@/components/shared/media";
import { sendBrochureInquiry, whatsappHref } from "@/components/shared/form-submit";
import { ShowroomChrome } from "@/components/inventory/page-chrome";
import {
  INVENTORY_INSTANCE_ID,
  VEHICLE_STATUS_LABELS,
  showroomHref,
  vehicleSlug,
  vehicleTitle,
} from "@/components/inventory/data";
import type { BrochureVehicle } from "@/types/brochure";
import styles from "./vehicle-view.module.scss";

type MosaicRow =
  | { kind: "pair"; items: LightboxImage[] }
  | { kind: "full"; item: LightboxImage };

function mosaicRows(images: LightboxImage[]): MosaicRow[] {
  const rows: MosaicRow[] = [];
  let index = 0;
  let pairTurn = true;
  while (index < images.length) {
    const remaining = images.length - index;
    if (pairTurn && remaining >= 2) {
      rows.push({ kind: "pair", items: [images[index], images[index + 1]] });
      index += 2;
    } else {
      rows.push({ kind: "full", item: images[index] });
      index += 1;
    }
    pairTurn = !pairTurn;
  }
  return rows;
}

type VehicleViewProps = {
  vehicle: BrochureVehicle;
  businessName: string;
  logoUrl?: string;
  inquiryEmail: string;
  whatsapp: string;
};

type SubmitState = "idle" | "sending" | "sent" | "error";

export function VehicleView({
  vehicle,
  businessName,
  logoUrl,
  inquiryEmail,
  whatsapp,
}: VehicleViewProps) {
  const title = vehicleTitle(vehicle) || "Motorcar";
  const slug = vehicleSlug(vehicle);
  const sold = vehicle.status === "sold";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lead = useMemo<LightboxImage>(
    () => ({
      url: vehicle.imageUrl,
      alt: vehicle.imageAlt.trim() || title,
      slotId: `${INVENTORY_INSTANCE_ID}_${slug}_hero`,
      jsonPath: `${INVENTORY_INSTANCE_ID}.vehicles[].imageUrl`,
    }),
    [slug, title, vehicle.imageAlt, vehicle.imageUrl],
  );

  const gallery = useMemo<LightboxImage[]>(
    () =>
      vehicle.galleryImageUrls
        .map((url, index) => ({
          url,
          alt: `${title} — ${index + 1}`,
          slotId: `${INVENTORY_INSTANCE_ID}_${slug}_gallery_${index + 1}`,
          jsonPath: `${INVENTORY_INSTANCE_ID}.vehicles[].galleryImageUrls[${index}]`,
        }))
        .filter((image) => image.url.trim()),
    [slug, title, vehicle.galleryImageUrls],
  );

  const lightboxImages = useMemo<LightboxImage[]>(() => {
    const seen = new Set<string>();
    const next: LightboxImage[] = [];
    for (const image of [lead, ...gallery]) {
      const url = image.url.trim();
      if (!url || seen.has(url)) continue;
      seen.add(url);
      next.push(image);
    }
    return next;
  }, [gallery, lead]);

  const rows = useMemo(() => mosaicRows(gallery), [gallery]);

  function openLightbox(url: string) {
    const match = lightboxImages.findIndex((image) => image.url === url);
    setLightboxIndex(match >= 0 ? match : 0);
  }

  const specs: { label: string; value: string; mono?: boolean }[] = [
    { label: "Year", value: vehicle.year },
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Chassis", value: vehicle.chassis, mono: true },
    { label: "Transmission", value: vehicle.transmission },
    { label: vehicle.metricLabel.trim() || "Figure", value: vehicle.metricValue },
    {
      label: "Status",
      value: VEHICLE_STATUS_LABELS[vehicle.status] ?? vehicle.status,
    },
    { label: "Price", value: sold ? "" : vehicle.price },
  ].filter((spec) => spec.value.trim());

  const wa = whatsappHref(
    whatsapp,
    `Hello — I would like to enquire about the ${title}.`,
  );

  return (
    <ShowroomChrome
      businessName={businessName}
      logoUrl={logoUrl}
      statusBanner={sold ? "Sold" : undefined}
    >
      <article className={styles.article}>
        <button
          type="button"
          className={styles.cover}
          onClick={() => openLightbox(lead.url)}
          aria-label={`View photographs of ${title}`}
        >
          <MediaSlot
            url={lead.url}
            slotId={lead.slotId}
            jsonPath={lead.jsonPath}
            alt={lead.alt}
            className={styles.coverImage}
          />
          {sold ? <span className={styles.coverStamp}>Sold</span> : null}
        </button>

        <div className={styles.inner}>
          <Link href={showroomHref()} className={styles.back}>
            <ArrowLeft className={styles.backIcon} aria-hidden />
            The showroom
          </Link>

          <div className={styles.layout}>
            <div className={styles.main}>
              <header className={styles.heading}>
                <p className={styles.year}>{vehicle.year}</p>
                <h1 className={styles.title}>
                  {vehicle.make ? (
                    <span className={styles.make}>{vehicle.make}</span>
                  ) : null}
                  {vehicle.model}
                </h1>
                {vehicle.status ? (
                  <span className={styles.status} data-status={vehicle.status}>
                    {VEHICLE_STATUS_LABELS[vehicle.status] ?? vehicle.status}
                  </span>
                ) : null}
                {vehicle.placedNote.trim() ? (
                  <p className={styles.placedNote}>{vehicle.placedNote}</p>
                ) : null}
              </header>

              {vehicle.description.trim() ? (
                <div className={styles.description}>
                  {vehicle.description
                    .split(/\n\s*\n/)
                    .map((paragraph) => paragraph.trim())
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
              ) : null}

              {specs.length > 0 ? (
                <section className={styles.specBlock} aria-label="Specification">
                  <h2 className={styles.sectionLabel}>Specification</h2>
                  <dl className={styles.specTable}>
                    {specs.map((spec) => (
                      <div key={spec.label} className={styles.specRow}>
                        <dt>{spec.label}</dt>
                        <dd className={spec.mono ? styles.mono : undefined}>
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              {vehicle.provenance.length > 0 ? (
                <section className={styles.provBlock} aria-label="Provenance">
                  <h2 className={styles.sectionLabel}>Provenance</h2>
                  <ol className={styles.timeline}>
                    {vehicle.provenance.map((entry, index) => (
                      <li key={`${entry.year}-${index}`} className={styles.timelineItem}>
                        <span className={styles.timelineYear}>{entry.year}</span>
                        <span className={styles.timelineLabel}>{entry.label}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
            </div>

            <aside className={styles.inquiryCol} id="inquire">
              <InquiryCard
                vehicleTitle={title}
                inquiryEmail={inquiryEmail}
                whatsappLink={wa}
                businessName={businessName}
                sold={sold}
              />
            </aside>
          </div>
        </div>

        {rows.length > 0 ? (
          <section className={styles.mosaic} aria-label={`${title} photographs`}>
            {rows.map((row, rowIndex) =>
              row.kind === "pair" ? (
                <div key={`pair-${rowIndex}`} className={styles.mosaicPair}>
                  {row.items.map((image) => (
                    <button
                      key={image.slotId}
                      type="button"
                      className={styles.plate}
                      onClick={() => openLightbox(image.url)}
                      aria-label={image.alt}
                    >
                      <MediaSlot
                        url={image.url}
                        slotId={image.slotId}
                        jsonPath={image.jsonPath}
                        alt={image.alt}
                        className={styles.plateImage}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  key={row.item.slotId}
                  type="button"
                  className={`${styles.plate} ${styles.plateFull}`}
                  onClick={() => openLightbox(row.item.url)}
                  aria-label={row.item.alt}
                >
                  <MediaSlot
                    url={row.item.url}
                    slotId={row.item.slotId}
                    jsonPath={row.item.jsonPath}
                    alt={row.item.alt}
                    className={styles.plateImage}
                  />
                </button>
              ),
            )}
          </section>
        ) : null}
      </article>

      {lightboxIndex != null && lightboxImages.length > 0 ? (
        <ImageLightbox
          images={lightboxImages}
          index={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      ) : null}

      <a href="#inquire" className={styles.floating}>
        <MessageCircle className={styles.floatingIcon} aria-hidden />
        Private inquiry
      </a>
    </ShowroomChrome>
  );
}

type InquiryCardProps = {
  vehicleTitle: string;
  inquiryEmail: string;
  whatsappLink?: string;
  businessName: string;
  sold?: boolean;
};

function InquiryCard({
  vehicleTitle,
  inquiryEmail,
  whatsappLink,
  businessName,
  sold = false,
}: InquiryCardProps) {
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: if a bot filled the hidden field, feign success.
    if ((data.get("company") as string)?.trim()) {
      setState("sent");
      form.reset();
      return;
    }

    const name = (data.get("name") as string)?.trim() ?? "";
    const email = (data.get("email") as string)?.trim() ?? "";
    const message = (data.get("message") as string)?.trim() ?? "";

    setState("sending");
    try {
      await sendBrochureInquiry(
        inquiryEmail,
        {
          Name: name,
          Email: email,
          Motorcar: vehicleTitle,
          Message: message || "(no message)",
        },
        {
          subject: `${businessName.trim() || "Private"} — inquiry: ${vehicleTitle}`,
          replyTo: email,
        },
      );
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.inquiry}>
        <h2 className={styles.inquiryTitle}>Thank you</h2>
        <p className={styles.inquiryNote} role="status">
          Your note about the {vehicleTitle} is with us. We reply to every
          serious inquiry personally, usually within a day.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.inquiry}>
      <h2 className={styles.inquiryTitle}>
        {sold ? "This motorcar is sold" : "Private inquiry"}
      </h2>
      <p className={styles.inquiryNote}>
        {sold
          ? `The ${vehicleTitle} has been placed. Write if you would like us to look for a similar example.`
          : `Arrange a viewing or request the full history file for the ${vehicleTitle}.`}
      </p>

      {whatsappLink ? (
        <a
          href={whatsappLink}
          className={styles.whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className={styles.whatsappIcon} aria-hidden />
          Message on WhatsApp
        </a>
      ) : null}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.honeypot} aria-hidden>
          <label htmlFor="vehicle-company">Company</label>
          <input id="vehicle-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Name</span>
          <input name="name" type="text" required autoComplete="name" className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <input name="email" type="email" required autoComplete="email" className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Message</span>
          <textarea
            name="message"
            rows={3}
            className={styles.input}
            defaultValue={
              sold
                ? `I am looking for a motorcar similar to the ${vehicleTitle}.`
                : `I would like to arrange a viewing of the ${vehicleTitle}.`
            }
          />
        </label>

        {state === "error" ? (
          <p className={styles.error} role="alert">
            That did not send. Try again, or reach us on WhatsApp.
          </p>
        ) : null}

        <button type="submit" className={styles.submit} disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send inquiry"}
        </button>
      </form>
    </div>
  );
}
