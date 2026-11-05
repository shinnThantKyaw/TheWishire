"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/supabase/storage";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_FILE_BYTES,
  MAX_PHOTOS,
  MAX_VIDEOS,
  formatBytes,
} from "@/lib/media-limits";
import type { StepProps } from "../types";

/**
 * Step 3 — Photos & Video (4.6). Uploads go client-side straight to
 * Supabase Storage (bucket wish-media), then register a WishMedia row
 * via the API so /w/[slug] can render them. Limits (5 MB, 10 photos,
 * 1 video) are checked here AND re-checked server-side.
 */
export const MediaStep = ({ wish, refreshWish }: StepProps) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const media = wish.media ?? [];
  const photos = media.filter((m) => m.type === "photo");
  const videos = media.filter((m) => m.type === "video");
  const photosFull = photos.length >= MAX_PHOTOS;
  const videosFull = videos.length >= MAX_VIDEOS;

  const handleFiles = async (files: FileList | null, type: "photo" | "video") => {
    if (!files || files.length === 0) return;
    setError(null);

    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const isAccepted =
        type === "photo"
          ? ACCEPTED_IMAGE_TYPES.includes(file.type)
          : ACCEPTED_VIDEO_TYPES.includes(file.type);

      if (!isAccepted) {
        setError(`Unsupported file type: ${file.name}`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError(`${file.name} is ${formatBytes(file.size)} — max ${formatBytes(MAX_FILE_BYTES)}.`);
        continue;
      }

      setUploading(`${file.name} (${i + 1}/${list.length})`);
      try {
        const { url, path } = await uploadFile(wish.id, file);
        const filename = path.split("/").slice(1).join("/");
        const res = await fetch(`/api/wishes/${wish.id}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            url,
            filename,
            sizeBytes: file.size,
          }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? `Upload failed (${res.status})`);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    setUploading(null);
    refreshWish();
    // Clear inputs so re-selecting the same file re-fires change
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleDelete = async (mediaId: string) => {
    setDeletingId(mediaId);
    setError(null);
    try {
      const res = await fetch(`/api/wishes/${wish.id}/media/${mediaId}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) throw new Error(`Delete failed (${res.status})`);
      refreshWish();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Photos &amp; Video</h2>
        <p className="text-sm text-muted-foreground">
          {photos.length}/{MAX_PHOTOS} photos · {videos.length}/{MAX_VIDEOS} video ·
          max {formatBytes(MAX_FILE_BYTES)} each
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => photoInputRef.current?.click()}
          disabled={Boolean(uploading) || photosFull}
        >
          <ImagePlus className="mr-1.5 h-4 w-4" />
          {photosFull ? "Photo limit reached" : "Add photos"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => videoInputRef.current?.click()}
          disabled={Boolean(uploading) || videosFull}
        >
          <Video className="mr-1.5 h-4 w-4" />
          {videosFull ? "Video added" : "Add video"}
        </Button>
        <input
          ref={photoInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          className="hidden"
          aria-label="Upload photos"
          onChange={(e) => void handleFiles(e.target.files, "photo")}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept={ACCEPTED_VIDEO_TYPES.join(",")}
          className="hidden"
          aria-label="Upload video"
          onChange={(e) => void handleFiles(e.target.files, "video")}
        />
      </div>

      {uploading && (
        <p className="text-sm text-muted-foreground" role="status">
          <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" aria-hidden />
          Uploading {uploading}…
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {media.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No media yet — the gallery chapter shows these photos (and an
          optional video).
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg border bg-muted"
            >
              {item.type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.filename ?? "Uploaded photo"}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <Video className="h-6 w-6" aria-hidden />
                  <span className="px-2 text-center text-xs">Video</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => void handleDelete(item.id)}
                disabled={deletingId === item.id}
                aria-label={`Delete ${item.filename ?? item.type}`}
                className="absolute right-1.5 top-1.5 rounded-md bg-black/60 p-1.5 text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
              >
                {deletingId === item.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
