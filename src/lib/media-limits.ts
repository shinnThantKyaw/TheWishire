/**
 * Upload limits shared by the media step UI and the media API
 * (safeguard 3 — abuse controls). Enforced on both sides.
 */
export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB per file
export const MAX_PHOTOS = 10;
export const MAX_VIDEOS = 1;
export const MAX_MEDIA_PER_WISH = MAX_PHOTOS + MAX_VIDEOS;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const formatBytes = (bytes: number): string =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
