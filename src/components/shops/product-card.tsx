import Link from "next/link";
import { MediaSlot } from "@/components/shared/media";
import { TextSlot } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import type { BrochureShopItem } from "@/types/brochure";
import styles from "./product-card.module.scss";

type ProductCardProps = {
  item: BrochureShopItem;
  instanceId: string;
  index: number;
  anchorId?: string;
  /** Piece page. Both the rail and the shop grid use this. */
  href?: string;
};

export function ProductCard({
  item,
  instanceId,
  index,
  anchorId,
  href,
}: ProductCardProps) {
  const brand = item.brand.trim();
  const category = item.category.trim();
  const title = item.title.trim();
  const price = item.price.trim();
  const kicker = category || brand;
  const kickerPath = category
    ? `items[${index}].category`
    : `items[${index}].brand`;
  const label = [brand, title, price].filter(Boolean).join(", ");
  const alt = item.imageAlt.trim() || title || brand;

  const body = (
    <>
      <figure className={styles.plate}>
        <MediaSlot
          url={item.imageUrl}
          slotId={`${instanceId}-item-${index + 1}`}
          jsonPath={fieldPath(instanceId, `items[${index}].imageUrl`)}
          alt={alt}
          className={styles.image}
        />
      </figure>
      <div className={styles.meta}>
        <TextSlot
          value={kicker}
          jsonPath={fieldPath(instanceId, kickerPath)}
          as="p"
          className={styles.kicker}
          hideWhenEmpty
        />
        <TextSlot
          value={item.title}
          jsonPath={fieldPath(instanceId, `items[${index}].title`)}
          as="h3"
          className={styles.title}
        />
        <TextSlot
          value={item.price}
          jsonPath={fieldPath(instanceId, `items[${index}].price`)}
          as="p"
          className={styles.price}
        />
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={styles.card} aria-label={label || "Piece"}>
        {body}
      </Link>
    );
  }

  return (
    <article id={anchorId} className={styles.card}>
      {body}
    </article>
  );
}
