import type { WishConfig } from "@/types/wish";
import type { TemplateConfig } from "@/types/template";

/**
 * Draft-config helpers for the builder (4.3): default config from a
 * template, one-level-deep merges for autosave patches.
 */

/** Defaults matching WishSettingsSchema's required booleans. */
export const defaultSettings = (): WishConfig["settings"] => ({
  intensity: "celebration",
  flowMode: "click-through",
  enableGiftBox: true,
  enableCake: true,
  enableRibbon: false,
  enableVoiceMessage: false,
  enableMusic: true,
  enablePoem: true,
  enableTimeline: true,
  enableGiftChallenge: true,
  enableSpinWheel: true,
});

/** Empty-but-valid config seeded from a template's stage list. */
export const createDefaultConfig = (template: TemplateConfig): WishConfig => ({
  stages: template.stages.map((stage) => ({
    type: stage.type,
    enabled: true,
    config: {},
  })),
  content: {},
  settings: defaultSettings(),
});

/** Patch shape for mergeConfig: content/settings accept partials. */
export type WishConfigPatch = Partial<
  Omit<WishConfig, "content" | "settings" | "stages">
> & {
  content?: Partial<WishConfig["content"]>;
  settings?: Partial<WishConfig["settings"]>;
  stages?: WishConfig["stages"];
};

/**
 * Merge a partial config patch into the draft. Top-level keys merge one
 * level deep (content/settings), so a step can send only the slice it
 * edited without clobbering sibling fields; `stages` replaces wholesale.
 */
export const mergeConfig = (
  base: WishConfig,
  patch: WishConfigPatch,
): WishConfig => ({
  ...base,
  ...patch,
  content: { ...base.content, ...patch.content },
  settings: { ...base.settings, ...patch.settings },
  ...(patch.stages ? { stages: patch.stages } : {}),
});
