"use client";

import { ScreenPlaceholder } from "../screens/screen-placeholder";

interface PhotosChapterProps {
  photos: { id: string; url: string; type: "photo" }[];
  videoUrl?: string;
  primaryColor?: string;
}

/**
 * Screen 7: Photos & Videos Chapter.
 * Masonry grid of photos with lightbox and video embed.
 *
 * In Phase 2.4, this will get:
 * - Masonry grid layout
 * - Tap-to-lightbox viewing
 * - Video embed with play button
 * - Staggered entrance animation
 */
export const PhotosChapter = ({
  photos,
  videoUrl,
  primaryColor = "#E91E63",
}: PhotosChapterProps) => {
  return (
    <ScreenPlaceholder
      screenNumber={7}
      name="Photos & Videos"
      subtitle={`${photos.length} moment${photos.length !== 1 ? "s" : ""} captured${videoUrl ? " + video" : ""}`}
      emoji="📷"
      primaryColor={primaryColor}
    />
  );
};
