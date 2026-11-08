import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaSlot } from "@/components/shared/media";
import { fieldPath } from "@/components/shared/field-path";
import { vehicleHref, vehicleTitle } from "@/components/inventory/data";
import type { BrochureVehicle } from "@/types/brochure";
import styles from "./vehicle-card.module.scss";

type VehicleCardProps = {
  vehicle: BrochureVehicle;
  instanceId: string;
  index: number;
};

/** Framed print card: plate, year, model, chassis, one figure, price. */
export function VehicleCard({ vehicle, instanceId, index }: VehicleCardProps) {
  const title = vehicleTitle(vehicle) || "Motorcar";
  const alt = vehicle.imageAlt.trim() || title;

  return (
    <Link
      href={vehicleHref(vehicle)}
      className={styles.card}
      aria-label={`${title}${vehicle.price.trim() ? ` — ${vehicle.price}` : ""}`}
    >
      <figure className={styles.plate}>
        <MediaSlot
          url={vehicle.imageUrl}
          slotId={`${instanceId}_${index + 1}`}
          jsonPath={fieldPath(instanceId, `vehicles[${index}].imageUrl`)}
          alt={alt}
          className={styles.image}
        />
      </figure>

      <div className={styles.body}>
        <p className={styles.year}>{vehicle.year}</p>
        <h3 className={styles.model}>
          {vehicle.make ? <span className={styles.make}>{vehicle.make}</span> : null}
          {vehicle.model}
        </h3>

        <dl className={styles.specs}>
          {vehicle.chassis.trim() ? (
            <div className={styles.specRow}>
              <dt>Chassis</dt>
              <dd className={styles.mono}>{vehicle.chassis}</dd>
            </div>
          ) : null}
          {vehicle.metricValue.trim() ? (
            <div className={styles.specRow}>
              <dt>{vehicle.metricLabel.trim() || "Figure"}</dt>
              <dd>{vehicle.metricValue}</dd>
            </div>
          ) : null}
          {vehicle.transmission.trim() ? (
            <div className={styles.specRow}>
              <dt>Gearbox</dt>
              <dd>{vehicle.transmission}</dd>
            </div>
          ) : null}
        </dl>

        <div className={styles.footer}>
          <span className={styles.price}>{vehicle.price.trim() || "On request"}</span>
          <span className={styles.view}>
            View
            <ArrowUpRight className={styles.viewIcon} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
