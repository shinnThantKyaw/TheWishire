import { describe, it, expect } from "vitest";
import {
  WishConfigSchema,
  WishSettingsSchema,
  StartActionSchema,
  GiftChallengeConfigSchema,
} from "@/lib/validators";
import { buildWishConfig, TEST_WISHES } from "./seed-config";

const baseSettings = {
  intensity: "celebration",
  enableGiftBox: true,
  enableCake: true,
  enableRibbon: false,
  enableVoiceMessage: false,
  enableMusic: true,
  enablePoem: true,
  enableTimeline: true,
  enableGiftChallenge: true,
  enableSpinWheel: true,
};

describe("WishSettingsSchema", () => {
  it("retains flowMode instead of stripping it", () => {
    const result = WishSettingsSchema.safeParse({
      ...baseSettings,
      flowMode: "scroll",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.flowMode).toBe("scroll");
  });

  it("accepts legacy flowMode aliases", () => {
    for (const flowMode of ["buttons", "tap-to-reveal", "click-through", "interactive"]) {
      const result = WishSettingsSchema.safeParse({ ...baseSettings, flowMode });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.flowMode).toBe(flowMode);
    }
  });

  it("retains giftChapter with gate + miniGame intact", () => {
    const result = WishSettingsSchema.safeParse({
      ...baseSettings,
      flowMode: "scroll",
      giftChapter: {
        gateAction: { type: "pin", pin: "1609", hint: "our anniversary date" },
        mainGiftMessage: "Test message",
        mainGiftPhotoIds: ["/Gift.jpg"],
        miniGame: {
          type: "spin-wheel",
          attempts: 3,
          items: [
            { id: "1", label: "Love Note", emoji: "💌", description: "note", probability: 22 },
          ],
        },
      },
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.giftChapter?.gateAction).toEqual({
      type: "pin",
      pin: "1609",
      hint: "our anniversary date",
    });
    expect(result.data.giftChapter?.miniGame?.items).toHaveLength(1);
  });

  it("rejects an invalid gate action", () => {
    const result = WishSettingsSchema.safeParse({
      ...baseSettings,
      flowMode: "scroll",
      giftChapter: { gateAction: { type: "teleport" } },
    });
    expect(result.success).toBe(false);
  });
});

describe("StartActionSchema", () => {
  it("accepts every gate variant used by the gift chapter", () => {
    const variants = [
      { type: "candles", count: 3 },
      { type: "yes-no", prompt: "Ready?" },
      { type: "password", answer: "open" },
      { type: "pin", pin: "1609", hint: "hint" },
      { type: "tap", prompt: "Tap" },
    ];
    for (const variant of variants) {
      expect(StartActionSchema.safeParse(variant).success).toBe(true);
    }
  });
});

describe("buildWishConfig", () => {
  it("produces a WishConfig that survives full validation for every seed flow mode", () => {
    expect(TEST_WISHES.length).toBeGreaterThan(0);
    for (const wish of TEST_WISHES) {
      const config = buildWishConfig(wish.flowMode, wish.challenge);
      const parsed = WishConfigSchema.safeParse(config);
      expect(parsed.success, `${wish.slug}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
      if (!parsed.success) continue;
      expect(parsed.data.settings.flowMode).toBe(wish.flowMode);
      expect(parsed.data.settings.giftChapter?.miniGame?.items.length).toBeGreaterThan(0);
    }
  });

  it("keeps the legacy PIN gate when no challenge override is given", () => {
    const config = buildWishConfig("scroll");
    expect(config.settings.giftChapter?.challenge).toBeUndefined();
    expect(config.settings.giftChapter?.gateAction).toEqual({
      type: "pin",
      pin: "1609",
      hint: "our anniversary date",
    });
  });

  it("wires the per-wish Wave 2 challenge overrides from TEST_WISHES", () => {
    const bySlug = Object.fromEntries(TEST_WISHES.map((w) => [w.slug, w]));

    expect(bySlug["demo-scroll"].challenge?.type).toBe("multiple-choice");
    expect(bySlug["demo-pages"].challenge?.type).toBe("heart-catch");
    expect(bySlug["happy-birthday-sarah"].challenge).toBeUndefined();
    expect(bySlug["demo-interactive"].challenge).toBeUndefined();

    const mcConfig = buildWishConfig("scroll", bySlug["demo-scroll"].challenge);
    const parsed = WishConfigSchema.safeParse(mcConfig);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.settings.giftChapter?.challenge).toEqual(
        bySlug["demo-scroll"].challenge,
      );
    }
  });
});

describe("GiftChallengeConfigSchema", () => {
  it("accepts all three challenge variants", () => {
    const variants = [
      { type: "pin", pin: "1609", hint: "hint" },
      {
        type: "multiple-choice",
        question: "Q?",
        options: ["A", "B", "C"],
        correctIndex: 2,
      },
      { type: "heart-catch", heartsToCatch: 8, timeLimitSeconds: 15 },
    ];
    for (const variant of variants) {
      expect(GiftChallengeConfigSchema.safeParse(variant).success).toBe(true);
    }
  });

  it("rejects malformed challenges", () => {
    const invalid = [
      { type: "teleport" },
      { type: "multiple-choice", question: "Q", options: ["only-one"], correctIndex: 0 },
      { type: "multiple-choice", question: "Q", options: ["A", "B"], correctIndex: 5 },
      { type: "heart-catch", heartsToCatch: 0, timeLimitSeconds: 15 },
      { type: "heart-catch", heartsToCatch: 8, timeLimitSeconds: 1 },
    ];
    for (const variant of invalid) {
      expect(GiftChallengeConfigSchema.safeParse(variant).success).toBe(false);
    }
  });
});
