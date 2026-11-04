export type Occasion =
  | "birthday"
  | "anniversary"
  | "valentine"
  | "girlfriend-day"
  | "boyfriend-day"
  | "thadingyut"
  | "thingyan";

export type MediaType = "photo" | "video" | "voice";

export interface WishMedia {
  id: string;
  wishId: string;
  type: MediaType;
  url: string;
  filename?: string;
  sizeBytes?: number;
  sortOrder: number;
  createdAt: Date;
}


export interface WishConfig {
  stages: StageContent[];
  content: WishContent;
  settings: WishSettings;
  /** Casual names for copy slots (cake, gift, chapters). Fall back to the
   *  DB-level recipientName/senderName when unset. */
  recipientNickname?: string;
  senderNickname?: string;
}


export interface StageContent {
  type: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

import type {
  FlowMode as ExperienceFlowMode,
  GateType,
  StartAction,
  BoxOpenMethod,
  MiniGameConfig,
  MaterialTheme,
} from "./experience";

/**
 * @deprecated Use ExperienceFlowMode from experience.ts instead.
 * Kept for backward compatibility during migration.
 */
export type FlowMode = ExperienceFlowMode;

export interface WishContent {
  letter?: string;
  poem?: PoemSelection;
  song?: SongSelection;
  music?: MusicSelection;
  voiceMessageUrl?: string;
  videoUrl?: string;
  memoryTimeline?: MemoryTimelineEntry[];
  musicUrl?: string;
  characterGif?: CharacterGifConfig;
  decorations?: DecorationConfig;
}

export interface CharacterGifConfig {
  src: string;
  position: "bottom-left" | "bottom-right" | "center-bottom";
  alt?: string;
}

export interface DecorationConfig {
  elements: Array<"flowers" | "sparkles" | "confetti" | "balloons" | "stars" | "hearts">;
  density: "light" | "medium" | "heavy";
}

export interface PoemSelection {
  id: string;
  title: string;
  author: string;
  text: string;
}

/** A YouTube video the creator picked for the song chapter. */
export interface SongSelection {
  /** Any YouTube URL (watch, youtu.be, shorts, embed) or a bare video ID. */
  youtubeUrl: string;
  title?: string;
  artist?: string;
}

export interface MusicSelection {
  id: string;
  title: string;
  artist: string;
  url: string;
  mood: string;
}

export interface MemoryTimelineEntry {
  date: string;
  title: string;
  description?: string;
  photoUrl?: string;
  videoUrl?: string;
}

export interface WishSettings {
  intensity: "subtle" | "celebration";
  flowMode: FlowMode;
  // ── Legacy stage toggles (kept for backward compat) ──
  enableGiftBox: boolean;
  enableCake: boolean;
  enableRibbon: boolean;
  enableVoiceMessage: boolean;
  enableMusic: boolean;
  enablePoem: boolean;
  enableTimeline: boolean;
  enableGiftChallenge: boolean;
  enableSpinWheel: boolean;
  surpriseLock?: SurpriseLock;
  // ── New experience settings (Phase 2 redesign) ──
  gateType?: GateType;
  startAction?: StartAction;
  boxOpenMethod?: BoxOpenMethod;
  giftChapter?: GiftChapterConfig;
  materialTheme?: MaterialTheme;
}

/** Configuration for the Gift & Rewards chapter (Screen 10). */
export interface GiftChapterConfig {
  /** The pre-reveal gate challenge. */
  gateAction?: StartAction;
  /** Main gift message from the creator. */
  mainGiftMessage?: string;
  /** Photos of the physical gift (URLs from WishMedia). */
  mainGiftPhotoIds?: string[];
  /** Mini-game configuration. */
  miniGame?: MiniGameConfig;
}

export interface SurpriseLock {
  unlockAt: string; // ISO datetime
  message?: string;
}




export interface Wish {
  id: string;
  userId: string;
  title: string;
  occasion: Occasion;
  templateId: string;
  recipientName: string;
  senderName: string;
  config: WishConfig;
  published: boolean;
  slug?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Merge Output ───────────────────────────────────────
// Produced by mergeWishWithTemplate — combines template structure
// with wish content into a render-ready shape for client components.

import type { StageType, AnimationConfig } from "./template";

export interface MergedStage {
  type: StageType;
  enabled: boolean;
  props: Record<string, unknown>;
  animation?: AnimationConfig;
  content: {
    letter?: string;
    poem?: PoemSelection;
    song?: SongSelection;
    photos: { id: string; url: string; type: "photo" }[];
    voiceMessageUrl?: string;
    videoUrl?: string;
    memoryTimeline?: MemoryTimelineEntry[];
    music?: MusicSelection;
    musicUrl?: string;
    characterGif?: CharacterGifConfig;
    decorations?: DecorationConfig;
  };
}
