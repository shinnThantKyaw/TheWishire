import type { WishConfig, MergedStage } from "@/types/wish";
import type { TemplateConfig, StageConfig } from "@/types/template";

/** Prisma returns type as string, not the narrow MediaType union */
interface RawMedia {
  id: string;
  type: string;
  url: string;
  filename?: string | null;
  sizeBytes?: number | null;
  sortOrder: number;
}

/**
 * Maps WishSettings boolean toggles to their corresponding stage types.
 * If a setting is disabled, we skip that stage entirely.
 * Used for legacy stage types that have enable/disable toggles.
 */
const STAGE_SETTING_MAP: Record<string, keyof WishConfig["settings"]> = {
  // Legacy stage toggles
  "gift-box": "enableGiftBox",
  cake: "enableCake",
  ribbon: "enableRibbon",
  "voice-message": "enableVoiceMessage",
  "music-player": "enableMusic",
  "poem-display": "enablePoem",
  "memory-timeline": "enableTimeline",
  "gift-challenge": "enableGiftChallenge",
  "spin-wheel": "enableSpinWheel",
};

/**
 * New experience stage types that don't have enable/disable toggles.
 * These are always enabled if the template says so.
 */
const NEW_STAGE_TYPES = new Set([
  "introduction",
  "start",
  "gift-reveal",
  "gift-opening",
  "letter",
  "photos",
  "poem",
  "timeline",
  "gift",
  "closing",
]);

/**
 * Merges template stage config with wish content into a render-ready MergedStage array.
 *
 * Template provides: stage order, props, animation config
 * Wish config provides: content (letter, photos, etc.), settings (which stages are on)
 * Media provides: photo/video URLs mapped to the appropriate stage
 */
export const mergeWishWithTemplate = (
  wishConfig: WishConfig,
  template: TemplateConfig,
  media: RawMedia[],
): MergedStage[] => {
  const { content, settings } = wishConfig;

  // Partition media by type
  const photos = media
    .filter((m) => m.type === "photo")
    .map((m) => ({ id: m.id, url: m.url, type: "photo" as const }));

  const videos = media.filter((m) => m.type === "video");
  const voiceMessages = media.filter((m) => m.type === "voice");

  // Map stages from template, filtering by enabled settings
  const mergedStages: MergedStage[] = template.stages
    .filter((stage) => isStageEnabled(stage, settings))
    .map((stage) =>
      buildMergedStage(stage, content, { photos, videos, voiceMessages }),
    );

  return mergedStages;
};

/** Check if a template stage should be rendered based on wish settings */
const isStageEnabled = (
  stage: StageConfig,
  settings: WishConfig["settings"],
): boolean => {
  // If the template explicitly disables it, skip
  if (!stage.enabled) return false;

  // New experience stage types: always enabled if template says so
  if (NEW_STAGE_TYPES.has(stage.type)) return true;

  // Legacy stage types: check the wish settings toggle
  const settingKey = STAGE_SETTING_MAP[stage.type];
  if (settingKey && !settings[settingKey]) return false;

  return true;
};

/** Build a MergedStage by combining template props with wish content */
const buildMergedStage = (
  stage: StageConfig,
  content: WishConfig["content"],
  media: {
    photos: { id: string; url: string; type: "photo" }[];
    videos: RawMedia[];
    voiceMessages: RawMedia[];
  },
): MergedStage => {
  const stageContent: MergedStage["content"] = {
    photos: [],
  };

  // Attach content relevant to each stage type
  switch (stage.type) {
    // ── New experience stages ──
    case "letter":
      stageContent.letter = content.letter;
      stageContent.photos = media.photos;
      break;

    case "photos":
      stageContent.photos = media.photos;
      stageContent.videoUrl = content.videoUrl;
      break;

    case "poem":
      stageContent.poem = content.poem ?? undefined;
      break;

    case "timeline":
      stageContent.memoryTimeline = content.memoryTimeline;
      break;

    case "gift":
      // Gift chapter gets its config from settings.giftChapter
      break;

    // Stages with no content needed (introduction, start,
    // gift-reveal, gift-opening, closing) — render from props only
    case "introduction":
    case "start":
    case "gift-reveal":
    case "gift-opening":
    case "closing":
      break;

    // ── Legacy stage types (kept for backward compatibility) ──
    case "main-content":
      stageContent.letter = content.letter;
      stageContent.photos = media.photos;
      stageContent.poem = content.poem ?? undefined;
      break;

    case "photo-gallery":
      stageContent.photos = media.photos;
      break;

    case "video-player":
      stageContent.videoUrl = content.videoUrl;
      break;

    case "voice-message":
      stageContent.voiceMessageUrl =
        content.voiceMessageUrl ?? media.voiceMessages[0]?.url;
      break;

    case "music-player":
      stageContent.music = content.music ?? undefined;
      break;

    case "poem-display":
      stageContent.poem = content.poem ?? undefined;
      break;

    case "memory-timeline":
      stageContent.memoryTimeline = content.memoryTimeline;
      break;

    // Stages that don't need content
    case "envelope":
    case "gift-box":
    case "cake":
    case "ribbon":
    case "fancy-facts":
    case "gift-challenge":
    case "spin-wheel":
      break;
  }

  return {
    type: stage.type,
    enabled: true, // Already filtered by isStageEnabled
    props: stage.props,
    animation: stage.animation,
    content: stageContent,
  };
};
