import { z } from "zod";

// ──────────────────────────────────────────────
// Animation Schema
// ──────────────────────────────────────────────

export const AnimationTypeSchema = z.enum([
  "fade",
  "slide",
  "scale",
  "confetti",
  "slide-up",
  "slide-down",
  "zoom-in",
]);

export const AnimationConfigSchema = z.object({
  type: AnimationTypeSchema,
  duration: z.number().min(0.1).max(5).optional(),
  delay: z.number().min(0).max(3).optional(),
  stagger: z.number().min(0).max(1).optional(),
});

// ──────────────────────────────────────────────
// Theme Schema
// ──────────────────────────────────────────────

export const ThemeConfigSchema = z.object({
  colors: z.object({
    primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    foreground: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  fonts: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
  }),
  decorations: z.object({
    style: z.string().min(1),
    density: z.enum(["light", "medium", "heavy"]),
  }),
});

// ──────────────────────────────────────────────
// Stage Schema
// ──────────────────────────────────────────────

export const StageTypeSchema = z.enum([
  "envelope",
  "gift-box",
  "cake",
  "ribbon",
  "main-content",
  "letter",
  "photo-gallery",
  "video-player",
  "voice-message",
  "music-player",
  "poem-display",
  "memory-timeline",
  "gift-challenge",
  "spin-wheel",
  "closing",
]);

export const StageConfigSchema = z.object({
  type: StageTypeSchema,
  enabled: z.boolean(),
  props: z.record(z.string(), z.unknown()),
  animation: AnimationConfigSchema.optional(),
});

// ──────────────────────────────────────────────
// Template Schema
// ──────────────────────────────────────────────

export const TemplateConfigSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  occasion: z.string().min(1),
  thumbnail: z.string().url(),
  stages: z.array(StageConfigSchema).min(1).max(15),
  theme: ThemeConfigSchema,
});

// ──────────────────────────────────────────────
// Wish Config Schema
// ──────────────────────────────────────────────

export const WishContentSchema = z.object({
  letter: z.string().max(5000).optional(),
  poem: z
    .object({
      id: z.string(),
      title: z.string(),
      author: z.string(),
      text: z.string(),
    })
    .optional(),
  music: z
    .object({
      id: z.string(),
      title: z.string(),
      artist: z.string(),
      url: z.string().url(),
      mood: z.string(),
    })
    .optional(),
  voiceMessageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  memoryTimeline: z
    .array(
      z.object({
        date: z.string(),
        title: z.string().max(100),
        description: z.string().max(500).optional(),
        photoUrl: z.string().url().optional(),
        videoUrl: z.string().url().optional(),
      })
    )
    .max(20)
    .optional(),
});

export const WishSettingsSchema = z.object({
  intensity: z.enum(["subtle", "celebration"]),
  enableGiftBox: z.boolean(),
  enableCake: z.boolean(),
  enableRibbon: z.boolean(),
  enableVoiceMessage: z.boolean(),
  enableMusic: z.boolean(),
  enablePoem: z.boolean(),
  enableTimeline: z.boolean(),
  enableGiftChallenge: z.boolean(),
  enableSpinWheel: z.boolean(),
  surpriseLock: z
    .object({
      unlockAt: z.string().datetime(),
      message: z.string().max(200).optional(),
    })
    .optional(),
});

export const WishConfigSchema = z.object({
  stages: z.array(
    z.object({
      type: z.string(),
      enabled: z.boolean(),
      config: z.record(z.string(), z.unknown()),
    })
  ),
  content: WishContentSchema,
  settings: WishSettingsSchema,
});

// ──────────────────────────────────────────────
// Wish Creation Schema
// ──────────────────────────────────────────────

export const CreateWishSchema = z.object({
  title: z.string().min(1).max(100),
  occasion: z.string().min(1),
  templateId: z.string().min(1),
  recipientName: z.string().min(1).max(100),
  senderName: z.string().min(1).max(100),
});

// ──────────────────────────────────────────────
// Inferred Types
// ──────────────────────────────────────────────

export type AnimationConfigInput = z.infer<typeof AnimationConfigSchema>;
export type ThemeConfigInput = z.infer<typeof ThemeConfigSchema>;
export type StageConfigInput = z.infer<typeof StageConfigSchema>;
export type TemplateConfigInput = z.infer<typeof TemplateConfigSchema>;
export type WishConfigInput = z.infer<typeof WishConfigSchema>;
export type CreateWishInput = z.infer<typeof CreateWishSchema>;
