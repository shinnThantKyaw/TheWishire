"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { SongSelection } from "@/types/wish";

// ── YouTube IFrame API (minimal typings) ──────────────────
interface YTPlayerInstance {
  pauseVideo(): void;
  playVideo(): void;
  destroy(): void;
}
type YTApi = {
  Player: new (
    el: HTMLElement,
    opts: Record<string, unknown>,
  ) => YTPlayerInstance;
};
declare global {
  interface Window {
    YT?: YTApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}
/** YT.PlayerState.PLAYING */
const YT_STATE_PLAYING = 1;

/**
 * Keyframes for the vinyl + equalizer.
 * CSS animation + animation-play-state (not framer-motion) so pausing
 * FREEZES the disc in place — motion's `animate: {}` would tween the
 * rotation backwards to 0, which looks like a spinning-reverse bug.
 * With play-state, resume continues forward from the same angle.
 */
const VINYL_KEYFRAMES = `
  @keyframes song-vinyl-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .song-vinyl-disc {
    animation-name: song-vinyl-spin;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-play-state: paused;
  }
  @keyframes song-eq-bounce {
    0%, 100% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
  }
  .song-eq-bar {
    animation-name: song-eq-bounce;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-play-state: paused;
    transform-origin: bottom center;
  }
`;

interface SongChapterProps {
  song?: SongSelection;
  primaryColor?: string;
  foregroundColor?: string;
}

/**
 * Extracts the 11-char video ID from any common YouTube URL form:
 * watch?v=, youtu.be/, shorts/, embed/, music.youtube.com — or a bare ID.
 */
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/** Slow-spinning vinyl record — decorative depth behind the card. */
const VinylDisc = ({
  size,
  primaryColor,
  spinning,
  durationSeconds = 14,
}: {
  size: number;
  primaryColor: string;
  spinning: boolean;
  /** Seconds per full rotation while spinning. */
  durationSeconds?: number;
}) => (
  <div
    aria-hidden
    className="song-vinyl-disc"
    style={{
      width: size,
      height: size,
      animationDuration: `${durationSeconds}s`,
      animationPlayState: spinning ? "running" : "paused",
    }}
  >
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <circle cx="48" cy="48" r="46" fill="#2A2118" />
      <circle cx="48" cy="48" r="46" stroke={primaryColor} strokeOpacity="0.25" strokeWidth="1.5" />
      {[40, 34, 28].map((r) => (
        <circle key={r} cx="48" cy="48" r={r} stroke="#5A4A38" strokeWidth="0.75" strokeOpacity="0.7" fill="none" />
      ))}
      <path d="M48 2 A46 46 0 0 1 94 48 L82 48 A34 34 0 0 0 48 14 Z" fill="url(#vinyl-sheen)" opacity="0.18" />
      <circle cx="48" cy="48" r="18" fill={primaryColor} />
      <circle cx="48" cy="48" r="18" stroke="#FFF" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="48" cy="48" r="3.5" fill="#F7F1EA" />
      <defs>
        <linearGradient id="vinyl-sheen" x1="48" y1="2" x2="94" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF" />
          <stop offset="1" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

/**
 * Screen 9: Song Chapter — a YouTube video the creator picked.
 *
 * - Poster-play pattern: YouTube thumbnail + large custom play button.
 *   The iframe (with autoplay) only mounts after the tap — gives a
 *   guaranteed ≥44px touch target on mobile instead of YouTube's small
 *   embedded controls, and keeps initial load light.
 * - "Watch on YouTube" fallback link deep-links to the YouTube app on mobile.
 * - Spinning vinyl peeks from behind the card for depth.
 */
export const SongChapter = ({
  song,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
}: SongChapterProps) => {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [playerState, setPlayerState] = useState<number | null>(null);
  const [apiFailed, setApiFailed] = useState(false);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const videoId = song?.youtubeUrl ? extractYouTubeId(song.youtubeUrl) : null;
  const isPlaying = playerState === YT_STATE_PLAYING;

  // Boot the YouTube IFrame API player once the poster is tapped.
  // A fresh mount-point div is created per run so StrictMode's
  // mount → cleanup → remount cycle never targets a detached node.
  useEffect(() => {
    if (!playing || !videoId || apiFailed) return;
    let cancelled = false;
    let player: YTPlayerInstance | null = null;

    const host = playerHostRef.current;
    if (!host) return;
    const mountPoint = document.createElement("div");
    mountPoint.style.width = "100%";
    mountPoint.style.height = "100%";
    host.appendChild(mountPoint);

    const boot = async () => {
      if (!window.YT?.Player) {
        await new Promise<void>((resolve, reject) => {
          const previous = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            previous?.();
            resolve();
          };
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          script.onerror = () => reject(new Error("YT API failed to load"));
          document.head.appendChild(script);
          window.setTimeout(() => reject(new Error("YT API timed out")), 6000);
        }).catch(() => {
          if (!cancelled) setApiFailed(true);
        });
        if (cancelled) return;
        if (!window.YT?.Player) return; // apiFailed already set by catch
      }
      if (cancelled || !window.YT?.Player) return;
      player = new window.YT.Player(mountPoint, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e: { data: number }) => {
            if (!cancelled) setPlayerState(e.data);
          },
        },
      });
      playerRef.current = player;
    };
    void boot();

    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        // player never fully constructed — nothing to destroy
      }
      playerRef.current = null;
      if (host) host.innerHTML = "";
    };
  }, [playing, videoId, apiFailed]);

  const togglePlayback = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  };

  // ── Empty state — graceful "song not added yet" card ──
  if (!song || !videoId) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 0%, ${primaryColor}0D 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 100%, ${primaryColor}08 0%, transparent 50%),
            linear-gradient(180deg, #FDFAF6 0%, #F7F1EA 100%)
          `,
        }}
      >
        <style>{VINYL_KEYFRAMES}</style>
        {/* Ambient glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${primaryColor}0A 0%, transparent 60%)`,
          }}
          animate={
            reduceMotion
              ? { opacity: 0.6 }
              : { scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }
          }
          transition={{
            duration: reduceMotion ? 0 : 16,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating music notes */}
        {[
          { char: "♪", left: "22%", top: "28%", size: 18, delay: 0 },
          { char: "♫", left: "74%", top: "22%", size: 22, delay: 1.6 },
          { char: "♩", left: "80%", top: "62%", size: 16, delay: 3.2 },
          { char: "♪", left: "16%", top: "66%", size: 14, delay: 2.4 },
        ].map((note, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute select-none"
            style={{
              left: note.left,
              top: note.top,
              fontSize: note.size,
              color: primaryColor,
              fontFamily: "Georgia, serif",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 10, rotate: -8 }}
            animate={
              reduceMotion
                ? { opacity: 0.3 }
                : { opacity: [0, 0.45, 0], y: [10, -40, -70], rotate: [-8, 8] }
            }
            transition={{
              duration: reduceMotion ? 0 : 5,
              delay: reduceMotion ? 0 : note.delay,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {note.char}
          </motion.span>
        ))}

        {/* Empty-state card */}
        <motion.div
          className="relative w-full max-w-md"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Outer shadow */}
          <div
            aria-hidden
            className="absolute -inset-1 rounded-[32px] opacity-60"
            style={{
              boxShadow: `
                0 25px 50px -12px rgba(30, 20, 10, 0.15),
                0 0 0 1px ${primaryColor}15
              `,
            }}
          />

          {/* Card body — ivory */}
          <div
            className="relative overflow-hidden rounded-[30px] px-8 py-12 sm:px-12"
            style={{
              background: `linear-gradient(145deg, #FEFCF8 0%, #FAF6EE 40%, #F5EFE6 100%)`,
              boxShadow: `
                inset 0 2px 4px rgba(255, 255, 255, 0.8),
                inset 0 -2px 4px rgba(0, 0, 0, 0.02),
                0 1px 2px rgba(0, 0, 0, 0.03)
              `,
            }}
          >
            {/* Inner accent border */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[10px] rounded-[22px] border"
              style={{ borderColor: `${primaryColor}20` }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Vinyl record — slow spin */}
              <div className="mb-8">
                <VinylDisc size={96} primaryColor={primaryColor} spinning={!reduceMotion} />
              </div>

              {/* Heading */}
              <h2
                className="text-center text-xl font-bold tracking-wide sm:text-2xl"
                style={{
                  fontFamily: "var(--wish-font-heading), 'Padauk', Georgia, serif",
                  color: foregroundColor,
                }}
              >
                The Turntable is Waiting
              </h2>

              {/* Soft divider */}
              <div
                aria-hidden
                className="my-4 h-px w-16"
                style={{
                  background: `linear-gradient(90deg, transparent, ${primaryColor}70, transparent)`,
                }}
              />

              {/* Body copy */}
              <p
                className="max-w-[36ch] text-center text-sm leading-relaxed"
                style={{
                  color: foregroundColor,
                  opacity: 0.55,
                  fontFamily: "'Padauk', Georgia, serif",
                }}
              >
                No melody has been placed on the record yet — but the rest of
                your surprise is waiting just ahead.
              </p>

              {/* Bottom flourish */}
              <div aria-hidden className="mt-8 flex items-center gap-2.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="block rounded-full"
                    style={{
                      width: i === 1 ? 4 : 2.5,
                      height: i === 1 ? 4 : 2.5,
                      background: primaryColor,
                      opacity: 0.6,
                      boxShadow: `0 0 4px ${primaryColor}40`,
                    }}
                    animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.3, 0.7, 0.3] }}
                    transition={{
                      duration: reduceMotion ? 0 : 3,
                      repeat: reduceMotion ? 0 : Infinity,
                      delay: reduceMotion ? 0 : i * 0.4,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Soft glow beneath card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-2/3 -translate-x-1/2 rounded-full blur-2xl"
            style={{ background: `${primaryColor}15` }}
          />
        </motion.div>
      </div>
    );
  }

  // ── Video state ──
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6"
      style={{
        background: `
          radial-gradient(ellipse 90% 70% at 50% 0%, ${primaryColor}0D 0%, transparent 50%),
          radial-gradient(ellipse 80% 60% at 50% 100%, ${primaryColor}08 0%, transparent 50%),
          linear-gradient(180deg, #FDFAF6 0%, #F7F1EA 100%)
        `,
      }}
    >
      <style>{VINYL_KEYFRAMES}</style>
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${primaryColor}0A 0%, transparent 60%)`,
        }}
        animate={
          reduceMotion ? { opacity: 0.6 } : { scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }
        }
        transition={{
          duration: reduceMotion ? 0 : 16,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main card — wrapper keeps overflow visible so the vinyl can peek out */}
      <motion.div
        className="relative w-full max-w-xl"
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Outer shadow */}
        <div
          aria-hidden
          className="absolute -inset-1 rounded-[32px] opacity-60"
          style={{
            boxShadow: `
              0 25px 50px -12px rgba(30, 20, 10, 0.15),
              0 0 0 1px ${primaryColor}15
            `,
          }}
        />

        {/* Card body — ivory */}
        <div
          className="relative z-10 overflow-hidden rounded-[30px] px-6 py-8 sm:px-10 sm:py-10"
          style={{
            background: `linear-gradient(145deg, #FEFCF8 0%, #FAF6EE 40%, #F5EFE6 100%)`,
            boxShadow: `
              inset 0 2px 4px rgba(255, 255, 255, 0.8),
              inset 0 -2px 4px rgba(0, 0, 0, 0.02),
              0 1px 2px rgba(0, 0, 0, 0.03)
            `,
          }}
        >
          {/* Inner accent border */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[10px] rounded-[22px] border"
            style={{ borderColor: `${primaryColor}20` }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Eyebrow */}
            <motion.div
              className="mb-5 flex items-center gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.4, duration: reduceMotion ? 0 : 1 }}
            >
              <span
                className="h-px w-8"
                style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}60)` }}
              />
              <span
                className="text-[0.65rem] font-medium uppercase"
                style={{
                  color: primaryColor,
                  letterSpacing: "0.4em",
                  fontFamily: "'Padauk', Georgia, serif",
                  opacity: 0.8,
                }}
              >
                🎵 သီချင်း
              </span>
              <span
                className="h-px w-8"
                style={{ background: `linear-gradient(90deg, ${primaryColor}60, transparent)` }}
              />
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="mb-6 text-center text-xl font-bold tracking-wide sm:text-2xl"
              style={{
                fontFamily: "var(--wish-font-heading), 'Padauk', Georgia, serif",
                color: foregroundColor,
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.6, duration: reduceMotion ? 0 : 1 }}
            >
              A Song, Just for You
            </motion.h2>

            {/* Now Playing row — small spinning vinyl + label */}
            <motion.div
              className="mb-5 flex w-full items-center gap-3 rounded-full border px-3 py-2"
              style={{
                borderColor: `${primaryColor}25`,
                backgroundColor: `${primaryColor}08`,
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.7, duration: reduceMotion ? 0 : 0.8 }}
            >
              <VinylDisc
                size={40}
                primaryColor={primaryColor}
                spinning={!reduceMotion && isPlaying}
                durationSeconds={3}
              />
              <div className="min-w-0 flex-1 text-left">
                <p
                  className="text-[0.6rem] font-medium uppercase"
                  style={{
                    color: primaryColor,
                    letterSpacing: "0.3em",
                    fontFamily: "'Padauk', Georgia, serif",
                    opacity: 0.75,
                  }}
                >
                  Now Playing
                </p>
                <p
                  className="truncate text-[0.85rem] font-semibold"
                  style={{
                    color: foregroundColor,
                    opacity: 0.85,
                    fontFamily: "'Padauk', Georgia, serif",
                  }}
                >
                  {song.title?.trim() || "A song picked for you"}
                  {song.artist?.trim() && (
                    <span style={{ opacity: 0.55, fontWeight: 400 }}>
                      {" — "}
                      {song.artist}
                    </span>
                  )}
                </p>
              </div>
              {/* Equalizer bars — bounce while playing, frozen when paused */}
              <div
                aria-hidden
                className="flex h-5 shrink-0 items-end gap-[3px]"
                role="presentation"
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="song-eq-bar block w-[3px] rounded-full"
                    style={{
                      height: 16,
                      backgroundColor: primaryColor,
                      opacity: isPlaying ? 0.9 : 0.35,
                      animationDuration: `${0.75 + (i % 2) * 0.25}s`,
                      animationDelay: `${i * 0.18}s`,
                      animationPlayState:
                        !reduceMotion && isPlaying ? "running" : "paused",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Video stage — poster until tapped, then live embed */}
            <motion.div
              className="w-full overflow-hidden rounded-2xl"
              style={{
                aspectRatio: "16 / 9",
                boxShadow: `0 12px 32px ${primaryColor}20, 0 0 0 1px ${primaryColor}25`,
                backgroundColor: "#1A1208",
              }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: reduceMotion ? 0 : 0.8,
                duration: reduceMotion ? 0 : 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {playing ? (
                apiFailed ? (
                  // API blocked — plain embed fallback (native YouTube controls)
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={song.title || "A song picked for you"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div ref={playerHostRef} className="h-full w-full" />
                )
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={`Play ${song.title?.trim() || "the song picked for you"}`}
                  className="group relative block h-full w-full cursor-pointer touch-manipulation border-0 p-0"
                >
                  {/* Thumbnail — hqdefault is 4:3; cover crops letterbox to 16:9 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* Scrim — keeps play button and text readable over any thumbnail */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(26,18,8,0.15) 0%, rgba(26,18,8,0.05) 40%, rgba(26,18,8,0.45) 100%)",
                    }}
                  />

                  {/* Play button — large touch target */}
                  <span className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    {/* Pulse rings */}
                    {!reduceMotion && (
                      <>
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ border: `2px solid rgba(255,255,255,0.7)` }}
                          animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        />
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ border: `2px solid rgba(255,255,255,0.5)` }}
                          animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                        />
                      </>
                    )}
                    <span
                      className="relative flex h-full w-full items-center justify-center rounded-full shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                        boxShadow: `0 8px 24px ${primaryColor}55, inset 0 1px 0 rgba(255,255,255,0.35)`,
                      }}
                    >
                      {/* Play triangle */}
                      <svg
                        width="28"
                        height="32"
                        viewBox="0 0 28 32"
                        fill="none"
                        aria-hidden
                        style={{ marginLeft: 4 }}
                      >
                        <path d="M26 14.27a2 2 0 0 1 0 3.46L4 30.66A2 2 0 0 1 1 28.93V3.07A2 2 0 0 1 4 1.34L26 14.27Z" fill="#FFF" />
                      </svg>
                    </span>
                  </span>

                  {/* "Tap to play" hint chip */}
                  <span
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(26,18,8,0.55)" }}
                  >
                    ▶ Tap to play
                  </span>
                </button>
              )}
            </motion.div>

            {/* Playback control — big touch-friendly play/pause toggle */}
            {playing && !apiFailed && (
              <motion.div
                className="mt-4 flex items-center justify-center gap-3"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.5 }}
              >
                <button
                  type="button"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? "Pause the song" : "Play the song"}
                  className="flex h-14 w-14 cursor-pointer touch-manipulation items-center justify-center rounded-full border-0 transition-transform duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                    boxShadow: `0 6px 20px ${primaryColor}45, inset 0 1px 0 rgba(255,255,255,0.35)`,
                  }}
                >
                  {isPlaying ? (
                    // Pause icon — two bars
                    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden>
                      <rect x="2" y="1" width="6" height="20" rx="2" fill="#FFF" />
                      <rect x="12" y="1" width="6" height="20" rx="2" fill="#FFF" />
                    </svg>
                  ) : (
                    // Play icon — triangle
                    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden style={{ marginLeft: 3 }}>
                      <path d="M18 9.27a2 2 0 0 1 0 3.46L3.5 21.06A2 2 0 0 1 .5 19.33V2.67A2 2 0 0 1 3.5.94L18 9.27Z" fill="#FFF" />
                    </svg>
                  )}
                </button>
                <span
                  className="text-xs font-medium"
                  style={{ color: foregroundColor, opacity: 0.55 }}
                >
                  {playerState === YT_STATE_PLAYING
                    ? "Playing"
                    : playerState === 2
                      ? "Paused"
                      : playerState === 3
                        ? "Buffering…"
                        : playerState === 4
                          ? "Replay"
                          : ""}
                </span>
              </motion.div>
            )}

            {/* Watch on YouTube — fallback that deep-links to the app on mobile */}
            <motion.a
              href={song.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors"
              style={{
                borderColor: `${primaryColor}40`,
                color: primaryColor,
                backgroundColor: `${primaryColor}08`,
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ backgroundColor: `${primaryColor}15` }}
              transition={{
                delay: reduceMotion ? 0 : 1.2,
                duration: reduceMotion ? 0 : 0.8,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M9.75 15.02 15.5 11.75 9.75 8.48v6.54Z" fill="currentColor" />
              </svg>
              Watch on YouTube
            </motion.a>

            {/* Bottom flourish */}
            <motion.div
              className="mt-6 flex items-center gap-2.5"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: reduceMotion ? 0 : 1.3,
                duration: reduceMotion ? 0 : 1.2,
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block rounded-full"
                  style={{
                    width: i === 1 ? 4 : 2.5,
                    height: i === 1 ? 4 : 2.5,
                    background: primaryColor,
                    opacity: 0.6,
                    boxShadow: `0 0 4px ${primaryColor}40`,
                  }}
                  animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    duration: reduceMotion ? 0 : 3,
                    repeat: reduceMotion ? 0 : Infinity,
                    delay: reduceMotion ? 0 : i * 0.4,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Soft glow beneath card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-2/3 -translate-x-1/2 rounded-full blur-2xl"
          style={{ background: `${primaryColor}15` }}
        />
      </motion.div>
    </div>
  );
};
