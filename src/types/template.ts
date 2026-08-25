export type AnimationType = "fade" | "slide" | "scale" | "confetti" | "slide-up" | "slide-down" | "zoom-in";
export type StageType =
  | "envelope"
  | "gift-box"
  | "cake"
  | "ribbon"
  | "main-content"
  | "letter"
  | "photo-gallery"
  | "video-player"
  | "voice-message"
  | "music-player"
  | "poem-display"
  | "memory-timeline"
  | "gift-challenge"
  | "spin-wheel"
  | "closing";

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
  thumbnail: string;
  stages: StageConfig[];
  theme: ThemeConfig;
}
