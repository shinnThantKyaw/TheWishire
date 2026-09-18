"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LetterChapterProps {
  letter?: string;
  primaryColor?: string;
  foregroundColor?: string;
}

/*
 * LetterChapter - Chapter 1 of 5
 *
 * Luxurious blush pink envelope with gold trim and floral decorations.
 * Modeled after a premium greeting card envelope with wax seal.
 *
 * Geometry (320 x 250 container):
 *   Envelope body: bottom-0, h=180, top edge at y=70
 *   V-flap apex: y=110 (in SVG) = y=180 in container
 *   Top flap: top=70, h=110, tip at y=180 (meets V-flap apex)
 *   Wax seal: centered at the junction (~y=155)
 */
export const LetterChapter = ({
  letter,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
}: LetterChapterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
    setTimeout(() => setIsAnimating(false), 900);
  }, [isAnimating]);

  if (!letter) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p style={{ color: foregroundColor, opacity: 0.4 }}>No letter yet</p>
      </div>
    );
  }

  const letterLines = letter.split("\n").filter((line) => line.trim());
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  // Palette matching the reference image
  const blush = "#F0D5CC";
  const blushLight = "#F5E0D8";
  const blushDark = "#E2BFB3";
  const gold = "#C9A96E";
  const goldLight = "#D4BA82";
  const sealColor = "#8B2252";
  const sealDark = "#6B1A3E";
  const insideFlap = "#A0305F";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Soft pink background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(240,213,204,0.15), transparent 65%)",
        }}
      />

      {/* Envelope + letter assembly */}
      <div className="relative" style={{ perspective: 900 }}>
        <div className="relative" style={{ width: 320, height: 250 }}>
          {/* Tap target (closed state) */}
          {!isOpen && (
            <button
              onClick={handleToggle}
              className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent p-0"
              style={{ width: 320, height: 250 }}
              aria-label="Open envelope to read letter"
            />
          )}

          {/* Drop shadow */}
          <div
            className="absolute -bottom-6 left-10 right-10 h-8 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(139,34,82,0.12), transparent 70%)",
              filter: "blur(14px)",
            }}
          />

          {/* LETTER PAPER - hidden inside, slides up on open */}
          <motion.div
            className="absolute left-[16px] right-[16px] z-[2] overflow-hidden"
            style={{
              borderRadius: "6px 6px 8px 8px",
              background:
                "linear-gradient(180deg, #FFFCF8 0%, #FFF8F0 40%, #FFF3E8 100%)",
              boxShadow: `
                0 -1px 3px rgba(0,0,0,0.03),
                0 4px 16px rgba(0,0,0,0.08),
                inset 0 1px 0 rgba(255,255,255,0.9)
              `,
              transformOrigin: "bottom center",
            }}
            animate={{
              height: isOpen ? 230 : 140,
              top: isOpen ? -205 : 80,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              mass: 1,
              delay: isOpen ? 0.35 : 0,
            }}
          >
            {/* Paper grain */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Letter content */}
            <div className="relative px-5 pt-4 pb-3 sm:px-6">
              <motion.div
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.4, delay: isOpen ? 0.5 : 0 }}
              >
                {letterLines.map((line, i) => (
                  <motion.p
                    key={i}
                    className="leading-[1.7]"
                    style={{
                      color: "#4A3040",
                      fontFamily:
                        "'Playfair Display', Georgia, 'Times New Roman', serif",
                      textAlign: "left",
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      y: isOpen ? 0 : 6,
                    }}
                    transition={{
                      delay: isOpen ? 0.55 + i * 0.04 : 0,
                      duration: 0.4,
                    }}
                  >
                    <span className="text-[12px] sm:text-[13px]">
                      {line || " "}
                    </span>
                  </motion.p>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* ENVELOPE BODY - back panel (blush pink) */}
          <div
            className="absolute inset-x-0 bottom-0 z-[2] overflow-hidden"
            style={{ height: 180, borderRadius: "10px 10px 14px 14px" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${blushLight} 0%, ${blush} 40%, ${blushDark} 100%)`,
              }}
            />
            {/* Subtle paper grain */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23p)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Inner highlight border */}
            <div
              className="absolute inset-[3px] rounded-[8px]"
              style={{ border: "1px solid rgba(255,255,255,0.3)" }}
            />
          </div>

          {/* FRONT V-FLAP with gold trim */}
          <div
            className="absolute inset-x-0 bottom-0 z-[3] pointer-events-none"
            style={{ height: 180 }}
          >
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 320 180"
              fill="none"
            >
              <defs>
                <linearGradient
                  id={`bodyFill-${uid}`}
                  x1="0.5"
                  y1="0"
                  x2="0.5"
                  y2="1"
                >
                  <stop offset="0%" stopColor={blushLight} />
                  <stop offset="100%" stopColor={blush} />
                </linearGradient>
              </defs>

              {/* Bottom center triangle */}
              <polygon
                points="0,180 160,110 320,180"
                fill={`url(#bodyFill-${uid})`}
              />
              {/* Left triangle */}
              <polygon
                points="0,0 160,110 0,180"
                fill={`url(#bodyFill-${uid})`}
              />
              {/* Right triangle */}
              <polygon
                points="320,0 160,110 320,180"
                fill={`url(#bodyFill-${uid})`}
              />

              {/* Gold trim lines along all V-flap edges */}
              {/* Left edge: top-left to apex */}
              <line
                x1="1" y1="1" x2="159" y2="109"
                stroke={gold}
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Left edge: apex to bottom-left */}
              <line
                x1="1" y1="179" x2="159" y2="111"
                stroke={gold}
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Right edge: top-right to apex */}
              <line
                x1="319" y1="1" x2="161" y2="109"
                stroke={gold}
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Right edge: apex to bottom-right */}
              <line
                x1="319" y1="179" x2="161" y2="111"
                stroke={gold}
                strokeWidth="1.5"
                opacity="0.6"
              />

              {/* Floral decoration - bottom left */}
              <g opacity="0.55" transform="translate(15, 120)">
                {/* Stems */}
                <path
                  d="M20,50 Q25,30 30,10"
                  stroke="#9B7DB8"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M30,50 Q28,25 20,5"
                  stroke="#B08CC0"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M10,55 Q15,35 25,15"
                  stroke="#8B6DAF"
                  strokeWidth="1"
                  fill="none"
                />
                {/* Flower buds - lavender */}
                <ellipse cx="30" cy="8" rx="3" ry="5" fill="#C4A0D8" opacity="0.7" />
                <ellipse cx="27" cy="6" rx="2.5" ry="4" fill="#B890CC" opacity="0.6" />
                <ellipse cx="20" cy="3" rx="3" ry="4.5" fill="#D0B0E0" opacity="0.65" />
                {/* Pink flower */}
                <circle cx="12" cy="48" r="5" fill="#E8A0B0" opacity="0.6" />
                <circle cx="12" cy="48" r="2.5" fill="#D48090" opacity="0.5" />
                {/* Small leaves */}
                <ellipse cx="22" cy="35" rx="4" ry="2" fill="#A0C8A0" opacity="0.3" transform="rotate(-30 22 35)" />
                <ellipse cx="16" cy="40" rx="3.5" ry="1.8" fill="#90B890" opacity="0.25" transform="rotate(20 16 40)" />
              </g>

              {/* Floral decoration - bottom right (mirrored) */}
              <g opacity="0.55" transform="translate(255, 120) scale(-1,1) translate(-65,0)">
                <path
                  d="M20,50 Q25,30 30,10"
                  stroke="#9B7DB8"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M30,50 Q28,25 20,5"
                  stroke="#B08CC0"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M10,55 Q15,35 25,15"
                  stroke="#8B6DAF"
                  strokeWidth="1"
                  fill="none"
                />
                <ellipse cx="30" cy="8" rx="3" ry="5" fill="#C4A0D8" opacity="0.7" />
                <ellipse cx="27" cy="6" rx="2.5" ry="4" fill="#B890CC" opacity="0.6" />
                <ellipse cx="20" cy="3" rx="3" ry="4.5" fill="#D0B0E0" opacity="0.65" />
                <circle cx="12" cy="48" r="5" fill="#E8A0B0" opacity="0.6" />
                <circle cx="12" cy="48" r="2.5" fill="#D48090" opacity="0.5" />
                <ellipse cx="22" cy="35" rx="4" ry="2" fill="#A0C8A0" opacity="0.3" transform="rotate(-30 22 35)" />
                <ellipse cx="16" cy="40" rx="3.5" ry="1.8" fill="#90B890" opacity="0.25" transform="rotate(20 16 40)" />
              </g>

              {/* Gold sparkle stars */}
              <g fill={gold} opacity="0.5">
                {/* Left side sparkles */}
                <path d="M55,140 l1.5,-4 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 z" />
                <path d="M45,105 l1,-3 l1,3 l3,1 l-3,1 l-1,3 l-1,-3 l-3,-1 z" opacity="0.35" />
                {/* Center sparkles */}
                <path d="M160,95 l1.5,-4 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 z" opacity="0.4" />
                {/* Right side sparkles */}
                <path d="M265,140 l1.5,-4 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 z" />
                <path d="M275,105 l1,-3 l1,3 l3,1 l-3,1 l-1,3 l-1,-3 l-3,-1 z" opacity="0.35" />
              </g>
            </svg>
          </div>

          {/* TOP FLAP - blush pink outside, deep rose inside */}
          <motion.div
            className="absolute inset-x-0 z-[5] origin-top"
            style={{
              top: 70,
              height: 110,
              transformStyle: "preserve-3d",
            }}
            animate={
              isOpen
                ? { rotateX: 180, opacity: 0 }
                : { rotateX: 0, opacity: 1 }
            }
            transition={{ duration: 0.6, ease: [0.4, 0, 0.15, 1] }}
          >
            {/* Front face (blush pink with gold trim) */}
            <svg
              viewBox="0 0 320 110"
              className="absolute inset-0 h-full w-full"
              style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.06))" }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`flapFill-${uid}`}
                  x1="0.5"
                  y1="0"
                  x2="0.5"
                  y2="1"
                >
                  <stop offset="0%" stopColor={blushLight} />
                  <stop offset="100%" stopColor={blush} />
                </linearGradient>
              </defs>
              <polygon
                points="0,0 160,106 320,0"
                fill={`url(#flapFill-${uid})`}
              />
              {/* Gold trim on left edge */}
              <line
                x1="1" y1="1" x2="159" y2="105"
                stroke={gold}
                strokeWidth="1.5"
                opacity="0.65"
              />
              {/* Gold trim on right edge */}
              <line
                x1="319" y1="1" x2="161" y2="105"
                stroke={gold}
                strokeWidth="1.5"
                opacity="0.65"
              />
              {/* Subtle inner highlight */}
              <line
                x1="8" y1="3" x2="157" y2="103"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <line
                x1="312" y1="3" x2="163" y2="103"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </svg>

            {/* Back face (deep rose - visible when flap opens) */}
            <svg
              viewBox="0 0 320 110"
              className="absolute inset-0 h-full w-full"
              style={{
                transform: "rotateX(180deg)",
                backfaceVisibility: "visible",
              }}
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 160,106 320,0"
                fill={insideFlap}
              />
              {/* Subtle texture on inside */}
              <polygon
                points="0,0 160,106 320,0"
                fill="url(#insideTexture)"
                opacity="0.08"
              />
            </svg>
          </motion.div>

          {/* WAX SEAL - deep rose/burgundy with gold rim */}
          <motion.div
            className="absolute left-1/2 z-[7] -translate-x-1/2"
            style={{ top: 140 }}
            animate={
              isOpen
                ? { scale: 1.2, opacity: 0, rotate: 15, y: -10 }
                : { scale: 1, opacity: 1, rotate: 0, y: 0 }
            }
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-3 rounded-full"
              style={{
                background: `radial-gradient(circle, ${sealColor}20, transparent 70%)`,
              }}
            />
            {/* Gold outer ring */}
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-full sm:h-[60px] sm:w-[60px]"
              style={{
                background: `linear-gradient(145deg, ${goldLight}, ${gold}, ${goldLight})`,
                boxShadow: `
                  0 2px 0 ${gold},
                  0 4px 14px rgba(0,0,0,0.22),
                  0 8px 24px ${sealColor}25,
                  inset 0 1px 1px rgba(255,255,255,0.35)
                `,
                padding: 2.5,
              }}
            >
              {/* Inner seal face */}
              <div
                className="flex h-full w-full items-center justify-center rounded-full"
                style={{
                  background: `radial-gradient(circle at 40% 35%, ${sealColor} 0%, ${sealDark} 100%)`,
                  boxShadow: `
                    inset 0 2px 5px rgba(255,255,255,0.20),
                    inset 0 -2px 5px rgba(0,0,0,0.20),
                    inset 0 0 10px rgba(0,0,0,0.08)
                  `,
                }}
              >
                {/* Heart emboss */}
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 24 22"
                  fill="none"
                  style={{
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))",
                  }}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="rgba(255,255,255,0.3)"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* ENVELOPE shadow */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]"
            style={{
              height: 180,
              borderRadius: "10px 10px 14px 14px",
              boxShadow: `
                0 8px 32px rgba(139,34,82,0.08),
                0 2px 8px rgba(0,0,0,0.04),
                0 1px 2px rgba(0,0,0,0.03)
              `,
            }}
          />
        </div>
      </div>

      {/* Action button */}
      <div className="relative z-10 mt-6 flex justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="open"
              onClick={handleToggle}
              className="flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold tracking-wide sm:text-sm"
              style={{
                background: `linear-gradient(135deg, ${sealColor}, ${insideFlap})`,
                color: "white",
                boxShadow: `0 4px 20px ${sealColor}30, 0 2px 6px ${sealColor}15`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 6px 28px ${sealColor}40`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              Open the letter
            </motion.button>
          ) : (
            <motion.button
              key="close"
              onClick={handleToggle}
              className="flex items-center gap-2 rounded-full border px-6 py-2.5 text-xs font-medium tracking-wide sm:text-sm backdrop-blur-sm"
              style={{
                borderColor: `${sealColor}25`,
                color: sealColor,
                background: "rgba(255,255,255,0.65)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              Fold back
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
