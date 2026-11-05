"use client";

import { useEffect, useState } from "react";
import { Music, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { extractYouTubeId, youTubeThumbnail } from "@/lib/youtube";
import type { StepProps } from "../types";

/**
 * Step 4 — Song (4.7): YouTube URL with live validation + thumbnail
 * preview. Invalid non-empty input blocks Next; clearing removes the
 * song chapter.
 */
export const SongStep = ({
  config,
  updateConfig,
  onValidityChange,
}: StepProps) => {
  const song = config.content.song;
  const [url, setUrl] = useState(song?.youtubeUrl ?? "");
  const [touched, setTouched] = useState(false);

  const videoId = extractYouTubeId(url);
  const valid = url.trim() === "" || videoId !== null;

  useEffect(() => {
    onValidityChange(valid);
  }, [valid, onValidityChange]);

  const commit = (value: string) => {
    setUrl(value);
    const id = extractYouTubeId(value);
    updateConfig({
      content: {
        ...config.content,
        song: id ? { ...(song ?? { youtubeUrl: "" }), youtubeUrl: value.trim() } : undefined,
      },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Song</h2>
        <p className="text-sm text-muted-foreground">
          A YouTube video the recipient can play in the song chapter.
          Optional.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="song-url">YouTube URL</Label>
        <div className="flex gap-2">
          <Input
            id="song-url"
            value={url}
            onChange={(e) => commit(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="https://www.youtube.com/watch?v=…"
            aria-invalid={touched && !valid}
            className="flex-1"
          />
          {url && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Remove song"
              onClick={() => {
                commit("");
                setTouched(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {touched && !valid && (
          <p className="text-sm text-destructive" role="alert">
            That doesn&apos;t look like a YouTube link — paste a watch,
            youtu.be, or shorts URL.
          </p>
        )}
      </div>

      {videoId && (
        <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={youTubeThumbnail(videoId)}
            alt="Song video thumbnail"
            className="h-24 w-full rounded-md object-cover sm:w-40"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Music className="h-4 w-4 text-pink-500" aria-hidden />
              Song chapter ready
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {url}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
