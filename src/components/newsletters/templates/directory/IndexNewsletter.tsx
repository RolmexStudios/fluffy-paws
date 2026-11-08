"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterSelect } from "@/components/shared/filter-select";
import { TextSlot } from "@/components/shared/text-slot";
import { SectionHeading } from "@/components/shared/section-heading";
import { MediaSlot } from "@/components/shared/media";
import { fieldPath } from "@/components/shared/field-path";
import { emptyNewsletterBlueprint } from "@/components/newsletters/blueprint";
import {
  letterHref,
  letterMonth,
  letterSlug,
  letterYear,
  monthLabel,
} from "@/components/newsletters/data";
import type {
  BrochureBlockProps,
  BrochureNewsletterContent,
} from "@/types/brochure";
import styles from "./directory.module.scss";

const ALL = "all";

type FilterState = {
  year: string;
  month: string;
};

const EMPTY_FILTERS: FilterState = {
  year: ALL,
  month: ALL,
};

export function IndexNewsletter({
  instanceId = "BrochureNewsletter_1",
  data = emptyNewsletterBlueprint(),
}: BrochureBlockProps<BrochureNewsletterContent>) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const indexed = useMemo(
    () =>
      data.posts
        .map((post, index) => ({ post, index }))
        .filter(({ post }) => Boolean(letterSlug(post))),
    [data.posts],
  );

  const years = useMemo(() => {
    const values = indexed
      .map(({ post }) => letterYear(post))
      .filter(Boolean);
    return Array.from(new Set(values)).sort((a, b) => b.localeCompare(a));
  }, [indexed]);

  const months = useMemo(() => {
    const values = indexed
      .filter(
        ({ post }) =>
          filters.year === ALL || letterYear(post) === filters.year,
      )
      .map(({ post }) => letterMonth(post))
      .filter(Boolean);
    return Array.from(new Set(values)).sort(
      (a, b) => Number(a) - Number(b),
    );
  }, [indexed, filters.year]);

  const filtered = useMemo(
    () =>
      indexed.filter(({ post }) => {
        if (filters.year !== ALL && letterYear(post) !== filters.year) {
          return false;
        }
        if (filters.month !== ALL && letterMonth(post) !== filters.month) {
          return false;
        }
        return true;
      }),
    [indexed, filters],
  );

  const hasActiveFilters = filters.year !== ALL || filters.month !== ALL;
  const countLabel =
    filtered.length === indexed.length
      ? `${indexed.length} letter${indexed.length === 1 ? "" : "s"}`
      : `${filtered.length} of ${indexed.length}`;

  function updateYear(value: string) {
    setFilters((current) => {
      const nextMonths = indexed
        .filter(
          ({ post }) => value === ALL || letterYear(post) === value,
        )
        .map(({ post }) => letterMonth(post))
        .filter(Boolean);
      const monthStillValid =
        current.month === ALL || nextMonths.includes(current.month);
      return {
        year: value,
        month: monthStillValid ? current.month : ALL,
      };
    });
  }

  return (
    <section id={instanceId} className={styles.section} aria-label="Letters">
      <div className={styles.inner}>
        <aside className={styles.filters} aria-label="Filter the letters">
          <div className={styles.filtersInner}>
            <p className={styles.filtersEyebrow}>Refine</p>
            <p className={styles.count} aria-live="polite">
              {countLabel}
            </p>

            <FilterSelect
              id={`${instanceId}-year`}
              label="Year"
              value={filters.year}
              options={years}
              onChange={updateYear}
            />
            <FilterSelect
              id={`${instanceId}-month`}
              label="Month"
              value={filters.month}
              options={months}
              labelFor={monthLabel}
              onChange={(value) =>
                setFilters((current) => ({ ...current, month: value }))
              }
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
          <header className={styles.header}>
            <SectionHeading
              instanceId={instanceId}
              eyebrow={data.eyebrow}
              title={data.title}
              titleAs="h1"
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
            <ol className={styles.list}>
              {filtered.map(({ post, index }) => {
                const slug = letterSlug(post);
                return (
                  <li key={slug || `${instanceId}-${index}`}>
                    <Link href={letterHref(post)} className={styles.row}>
                      <div className={styles.thumb}>
                        <MediaSlot
                          url={post.heroImageUrl}
                          slotId={`${instanceId}_${slug}_hero`}
                          jsonPath={fieldPath(
                            instanceId,
                            `posts[${index}].heroImageUrl`,
                          )}
                          alt={post.heroImageAlt.trim() || post.title}
                          className={styles.thumbImage}
                        />
                      </div>
                      <div className={styles.copy}>
                        <TextSlot
                          value={post.date}
                          jsonPath={fieldPath(instanceId, `posts[${index}].date`)}
                          as="p"
                          className={styles.date}
                        />
                        <TextSlot
                          value={post.title}
                          jsonPath={fieldPath(instanceId, `posts[${index}].title`)}
                          as="h2"
                          className={styles.rowTitle}
                        />
                        <TextSlot
                          value={post.excerpt}
                          jsonPath={fieldPath(
                            instanceId,
                            `posts[${index}].excerpt`,
                          )}
                          as="p"
                          className={styles.excerpt}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className={styles.empty} role="status">
              <p className={styles.emptyTitle}>No letters in that period.</p>
              <p className={styles.emptyBody}>
                Try another year or month, or reset to see every letter.
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
