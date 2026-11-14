"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Music, Pause, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MUSIC_TRACKS, type MusicTrack } from "@/config/music";
import { cn } from "@/lib/utils";

interface MusicPickerProps {
  /** Current musicUrl from the wish config (catalog path or custom URL). */
  value?: string;
  /** Called with the new musicUrl, or undefined when cleared. */
  onChange: (src: string | undefined) => void;
}

/**
 * Background-music picker: click a catalog track to select it, hit the
 * play button to preview before choosing. A collapsed "own link" field
 * covers non-catalog URLs and opens automatically when the stored value
 * isn't in the catalog. One shared Audio instance — only one preview
 * plays at a time and it stops when the step unmounts.
 */
export const MusicPicker = ({ value, onChange }: MusicPickerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const isCustomValue = Boolean(value) && !MUSIC_TRACKS.some((t) => t.src === value);
  const customVisible = showCustom || isCustomValue;

  // Stop any preview when the step unmounts or the component re-renders away.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const togglePreview = (track: MusicTrack) => {
    // Stop whatever is playing — a fresh element per preview keeps the
    // react-hooks/immutability rule happy (no mutating a ref-derived value).
    audioRef.current?.pause();

    if (playingId === track.id) {
      setPlayingId(null);
      return;
    }

    setPreviewError(null);
    const audio = new Audio(track.src);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio
      .play()
      .then(() => setPlayingId(track.id))
      .catch(() => {
        setPreviewError(`Couldn't play "${track.title}" — file missing?`);
        setPlayingId(null);
      });
  };

  return (
    <div className="space-y-2">
      <div
        role="group"
        aria-label="Background music tracks"
        className="overflow-hidden rounded-lg border border-border"
      >
        {MUSIC_TRACKS.map((track) => {
          const selected = value === track.src;
          const playing = playingId === track.id;
          return (
            <div
              key={track.id}
              className="flex items-center gap-1 border-b border-border last:border-b-0"
            >
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(track.src)}
                className={cn(
                  "flex min-h-11 flex-1 items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                  selected
                    ? "bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300"
                    : "hover:bg-muted",
                )}
              >
                <Music className="h-4 w-4 shrink-0 text-pink-500" aria-hidden />
                <span className="min-w-0 flex-1 truncate font-medium">
                  {track.title}
                </span>
                {selected && (
                  <Check className="h-4 w-4 shrink-0 text-pink-600 dark:text-pink-400" aria-hidden />
                )}
              </button>
              <button
                type="button"
                onClick={() => togglePreview(track)}
                aria-label={playing ? `Pause ${track.title} preview` : `Preview ${track.title}`}
                className="mr-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {playing ? (
                  <Pause className="h-4 w-4" aria-hidden />
                ) : (
                  <Play className="h-4 w-4" aria-hidden />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {previewError && (
        <p className="text-sm text-destructive" role="alert">
          {previewError}
        </p>
      )}

      <button
        type="button"
        onClick={() => setShowCustom((v) => !v)}
        aria-expanded={customVisible}
        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", customVisible && "rotate-180")}
          aria-hidden
        />
        Use your own link
      </button>

      {customVisible && (
        <Input
          value={isCustomValue ? value : ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          placeholder="/music/your-track.mp3"
          maxLength={500}
          aria-label="Custom music file URL"
          className="text-sm"
        />
      )}
    </div>
  );
};
