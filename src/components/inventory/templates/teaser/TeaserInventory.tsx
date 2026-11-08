"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyInventoryBlueprint } from "@/components/inventory/blueprint";
import { VehicleCard } from "@/components/inventory/templates/vehicle-card";
import { isListedVehicle, showroomHref } from "@/components/inventory/data";
import type {
  BrochureBlockProps,
  BrochureInventoryContent,
} from "@/types/brochure";
import styles from "./teaser.module.scss";

export function TeaserInventory({
  instanceId = "BrochureInventory_1",
  data = emptyInventoryBlueprint(),
}: BrochureBlockProps<BrochureInventoryContent>) {
  const limit = Math.max(1, data.teaserLimit);
  const preview = data.vehicles
    .map((vehicle, index) => ({ vehicle, index }))
    .filter(({ vehicle }) => isListedVehicle(vehicle))
    .slice(0, limit);
  const viewAll = data.viewAllLabel.trim();

  return (
    <section id={instanceId} className={styles.section} aria-label="Showroom preview">
      <div className={styles.inner}>
        <header className={styles.header}>
          <SectionHeading
            instanceId={instanceId}
            eyebrow={data.eyebrow}
            title={data.title}
            className={styles.heading}
            eyebrowClassName={styles.eyebrow}
            titleClassName={styles.title}
          />
          <div className={styles.asideCol}>
            {data.intro.trim() ? (
              <TextSlot
                value={data.intro}
                jsonPath={fieldPath(instanceId, "intro")}
                as="p"
                className={styles.intro}
              />
            ) : null}
            {viewAll ? (
              <Link href={showroomHref()} className={styles.viewAll}>
                {viewAll}
                <ArrowRight className={styles.viewAllIcon} aria-hidden />
              </Link>
            ) : null}
          </div>
        </header>

        <div className={styles.grid}>
          {preview.map(({ vehicle, index }) => (
            <VehicleCard
              key={vehicle.id || `${instanceId}-${index}`}
              vehicle={vehicle}
              instanceId={instanceId}
              index={index}
            />
          ))}
        </div>

        {viewAll ? (
          <Link href={showroomHref()} className={styles.viewAllMobile}>
            {viewAll}
            <ArrowRight className={styles.viewAllIcon} aria-hidden />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
