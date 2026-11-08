"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./filter-select.module.scss";

const OPEN_EVENT = "brochure:filter-select-open";
const ALL_VALUE = "all";

export type FilterSelectProps = {
  id?: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  allValue?: string;
  allLabel?: string;
  labelFor?: (value: string) => string;
};

type Item = {
  value: string;
  label: string;
};

function optionDomId(rootId: string, value: string) {
  return `${rootId}-opt-${value.replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
}

export function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
  allValue = ALL_VALUE,
  allLabel = "All",
  labelFor,
}: FilterSelectProps) {
  const generatedId = useId();
  const rootId = id ?? generatedId;
  const listId = `${rootId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo<Item[]>(() => {
    const seen = new Set<string>();
    const next: Item[] = [{ value: allValue, label: allLabel }];
    seen.add(allValue);
    for (const option of options) {
      if (!option || seen.has(option)) continue;
      seen.add(option);
      next.push({
        value: option,
        label: labelFor ? labelFor(option) : option,
      });
    }
    return next;
  }, [allLabel, allValue, labelFor, options]);

  const selected =
    items.find((item) => item.value === value) ?? items[0] ?? {
      value: allValue,
      label: allLabel,
    };
  const active = items[activeIndex] ?? selected;
  const activeId = optionDomId(rootId, active.value);
  const isFiltered = selected.value !== allValue;

  function close() {
    setOpen(false);
  }

  function openMenu(index = items.findIndex((item) => item.value === selected.value)) {
    setActiveIndex(index < 0 ? 0 : index);
    setOpen(true);
    document.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: rootId }));
  }

  function choose(next: Item) {
    onChange(next.value);
    close();
  }

  function move(delta: number) {
    if (!open) {
      openMenu();
      return;
    }
    setActiveIndex((current) => {
      const last = items.length - 1;
      if (last < 0) return 0;
      return (current + delta + items.length) % items.length;
    });
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    function onForeignOpen(event: Event) {
      if ((event as CustomEvent<string>).detail !== rootId) {
        close();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener(OPEN_EVENT, onForeignOpen);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener(OPEN_EVENT, onForeignOpen);
    };
  }, [open, rootId]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-open={open || undefined}
      data-active={isFiltered || undefined}
    >
      <span id={`${rootId}-label`} className={styles.label}>
        {label}
      </span>
      <button
        type="button"
        id={rootId}
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${rootId}-label ${rootId}`}
        aria-activedescendant={open ? activeId : undefined}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            move(1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            move(-1);
          } else if (event.key === "Home") {
            event.preventDefault();
            if (open) setActiveIndex(0);
            else openMenu(0);
          } else if (event.key === "End") {
            event.preventDefault();
            const last = Math.max(items.length - 1, 0);
            if (open) setActiveIndex(last);
            else openMenu(last);
          } else if (event.key === "Enter" || event.key === " ") {
            if (open) {
              event.preventDefault();
              choose(active);
            }
          }
        }}
      >
        <span className={styles.value}>{selected.label}</span>
        <span className={styles.mark} aria-hidden="true" />
      </button>
      {open ? (
        <ul
          id={listId}
          className={styles.menu}
          role="listbox"
          aria-labelledby={`${rootId}-label`}
        >
          {items.map((item, index) => {
            const selectedItem = item.value === selected.value;
            const activeItem = item.value === active.value;
            return (
              <li
                key={item.value}
                id={optionDomId(rootId, item.value)}
                role="option"
                aria-selected={selectedItem}
                className={styles.option}
                data-active={activeItem || undefined}
                data-selected={selectedItem || undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onPointerDown={(event) => {
                  event.preventDefault();
                  choose(item);
                }}
              >
                <span className={styles.index} aria-hidden="true">
                  {index === 0 ? "—" : String(index).padStart(2, "0")}
                </span>
                <span className={styles.optionLabel}>{item.label}</span>
                <span className={styles.pip} aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
