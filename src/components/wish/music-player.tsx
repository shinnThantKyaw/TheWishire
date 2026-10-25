"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

import { copy } from "@/config/copy";

interface MusicPlayerProps {
  src: string;
  /** Start playing only after this becomes true (e.g. after intro phase). */
  startPlaying?: boolean;
  /** Shift button up when bottom navigation bar is visible. */
  hasBottomNav?: boolean;
}

/**
 * MusicPlayer — background audio with a floating toggle button.
 *
 * Waits for `startPlaying` to be true before attempting playback.
 * Loops continuously. Small toggle in bottom-right corner.
 */
export const MusicPlayer = ({
  src,
  startPlaying = true,
  hasBottomNav = false,
}: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasStartedRef = useRef(false);

  // Start playback when startPlaying becomes true
  useEffect(() => {
    if (!startPlaying || hasStartedRef.current) return;

    const audio = audioRef.current;
    if (!audio) return;

    // Small delay to let the phase transition complete
    const timer = setTimeout(() => {
      audio.volume = 0.4;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          hasStartedRef.current = true;
        })
        .catch(() => {
          // Autoplay blocked — try on next interaction
          const tryPlay = () => {
            if (hasStartedRef.current) return;
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
                hasStartedRef.current = true;
              })
              .catch(() => {});
          };
          document.addEventListener("click", tryPlay, { once: true });
          document.addEventListener("touchstart", tryPlay, { once: true });
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [startPlaying]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying]);

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />

      <AnimatePresence>
        {startPlaying && hasStartedRef.current && (
          <motion.button
            onClick={toggle}
            className={`fixed right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg backdrop-blur-sm ${hasBottomNav ? "bottom-20" : "bottom-6"}`}
            style={{
              backgroundColor: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(233,30,99,0.2)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isPlaying ? copy.music.mute : copy.music.play}
          >
            {isPlaying ? (
              <motion.span
                className="text-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎵
              </motion.span>
            ) : (
              <span className="text-xl opacity-50">🔇</span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
