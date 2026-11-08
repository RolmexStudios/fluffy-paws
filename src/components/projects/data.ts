import projectJson from "./blueprint.json";
import { projectBlueprintSchema } from "@/components/projects/blueprint";
import type {
  BrochureProjectClip,
  BrochureProjectContent,
  BrochureProjectMediaShape,
  BrochureProjectRecord,
} from "@/types/brochure";

export const PROJECT_INSTANCE_ID = "BrochureProject_1";

const DARK_BACKGROUNDS = new Set(["#141413", "#1e1e1c"]);

export function projectSlug(project: BrochureProjectRecord): string {
  return project.slug.trim() || project.id.trim();
}

export function isPhotography(project: BrochureProjectRecord): boolean {
  return project.category === "Photography";
}

export function sortProjects(projects: readonly BrochureProjectRecord[]): BrochureProjectRecord[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function themeForBackground(bg: string): "light" | "dark" {
  return DARK_BACKGROUNDS.has(bg.trim().toLowerCase()) ? "dark" : "light";
}

export function projectBackground(project: BrochureProjectRecord): string {
  return project.bg.trim() || "#f4f0e8";
}

export function videoHref(project: BrochureProjectRecord): string {
  return `/video/${projectSlug(project)}`;
}

export function photoHref(project: BrochureProjectRecord): string {
  return `/photography/${projectSlug(project)}`;
}

/** Cover first, then any extra gallery frames. */
export function projectGallery(project: BrochureProjectRecord): string[] {
  return [project.imageSrc, ...project.images].map((item) => item.trim()).filter(Boolean);
}

export function recordIndex(
  projects: readonly BrochureProjectRecord[],
  project: BrochureProjectRecord,
): number {
  const index = projects.findIndex(
    (item) => item.id === project.id && item.slug === project.slug,
  );
  return index >= 0 ? index : 0;
}

type BlueprintLike = Record<string, unknown> | null | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readProjectSlice(
  blueprint: BlueprintLike,
  instanceId: string = PROJECT_INSTANCE_ID,
): BrochureProjectContent | null {
  if (!isRecord(blueprint)) return null;
  const raw = blueprint[instanceId];
  if (!isRecord(raw)) return null;
  const fields = { ...raw };
  delete fields.component;
  return projectBlueprintSchema.parse(fields);
}

export function projectBySlug(
  content: BrochureProjectContent | null,
  slug: string,
  kind: "video" | "photo",
): BrochureProjectRecord | undefined {
  if (!content) return undefined;
  return content.projects.find((project) => {
    if (projectSlug(project) !== slug) return false;
    return kind === "photo" ? isPhotography(project) : !isPhotography(project);
  });
}

export type EssayItem =
  | { type: "text"; text: string; storyIndex: number }
  | { type: "wide"; src: string; mediaIndex: number }
  | {
      type: "float";
      src: string;
      shape: BrochureProjectMediaShape;
      side: "left" | "right";
      mediaIndex: number;
    };

/** Story paragraphs interleaved with clips. An empty story stays empty. */
export function essayItems(project: BrochureProjectRecord): EssayItem[] {
  const paragraphs = project.story;
  if (!paragraphs.some((paragraph) => paragraph.trim())) return [];

  const clips = project.media.filter((clip) => clip.src.trim());
  const items: EssayItem[] = [];
  let floatSide: "left" | "right" = "left";

  const pushMedia = (clip: BrochureProjectClip, mediaIndex: number) => {
    if (clip.shape === "horizontal") {
      items.push({ type: "wide", src: clip.src, mediaIndex });
      return;
    }
    items.push({
      type: "float",
      src: clip.src,
      shape: clip.shape,
      side: floatSide,
      mediaIndex,
    });
    floatSide = floatSide === "left" ? "right" : "left";
  };

  paragraphs.forEach((text, storyIndex) => {
    items.push({ type: "text", text, storyIndex });
    const clip = clips[storyIndex];
    if (clip) pushMedia(clip, storyIndex);
  });
  for (let index = paragraphs.length; index < clips.length; index += 1) {
    const clip = clips[index];
    if (clip) pushMedia(clip, index);
  }
  return items;
}

export function getSampleProjects(): BrochureProjectContent {
  return projectBlueprintSchema.parse(projectJson);
}
