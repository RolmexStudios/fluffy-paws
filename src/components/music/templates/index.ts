import type { ComponentType } from "react";
import type { BrochureMusicTrack } from "@/types/brochure";
import { BarMusic } from "@/components/music/templates/bar/BarMusic";

export type MusicTemplateProps = {
  label: string;
  tracks: BrochureMusicTrack[];
};

export const musicTemplates: Record<"bar", ComponentType<MusicTemplateProps>> = {
  bar: BarMusic,
};
