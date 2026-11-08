import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;

export type LocalizedAsset = {
  from: string;
  to: string;
  source: "copy" | "download" | "existing";
};

export type LocalizeSiteAssetsResult = {
  localized: number;
  skipped: number;
  files: LocalizedAsset[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isRemoteImageUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return false;
  }
  try {
    const url = new URL(trimmed);
    return IMAGE_EXT.test(url.pathname);
  } catch {
    return false;
  }
}

export function sanitizeAssetRelPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  return parts
    .map((part, index) => sanitizeSegment(part, index === parts.length - 1))
    .join("/");
}

function sanitizeSegment(segment: string, isFile: boolean): string {
  let decoded = decodeURIComponent(segment);
  decoded = decoded.replace(/^WhatsApp Image\s+/i, "");
  const extMatch = isFile ? decoded.match(IMAGE_EXT) : null;
  const ext = extMatch ? extMatch[0].toLowerCase() : "";
  const stem = extMatch ? decoded.slice(0, -extMatch[0].length) : decoded;
  const slug = stem
    .replace(/[()]/g, " ")
    .replace(/[._]+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  const safe = slug || "image";
  return ext ? `${safe}${ext}` : safe;
}

function collectRemoteImageUrls(value: unknown, found: Set<string>) {
  if (typeof value === "string") {
    if (isRemoteImageUrl(value)) {
      found.add(value.trim());
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectRemoteImageUrls(item, found);
    }
    return;
  }
  if (isRecord(value)) {
    for (const item of Object.values(value)) {
      collectRemoteImageUrls(item, found);
    }
  }
}

function rewriteRemoteImageUrls(
  value: unknown,
  mapping: Map<string, string>,
): unknown {
  if (typeof value === "string") {
    const next = mapping.get(value.trim());
    return next ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => rewriteRemoteImageUrls(item, mapping));
  }
  if (isRecord(value)) {
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      next[key] = rewriteRemoteImageUrls(item, mapping);
    }
    return next;
  }
  return value;
}

function uniqueDestPath(relPath: string, used: Set<string>): string {
  if (!used.has(relPath)) {
    used.add(relPath);
    return relPath;
  }
  const extMatch = relPath.match(IMAGE_EXT);
  const ext = extMatch ? extMatch[0] : "";
  const stem = ext ? relPath.slice(0, -ext.length) : relPath;
  let index = 2;
  let candidate = `${stem}-${index}${ext}`;
  while (used.has(candidate)) {
    index += 1;
    candidate = `${stem}-${index}${ext}`;
  }
  used.add(candidate);
  return candidate;
}

function defaultExtraAssetRoots(siteRoot: string): string[] {
  const roots: string[] = [];
  const fromEnv = process.env.WAAS_ASSET_ROOT?.trim();
  if (fromEnv) {
    roots.push(path.resolve(fromEnv));
  }
  const monorepoAssets = path.resolve(siteRoot, "../../public/assets");
  if (existsSync(monorepoAssets)) {
    roots.push(monorepoAssets);
  }
  return roots;
}

async function readLocalAsset(
  url: URL,
  extraAssetRoots: string[],
): Promise<Buffer | undefined> {
  const decoded = decodeURIComponent(url.pathname).replace(/^\//, "");
  for (const root of extraAssetRoots) {
    const candidate = path.join(root, decoded);
    if (existsSync(candidate)) {
      return readFile(candidate);
    }
  }
  return undefined;
}

async function loadRemoteAsset(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function localizeSiteAssets(options: {
  siteRoot: string;
  extraAssetRoots?: string[];
}): Promise<LocalizeSiteAssetsResult> {
  const siteRoot = path.resolve(options.siteRoot);
  const contentDir = path.join(siteRoot, "content");
  const publicAssets = path.join(siteRoot, "public", "assets");
  const extraAssetRoots = [
    publicAssets,
    ...(options.extraAssetRoots ?? defaultExtraAssetRoots(siteRoot)),
  ];

  if (!existsSync(contentDir)) {
    return { localized: 0, skipped: 0, files: [] };
  }

  const blueprintFiles = (await readdir(contentDir))
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(contentDir, name));

  const documents: Array<{ filePath: string; data: unknown }> = [];
  const remoteUrls = new Set<string>();
  for (const filePath of blueprintFiles) {
    const data = JSON.parse(await readFile(filePath, "utf8")) as unknown;
    documents.push({ filePath, data });
    collectRemoteImageUrls(data, remoteUrls);
  }

  const mapping = new Map<string, string>();
  const usedDest = new Set<string>();
  const files: LocalizedAsset[] = [];
  let skipped = 0;

  for (const remoteUrl of remoteUrls) {
    const url = new URL(remoteUrl);
    const destRel = uniqueDestPath(
      sanitizeAssetRelPath(url.pathname),
      usedDest,
    );
    const publicPath = `/assets/${destRel}`;
    const destFile = path.join(publicAssets, destRel);
    mapping.set(remoteUrl, publicPath);

    if (existsSync(destFile)) {
      files.push({ from: remoteUrl, to: publicPath, source: "existing" });
      skipped += 1;
      continue;
    }

    const copied = await readLocalAsset(url, extraAssetRoots);
    const bytes = copied ?? (await loadRemoteAsset(remoteUrl));
    await mkdir(path.dirname(destFile), { recursive: true });
    await writeFile(destFile, bytes);
    files.push({
      from: remoteUrl,
      to: publicPath,
      source: copied ? "copy" : "download",
    });
  }

  if (mapping.size > 0) {
    for (const doc of documents) {
      const rewritten = rewriteRemoteImageUrls(doc.data, mapping);
      await writeFile(
        doc.filePath,
        `${JSON.stringify(rewritten, null, 2)}\n`,
        "utf8",
      );
    }
  }

  return {
    localized: mapping.size - skipped,
    skipped,
    files,
  };
}
