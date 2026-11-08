"use client";

import type { BrochureMusicContent } from "@/types/brochure";
import { musicTemplates } from "@/components/music/templates";

/** Site chrome. Mount once from the root layout, not from the home stack. */
export function MusicPlayer({ data }: { data: BrochureMusicContent }) {
  const tracks = data.tracks.filter((track) => track.src.trim());
  if (tracks.length === 0) {
    return null;
  }
  const Template = musicTemplates[data.variant];
  if (!Template) {
    return null;
  }
  return <Template label={data.label} tracks={tracks} />;
}
