import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { RewardItem } from "@/types/experience";

export {
  DEFAULT_ATTEMPTS,
  DEFAULT_MINI_GAME_ITEMS,
  bonusPointsFor,
} from "./rewards-shared";

/**
 * Reward-proof core, server-only (GIFT-03). Client-safe constants
 * live in `rewards-shared.ts`.
 *
 * Anti-fake design:
 * - Winner picked server-side with weighted crypto RNG — client never decides.
 * - Each win gets a 128-bit crypto-random verify token (DB is authoritative).
 * - HMAC-SHA256 signature binds wish + token + prize + timestamp so a
 *   doctored ticket fails verification even if it looks right.
 */

/** Cryptographically strong uniform [0,1). Never Math.random for prize outcomes. */
export const cryptoRandom = (): number =>
  randomBytes(4).readUInt32BE(0) / 2 ** 32;

/** Weighted index pick; non-positive weights treated as 1. Returns -1 for empty pools. */
export const pickWeightedIndex = (items: RewardItem[]): number => {
  if (items.length === 0) return -1;
  const weights = items.map((it) => (it.probability > 0 ? it.probability : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = cryptoRandom() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll < 0) return i;
  }
  return items.length - 1; // float-rounding safety net
};

/** 128-bit verify token as 32 hex chars. */
export const generateVerifyToken = (): string => randomBytes(16).toString("hex");

/** Cosmetic display serial, e.g. "W-482913". */
export const generateSerial = (): string =>
  `W-${String(Math.floor(cryptoRandom() * 1_000_000)).padStart(6, "0")}`;

const hmacSecret = (): string =>
  process.env.REWARD_HMAC_SECRET ?? "wishire-dev-reward-secret";

/** Canonical string signed for a proof — change ⇒ signature mismatch. */
const signingPayload = (wishId: string, token: string, label: string, wonAt: Date): string =>
  `${wishId}|${token}|${label}|${wonAt.toISOString()}`;

/** HMAC-SHA256 hex signature binding wish + token + prize + timestamp. */
export const signReward = (
  wishId: string,
  token: string,
  label: string,
  wonAt: Date,
): string =>
  createHmac("sha256", hmacSecret())
    .update(signingPayload(wishId, token, label, wonAt))
    .digest("hex");

/** Signature check via timing-safe comparison. */
export const verifyRewardSignature = (
  wishId: string,
  token: string,
  label: string,
  wonAt: Date,
  signature: string,
): boolean => {
  const expected = signReward(wishId, token, label, wonAt);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
};
