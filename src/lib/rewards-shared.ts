import { copy } from "@/config/copy";
import type { RewardItem } from "@/types/experience";

/**
 * Shared reward constants (GIFT-03) — safe for client AND server.
 * Crypto/HMAC helpers live in `rewards.ts` (server-only, node:crypto).
 * copy.ts is import-safe here too — prize text is dictionary-sourced so
 * the wheel/booth translate with everything else (task 1.5 follow-up Q1).
 */

/** Weights for the 8 default prizes, keyed by copy.rewards.pool order. */
const DEFAULT_POOL_PROBABILITIES = [22, 18, 18, 14, 10, 8, 6, 4];

/** Fallback prize pool when a wish has no miniGame config (8 items, varied weights). */
export const DEFAULT_MINI_GAME_ITEMS: RewardItem[] = copy.rewards.pool.map((item, index) => ({
  ...item,
  probability: DEFAULT_POOL_PROBABILITIES[index] ?? 4,
}));

export const DEFAULT_ATTEMPTS = 3;

/** Deterministic fun points from label length (matches ticket wallet formula). */
export const bonusPointsFor = (label: string): number =>
  100 + ((label.length * 55) % 900);
