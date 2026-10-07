"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";

interface PhotosChapterProps {
    photos: { id: string; url: string; type: "photo" }[];
    videoUrl?: string;
    primaryColor?: string;
    foregroundColor?: string;
}

type PageDirection = "next" | "previous" | null;

const easeSettle = [0.16, 1, 0.3, 1] as const;
/* Slower, smoother paper motion */
const easePaper = [0.32, 0.72, 0.18, 1] as const;
const FLIP_MS_DESKTOP = 1300;
const FLIP_MS_MOBILE = 1150;
const ALBUM_HEIGHT = "clamp(420px, 68vh, 560px)";

/* Chrome (paddings, caption, dots) around a photo frame — subtract from ALBUM_HEIGHT so open/closed book heights match */
const MOBILE_PHOTO_MAX_HEIGHT = `calc(${ALBUM_HEIGHT} - clamp(0.8rem, 2vh, 1.5rem) - clamp(1.5rem, 6vh, 6rem) - 78px - clamp(0.75rem, 2.5vh, 2rem) - 4px)`;
const DESKTOP_PHOTO_MAX_HEIGHT = `min(calc(${ALBUM_HEIGHT} - clamp(0.8rem, 2vh, 1.5rem) - clamp(1.5rem, 5vh, 5rem) - 54px), min(46vh, 380px))`;

export const PhotosChapter = ({
                                  photos,
                                  videoUrl,
                                  primaryColor = "#E91E63",
                                  foregroundColor = "#1A1A2E",
                              }: PhotosChapterProps) => {
    const [isClosed, setIsClosed] = useState(true);
    const [isOpening, setIsOpening] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState<PageDirection>(null);
    const [isTurning, setIsTurning] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [hasFlipped, setHasFlipped] = useState(false);

    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    const spreads = useMemo(() => {
        const result: {
            left?: (typeof photos)[number];
            right?: (typeof photos)[number];
            leftIndex?: number;
            rightIndex?: number;
        }[] = [];
        for (let i = 0; i < photos.length; i += 2) {
            result.push({
                left: photos[i],
                leftIndex: i,
                right: photos[i + 1],
                rightIndex: i + 1 < photos.length ? i + 1 : undefined,
            });
        }
        return result;
    }, [photos]);

    const totalViews = isDesktop ? spreads.length : photos.length;

    const clampPage = useCallback(
        (n: number) => Math.max(0, Math.min(n, Math.max(0, totalViews - 1))),
        [totalViews]
    );

    useEffect(() => {
        setCurrentPage((p) => clampPage(p));
    }, [clampPage]);

    const openAlbum = useCallback(() => {
        if (isOpening || !isClosed) return;
        setIsOpening(true);
        // Must be >= AlbumOpeningAnimation duration, or open book appears mid-flip (flash)
        const ms = isDesktop ? 1250 : 1450;
        window.setTimeout(() => {
            setIsClosed(false);
            setIsOpening(false);
        }, ms);
    }, [isClosed, isOpening, isDesktop]);

    const closeAlbum = useCallback(() => {
        if (isTurning || isOpening) return;
        setIsClosed(true);
        setCurrentPage(0);
        setDirection(null);
        setHasFlipped(false);
    }, [isOpening, isTurning]);

    const goNext = useCallback(() => {
        if (isClosed || isOpening || isTurning) return;
        if (currentPage >= totalViews - 1) return;
        setIsTurning(true);
        setDirection("next");
        setHasFlipped(true);
        const ms = isDesktop ? FLIP_MS_DESKTOP : FLIP_MS_MOBILE;
        window.setTimeout(() => {
            setCurrentPage((v) => v + 1);
            setDirection(null);
            setIsTurning(false);
        }, ms);
    }, [currentPage, isClosed, isDesktop, isOpening, isTurning, totalViews]);

    const goPrev = useCallback(() => {
        if (isClosed || isOpening || isTurning) return;
        if (currentPage <= 0) return;
        setIsTurning(true);
        setDirection("previous");
        setHasFlipped(true);
        const ms = isDesktop ? FLIP_MS_DESKTOP : FLIP_MS_MOBILE;
        window.setTimeout(() => {
            setCurrentPage((v) => v - 1);
            setDirection(null);
            setIsTurning(false);
        }, ms);
    }, [currentPage, isClosed, isDesktop, isOpening, isTurning]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (isClosed) return;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                goNext();
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                goPrev();
            }
            if (e.key === "Escape") {
                e.preventDefault();
                closeAlbum();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeAlbum, goNext, goPrev, isClosed]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
        touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        const endX = e.changedTouches[0]?.clientX ?? 0;
        const endY = e.changedTouches[0]?.clientY ?? 0;

        const dx =
            touchStartX.current !== null ? endX - touchStartX.current : 0;
        const dy =
            touchStartY.current !== null ? endY - touchStartY.current : 0;

        touchStartX.current = null;
        touchStartY.current = null;

        // Horizontal swipe only — vertical gestures should scroll the page.
        if (Math.abs(dx) < 40) return;
        if (Math.abs(dx) <= Math.abs(dy)) return;

        if (dx < 0) goNext();
        else goPrev();
    };

    if (!photos?.length && !videoUrl) return null;

    const mobilePhoto = photos[currentPage];
    const desktopSpread = spreads[currentPage];

    return (
        <section
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative overflow-hidden px-4 sm:px-6"
            style={{
                color: foregroundColor,
                paddingTop: "clamp(1.5rem, 5vh, 5rem)",
                paddingBottom: "clamp(1.5rem, 5vh, 5rem)",
            }}
        >
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl sm:top-20"
                    style={{ background: `${primaryColor}12` }}
                />
                <div
                    className="absolute -left-10 top-1/2 h-56 w-56 rounded-full blur-3xl"
                    style={{ background: `${primaryColor}08` }}
                />
                <div
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                        backgroundImage: `radial-gradient(${primaryColor}18 0.7px, transparent 0.7px)`,
                        backgroundSize: "22px 22px",
                    }}
                />
            </div>

            {/* Header */}
            <div
                className="relative z-10 mx-auto max-w-xl text-center"
                style={{ marginBottom: "clamp(1rem, 3vh, 3rem)" }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: easeSettle }}
                >
          <span
              className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.35em]"
              style={{ color: primaryColor }}
          >
            Chapter 02
          </span>
                    <h2
                        className="font-semibold"
                        style={{
                            fontFamily:
                                "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                            fontSize: "clamp(1.5rem, 3.5vh, 2.25rem)",
                        }}
                    >
                        Our Memories
                    </h2>
                    <p
                        className="mx-auto mt-3 max-w-md text-sm leading-6"
                        style={{ color: foregroundColor, opacity: 0.56 }}
                    >
                        A little collection of moments I never want to forget.
                    </p>
                </motion.div>
            </div>

            {/* Closed album */}
            <AnimatePresence mode="wait">
                {isClosed && !isOpening && (
                    <motion.div
                        key="closed"
                        className="relative z-10 mx-auto w-full max-w-[280px] sm:max-w-sm"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 15 }}
                        transition={{ duration: 0.5, ease: easeSettle }}
                    >
                        <button
                            type="button"
                            onClick={openAlbum}
                            aria-label="Open memory album"
                            className="group relative block w-full cursor-pointer border-0 bg-transparent p-0"
                        >
                            <div
                                className="absolute -bottom-6 left-8 right-8 h-12 rounded-full blur-2xl"
                                style={{ background: `${foregroundColor}30` }}
                            />

                            <div
                                className="absolute inset-x-4 bottom-3 top-4 rounded-[16px]"
                                style={{
                                    background: "#ede0d5",
                                    transform: "rotate(2.2deg)",
                                    boxShadow: "0 12px 24px -12px rgba(0,0,0,.18)",
                                }}
                            />
                            <div
                                className="absolute inset-x-2 bottom-2 top-2 rounded-[16px]"
                                style={{
                                    background: "#f6ece2",
                                    transform: "rotate(-1.4deg)",
                                }}
                            />

                            <motion.div
                                className="relative w-full overflow-hidden rounded-[18px]"
                                whileHover={{ y: -6, rotate: -1 }}
                                whileTap={{ scale: 0.985 }}
                                transition={{ duration: 0.35, ease: easeSettle }}
                                style={{
                                    height: ALBUM_HEIGHT,
                                    background: `linear-gradient(140deg, ${primaryColor}, ${primaryColor}CC 60%, ${primaryColor}AA)`,
                                    boxShadow: `0 30px 60px -25px ${foregroundColor}60, inset 0 0 0 1px rgba(255,255,255,.22), inset 0 -8px 24px rgba(0,0,0,.15)`,
                                }}
                            >
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
                                    style={{
                                        backgroundImage: `radial-gradient(circle at 30% 30%, white 0.5px, transparent 1.2px), radial-gradient(circle at 70% 70%, white 0.5px, transparent 1.2px)`,
                                        backgroundSize: "14px 14px, 20px 20px",
                                    }}
                                />
                                <div
                                    className="pointer-events-none absolute inset-3 rounded-[14px] border"
                                    style={{ borderColor: "rgba(255,255,255,.35)" }}
                                />
                                <div
                                    className="pointer-events-none absolute inset-5 rounded-[11px] border"
                                    style={{ borderColor: "rgba(255,255,255,.12)" }}
                                />

                                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-white">
                  <span className="mb-3 text-[9px] uppercase tracking-[0.45em] opacity-75">
                    A collection of
                  </span>
                                    <h3
                                        className="text-center text-4xl italic leading-tight sm:text-5xl"
                                        style={{
                                            fontFamily:
                                                "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                        }}
                                    >
                                        Our
                                        <br />
                                        Memories
                                    </h3>
                                    <div
                                        className="my-5 h-px w-14"
                                        style={{ background: "rgba(255,255,255,.5)" }}
                                    />
                                    <span className="text-[10px] tracking-[0.3em] opacity-85">
                    A STORY WORTH KEEPING
                  </span>
                                </div>

                                {photos[0] && (
                                    <motion.div
                                        className="absolute -bottom-2 -right-2 rotate-[8deg] overflow-hidden rounded-sm border-[5px] border-white bg-white shadow-2xl"
                                        style={{ width: "5.5rem", height: "7rem" }}
                                        animate={{ rotate: [8, 6, 8], y: [0, -3, 0] }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <img
                                            src={photos[0].url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </motion.div>
                                )}

                                <motion.div
                                    className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.18em]"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                        duration: 2.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    style={{
                                        background: "rgba(18, 18, 32, 0.82)",
                                        border: "1px solid rgba(255,255,255,0.22)",
                                        color: "#FFFFFF",
                                        boxShadow:
                                            "0 10px 28px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.08)",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    <span aria-hidden="true" className="text-[13px] leading-none">
                                        ✨
                                    </span>
                                    Tap to open
                                </motion.div>
                            </motion.div>
                        </button>
                    </motion.div>
                )}

                {isOpening && (
                    <motion.div
                        key="opening"
                        className="relative z-10 mx-auto w-full max-w-3xl"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <AlbumOpeningAnimation
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                            isDesktop={isDesktop}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Open book */}
            {!isClosed && !isOpening && photos.length > 0 && (
                <motion.div
                    className="relative z-10 mx-auto w-full max-w-4xl"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: easeSettle }}
                >
                    <div
                        className="absolute -bottom-6 left-[10%] right-[10%] h-14 rounded-full blur-3xl"
                        style={{ background: `${foregroundColor}35` }}
                    />

                    <div
                        className="relative rounded-[20px] sm:rounded-[22px]"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor}22, #d8c8b8 50%, ${primaryColor}18)`,
                            boxShadow: `0 40px 80px -35px ${foregroundColor}60, 0 0 0 1px ${primaryColor}22`,
                            padding: "clamp(0.4rem, 1vh, 0.75rem)",
                            height: ALBUM_HEIGHT,
                        }}
                    >
                        <div
                            className="pointer-events-none absolute inset-x-2 bottom-1 top-2 rounded-[16px]"
                            style={{
                                background: "#e5d6c8",
                                transform: "translateY(6px) translateX(2px)",
                            }}
                        />
                        <div
                            className="pointer-events-none absolute inset-x-2 bottom-1 top-2 rounded-[16px]"
                            style={{
                                background: "#f2e7db",
                                transform: "translateY(3px) translateX(1px)",
                            }}
                        />

                        <div
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
                            className="relative overflow-hidden rounded-[16px]"
                            style={{
                                height: "100%",
                                background: "#fdfaf4",
                                perspective: isDesktop ? 2600 : 1400,
                                perspectiveOrigin: "50% 50%",
                            }}

                    >


                            <div
                                className="pointer-events-none absolute inset-0 z-[60] opacity-[0.06]"
                                style={{
                                    backgroundImage: `radial-gradient(circle at 20% 20%, ${foregroundColor} 0.5px, transparent 0.7px)`,
                                    backgroundSize: "11px 11px",
                                }}
                            />

                            {isDesktop ? (
                                <DesktopSpread
                                    spread={desktopSpread}
                                    spreadIndex={currentPage}
                                    primaryColor={primaryColor}
                                    foregroundColor={foregroundColor}
                                />
                            ) : (
                                <MobilePage
                                    photo={mobilePhoto}
                                    photoIndex={currentPage}
                                    total={photos.length}
                                    primaryColor={primaryColor}
                                    foregroundColor={foregroundColor}
                                />
                            )}

                            {direction && (
                                <PageFlip
                                    direction={direction}
                                    isDesktop={isDesktop}
                                    currentPhoto={
                                        isDesktop
                                            ? direction === "next"
                                                ? desktopSpread?.right
                                                : desktopSpread?.left
                                            : mobilePhoto
                                    }
                                    currentPhotoIndex={
                                        isDesktop
                                            ? direction === "next"
                                                ? desktopSpread?.rightIndex
                                                : desktopSpread?.leftIndex
                                            : currentPage
                                    }
                                    nextPhoto={
                                        isDesktop
                                            ? direction === "next"
                                                ? spreads[currentPage + 1]?.left
                                                : spreads[currentPage - 1]?.right
                                            : direction === "next"
                                                ? photos[currentPage + 1]
                                                : photos[currentPage - 1]
                                    }
                                    nextPhotoIndex={
                                        isDesktop
                                            ? direction === "next"
                                                ? spreads[currentPage + 1]?.leftIndex
                                                : spreads[currentPage - 1]?.rightIndex
                                            : direction === "next"
                                                ? currentPage + 1
                                                : currentPage - 1
                                    }
                                    total={photos.length}
                                    primaryColor={primaryColor}
                                    foregroundColor={foregroundColor}
                                />
                            )}

                            {isDesktop && (
                                <>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 left-1/2 z-[55] w-10 -translate-x-1/2"
                                        style={{
                                            background: `linear-gradient(90deg, transparent, rgba(40,25,15,.14) 30%, rgba(40,25,15,.05) 50%, rgba(40,25,15,.14) 70%, transparent)`,
                                        }}
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-y-4 left-1/2 z-[56] w-px -translate-x-1/2"
                                        style={{ background: "rgba(60,40,30,.16)" }}
                                    />
                                </>
                            )}

                            {!isDesktop && (
                                <div
                                    className="pointer-events-none absolute inset-y-0 left-0 z-[55] w-10"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, rgba(60,40,30,.22), rgba(60,40,30,.04) 50%, transparent 85%)",
                                    }}
                                />
                            )}

                            <button
                                type="button"
                                aria-label="Previous page"
                                onClick={goPrev}
                                disabled={currentPage === 0 || isTurning}
                                className="absolute inset-y-0 left-0 z-[70] w-1/2 cursor-w-resize border-0 bg-transparent disabled:cursor-default sm:w-1/3"
                            />
                            <button
                                type="button"
                                aria-label="Next page"
                                onClick={goNext}
                                disabled={currentPage === totalViews - 1 || isTurning}
                                className="absolute inset-y-0 right-0 z-[70] w-1/2 cursor-e-resize border-0 bg-transparent disabled:cursor-default sm:w-1/3"
                            />

                            {/* Flip instruction — on the page surface, high-contrast, never blocks taps */}
                            {!isTurning && !hasFlipped && totalViews > 1 && (
                                <motion.div
                                    className="pointer-events-none absolute bottom-4 left-1/2 z-[75] flex w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-center text-[11px] font-semibold leading-snug tracking-[0.04em] sm:bottom-5 sm:w-auto sm:max-w-none sm:px-5 sm:py-2.5 sm:text-xs"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: [1, 1.03, 1],
                                    }}
                                    transition={{
                                        opacity: { delay: 1.1, duration: 0.45 },
                                        y: { delay: 1.1, duration: 0.45 },
                                        scale: {
                                            delay: 1.7,
                                            duration: 2.4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        },
                                    }}
                                    style={{
                                        background: "rgba(18, 18, 32, 0.9)",
                                        border: `1px solid ${primaryColor}80`,
                                        color: "#FFFFFF",
                                        boxShadow: `0 12px 32px rgba(0,0,0,.42), 0 0 0 1px rgba(255,255,255,.06) inset`,
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    {isDesktop ? (
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className="rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold leading-none"
                                            >
                                                ←
                                            </span>
                                            <span>Click sides or use arrow keys</span>
                                            <span
                                                aria-hidden="true"
                                                className="rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold leading-none"
                                            >
                                                →
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className="text-[13px] leading-none"
                                            >
                                                👆
                                            </span>
                                            <span>Swipe or tap the sides to flip</span>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div
                        className="flex items-center justify-between gap-2 px-2 sm:px-4"
                        style={{ marginTop: "clamp(0.5rem, 1.5vh, 1.5rem)" }}
                    >
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={currentPage === 0 || isTurning}
                            className="group flex items-center gap-1.5 rounded-full border-0 bg-transparent px-3 py-2 text-xs transition disabled:opacity-20"
                            style={{ color: foregroundColor }}
                        >
              <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        <div className="flex flex-col items-center">
              <span
                  className="text-[9px] font-semibold uppercase tracking-[0.32em]"
                  style={{ color: foregroundColor, opacity: 0.42 }}
              >
                Our Memories
              </span>
                            <span
                                className="mt-0.5 text-xs"
                                style={{ color: foregroundColor, opacity: 0.6 }}
                            >
                {currentPage + 1} / {totalViews}
              </span>
                        </div>

                        <button
                            type="button"
                            onClick={goNext}
                            disabled={currentPage === totalViews - 1 || isTurning}
                            className="group flex items-center gap-1.5 rounded-full border-0 bg-transparent px-3 py-2 text-xs transition disabled:opacity-20"
                            style={{ color: foregroundColor }}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
                        </button>
                    </div>

                    <div
                        className="text-center"
                        style={{ marginTop: "clamp(0.5rem, 1.5vh, 1.5rem)" }}
                    >
                        <button
                            type="button"
                            onClick={closeAlbum}
                            disabled={isTurning}
                            className="rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition hover:opacity-80 disabled:opacity-30"
                            style={{
                                borderColor: `${foregroundColor}35`,
                                color: foregroundColor,
                                background: "rgba(255,255,255,.65)",
                                backdropFilter: "blur(6px)",
                            }}
                        >
                            Close album
                        </button>
                    </div>
                </motion.div>
            )}

            {videoUrl && !isClosed && !isOpening && (
                <motion.div
                    className="relative z-10 mx-auto max-w-3xl"
                    style={{ marginTop: "clamp(2rem, 6vh, 4rem)" }}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.7, ease: easeSettle }}
                >
                    <div className="mb-6 text-center">
            <span
                className="text-[9px] font-semibold uppercase tracking-[0.35em]"
                style={{ color: primaryColor }}
            >
              Moving Memory
            </span>
                        <h3
                            className="mt-2 text-2xl sm:text-3xl"
                            style={{
                                fontFamily:
                                    "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                            }}
                        >
                            A Moment That Came Alive
                        </h3>
                    </div>

                    <div
                        className="relative mx-auto max-w-2xl rotate-[-1deg] p-3 pb-10 sm:p-5 sm:pb-12"
                        style={{
                            background: "#fffdf9",
                            boxShadow: `0 25px 45px -20px ${foregroundColor}40, 0 1px 2px ${foregroundColor}12`,
                        }}
                    >
                        <div
                            className="absolute -top-3 left-1/2 z-10 h-8 w-24 -translate-x-1/2 rotate-2 opacity-80"
                            style={{ background: `${primaryColor}35` }}
                        />
                        <div className="aspect-video overflow-hidden bg-black">
                            <video
                                src={videoUrl}
                                controls
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <p
                            className="absolute bottom-2 left-0 right-0 text-center text-xs italic"
                            style={{
                                fontFamily:
                                    "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                color: foregroundColor,
                                opacity: 0.52,
                            }}
                        >
                            one of those moments worth keeping
                        </p>
                    </div>
                </motion.div>
            )}
        </section>
    );
};

/* =============================================================
   MOBILE PAGE
============================================================= */

interface MobilePageProps {
    photo: { id: string; url: string; type: "photo" };
    photoIndex: number;
    total: number;
    primaryColor: string;
    foregroundColor: string;
}

const MobilePage = ({
                        photo,
                        photoIndex,
                        total,
                        primaryColor,
                        foregroundColor,
                    }: MobilePageProps) => {
    return (
        <div
            className="relative flex h-full flex-col items-center justify-center"
            style={{
                background:
                    "radial-gradient(120% 100% at 50% 0%, #fffdf9, #fdfaf4 60%, #f7f0e6)",
                padding:
                    "clamp(0.75rem, 3vh, 3rem) clamp(0.75rem, 4vw, 2rem)",
            }}
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24"
                style={{
                    background: `linear-gradient(180deg, ${primaryColor}08, transparent)`,
                }}
            />

            <motion.div
                key={photo.id}
                className="relative w-full"
                style={{ maxWidth: "min(92%, 420px)" }}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: easeSettle }}
            >
                <div
                    className="absolute -inset-x-4 -bottom-6 top-8 rounded-full blur-2xl"
                    style={{ background: `${foregroundColor}30` }}
                />

                <div
                    className="relative rounded-[6px] bg-white p-2.5 pb-14 sm:p-3.5 sm:pb-16"
                    style={{
                        boxShadow: `0 20px 40px -20px ${foregroundColor}55, 0 2px 6px ${foregroundColor}15, inset 0 0 0 1px rgba(0,0,0,.03)`,
                        transform: "rotate(-0.8deg)",
                    }}
                >
                    <div
                        className="relative overflow-hidden rounded-[3px] bg-neutral-100"
                        style={{
                            aspectRatio: "4 / 5",
                            maxHeight: MOBILE_PHOTO_MAX_HEIGHT,
                            maxWidth: `calc((${MOBILE_PHOTO_MAX_HEIGHT}) * 4 / 5)`,
                            width: "100%",
                            marginInline: "auto",
                        }}
                    >
                        <img
                            src={photo.url}
                            alt={`Memory ${photoIndex + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            draggable={false}
                        />
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background: `linear-gradient(125deg, rgba(255,255,255,.14) 0%, transparent 40%, transparent 70%, rgba(0,0,0,.08) 100%)`,
                            }}
                        />
                    </div>

                    <div
                        className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-4 sm:bottom-4"
                        style={{ color: foregroundColor }}
                    >
            <span
                className="h-px w-6"
                style={{ background: `${foregroundColor}25` }}
            />
                        <span
                            className="text-[11px] italic sm:text-xs"
                            style={{
                                fontFamily:
                                    "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                opacity: 0.62,
                            }}
                        >
              Memory #{photoIndex + 1}
            </span>
                        <span
                            className="h-px w-6"
                            style={{ background: `${foregroundColor}25` }}
                        />
                    </div>
                </div>
            </motion.div>

            <div
                className="relative z-10 flex items-center gap-1.5"
                style={{ marginTop: "clamp(0.75rem, 2.5vh, 2rem)" }}
            >
                {Array.from({ length: total }).map((_, i) => (
                    <span
                        key={i}
                        className="h-1 rounded-full transition-all duration-300"
                        style={{
                            width: i === photoIndex ? "18px" : "6px",
                            background:
                                i === photoIndex ? primaryColor : `${foregroundColor}22`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

/* =============================================================
   DESKTOP SPREAD
============================================================= */

interface DesktopSpreadProps {
    spread?: {
        left?: { id: string; url: string; type: "photo" };
        right?: { id: string; url: string; type: "photo" };
        leftIndex?: number;
        rightIndex?: number;
    };
    spreadIndex: number;
    primaryColor: string;
    foregroundColor: string;
}

const DesktopSpread = ({
                           spread,
                           spreadIndex,
                           primaryColor,
                           foregroundColor,
                       }: DesktopSpreadProps) => {
    return (
        <div
            className="relative grid grid-cols-2"
            style={{
                background: "#fdfaf4",
                height: "100%",
            }}
        >
            <DesktopPage
                photo={spread?.left}
                photoIndex={spread?.leftIndex}
                side="left"
                primaryColor={primaryColor}
                foregroundColor={foregroundColor}
            />
            <DesktopPage
                photo={spread?.right}
                photoIndex={spread?.rightIndex}
                side="right"
                primaryColor={primaryColor}
                foregroundColor={foregroundColor}
            />

            <div
                className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 text-[8px] uppercase tracking-[0.3em]"
                style={{ color: foregroundColor, opacity: 0.28 }}
            >
                {spreadIndex === 0 ? "The beginning" : `Memory ${spreadIndex + 1}`}
            </div>
        </div>
    );
};

interface DesktopPageProps {
    photo?: { id: string; url: string; type: "photo" };
    photoIndex?: number;
    side: "left" | "right";
    primaryColor: string;
    foregroundColor: string;
}

const DesktopPage = ({
                         photo,
                         photoIndex,
                         side,
                         primaryColor,
                         foregroundColor,
                     }: DesktopPageProps) => {
    const bg =
        side === "left"
            ? "radial-gradient(140% 100% at 0% 0%, #fffdf9, #fdfaf4)"
            : "radial-gradient(140% 100% at 100% 0%, #fffdf9, #fdfaf4)";

    if (!photo) {
        return (
            <div
                className="relative flex items-center justify-center overflow-hidden"
                style={{
                    background: bg,
                    padding:
                        "clamp(0.75rem, 2.5vh, 2.5rem) clamp(0.75rem, 2vw, 1.5rem)",
                }}
            >
                <div
                    className="text-center"
                    style={{ color: foregroundColor, opacity: 0.3 }}
                >
                    <div className="mb-2 text-3xl" style={{ color: primaryColor }}>
                        ♡
                    </div>
                    <p
                        className="text-xs italic"
                        style={{
                            fontFamily:
                                "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                        }}
                    >
                        More memories to come...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{
                background: bg,
                padding:
                    "clamp(0.75rem, 2.5vh, 2.5rem) clamp(0.75rem, 2vw, 1.5rem)",
            }}
        >
            <motion.div
                key={photo.id}
                className="relative w-full"
                style={{
                    maxWidth: "min(300px, 90%)",
                    maxHeight: "100%",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeSettle }}
            >
                <div
                    className="absolute -inset-x-3 -bottom-4 top-6 rounded-full blur-2xl"
                    style={{ background: `${foregroundColor}28` }}
                />

                <div
                    className="relative rounded-[5px] bg-white p-2.5 pb-11"
                    style={{
                        boxShadow: `0 18px 35px -18px ${foregroundColor}55, 0 1px 3px ${foregroundColor}12`,
                        transform: side === "left" ? "rotate(-1deg)" : "rotate(1deg)",
                        maxHeight: "100%",
                    }}
                >
                    <div
                        className="relative overflow-hidden rounded-[3px] bg-neutral-100"
                        style={{
                            aspectRatio: "4 / 5",
                            maxHeight: DESKTOP_PHOTO_MAX_HEIGHT,
                            maxWidth: `calc((${DESKTOP_PHOTO_MAX_HEIGHT}) * 4 / 5)`,
                            width: "100%",
                            marginInline: "auto",
                        }}
                    >
                        <img
                            src={photo.url}
                            alt={`Memory ${(photoIndex ?? 0) + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            draggable={false}
                        />
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background: `linear-gradient(125deg, rgba(255,255,255,.12) 0%, transparent 40%, transparent 70%, rgba(0,0,0,.08) 100%)`,
                            }}
                        />
                    </div>

                    <div
                        className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-2"
                        style={{ color: foregroundColor }}
                    >
            <span
                className="h-px w-5"
                style={{ background: `${foregroundColor}25` }}
            />
                        <span
                            className="text-[10px] italic"
                            style={{
                                fontFamily:
                                    "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                opacity: 0.6,
                            }}
                        >
              Memory #{(photoIndex ?? 0) + 1}
            </span>
                        <span
                            className="h-px w-5"
                            style={{ background: `${foregroundColor}25` }}
                        />
                    </div>
                </div>
            </motion.div>

            <span
                className="absolute bottom-4 text-[9px] tracking-[0.28em]"
                style={{
                    [side === "left" ? "left" : "right"]: "18px",
                    color: foregroundColor,
                    opacity: 0.28,
                }}
            >
        {String((photoIndex ?? 0) + 1).padStart(2, "0")}
      </span>
        </div>
    );
};

/* =============================================================
   PAGE FLIP — horizontal page-turn around the spine on both platforms
============================================================= */

interface PageFlipProps {
    direction: "next" | "previous";
    isDesktop: boolean;
    currentPhoto?: { id: string; url: string; type: "photo" };
    currentPhotoIndex?: number;
    nextPhoto?: { id: string; url: string; type: "photo" };
    nextPhotoIndex?: number;
    total: number;
    primaryColor: string;
    foregroundColor: string;
}

const PageFlip = ({
                      direction,
                      isDesktop,
                      currentPhoto,
                      currentPhotoIndex,
                      nextPhoto,
                      nextPhotoIndex,
                      total,
                      primaryColor,
                      foregroundColor,
                  }: PageFlipProps) => {
    const isNext = direction === "next";
    const durationSec = (isDesktop ? FLIP_MS_DESKTOP : FLIP_MS_MOBILE) / 1000;

    /** rotateY on both platforms: page swings around a vertical spine. */
    const axis = "rotateY";

    const originStyle: React.CSSProperties = isDesktop
        ? isNext
            ? { right: 0, transformOrigin: "left center" }
            : { left: 0, transformOrigin: "right center" }
        : // MOBILE: next hinges left (spine), prev hinges right and peels back
          {
              inset: 0,
              transformOrigin: isNext ? "left center" : "right center",
          };

    const containerClass = isDesktop
        ? `absolute inset-y-0 z-50 w-1/2 ${isNext ? "right-0" : "left-0"}`
        : "absolute inset-0 z-50";

    const frontShade = isNext
        ? "linear-gradient(90deg, transparent 35%, rgba(30,20,15,.55) 100%)"
        : "linear-gradient(270deg, transparent 35%, rgba(30,20,15,.55) 100%)";

    const backShade = isNext
        ? "linear-gradient(270deg, transparent 35%, rgba(30,20,15,.5) 100%)"
        : "linear-gradient(90deg, transparent 35%, rgba(30,20,15,.5) 100%)";

    const frontSide: "left" | "right" = isDesktop
        ? isNext
            ? "right"
            : "left"
        : "left";

    const backSide: "left" | "right" = isDesktop
        ? isNext
            ? "left"
            : "right"
        : "right";

    /** Lift off the spine mid-turn, settle softly — paper weight. */
    const rotationKeyframes = isNext ? [0, -20, -155, -180] : [0, 20, 155, 180];
    const liftKeyframes = isDesktop ? [0, 16, 38, 0] : [0, 10, 24, 0];

    return (
        <motion.div
            className={containerClass}
            initial={{ [axis]: 0, translateZ: 0 }}
            animate={{
                [axis]: rotationKeyframes,
                translateZ: liftKeyframes,
            }}
            transition={{
                duration: durationSec,
                ease: easePaper,
                times: [0, 0.32, 0.72, 1],
            }}
            style={{
                ...originStyle,
                transformStyle: "preserve-3d",
                willChange: "transform",
            }}
        >
            {/* Front face */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{
                    background: "#fdfaf4",
                    backfaceVisibility: "hidden",
                    boxShadow: isDesktop
                        ? isNext
                            ? "-16px 0 40px rgba(30,20,15,.18)"
                            : "16px 0 40px rgba(30,20,15,.18)"
                        : "0 22px 40px rgba(30,20,15,.2)",
                }}
            >
                {currentPhoto ? (
                    isDesktop ? (
                        <DesktopPage
                            photo={currentPhoto}
                            photoIndex={currentPhotoIndex}
                            side={frontSide}
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    ) : (
                        <MobilePage
                            photo={currentPhoto}
                            photoIndex={currentPhotoIndex ?? 0}
                            total={total}
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    )
                ) : null}

                <motion.div
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0.55] }}
                    transition={{
                        duration: durationSec,
                        ease: easePaper,
                        times: [0, 0.5, 1],
                    }}
                    style={{ background: frontShade }}
                />
            </div>

            {/* Back face */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{
                    background: "#fdfaf4",
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                }}
            >
                {nextPhoto ? (
                    isDesktop ? (
                        <DesktopPage
                            photo={nextPhoto}
                            photoIndex={nextPhotoIndex}
                            side={backSide}
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    ) : (
                        <MobilePage
                            photo={nextPhoto}
                            photoIndex={nextPhotoIndex ?? 0}
                            total={total}
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    )
                ) : (
                    <EmptyTurnPage
                        primaryColor={primaryColor}
                        foregroundColor={foregroundColor}
                    />
                )}

                <motion.div
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0.55 }}
                    animate={{ opacity: [0.55, 0.25, 0] }}
                    transition={{
                        duration: durationSec,
                        ease: easePaper,
                        times: [0, 0.55, 1],
                    }}
                    style={{ background: backShade }}
                />
            </div>

            {/* Paper thickness — hinge edge */}
            <div
                className="pointer-events-none absolute"
                style={
                    isDesktop
                        ? {
                            top: 0,
                            bottom: 0,
                            width: 10,
                            [isNext ? "left" : "right"]: 0,
                            background: isNext
                                ? "linear-gradient(90deg, rgba(80,50,35,.18), transparent)"
                                : "linear-gradient(270deg, rgba(80,50,35,.18), transparent)",
                        }
                        : {
                            top: 0,
                            bottom: 0,
                            [isNext ? "left" : "right"]: 0,
                            width: 12,
                            background: isNext
                                ? "linear-gradient(90deg, rgba(80,50,35,.18), transparent)"
                                : "linear-gradient(270deg, rgba(80,50,35,.18), transparent)",
                        }
                }
            />
        </motion.div>
    );
};

/* =============================================================
   ALBUM OPENING
============================================================= */

interface AlbumOpeningAnimationProps {
    primaryColor: string;
    foregroundColor: string;
    isDesktop: boolean;
}

const AlbumOpeningAnimation = ({
                                   primaryColor,
                                   foregroundColor,
                                   isDesktop,
                               }: AlbumOpeningAnimationProps) => {
    const coverDuration = isDesktop ? 1.1 : 1.35;
    const aspect = isDesktop ? "1.55 / 1" : "3 / 4";
    const maxWidth = isDesktop ? "40rem" : "min(68vw, 260px)";
    const coverRotate = isDesktop ? -118 : -102;

    return (
        <div
            className="relative mx-auto w-full"
            style={{
                aspectRatio: aspect,
                maxWidth,
                perspective: 1800,
                perspectiveOrigin: "50% 42%",
            }}
        >
            {/* Soft glow behind the book */}
            <motion.div
                className="pointer-events-none absolute -inset-8 rounded-[32px] blur-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0, 0.85, 0.5], scale: [0.9, 1.05, 1] }}
                transition={{ duration: coverDuration + 0.25, ease: "easeOut" }}
                style={{ background: `${primaryColor}28` }}
            />

            <motion.div
                className="absolute inset-0"
                initial={{ scale: 0.93, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: coverDuration, ease: easeSettle }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Back cover — closed-album gradient */}
                <div
                    className="absolute inset-0 rounded-[18px]"
                    style={{
                        background: `linear-gradient(140deg, ${primaryColor}, ${primaryColor}CC 60%, ${primaryColor}AA)`,
                        boxShadow:
                            "0 40px 80px rgba(20,10,10,.32), inset 0 0 0 1px rgba(255,255,255,.16)",
                    }}
                />

                {/* Staggered inner pages — fan open under the cover */}
                {[0, 1].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-[13px]"
                        style={{
                            inset: isDesktop
                                ? `${10 + i * 5}px ${14 + i * 8}px`
                                : "14px 12px",
                            transformOrigin: "left center",
                            background:
                                i === 0
                                    ? "linear-gradient(180deg, #fffdf9, #f7f0e6)"
                                    : "#fdfaf4",
                            boxShadow:
                                "1px 2px 12px rgba(40,20,15,.14), inset 0 0 0 1px rgba(0,0,0,.03)",
                            zIndex: 5 - i,
                        }}
                        initial={{ rotateY: 0, opacity: 0, y: 0 }}
                        animate={{
                            rotateY: isDesktop ? -7 - i * 5 : -3 - i * 2,
                            opacity: 1,
                            y: -2 - i,
                        }}
                        transition={{
                            duration: coverDuration * 0.8,
                            delay: 0.1 + i * 0.08,
                            ease: easeSettle,
                        }}
                    />
                ))}

                {/* Front cover — matches closed album */}
                <motion.div
                    className="absolute inset-0 rounded-[18px]"
                    style={{
                        transformOrigin: "left center",
                        transformStyle: "preserve-3d",
                        zIndex: 10,
                        background: `linear-gradient(140deg, ${primaryColor}, ${primaryColor}CC 60%, ${primaryColor}AA)`,
                        boxShadow:
                            "0 28px 55px rgba(20,10,10,.30), inset 0 0 0 1px rgba(255,255,255,.22)",
                    }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: [0, -6, coverRotate] }}
                    transition={{
                        duration: coverDuration,
                        ease: easeSettle,
                        times: [0, 0.18, 1],
                    }}
                >
                    <motion.div
                        className="absolute inset-0"
                        animate={{ opacity: [1, 1, 0] }}
                        transition={{
                            duration: coverDuration,
                            times: [0, 0.4, 0.85],
                        }}
                    >
                        <div
                            className="pointer-events-none absolute inset-3 rounded-[14px] border"
                            style={{ borderColor: "rgba(255,255,255,.35)" }}
                        />
                        <div
                            className="pointer-events-none absolute inset-5 rounded-[11px] border"
                            style={{ borderColor: "rgba(255,255,255,.12)" }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-white">
                            <span className="mb-2 text-[8px] uppercase tracking-[0.4em] opacity-70">
                                A collection of
                            </span>
                            <span
                                className="text-center text-2xl italic leading-tight sm:text-3xl"
                                style={{
                                    fontFamily:
                                        "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                }}
                            >
                                Our
                                <br />
                                Memories
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Light sweep across the opening */}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[18px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: coverDuration,
                        times: [0, 0.4, 1],
                    }}
                >
                    <motion.div
                        className="absolute inset-y-0 w-2/3"
                        style={{
                            background:
                                "linear-gradient(105deg, transparent, rgba(255,255,255,.5), transparent)",
                            filter: "blur(10px)",
                        }}
                        initial={{ left: "-70%" }}
                        animate={{ left: "130%" }}
                        transition={{
                            duration: coverDuration * 0.85,
                            delay: 0.12,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Caption */}
            <motion.div
                className="absolute -bottom-9 left-0 right-0 text-center text-[9px] uppercase tracking-[0.35em]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: [0, 0.55, 0], y: [6, 0, -4] }}
                transition={{ duration: coverDuration + 0.2 }}
                style={{ color: foregroundColor }}
            >
                Opening your memories
            </motion.div>
        </div>
    );
};

/* =============================================================
   EMPTY TURN PAGE
============================================================= */

interface EmptyTurnPageProps {
    primaryColor: string;
    foregroundColor: string;
}

const EmptyTurnPage = ({
                           primaryColor,
                           foregroundColor,
                       }: EmptyTurnPageProps) => {
    return (
        <div
            className="flex h-full items-center justify-center"
            style={{ background: "#fdfaf4" }}
        >
            <div
                className="text-center"
                style={{ color: foregroundColor, opacity: 0.25 }}
            >
                <div className="mb-2 text-3xl" style={{ color: primaryColor }}>
                    ♡
                </div>
                <p
                    className="text-xs italic"
                    style={{
                        fontFamily:
                            "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                    }}
                >
                    More memories...
                </p>
            </div>
        </div>
    );
};