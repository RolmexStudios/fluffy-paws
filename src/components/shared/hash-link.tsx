"use client";

import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { scrollToInPageHash } from "@/components/shared/smooth-scroll";

type HashLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: ReactNode;
};

export function HashLink({ href, onClick, children, ...rest }: HashLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (scrollToInPageHash(href)) {
      event.preventDefault();
    }
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

type SmoothScrollScopeProps = ComponentPropsWithoutRef<"div">;

/** Smooth-scroll for any same-page `#` link inside this subtree. */
export function SmoothScrollScope({
  onClick,
  children,
  ...rest
}: SmoothScrollScopeProps) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const anchor = (event.target as Element | null)?.closest?.("a[href]");
    if (!anchor || !(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    const href = anchor.getAttribute("href");
    if (!href) {
      return;
    }

    if (scrollToInPageHash(href)) {
      event.preventDefault();
    }
  }

  return (
    <div onClick={handleClick} {...rest}>
      {children}
    </div>
  );
}

export const BrochureHashLink = HashLink;
export const BrochureSmoothScrollScope = SmoothScrollScope;
