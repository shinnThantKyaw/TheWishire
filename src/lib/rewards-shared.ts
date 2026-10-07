import type { RewardItem } from "@/types/experience";

/**
 * Shared reward constants (GIFT-03) — safe for client AND server.
 * Crypto/HMAC helpers live in `rewards.ts` (server-only, node:crypto).
 */

/** Fallback prize pool when a wish has no miniGame config (8 items, varied weights). */
export const DEFAULT_MINI_GAME_ITEMS: RewardItem[] = [
  { id: "1", label: "Love Note", emoji: "💌", description: "A sweet note", probability: 22 },
  { id: "2", label: "Flowers", emoji: "🌸", description: "Virtual flowers", probability: 18 },
  { id: "3", label: "Chocolate", emoji: "🍫", description: "Sweet treat", probability: 18 },
  { id: "4", label: "Warm Hug", emoji: "🤗", description: "Extra warm hug", probability: 14 },
  { id: "5", label: "Sweet Song", emoji: "🎵", description: "A song for you", probability: 10 },
  { id: "6", label: "Star Gift", emoji: "⭐", description: "Special prize", probability: 8 },
  { id: "7", label: "Lucky Cat", emoji: "🐱", description: "Lucky companion", probability: 6 },
  { id: "8", label: "Golden Star", emoji: "🌟", description: "Rarest prize", probability: 4 },
];

export const DEFAULT_ATTEMPTS = 3;

/** Deterministic fun points from label length (matches ticket wallet formula). */
export const bonusPointsFor = (label: string): number =>
  100 + ((label.length * 55) % 900);
