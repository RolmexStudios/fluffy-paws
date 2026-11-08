import { AutoplayVideo } from "@/components/shared/autoplay-video";

function isVideoUrl(url: string) {
  return /\.(mp4|m4v|webm|mov)(\?|#|$)/i.test(url.trim());
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

export function initials(name: string) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "•";
}

export function Photo({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return <div className={className} aria-hidden />;
  }

  return (
    // Scraped and fixture URLs come from arbitrary hosts.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}

export function MediaSlot({
  url,
  slotId,
  jsonPath,
  alt = "",
  className,
  playing,
}: {
  url: string;
  slotId: string;
  jsonPath: string;
  alt?: string;
  className?: string;
  playing?: boolean;
}) {
  const trimmed = (url ?? "").trim();
  if (trimmed) {
    if (isVideoUrl(trimmed)) {
      return (
        <AutoplayVideo
          src={trimmed}
          className={className}
          ariaLabel={alt.trim() || undefined}
          playing={playing}
        />
      );
    }
    return <Photo src={trimmed} alt={alt} className={className} />;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed border-[#c45c3e]/50 bg-[#f0ebe3] text-center ${className ?? ""}`}
      role="img"
      aria-label={`Placeholder ${slotId}`}
    >
      <span className="font-mono text-sm font-semibold text-[#1c1916]">
        {slotId}
      </span>
      <span className="max-w-[90%] truncate font-mono text-[10px] text-[#5c5348]">
        {jsonPath}
      </span>
    </div>
  );
}
