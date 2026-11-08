import type { ReactNode } from "react";
import Link from "next/link";
import { showroomHref } from "@/components/inventory/data";
import { newsletterHref } from "@/components/newsletters/data";
import styles from "./page-chrome.module.scss";

type ShowroomChromeProps = {
  businessName: string;
  logoUrl?: string;
  statusBanner?: string;
  children: ReactNode;
};

/**
 * Slim editorial chrome for the standalone showroom routes. Cross-route links
 * (not in-page hashes) back to the home composition and the showroom index.
 */
export function ShowroomChrome({
  businessName,
  logoUrl = "",
  statusBanner = "",
  children,
}: ShowroomChromeProps) {
  const name = businessName.trim() || "The Marque";
  const logo = logoUrl.trim();

  return (
    <div className={styles.root}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Link href="/" className={styles.wordmark} aria-label={name}>
            {logo ? (
              <img src={logo} alt="" className={styles.logoImage} />
            ) : (
              name
            )}
          </Link>
          <nav className={styles.links} aria-label="Primary">
            <Link href="/" className={styles.homeLink}>
              Home
            </Link>
            <Link href={showroomHref()}>Showroom</Link>
            <Link href={newsletterHref()}>Letters</Link>
            <Link href="/#BrochureContact_1" className={styles.inquire}>
              Private inquiry
            </Link>
          </nav>
        </div>
        {statusBanner.trim() ? (
          <p className={styles.statusBanner} role="status">
            {statusBanner}
          </p>
        ) : null}
      </header>

      <main id="top" className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.colophon}>{name}</p>
          <Link href="/" className={styles.footerBack}>
            Return home
          </Link>
        </div>
      </footer>
    </div>
  );
}
