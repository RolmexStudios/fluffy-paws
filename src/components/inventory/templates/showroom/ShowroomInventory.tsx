"use client";

import { useMemo, useState } from "react";
import { FilterSelect } from "@/components/shared/filter-select";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { fieldPath } from "@/components/shared/field-path";
import { emptyInventoryBlueprint } from "@/components/inventory/blueprint";
import { VehicleCard } from "@/components/inventory/templates/vehicle-card";
import {
  VEHICLE_STATUS_LABELS,
  isListedVehicle,
} from "@/components/inventory/data";
import type {
  BrochureBlockProps,
  BrochureInventoryContent,
  BrochureVehicleStatus,
} from "@/types/brochure";
import styles from "./showroom.module.scss";

const ALL = "all";

type FilterState = {
  make: string;
  year: string;
  transmission: string;
  status: string;
};

const EMPTY_FILTERS: FilterState = {
  make: ALL,
  year: ALL,
  transmission: ALL,
  status: ALL,
};

function uniqueSorted(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));
}

export function ShowroomInventory({
  instanceId = "BrochureInventory_1",
  data = emptyInventoryBlueprint(),
}: BrochureBlockProps<BrochureInventoryContent>) {
  const vehicles = useMemo(
    () => data.vehicles.filter(isListedVehicle),
    [data.vehicles],
  );
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const makes = useMemo(
    () => uniqueSorted(vehicles.map((vehicle) => vehicle.make)),
    [vehicles],
  );
  const years = useMemo(
    () =>
      uniqueSorted(vehicles.map((vehicle) => vehicle.year)).sort((a, b) =>
        b.localeCompare(a),
      ),
    [vehicles],
  );
  const transmissions = useMemo(
    () => uniqueSorted(vehicles.map((vehicle) => vehicle.transmission)),
    [vehicles],
  );
  const statuses = useMemo(() => {
    const present = new Set(vehicles.map((vehicle) => vehicle.status));
    return (["available", "incoming", "private"] as BrochureVehicleStatus[]).filter(
      (status) => present.has(status),
    );
  }, [vehicles]);

  // Keep the original index so blueprint paths (vehicles[i]) stay correct.
  const indexed = useMemo(
    () =>
      data.vehicles
        .map((vehicle, index) => ({ vehicle, index }))
        .filter(({ vehicle }) => isListedVehicle(vehicle)),
    [data.vehicles],
  );

  const filtered = useMemo(
    () =>
      indexed.filter(({ vehicle }) => {
        if (filters.make !== ALL && vehicle.make.trim() !== filters.make) {
          return false;
        }
        if (filters.year !== ALL && vehicle.year.trim() !== filters.year) {
          return false;
        }
        if (
          filters.transmission !== ALL &&
          vehicle.transmission.trim() !== filters.transmission
        ) {
          return false;
        }
        if (filters.status !== ALL && vehicle.status !== filters.status) {
          return false;
        }
        return true;
      }),
    [indexed, filters],
  );

  const hasActiveFilters =
    filters.make !== ALL ||
    filters.year !== ALL ||
    filters.transmission !== ALL ||
    filters.status !== ALL;

  function update<K extends keyof FilterState>(key: K, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  const countLabel =
    filtered.length === vehicles.length
      ? `${vehicles.length} motorcars`
      : `${filtered.length} of ${vehicles.length}`;

  return (
    <section id={instanceId} className={styles.section} aria-label="Showroom">
      <div className={styles.inner}>
        <aside className={styles.filters} aria-label="Filter the collection">
          <div className={styles.filtersInner}>
            <p className={styles.filtersEyebrow}>Refine</p>
            <p className={styles.count} aria-live="polite">
              {countLabel}
            </p>

            <FilterSelect
              id={`${instanceId}-make`}
              label="Make"
              value={filters.make}
              options={makes}
              onChange={(value) => update("make", value)}
            />
            <FilterSelect
              id={`${instanceId}-year`}
              label="Year"
              value={filters.year}
              options={years}
              onChange={(value) => update("year", value)}
            />
            <FilterSelect
              id={`${instanceId}-transmission`}
              label="Transmission"
              value={filters.transmission}
              options={transmissions}
              onChange={(value) => update("transmission", value)}
            />
            <FilterSelect
              id={`${instanceId}-status`}
              label="Status"
              value={filters.status}
              options={statuses}
              labelFor={(value) =>
                VEHICLE_STATUS_LABELS[value as BrochureVehicleStatus] ?? value
              }
              onChange={(value) => update("status", value)}
            />

            <button
              type="button"
              className={styles.reset}
              onClick={() => setFilters(EMPTY_FILTERS)}
              disabled={!hasActiveFilters}
            >
              Reset filters
            </button>
          </div>
        </aside>

        <div className={styles.results}>
          <header className={styles.resultsHeader}>
            <SectionHeading
              instanceId={instanceId}
              eyebrow={data.eyebrow}
              title={data.title}
              eyebrowClassName={styles.eyebrow}
              titleClassName={styles.title}
            />
            {data.intro.trim() ? (
              <TextSlot
                value={data.intro}
                jsonPath={fieldPath(instanceId, "intro")}
                as="p"
                className={styles.intro}
              />
            ) : null}
          </header>

          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map(({ vehicle, index }) => (
                <VehicleCard
                  key={vehicle.id || `${instanceId}-${index}`}
                  vehicle={vehicle}
                  instanceId={instanceId}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty} role="status">
              <p className={styles.emptyTitle}>Nothing matches that search.</p>
              <p className={styles.emptyBody}>
                Adjust the filters, or reset to see the full register.
              </p>
              <button
                type="button"
                className={styles.emptyReset}
                onClick={() => setFilters(EMPTY_FILTERS)}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
