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
 * Realistic sealed envelope. Tap to open: seal breaks, flap flips,
 * letter rises out. Fold back: letter tucks in, flap reseals.
 *
 * Geometry (300 x 240 container):
 *   Envelope body: bottom-0, h=170, top edge at y=70
 *   V-flap apex: y=100 (in 170-tall SVG) = y=170 in container
 *   Top flap: top=70, h=100, tip at y=170 (meets V-flap apex)
 *   Wax seal: centered at the junction (~y=150)
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Soft background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${primaryColor}06, transparent 65%)`,
        }}
      />

      {/* Envelope + letter assembly */}
      <div className="relative" style={{ perspective: 900 }}>
        <div className="relative" style={{ width: 300, height: 240 }}>
          {/* Tap target (closed state) */}
          {!isOpen && (
            <button
              onClick={handleToggle}
              className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent p-0"
              style={{ width: 300, height: 240 }}
              aria-label="Open envelope to read letter"
            />
          )}

          {/* Drop shadow on surface */}
          <div
            className="absolute -bottom-5 left-8 right-8 h-6 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(0,0,0,0.10), transparent 70%)",
              filter: "blur(10px)",
            }}
          />

          {/* LETTER PAPER - hidden inside, slides up on open */}
          <motion.div
            className="absolute left-[14px] right-[14px] z-[2] overflow-hidden"
            style={{
              borderRadius: "6px 6px 8px 8px",
              background:
                "linear-gradient(180deg, #FFFEF9 0%, #FFF9F0 30%, #FFF4E8 60%, #FFF0E0 100%)",
              boxShadow: `
                0 -1px 3px rgba(0,0,0,0.03),
                0 4px 16px rgba(0,0,0,0.08),
                0 1px 4px rgba(0,0,0,0.04),
                inset 0 1px 0 rgba(255,255,255,0.9)
              `,
              transformOrigin: "bottom center",
            }}
            animate={{
              height: isOpen ? 220 : 130,
              top: isOpen ? -195 : 85,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              mass: 1,
              delay: isOpen ? 0.35 : 0,
            }}
          >
            {/* Paper grain texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.025]"
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
                      color: "#3E2723",
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

          {/* ENVELOPE BODY - back panel */}
          <div
            className="absolute inset-x-0 bottom-0 z-[2] overflow-hidden"
            style={{ height: 170, borderRadius: "12px 12px 14px 14px" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg,
                  #F9EDE5 0%, #F5E6DC 12%, #F0DDD0 25%, #EDD5C6 40%,
                  #E8CCBC 55%, #E3C4B2 70%, #DFBCA8 85%, #D8B09C 100%)`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23p)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />
            <div
              className="absolute inset-[4px] rounded-[10px]"
              style={{ border: "1px solid rgba(255,255,255,0.35)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.04), transparent)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.08) 50%, transparent 95%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 top-0 w-px"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
              }}
            />
          </div>

          {/* FRONT V-FLAP - apex at y=100 meets the top flap's tip */}
          <div
            className="absolute inset-x-0 bottom-0 z-[3] pointer-events-none overflow-hidden"
            style={{ height: 170, borderRadius: "0 0 14px 14px" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #E8CCBC 0%, #DFBCA8 50%, #D8B09C 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23p2)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 300 170"
              fill="none"
            >
              <defs>
                <linearGradient
                  id={`leftV-${uid}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0.40" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient
                  id={`rightV-${uid}`}
                  x1="1"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient
                  id={`bottomV-${uid}`}
                  x1="0.5"
                  y1="1"
                  x2="0.5"
                  y2="0"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              {/* Bottom center triangle - matches the side triangles */}
              <polygon
                points="0,170 150,100 300,170"
                fill={`url(#bottomV-${uid})`}
              />
              {/* Left triangle - apex at y=100 */}
              <polygon
                points="0,0 150,100 0,170"
                fill={`url(#leftV-${uid})`}
              />
              {/* Right triangle - apex at y=100 */}
              <polygon
                points="300,0 150,100 300,170"
                fill={`url(#rightV-${uid})`}
              />
              {/* Crease shadows along folds */}
              <line
                x1="2"
                y1="2"
                x2="148"
                y2="98"
                stroke="rgba(0,0,0,0.04)"
                strokeWidth="1"
              />
              <line
                x1="298"
                y1="2"
                x2="152"
                y2="98"
                stroke="rgba(0,0,0,0.03)"
                strokeWidth="1"
              />
              {/* Top edge highlight */}
              <line
                x1="4"
                y1="0.5"
                x2="296"
                y2="0.5"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* TOP FLAP - sits at envelope body top (y=70), tip meets V-flap at y=170 */}
          <motion.div
            className="absolute inset-x-0 z-[5] origin-top"
            style={{
              top: 70,
              height: 100,
              transformStyle: "preserve-3d",
            }}
            animate={
              isOpen
                ? { rotateX: 180, opacity: 0 }
                : { rotateX: 0, opacity: 1 }
            }
            transition={{ duration: 0.6, ease: [0.4, 0, 0.15, 1] }}
          >
            <svg
              viewBox="0 0 300 100"
              className="w-full h-full"
              style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.07))" }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`flap-${uid}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#F6E8DE" />
                  <stop offset="25%" stopColor="#F2E0D3" />
                  <stop offset="50%" stopColor="#EDD7C8" />
                  <stop offset="75%" stopColor="#E8CEBC" />
                  <stop offset="100%" stopColor="#E3C5B0" />
                </linearGradient>
              </defs>
              {/* Triangle: top-left, tip at center-bottom, top-right */}
              <polygon
                points="0,0 150,96 300,0"
                fill={`url(#flap-${uid})`}
              />
              {/* Left fold highlight */}
              <line
                x1="6"
                y1="2"
                x2="148"
                y2="93"
                stroke="white"
                strokeWidth="0.7"
                opacity="0.40"
              />
              {/* Right fold highlight */}
              <line
                x1="294"
                y1="2"
                x2="152"
                y2="93"
                stroke="white"
                strokeWidth="0.7"
                opacity="0.30"
              />
              {/* Bottom tip shadow */}
              <line
                x1="120"
                y1="95"
                x2="180"
                y2="95"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>

          {/* WAX SEAL - sits at the junction where flap meets V-flap */}
          <motion.div
            className="absolute left-1/2 z-[7] -translate-x-1/2"
            style={{ top: 136 }}
            animate={
              isOpen
                ? { scale: 1.2, opacity: 0, rotate: 15, y: -10 }
                : { scale: 1, opacity: 1, rotate: 0, y: 0 }
            }
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${primaryColor}15, transparent 70%)`,
              }}
            />
            {/* Gold rim */}
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16"
              style={{
                background:
                  "linear-gradient(145deg, #D4A574, #C09060, #B8864A, #D4A574)",
                boxShadow: `
                  0 1px 0 #E8C89C,
                  0 2px 0 #C09060,
                  0 4px 12px rgba(0,0,0,0.20),
                  0 6px 20px ${primaryColor}20,
                  inset 0 1px 1px rgba(255,255,255,0.3)
                `,
                padding: 2,
              }}
            >
              <div
                className="flex h-full w-full items-center justify-center rounded-full"
                style={{
                  background: `radial-gradient(circle at 38% 35%, ${primaryColor} 0%, ${primaryColor}dd 40%, ${primaryColor}bb 100%)`,
                  boxShadow: `
                    inset 0 2px 4px rgba(255,255,255,0.20),
                    inset 0 -2px 4px rgba(0,0,0,0.15),
                    inset 0 0 8px rgba(0,0,0,0.05)
                  `,
                }}
              >
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 24 22"
                  fill="none"
                  style={{
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
                  }}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="white"
                    fillOpacity="0.85"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* ENVELOPE multi-layer shadow */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]"
            style={{
              height: 170,
              borderRadius: "12px 12px 14px 14px",
              boxShadow: `
                0 8px 32px rgba(0,0,0,0.08),
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
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                color: "white",
                boxShadow: `0 4px 20px ${primaryColor}30, 0 2px 6px ${primaryColor}15`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 6px 28px ${primaryColor}40`,
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
                borderColor: `${primaryColor}25`,
                color: primaryColor,
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
