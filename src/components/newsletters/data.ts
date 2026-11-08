import newsletterJson from "./blueprint.json";
import { newsletterBlueprintSchema } from "@/components/newsletters/blueprint";
import type {
  BrochureNewsletterContent,
  BrochureNewsletterPost,
} from "@/types/brochure";

/** Default instance id for the letters block in both demo and produced sites. */
export const NEWSLETTER_INSTANCE_ID = "BrochureNewsletter_1";

export function slugifyLetter(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function letterSlug(post: BrochureNewsletterPost): string {
  return post.slug.trim() || slugifyLetter(post.title);
}

export function newsletterHref(): string {
  return "/newsletter";
}

export function letterHref(post: BrochureNewsletterPost): string {
  return `/newsletter/${letterSlug(post)}`;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Calendar year for filters — explicit field, else a year in the display date. */
export function letterYear(post: BrochureNewsletterPost): string {
  const explicit = post.year.trim();
  if (/^\d{4}$/.test(explicit)) {
    return explicit;
  }
  const match = post.date.match(/\b((?:19|20)\d{2})\b/);
  return match?.[1] ?? "";
}

/** Calendar month 1–12 for filters — explicit field, else parsed from the display date. */
export function letterMonth(post: BrochureNewsletterPost): string {
  return normalizeMonth(post.month) || monthFromDisplayDate(post.date);
}

export function monthLabel(month: string): string {
  const index = Number(month) - 1;
  return index >= 0 && index < 12 ? MONTH_NAMES[index] : month;
}

function normalizeMonth(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const numeric = Number(trimmed);
  if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 12) {
    return String(numeric);
  }
  const index = MONTH_NAMES.findIndex(
    (name) => name.toLowerCase() === trimmed.toLowerCase(),
  );
  return index >= 0 ? String(index + 1) : "";
}

function monthFromDisplayDate(date: string): string {
  const lower = date.toLowerCase();
  const named = MONTH_NAMES.findIndex((name) =>
    lower.includes(name.toLowerCase()),
  );
  if (named >= 0) {
    return String(named + 1);
  }
  if (/\bwinter\b/.test(lower)) {
    return "12";
  }
  if (/\bspring\b/.test(lower)) {
    return "3";
  }
  if (/\bsummer\b/.test(lower)) {
    return "6";
  }
  if (/\b(autumn|fall)\b/.test(lower)) {
    return "9";
  }
  return "";
}

type BlueprintLike = Record<string, unknown> | null | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Parse the newsletter slice out of a full blueprint object (produced-site content). */
export function readNewsletterSlice(
  blueprint: BlueprintLike,
  instanceId: string = NEWSLETTER_INSTANCE_ID,
): BrochureNewsletterContent | null {
  if (!isRecord(blueprint)) {
    return null;
  }
  const raw = blueprint[instanceId];
  if (!isRecord(raw)) {
    return null;
  }
  const fields = { ...raw };
  delete fields.component;
  return newsletterBlueprintSchema.parse(fields);
}

export function getNewsletterPosts(
  blueprint: BlueprintLike,
  instanceId: string = NEWSLETTER_INSTANCE_ID,
): BrochureNewsletterPost[] {
  return readNewsletterSlice(blueprint, instanceId)?.posts ?? [];
}

export function getLetterBySlug(
  blueprint: BlueprintLike,
  slug: string,
  instanceId: string = NEWSLETTER_INSTANCE_ID,
): { post: BrochureNewsletterPost; index: number } | undefined {
  const posts = getNewsletterPosts(blueprint, instanceId);
  const index = posts.findIndex((post) => letterSlug(post) === slug);
  if (index === -1) {
    return undefined;
  }
  return { post: posts[index], index };
}

/** Demo convenience: the block's own empty scaffold (no scrape, no content file). */
export function getSampleNewsletter(): BrochureNewsletterContent {
  return newsletterBlueprintSchema.parse(newsletterJson);
}
