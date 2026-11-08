"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { useSmoothHorizontalWheelScroll } from "@/components/shared/smooth-horizontal-wheel";
import { emptyInventoryBlueprint } from "@/components/inventory/blueprint";
import { vehicleHref, vehicleTitle } from "@/components/inventory/data";
import type {
  BrochureBlockProps,
  BrochureInventoryContent,
  BrochureVehicle,
} from "@/types/brochure";
import styles from "./archive.module.scss";

/** Slow editorial drift — about one plate every twelve seconds. */
const MARQUEE_PX_PER_SEC = 26;
const ARROW_PAUSE_MS = 2800;
const LOOP_COPIES = 2;

/**
 * Record of cars already sold. A quiet, horizontally scrolling strip of
 * plates with no prices. Each plate opens that car's showroom page.
 */
export function ArchiveInventory({
  instanceId = "BrochureInventory_2",
  data = emptyInventoryBlueprint(),
}: BrochureBlockProps<BrochureInventoryContent>) {
  const trackRef = useRef<HTMLOListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const pointerRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const setWidthRef = useRef(0);
  const posRef = useRef(0);
  const [overflows, setOverflows] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const vehicles = data.vehicles;
  const count = vehicles.length;
  const looping = overflows && !reduceMotion;
  const copies = looping ? LOOP_COPIES : 1;

  useSmoothHorizontalWheelScroll(trackRef, looping, { mapVertical: false });

  const firstSetMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track || count < 1) {
      return null;
    }
    const items = track.querySelectorAll<HTMLElement>(":scope > li");
    if (items.length < count) {
      return null;
    }
    const first = items[0];
    const last = items[count - 1];
    const contentWidth = last.offsetLeft + last.offsetWidth - first.offsetLeft;
    const styles = getComputedStyle(track);
    const padLeft = parseFloat(styles.paddingLeft) || 0;
    const padRight = parseFloat(styles.paddingRight) || 0;
    const available = track.clientWidth - padLeft - padRight;
    return { contentWidth, available };
  }, [count]);

  const measureOverflow = useCallback(() => {
    const metrics = firstSetMetrics();
    if (!metrics) {
      setOverflows(false);
      return;
    }
    setOverflows(metrics.contentWidth > metrics.available + 1);
  }, [firstSetMetrics]);

  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || count < 1 || !looping) {
      setWidthRef.current = 0;
      return;
    }
    const items = track.querySelectorAll<HTMLElement>(":scope > li");
    if (items.length < count * 2) {
      setWidthRef.current = 0;
      return;
    }
    setWidthRef.current = items[count].offsetLeft - items[0].offsetLeft;
  }, [count, looping]);

  const wrapPosition = useCallback((value: number) => {
    const width = setWidthRef.current;
    if (width <= 0) {
      return value;
    }
    let next = value;
    while (next >= width) {
      next -= width;
    }
    while (next < 0) {
      next += width;
    }
    return next;
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    measureOverflow();
    measureSetWidth();

    if (!overflows) {
      track.scrollLeft = 0;
      posRef.current = 0;
    }

    const onScroll = () => {
      if (pointerRef.current || track.dataset.smoothWheel === "active") {
        posRef.current = wrapPosition(track.scrollLeft);
      }
    };
    const onFrame = () => {
      measureOverflow();
      measureSetWidth();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onFrame);
    const observer = new ResizeObserver(onFrame);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onFrame);
      observer.disconnect();
    };
  }, [measureOverflow, measureSetWidth, overflows, wrapPosition]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !looping) {
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      return;
    }

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const section = sectionRef.current;
      const rect = section?.getBoundingClientRect();
      const inView = Boolean(
        rect && rect.bottom > 80 && rect.top < window.innerHeight - 40,
      );
      const paused =
        pointerRef.current ||
        !inView ||
        document.hidden ||
        now < pauseUntilRef.current ||
        track.dataset.smoothWheel === "active";

      if (!paused) {
        if (setWidthRef.current <= 0) {
          measureSetWidth();
        }
        posRef.current = wrapPosition(
          posRef.current + MARQUEE_PX_PER_SEC * dt,
        );
        track.scrollLeft = posRef.current;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [looping, measureSetWidth, wrapPosition]);

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const card = track.querySelector<HTMLElement>("li");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = setWidthRef.current;

    pauseUntilRef.current = performance.now() + ARROW_PAUSE_MS;

    if (looping && width > 0 && direction < 0 && track.scrollLeft < 8) {
      track.scrollLeft += width;
      posRef.current += width;
    }

    track.scrollBy({
      left: distance * direction,
      behavior: reduce ? "auto" : "smooth",
    });
    posRef.current = wrapPosition(track.scrollLeft + distance * direction);
  }

  return (
    <section
      ref={sectionRef}
      id={instanceId}
      className={styles.section}
      aria-label="Recently sold"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <SectionHeading
            instanceId={instanceId}
            eyebrow={data.eyebrow}
            title={data.title}
            eyebrowClassName={styles.eyebrow}
            titleClassName={styles.title}
          />
          <div className={styles.aside}>
            {data.intro.trim() ? (
              <TextSlot
                value={data.intro}
                jsonPath={fieldPath(instanceId, "intro")}
                as="p"
                className={styles.intro}
              />
            ) : null}
            {overflows ? (
              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.control}
                  onClick={() => step(-1)}
                  aria-label="Previous"
                >
                  <ArrowLeft aria-hidden />
                </button>
                <button
                  type="button"
                  className={styles.control}
                  onClick={() => step(1)}
                  aria-label="Next"
                >
                  <ArrowRight aria-hidden />
                </button>
              </div>
            ) : null}
          </div>
        </header>
      </div>

      <ol
        ref={trackRef}
        className={styles.track}
        data-marquee={looping ? "on" : undefined}
        data-overflow={overflows ? "on" : undefined}
        onPointerEnter={() => {
          pointerRef.current = true;
        }}
        onPointerLeave={() => {
          pointerRef.current = false;
        }}
        onPointerDown={() => {
          pointerRef.current = true;
        }}
        onPointerCancel={() => {
          pointerRef.current = false;
        }}
      >
        {Array.from({ length: copies }, (_, copy) =>
          vehicles.map((vehicle, index) => (
            <ArchivePlate
              key={`${vehicle.id || index}-copy-${copy}`}
              vehicle={vehicle}
              instanceId={instanceId}
              index={index}
              clone={copy > 0}
            />
          )),
        )}
      </ol>
    </section>
  );
}

function ArchivePlate({
  vehicle,
  instanceId,
  index,
  clone,
}: {
  vehicle: BrochureVehicle;
  instanceId: string;
  index: number;
  clone: boolean;
}) {
  const title = vehicleTitle(vehicle) || "Motorcar";
  const href = vehicleHref(vehicle);
  const origin = useRef({ x: 0, y: 0 });
  const dragged = useRef(false);

  return (
    <li className={styles.item} aria-hidden={clone || undefined}>
      <Link
        href={href}
        className={styles.link}
        tabIndex={clone ? -1 : undefined}
        aria-label={clone ? undefined : `${title} — Sold`}
        onPointerDown={(event) => {
          origin.current = { x: event.clientX, y: event.clientY };
          dragged.current = false;
        }}
        onPointerMove={(event) => {
          const dx = event.clientX - origin.current.x;
          const dy = event.clientY - origin.current.y;
          if (dx * dx + dy * dy > 64) {
            dragged.current = true;
          }
        }}
        onClick={(event) => {
          if (dragged.current) {
            event.preventDefault();
          }
        }}
      >
        <figure className={styles.plate}>
          <MediaSlot
            url={vehicle.imageUrl}
            slotId={`${instanceId}_${clone ? "loop_" : ""}${index + 1}`}
            jsonPath={fieldPath(instanceId, `vehicles[${index}].imageUrl`)}
            alt={clone ? "" : vehicle.imageAlt.trim() || title}
            className={styles.image}
          />
          <span className={styles.stamp}>Sold</span>
        </figure>
        <div className={styles.body}>
          <p className={styles.year}>{vehicle.year}</p>
          <h3 className={styles.model}>
            {vehicle.make ? <span className={styles.make}>{vehicle.make}</span> : null}
            {vehicle.model}
          </h3>
          {vehicle.placedNote.trim() ? (
            <p className={styles.note}>{vehicle.placedNote}</p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
