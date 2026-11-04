"use client";

import {useState, useCallback, useMemo, useRef, useEffect} from "react";
import { motion, AnimatePresence } from "motion/react";
import { copy, interpolate } from "@/config/copy";

interface LetterChapterProps {
  letter?: string;
  recipientName?: string;
  /** Casual name for sender-voice copy; falls back to recipientName. */
  recipientNickname?: string;
  primaryColor?: string;
  foregroundColor?: string;
}

export const LetterChapter = ({
                                letter,
                                recipientName = "",
                                recipientNickname = recipientName,
                                primaryColor = "#E91E63",
                                foregroundColor = "#1A1A2E",
                              }: LetterChapterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
    const [paperVisible, setPaperVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);


    const handleToggle = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);

        if (isOpen) {
            // Closing: paper stays visible for ~750ms while it slides back in
            setIsOpen(false);
            setTimeout(() => setPaperVisible(false), 800);
            setTimeout(() => setIsAnimating(false), 1400); // flap + paper total
        } else {
            // Opening: paper appears immediately so its rise animation plays
            setIsOpen(true);
            setPaperVisible(true);
            setHasInteracted(true);
            setTimeout(() => setIsAnimating(false), 1400);
        }
    }, [isAnimating, isOpen]);

  if (!letter) {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <p style={{ color: foregroundColor, opacity: 0.4 }}>{copy.chapters.letter.empty}</p>
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
                    aria-label={copy.chapters.letter.envelopeAria}
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

              {/* LETTER PAPER - dynamic height, scrollable when long, anchored to envelope top */}
              <LetterPaper
                  isOpen={isOpen}
                  paperVisible={paperVisible}
                  hasInteracted={hasInteracted}
                  letterLines={letterLines}
                  primaryColor={primaryColor}
                  recipientName={recipientName}
                  recipientNickname={recipientNickname}
                  uid={uid}
              />

            {/* ENVELOPE BODY - back panel (blush pink) */}
            <div
                className="absolute inset-x-0 bottom-0 z-[3] overflow-hidden"
                style={{ height: 180, borderRadius: "10px 10px 14px 14px" ,
                    boxShadow: isOpen
                        ? "0 -14px 30px rgba(107,26,62,0.18), inset 0 1px 0 rgba(255,255,255,0.3)"
                        : "inset 0 1px 0 rgba(255,255,255,0.3)",
                    transition: "box-shadow 0.6s ease 0.45s",
                    }}
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
              {/* ENVELOPE INSIDE - dark rose interior revealed when top flap opens */}
              <motion.div
                  className="absolute inset-x-0 z-[3] overflow-hidden"
                  style={{ top: 70, height: 110 }}
                  initial={false}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, delay: isOpen ? 0.3 : 0 }}
              >
                  <div
                      className="absolute inset-0"
                      style={{
                          background: `linear-gradient(180deg, #6b1a3e 0%, #7a2045 55%, #8a2a52 100%)`,
                      }}
                  />
                  <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-6"
                      style={{
                          background: "linear-gradient(180deg, rgba(0,0,0,0.28), transparent)",
                      }}
                  />
                  <div
                      className="pointer-events-none absolute inset-0 opacity-[0.06]"
                      style={{
                          backgroundImage: `repeating-linear-gradient(
          90deg,
          rgba(255,255,255,0.5) 0px,
          rgba(255,255,255,0.5) 1px,
          transparent 1px,
          transparent 6px
        )`,
                      }}
                  />
                  <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                      style={{ background: "rgba(201,169,110,0.35)" }}
                  />
              </motion.div>
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
                <line
                    x1="1" y1="1" x2="159" y2="109"
                    stroke={gold}
                    strokeWidth="1.5"
                    opacity="0.7"
                />
                <line
                    x1="1" y1="179" x2="159" y2="111"
                    stroke={gold}
                    strokeWidth="1.5"
                    opacity="0.6"
                />
                <line
                    x1="319" y1="1" x2="161" y2="109"
                    stroke={gold}
                    strokeWidth="1.5"
                    opacity="0.7"
                />
                <line
                    x1="319" y1="179" x2="161" y2="111"
                    stroke={gold}
                    strokeWidth="1.5"
                    opacity="0.6"
                />

                {/* Floral decoration - bottom left */}
                <g opacity="0.55" transform="translate(15, 120)">
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
                  <path d="M55,140 l1.5,-4 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 z" />
                  <path d="M45,105 l1,-3 l1,3 l3,1 l-3,1 l-1,3 l-1,-3 l-3,-1 z" opacity="0.35" />
                  <path d="M160,95 l1.5,-4 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 z" opacity="0.4" />
                  <path d="M265,140 l1.5,-4 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 z" />
                  <path d="M275,105 l1,-3 l1,3 l3,1 l-3,1 l-1,3 l-1,-3 l-3,-1 z" opacity="0.35" />
                </g>
              </svg>
            </div>

            {/* TOP FLAP - blush pink outside, deep rose inside when opened */}
              {/* TOP FLAP - blush pink outside, deep rose inside when opened */}
              <motion.div
                  className="absolute inset-x-0 z-[10] origin-top"
                  style={{
                      top: 70,
                      height: 110,
                      transformStyle: "preserve-3d",
                  }}
                  animate={{ rotateX: isOpen ? 180 : 0 }}
                  transition={{
                      duration: 0.72,
                      ease: [0.4, 0, 0.15, 1],
                      delay: isOpen ? 0 : 0.75,   // ← wait for letter to start descending
                  }}

              >
                  {/* FRONT FACE - blush pink, visible when CLOSED. Apex points DOWN. */}
                  <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: "hidden" }}
                  >
                      <svg viewBox="0 0 320 110" className="h-full w-full" preserveAspectRatio="none">
                          <defs>
                              <linearGradient id={`topFlapFront-${uid}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f8e5de" />
                                  <stop offset="100%" stopColor="#edcec3" />
                              </linearGradient>
                          </defs>
                          {/* Apex DOWN (V shape) */}
                          <polygon points="0,0 160,106 320,0" fill={`url(#topFlapFront-${uid})`} />
                          <line x1="2" y1="1" x2="159" y2="105" stroke="#c9a96e" strokeWidth="1.5" opacity="0.72" />
                          <line x1="318" y1="1" x2="161" y2="105" stroke="#c9a96e" strokeWidth="1.5" opacity="0.72" />
                      </svg>
                  </div>

                  {/* BACK FACE - deep rose inside, visible when OPEN.
      No extra rotateX here — the parent's rotateX(180) handles it.
      Apex DOWN in SVG = apex UP on screen after parent flips. */}
                  <div
                      className="absolute inset-0"
                      style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",  // mirror horizontally so backface culling works
                      }}
                  >
                      <svg viewBox="0 0 320 110" className="h-full w-full" preserveAspectRatio="none">
                          <defs>
                              <linearGradient id={`topFlapBack-${uid}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#982B57" />
                                  <stop offset="100%" stopColor="#7a2045" />
                              </linearGradient>
                          </defs>
                          {/* Apex DOWN in SVG. Parent rotateX(180) flips it to apex UP on screen. */}
                          <polygon points="0,0 160,106 320,0" fill={`url(#topFlapBack-${uid})`} />
                          <polygon points="4,3 160,102 316,3" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
                      </svg>
                  </div>
              </motion.div>

            {/* WAX SEAL - deep rose/burgundy with gold rim */}
            <AnimatePresence>
              {!isOpen && (
                  <motion.div
                      className="absolute left-1/2 z-[12] -translate-x-1/2"
                      style={{ top: 140 }}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.25, y: -10, rotate: 10 }}
                      transition={{ duration: 0.35 }}
                  >
                    <div
                        className="absolute -inset-3 rounded-full"
                        style={{ background: `radial-gradient(circle, ${sealColor}20, transparent 70%)` }}
                    />
                    <div
                        className="relative flex h-14 w-14 items-center justify-center rounded-full sm:h-[60px] sm:w-[60px]"
                        style={{
                          background: `linear-gradient(145deg, #dfc995, #b99455, #e2cd9d)`,
                          boxShadow: `0 3px 0 #a9844d, 0 4px 14px rgba(0,0,0,0.22), 0 8px 24px ${sealColor}25, inset 0 1px 1px rgba(255,255,255,0.35)`,
                          padding: 2.5,
                        }}
                    >
                      <div
                          className="flex h-full w-full items-center justify-center rounded-full"
                          style={{
                            background: `radial-gradient(circle at 35% 30%, #a52f60, #721b43 85%)`,
                            boxShadow: `inset 0 2px 5px rgba(255,255,255,0.20), inset 0 -2px 5px rgba(0,0,0,0.20), inset 0 0 10px rgba(0,0,0,0.08)`,
                          }}
                      >
                        <svg width="18" height="16" viewBox="0 0 24 22" fill="none" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))" }}>
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
              )}
            </AnimatePresence>

            {/* ENVELOPE shadow */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]"
                style={{
                  height: 180,
                  borderRadius: "10px 10px 14px 14px",
                  boxShadow: `0 8px 32px rgba(139,34,82,0.08), 0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)`,
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
                    whileHover={{ scale: 1.05, boxShadow: `0 6px 28px ${sealColor}40` }}
                    whileTap={{ scale: 0.95 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                  {copy.chapters.letter.open}
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
                  {copy.chapters.letter.foldBack}
                </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};






{/* LetterPaper Component*/}
interface LetterPaperProps {
    isOpen: boolean;
    paperVisible: boolean;
    hasInteracted: boolean;
    letterLines: string[];
    primaryColor: string;
    recipientName: string;
    recipientNickname: string;
    uid: string;
}

const LetterPaper = ({ isOpen, paperVisible, hasInteracted, letterLines, primaryColor, recipientName, recipientNickname, uid }: LetterPaperProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    // Measure natural content height
    useEffect(() => {
        if (!contentRef.current) return;
        const el = contentRef.current;
        const update = () => setContentHeight(el.scrollHeight);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [letterLines]);

    // Cap visible height so long letters don't blow past the viewport
    const MAX_HEIGHT = 420;
    const MIN_HEIGHT = 200;
    const visibleHeight = Math.min(
        Math.max(contentHeight + 80, MIN_HEIGHT), // +80 for padding
        MAX_HEIGHT
    );
    const needsScroll = contentHeight + 80 > MAX_HEIGHT;

    // When open, paper bottom sits just inside the envelope's top edge.
    // Envelope top edge is at y=70 of the 250px-tall container → 180px from bottom.
    const OPEN_BOTTOM = 20;   // sit slightly inside the envelope
    const CLOSED_BOTTOM = -60; // hidden fully inside

    return (
        <motion.div
            className={`absolute left-[22px] right-[22px] ${paperVisible ? "z-[11]" : "z-[6]"}`}
            style={{
                bottom: OPEN_BOTTOM,
                height: visibleHeight,
                borderRadius: "7px",
                background: `linear-gradient(180deg, #fffdfa 0%, #fff8f2 50%, #fff1e8 100%)`,
                boxShadow: isOpen
                    ? `0 18px 40px rgba(107,26,62,0.22), 0 6px 14px rgba(107,26,62,0.10), inset 0 1px 0 rgba(255,255,255,0.9)`
                    : `0 4px 12px rgba(107,26,62,0.10), inset 0 1px 0 rgba(255,255,255,0.9)`,
                transformOrigin: "bottom center",
                pointerEvents: paperVisible ? "auto" : "none",
                overflow: "hidden",
                willChange: "transform, opacity",
            }}
            initial={false}
            animate={
                isOpen
                    ? {
                        // Phase A: rise straight up out of envelope
                        y: [CLOSED_BOTTOM, CLOSED_BOTTOM - 40, 0],
                        rotate: [0, 0, -1.2],
                        scale: [0.94, 0.97, 1],
                        opacity: [0, 1, 1],
                    }
                    : hasInteracted
                        ? {
                            // Fold back: tilt reset → slide straight down → shrink into envelope
                            y: [0, -20, CLOSED_BOTTOM],
                            rotate: [-1.2, 0, 0],
                            scale: [1, 0.97, 0.94],
                            opacity: [1, 1, 0],
                        }
                        : {
                            // Initial state: paper hidden inside envelope, no animation
                            y: CLOSED_BOTTOM,
                            rotate: 0,
                            scale: 0.94,
                            opacity: 0,
                        }
            }
            transition={
                isOpen
                    ? {
                        duration: 1.1,
                        times: [0, 0.45, 1],
                        ease: [
                            [0.34, 1.4, 0.64, 1],   // rise: overshoot spring feel
                            [0.22, 1, 0.36, 1],     // settle: smooth out
                        ],
                        delay: 0.32,
                    }
                    : hasInteracted
                        ? {
                            duration: 0.7,
                            times: [0, 0.25, 1],
                            ease: [
                                [0.4, 0, 0.2, 1],
                                [0.55, 0, 0.9, 0.4],    // accelerate down into envelope
                            ],
                            delay: 0.05,
                        }
                        : { duration: 0 }
            }
        >
            {/* Paper border */}
            <div
                className="pointer-events-none absolute inset-[8px] rounded-[4px]"
                style={{ border: "1px solid rgba(201,169,110,0.35)" }}
            />

            {/* Flower decoration (fixed at top-right of visible area) */}
            <svg
                className="pointer-events-none absolute right-3 top-2 h-16 w-16 opacity-70"
                viewBox="0 0 80 80"
                fill="none"
            >
                <path d="M70 8C54 18 50 31 45 47" stroke="#9B7DB8" strokeWidth="1.2" />
                <path d="M50 28C57 24 62 18 64 12" stroke="#A88AB9" strokeWidth="1" />
                <path d="M47 39C38 35 34 29 33 23" stroke="#A88AB9" strokeWidth="1" />
                <circle cx="65" cy="11" r="6" fill="#F3A1B2" opacity="0.7" />
                <circle cx="65" cy="11" r="2.5" fill="#D47B91" />
                <ellipse cx="55" cy="24" rx="3" ry="5" fill="#C3A1D5" transform="rotate(35 55 24)" />
                <ellipse cx="48" cy="35" rx="3" ry="5" fill="#B58BC9" transform="rotate(-35 48 35)" />
            </svg>

            {/* Scrollable content area */}
            <div
                className="relative h-full overflow-y-auto px-7 pb-5 pt-8"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(201,169,110,0.5) transparent",
                }}
            >
                <motion.div
                    ref={contentRef}
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{
                        duration: 0.45,
                        delay: isOpen ? 0.7 : 0,   // starts after paper is mostly up
                        ease: "easeOut",
                    }}
                >
                    <div
                        className="mb-3 text-center text-xl"
                        style={{
                            color: "#9d3c63",
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontStyle: "italic",
                        }}
                    >
                        {interpolate(copy.chapters.letter.justForYou, { recipientNickname })}
                    </div>
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <div className="h-px w-10" style={{ background: "#d6a5b5" }} />
                        <span className="text-xs" style={{ color: primaryColor }}>♥</span>
                        <div className="h-px w-10" style={{ background: "#d6a5b5" }} />
                    </div>
                    <div className="space-y-2">
                        {letterLines.map((line, index) => (
                            <motion.p
                                key={`${index}-${line}`}
                                initial={{ opacity: 0, y: 7 }}
                                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 7 }}
                                transition={{
                                    duration: 0.35,
                                    delay: isOpen ? 0.7 + index * 0.06 : 0,
                                }}
                                className="text-left text-[12px] leading-[1.65] sm:text-[13px]"
                                style={{
                                    color: "#553847",
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                }}
                            >
                                {line}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Scroll hint gradient at bottom (only when scrollable) */}
            {needsScroll && isOpen && (
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
                    style={{
                        background: "linear-gradient(180deg, transparent, rgba(255,241,232,0.9))",
                    }}
                />
            )}
        </motion.div>
    );
};
