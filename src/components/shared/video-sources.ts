export interface VideoSource {
  src: string;
  type: string;
}

export function isImagePath(src: string): boolean {
  return /\.(png|jpe?g|webp|gif|svg|avif)(\?|#|$)/i.test(src);
}

/** Extract the 11-char video ID from a common YouTube URL. */
export function youtubeId(url: string | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  );
  return match?.[1];
}

export function videoMimeType(src: string): string {
  const ext = src.split("?")[0]?.split(".").pop()?.toLowerCase();
  if (ext === "webm") return "video/webm";
  if (ext === "mov") return "video/quicktime";
  return "video/mp4";
}

function swapVideoExt(url: string, ext: "mp4" | "m4v" | "mov" | "webm"): string {
  return url.replace(/\.(mov|mp4|m4v|webm)(\?.*)?$/i, `.${ext}$2`);
}

export function normalizeVideoUrl(url: string): string {
  return url.trim().replace(/ /g, "%20");
}

/**
 * Ordered `<source>` entries. A remote `.mov` is offered as `video/mp4` and
 * `video/quicktime` on the same URL — no sibling `.mp4` is invented.
 * Local files may try sibling extensions.
 */
export function videoSources(raw: string): VideoSource[] {
  const resolved = normalizeVideoUrl(raw);
  if (!resolved) return [];
  const ext = resolved.split("?")[0]?.split(".").pop()?.toLowerCase();
  const isRemote = /^https?:\/\//i.test(resolved);
  const out: VideoSource[] = [];
  const add = (src: string, type: string) => {
    if (!out.some((entry) => entry.src === src && entry.type === type)) {
      out.push({ src, type });
    }
  };

  if (ext === "mov") {
    if (isRemote) {
      add(resolved, "video/mp4");
      add(resolved, "video/quicktime");
    } else {
      add(swapVideoExt(resolved, "mp4"), "video/mp4");
      add(swapVideoExt(resolved, "m4v"), "video/mp4");
      add(resolved, "video/quicktime");
    }
  } else if (ext === "m4v" || ext === "mp4") {
    add(resolved, "video/mp4");
  } else if (ext === "webm") {
    add(resolved, "video/webm");
  } else {
    add(resolved, videoMimeType(resolved));
  }

  return out;
}
