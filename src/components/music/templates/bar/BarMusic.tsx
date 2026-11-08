"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { BrochureMusicTrack } from "@/types/brochure";
import styles from "./bar.module.scss";

type BarMusicProps = {
  label: string;
  tracks: BrochureMusicTrack[];
};

export function BarMusic({ label, tracks }: BarMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const tracksRef = useRef(tracks);
  const indexRef = useRef(0);
  const playingRef = useRef(false);
  const playGen = useRef(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  tracksRef.current = tracks;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brochure-player-offset", "4.75rem");
    return () => {
      root.style.removeProperty("--brochure-player-offset");
    };
  }, []);

  if (tracks.length === 0) {
    return null;
  }

  const current = tracks[Math.min(index, tracks.length - 1)];
  const roomLabel = label.trim() || "In the room";

  function assignSrc(src: string) {
    const audio = audioRef.current;
    if (!audio || audio.dataset.src === src) {
      return audio;
    }
    audio.src = src;
    audio.dataset.src = src;
    return audio;
  }

  function playCurrent() {
    const list = tracksRef.current;
    const track = list[indexRef.current];
    const audio = track ? assignSrc(track.src) : null;
    if (!audio) {
      return;
    }
    const gen = ++playGen.current;
    void audio.play().then(
      () => {
        if (gen !== playGen.current) return;
        playingRef.current = true;
        setPlaying(true);
      },
      () => {
        if (gen !== playGen.current) return;
        playingRef.current = false;
        setPlaying(false);
      },
    );
  }

  function pause() {
    playGen.current += 1;
    audioRef.current?.pause();
    playingRef.current = false;
    setPlaying(false);
  }

  function go(delta: number) {
    const list = tracksRef.current;
    if (list.length === 0) {
      return;
    }
    const next = (indexRef.current + delta + list.length) % list.length;
    indexRef.current = next;
    setIndex(next);
    assignSrc(list[next].src);
    if (playingRef.current) {
      playCurrent();
    }
  }

  function onEnded() {
    if (!playingRef.current) {
      return;
    }
    go(1);
  }

  return (
    <>
      <div className={styles.spacer} aria-hidden />
      <div className={styles.bar} role="region" aria-label={roomLabel}>
        <audio
          ref={audioRef}
          className={styles.audio}
          preload="none"
          onEnded={onEnded}
        />
        <div className={styles.transport}>
          <button
            type="button"
            className={styles.skip}
            onClick={() => go(-1)}
            aria-label="Previous piece"
          >
            <SkipBack className={styles.icon} aria-hidden />
          </button>
          <button
            type="button"
            className={styles.play}
            onClick={playing ? pause : playCurrent}
            aria-label={playing ? "Pause" : "Play"}
            aria-pressed={playing}
          >
            {playing ? (
              <Pause className={styles.icon} aria-hidden />
            ) : (
              <Play className={styles.icon} aria-hidden />
            )}
          </button>
          <button
            type="button"
            className={styles.skip}
            onClick={() => go(1)}
            aria-label="Next piece"
          >
            <SkipForward className={styles.icon} aria-hidden />
          </button>
        </div>
        <div className={styles.meta}>
          <p className={styles.label}>{roomLabel}</p>
          <p className={styles.track}>
            <span className={styles.title}>{current.title.trim() || "Untitled"}</span>
            {current.artist.trim() ? (
              <span className={styles.artist}>{current.artist.trim()}</span>
            ) : null}
          </p>
        </div>
      </div>
    </>
  );
}
