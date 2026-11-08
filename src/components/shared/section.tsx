"use client";

import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  type BrochureSectionLayout,
  type BrochureSectionSize,
} from "@/types/brochure";
import { NAV_SURFACE_DARK, type NavSurface } from "@/components/shared/nav-surface";
import styles from "./section.module.scss";

const NestedSection = createContext(false);

export type SectionProps = {
  children: ReactNode;
  size?: BrochureSectionSize;
  /** `split` is for composing two blocks side by side later. */
  layout?: BrochureSectionLayout;
  /** Marks a dark visual surface so the overlay nav can flip contrast. */
  navSurface?: NavSurface;
  className?: string;
  style?: CSSProperties;
};

export function Section({
  children,
  size = "auto",
  layout = "stack",
  navSurface,
  className,
  style,
}: SectionProps) {
  const nested = useContext(NestedSection);
  if (nested) {
    return children;
  }

  const fill = size !== "auto";

  return (
    <NestedSection.Provider value={true}>
      <div
        className={[styles.root, className].filter(Boolean).join(" ")}
        style={style}
        data-size={size}
        data-layout={layout}
        data-section-size={size}
        data-section-fill={fill ? "true" : undefined}
        data-nav-surface={navSurface === NAV_SURFACE_DARK ? NAV_SURFACE_DARK : undefined}
      >
        <div
          className={[styles.body, layout === "split" ? styles.split : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      </div>
    </NestedSection.Provider>
  );
}
