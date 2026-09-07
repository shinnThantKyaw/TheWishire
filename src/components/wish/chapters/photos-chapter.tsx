"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PhotosChapterProps {
  photos: { id: string; url: string; type: "photo" }[];
  videoUrl?: string;
  primaryColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 6: Photos & Videos Chapter.
 * Masonry grid with lightbox and video embed.
 */
export const PhotosChapter = ({
  photos,
  videoUrl,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
}: PhotosChapterProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-md">
        {/* Title */}
        <motion.h2
          className="mb-6 text-center text-xl font-bold"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            color: foregroundColor,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Our Memories Together 💕
        </motion.h2>

        {/* Photo grid */}
        {photos.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {photos.map((photo, i) => (
              <motion.button
                key={photo.id}
                onClick={() => setLightboxIndex(i)}
                className="group relative overflow-hidden rounded-xl border-0 bg-transparent p-0"
                style={{
                  aspectRatio: i % 3 === 0 ? "1" : "4/3",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={photo.url}
                  alt={`Memory ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(transparent 60%, ${primaryColor}40)`,
                  }}
                />
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <p
            className="py-8 text-center text-sm"
            style={{ color: foregroundColor, opacity: 0.3 }}
          >
            No photos yet
          </p>
        )}

        {/* Video */}
        {videoUrl && (
          <motion.div
            className="mt-4 overflow-hidden rounded-xl"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative aspect-video">
              <video
                src={videoUrl}
                controls
                className="h-full w-full object-cover"
                preload="metadata"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-white/10 text-xl text-white backdrop-blur-sm"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Nav arrows */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i ?? 0) - 1);
                }}
                className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-white/10 text-xl text-white backdrop-blur-sm"
                aria-label="Previous"
              >
                ←
              </button>
            )}
            {lightboxIndex < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i ?? 0) + 1);
                }}
                className="absolute right-14 z-10 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-white/10 text-xl text-white backdrop-blur-sm"
                aria-label="Next"
              >
                →
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              src={photos[lightboxIndex]?.url}
              alt={`Memory ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
