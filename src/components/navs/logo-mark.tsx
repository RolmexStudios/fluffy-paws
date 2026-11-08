import { MediaSlot, initials } from "@/components/shared/media";
import { fieldPath } from "@/components/shared/field-path";
import type { BrochureNavContent } from "@/types/brochure";
import styles from "@/components/navs/templates/bar/bar.module.scss";

type NavLogoMarkProps = {
  instanceId: string;
  data: BrochureNavContent;
};

function NavLogoMarkSquare({ instanceId, data }: NavLogoMarkProps) {
  if (data.logoImageUrl.trim()) {
    return (
      <MediaSlot
        url={data.logoImageUrl}
        slotId={instanceId}
        jsonPath={fieldPath(instanceId, "logoImageUrl")}
        alt={data.businessName || "Logo"}
        className={`${styles.mark} object-cover`}
      />
    );
  }

  const mark = data.logoMark.trim();
  if (mark) {
    return (
      <span className={styles.mark} title={mark}>
        <span className="max-w-[2.25rem] truncate px-0.5 text-center leading-none">
          {mark}
        </span>
      </span>
    );
  }

  const fallback = initials(data.businessName);
  if (fallback !== "•") {
    return <span className={styles.mark}>{fallback}</span>;
  }

  return (
    <span
      className={`${styles.mark} ${styles.markEmpty}`}
      title={fieldPath(instanceId, "logoMark")}
    >
      {fieldPath(instanceId, "logoMark")}
    </span>
  );
}

function NavLogoMarkHorizontal({ instanceId, data }: NavLogoMarkProps) {
  if (data.logoImageUrl.trim()) {
    return (
      <MediaSlot
        url={data.logoImageUrl}
        slotId={instanceId}
        jsonPath={fieldPath(instanceId, "logoImageUrl")}
        alt={data.businessName || "Logo"}
        className={`${styles.markHorizontal} object-contain object-left`}
      />
    );
  }

  return <NavLogoMarkSquare instanceId={instanceId} data={data} />;
}

function useHorizontalLogoMark(data: BrochureNavContent): boolean {
  if (data.logoLayout === "horizontal") {
    return true;
  }
  // Logo-only + image: full aspect ratio, not the square tile.
  return (
    data.brandDisplay === "logo-only" && data.logoImageUrl.trim().length > 0
  );
}

export function NavLogoMark({ instanceId, data }: NavLogoMarkProps) {
  if (useHorizontalLogoMark(data)) {
    return <NavLogoMarkHorizontal instanceId={instanceId} data={data} />;
  }
  return <NavLogoMarkSquare instanceId={instanceId} data={data} />;
}
