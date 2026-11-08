"use client";

import type { CSSProperties, ReactNode } from "react";
import type { BrochureSectionSize } from "@/types/brochure";
import type { NavSurface } from "@/components/shared/nav-surface";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section } from "@/components/shared/section";

export type BrochureBlockShellProps = {
  children: ReactNode;
  size?: BrochureSectionSize;
  navSurface?: NavSurface;
  className?: string;
  style?: CSSProperties;
  /** Turn off when a transform would trap `position: sticky` or `fixed` inside the block. */
  reveal?: boolean;
};

/** Layout shell every brochure block uses: section size + one-time scroll reveal. */
export function BrochureBlock({
  children,
  size = "auto",
  navSurface,
  className,
  style,
  reveal = true,
}: BrochureBlockShellProps) {
  return (
    <Section
      size={size}
      navSurface={navSurface}
      className={className}
      style={style}
    >
      {reveal ? <ScrollReveal>{children}</ScrollReveal> : children}
    </Section>
  );
}
