import { describe, it, expect } from "vitest";
import { WishConfigSchema, WishSettingsSchema, StartActionSchema } from "@/lib/validators";
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
      const config = buildWishConfig(wish.flowMode);
      const parsed = WishConfigSchema.safeParse(config);
      expect(parsed.success, `${wish.slug}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
      if (!parsed.success) continue;
      expect(parsed.data.settings.flowMode).toBe(wish.flowMode);
      expect(parsed.data.settings.giftChapter?.miniGame?.items.length).toBeGreaterThan(0);
    }
  });
});
