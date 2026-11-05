import { describe, it, expect } from "vitest";
import { createDefaultConfig, mergeConfig, defaultSettings } from "./wish-config";
import type { TemplateConfig } from "@/types/template";
import type { WishConfig } from "@/types/wish";

const template = {
  id: "birthday-classic",
  name: "Classic",
  description: "d",
  occasion: "birthday",
  thumbnail: "https://example.com/t.png",
  stages: [
    { type: "letter", enabled: true, props: {} },
    { type: "photos", enabled: true, props: {} },
  ],
  theme: {
    colors: { primary: "#fff", secondary: "#000", accent: "#f0f", background: "#fff", foreground: "#000" },
    fonts: { heading: "Playfair Display", body: "Inter" },
  },
} as unknown as TemplateConfig;

const baseConfig = (): WishConfig => createDefaultConfig(template);

describe("createDefaultConfig", () => {
  it("builds enabled stages from the template with valid settings", () => {
    const config = baseConfig();
    expect(config.stages).toHaveLength(2);
    expect(config.stages.every((s) => s.enabled)).toBe(true);
    expect(config.settings.intensity).toBe("celebration");
    expect(config.content).toEqual({});
  });

  it("produces settings that satisfy WishSettingsSchema requirements", () => {
    const s = defaultSettings();
    for (const key of [
      "enableGiftBox",
      "enableCake",
      "enableRibbon",
      "enableVoiceMessage",
      "enableMusic",
      "enablePoem",
      "enableTimeline",
      "enableGiftChallenge",
      "enableSpinWheel",
    ] as const) {
      expect(typeof s[key]).toBe("boolean");
    }
  });
});

describe("mergeConfig", () => {
  it("merges content and settings one level deep without clobbering siblings", () => {
    const base = baseConfig();
    base.content.letter = "Hello";
    base.settings.enableCake = false;

    const next = mergeConfig(base, {
      content: { birthdate: "2000-01-01" },
      settings: { flowMode: "scroll" },
    });

    expect(next.content.letter).toBe("Hello");
    expect(next.content.birthdate).toBe("2000-01-01");
    expect(next.settings.enableCake).toBe(false);
    expect(next.settings.flowMode).toBe("scroll");
  });

  it("replaces stages wholesale when the patch includes them", () => {
    const base = baseConfig();
    const next = mergeConfig(base, {
      stages: [{ type: "closing", enabled: false, config: {} }],
    });
    expect(next.stages).toHaveLength(1);
    expect(next.stages[0].type).toBe("closing");
  });

  it("keeps base stages when the patch omits them", () => {
    const base = baseConfig();
    const next = mergeConfig(base, { recipientNickname: "Jules" });
    expect(next.stages).toHaveLength(2);
    expect(next.recipientNickname).toBe("Jules");
  });
});
