export type AnimationType = "fade" | "slide" | "scale" | "confetti" | "slide-up" | "slide-down" | "zoom-in";

/**
 * Stage types for the new 11-screen experience (Phase 2 redesign).
 *
 * Common Beginning (Screens 1-5):
 *   introduction → unlock → start → gift-reveal → gift-opening
 *
 * Chapters (Screens 6-10, within "chapters" phase):
 *   letter → photos → poem → timeline → gift
 *
 * Finale (Screen 11):
 *   closing
 *
 * Legacy types are kept for backward compatibility.
 */
export type StageType =
  // ── New experience screens ──
  | "introduction" // Screen 1
  | "unlock" // Screen 2
  | "start" // Screen 3
  | "gift-reveal" // Screen 4
  | "gift-opening" // Screen 5
  | "letter" // Screen 6
  | "photos" // Screen 7
  | "poem" // Screen 8
  | "song" // Screen 9 (YouTube video chapter)
  | "timeline" // Screen 10
  | "gift" // Screen 11
  | "closing" // Screen 12
  // ── Legacy stage types (kept for backward compatibility) ──
  | "envelope"
  | "gift-box"
  | "cake"
  | "ribbon"
  | "main-content"
  | "photo-gallery"
  | "video-player"
  | "voice-message"
  | "music-player"
  | "poem-display"
  | "memory-timeline"
  | "fancy-facts"
  | "gift-challenge"
  | "spin-wheel";

export interface AnimationConfig {
  type: AnimationType;
  duration?: number; // seconds
  delay?: number; // seconds
  stagger?: number; // seconds between child animations
}

export interface StageConfig {
  type: StageType;
  enabled: boolean;
  props: Record<string, unknown>;
  animation?: AnimationConfig;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  decorations: {
    style: string; // e.g., "balloons", "confetti", "elegant"
    density: "light" | "medium" | "heavy";
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  occasion: string;
  thumbnail: string; // URL or path to a preview image for the template (e.g. "/templates/birthday/classic.jpg"). It's a string path, not an ID reference, so `thumbnailImageId` would be misleading. The name `thumbnail` is clear and conventional for preview images.
  stages: StageConfig[];
  theme: ThemeConfig;
}
