"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { HashLink } from "@/components/shared/hash-link";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import { emptyNavBlueprint } from "@/components/navs/blueprint";
import type {
  BrochureBlockProps,
  BrochureNavContent,
  BrochureNavLink,
} from "@/types/brochure";
import styles from "./studio.module.scss";

function StudioLink({ item, className }: { item: BrochureNavLink; className: string }) {
  const pathname = usePathname();
  const href = item.href.trim();
  const hash = href.startsWith("/#")
    ? href.slice(1)
    : href.startsWith("#")
      ? href
      : "";

  if (hash) {
    if (pathname === "/") {
      return (
        <HashLink href={hash} className={className}>
          {item.label}
        </HashLink>
      );
    }
    return (
      <Link href={`/${hash}`} className={className}>
        {item.label}
      </Link>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {item.label}
      </a>
    );
  }

  return (
    <Link href={href || "/"} className={className}>
      {item.label}
    </Link>
  );
}

export function StudioNav({
  instanceId = "BrochureSiteNav_1",
  data = emptyNavBlueprint(),
}: BrochureBlockProps<BrochureNavContent>) {
  const routeLabels = new Set(
    data.routeLinks.map((item) => item.label.trim()).filter(Boolean),
  );
  const hashLinks = data.links.filter(
    (item) => item.label.trim() && item.href.trim() && !routeLabels.has(item.label.trim()),
  );
  const routeLinks = data.routeLinks.filter((item) => item.label.trim() && item.href.trim());
  const links = [...hashLinks, ...routeLinks];
  const name = data.businessName.trim();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <TextSlot
          value={name}
          jsonPath={fieldPath(instanceId, "businessName")}
          as="span"
        />
      </Link>
      <nav className={styles.nav} aria-label="Main">
        {links.map((item) => (
          <StudioLink key={`${item.href}-${item.label}`} item={item} className={styles.link} />
        ))}
      </nav>
    </header>
  );
}

export function StudioChrome({
  nav,
  hashLinks,
  children,
}: {
  nav: BrochureNavContent;
  hashLinks: BrochureNavLink[];
  children: ReactNode;
}) {
  return (
    <>
      <StudioNav instanceId="BrochureSiteNav_1" data={{ ...nav, links: hashLinks }} />
      {children}
    </>
  );
}
