export type Occasion = "birthday" | "anniversary" | "valentine" | "wedding" | "graduation" | "friendship" | "thank-you";

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
}

export interface StageContent {
  type: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface WishContent {
  letter?: string;
  poem?: PoemSelection;
  music?: MusicSelection;
  voiceMessageUrl?: string;
  videoUrl?: string;
  memoryTimeline?: MemoryTimelineEntry[];
}

export interface PoemSelection {
  id: string;
  title: string;
  author: string;
  text: string;
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
