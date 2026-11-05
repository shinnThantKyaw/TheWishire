"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { copy } from "@/config/copy";
import type { StartAction } from "@/types/experience";
import type { StepProps } from "../types";

const FLOW_MODES = [
  { value: "click-through", label: "Click-through", hint: "One chapter at a time with next/back buttons" },
  { value: "scroll", label: "Scroll", hint: "Continuous stacked scroll with progress bar" },
  { value: "interactive", label: "Interactive", hint: "Material grid — tap to open each chapter" },
] as const;

const GATE_TYPES = [
  { value: "padlock", label: "Padlock" },
  { value: "ribbon", label: "Ribbon" },
  { value: "wax-seal", label: "Wax seal" },
  { value: "chain", label: "Chain" },
] as const;

const START_ACTIONS = [
  { value: "tap", label: "Tap to start" },
  { value: "yes-no", label: "Yes / No question" },
  { value: "candles", label: "Blow out candles" },
] as const;

const DECORATION_ELEMENTS = [
  "flowers",
  "sparkles",
  "confetti",
  "balloons",
  "stars",
  "hearts",
] as const;

/**
 * Step 7 — Experience (4.10): flow mode, gate, start action,
 * decorations, and background music. Flow/gate/start land in
 * settings; decorations/music in content.
 */
export const ExperienceStep = ({
  config,
  updateConfig,
  onValidityChange,
}: StepProps) => {
  const settings = config.settings;
  const content = config.content;
  const startAction = settings.startAction;
  const decorations = content.decorations;

  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  const updateSettings = (patch: Partial<typeof settings>) => {
    updateConfig({ settings: { ...settings, ...patch } });
  };

  const setStartActionType = (type: StartAction["type"]) => {
    const fresh: StartAction =
      type === "candles"
        ? { type: "candles", count: 3 }
        : type === "yes-no"
          ? { type: "yes-no", prompt: copy.gateDefaults.yesNo }
          : { type: "tap", prompt: copy.gateDefaults.tap };
    updateSettings({ startAction: fresh });
  };

  const updateStartAction = (patch: Partial<StartAction>) => {
    if (!startAction) return;
    updateSettings({
      startAction: { ...startAction, ...patch } as StartAction,
    });
  };

  const toggleDecoration = (element: (typeof DECORATION_ELEMENTS)[number]) => {
    const current = decorations?.elements ?? [];
    const next = current.includes(element)
      ? current.filter((e) => e !== element)
      : [...current, element];
    updateConfig({
      content: {
        ...content,
        decorations:
          next.length > 0
            ? { elements: next, density: decorations?.density ?? "medium" }
            : undefined,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Experience</h2>
        <p className="text-sm text-muted-foreground">
          How the recipient navigates, what unlocks the surprise, and the
          atmosphere.
        </p>
      </div>

      {/* ── Flow mode ──────────────────────────────── */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Layout</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {FLOW_MODES.map((mode) => (
            <label
              key={mode.value}
              className={`cursor-pointer rounded-lg border p-3 text-sm ${
                settings.flowMode === mode.value
                  ? "border-pink-500 bg-pink-50 dark:bg-pink-950/30"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="flow-mode"
                value={mode.value}
                checked={settings.flowMode === mode.value}
                onChange={() => updateSettings({ flowMode: mode.value })}
                className="mr-1.5 accent-pink-500"
              />
              <span className="font-medium">{mode.label}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {mode.hint}
              </span>
            </label>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* ── Gate ─────────────────────────────────── */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Entry gate</h3>
          <Select
            value={settings.gateType ?? "padlock"}
            onChange={(e) =>
              updateSettings({
                gateType: e.target.value as (typeof GATE_TYPES)[number]["value"],
              })
            }
            aria-label="Entry gate type"
          >
            {GATE_TYPES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </Select>
        </section>

        {/* ── Start action ──────────────────────────── */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Start action</h3>
          <Select
            value={startAction?.type ?? "tap"}
            onChange={(e) =>
              setStartActionType(e.target.value as StartAction["type"])
            }
            aria-label="Start action type"
          >
            {START_ACTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </Select>
          {(startAction?.type === "tap" || startAction?.type === "yes-no") && (
            <Input
              value={startAction.prompt ?? ""}
              onChange={(e) => updateStartAction({ prompt: e.target.value })}
              placeholder={
                startAction.type === "yes-no"
                  ? copy.gateDefaults.yesNo
                  : copy.gateDefaults.tap
              }
              maxLength={200}
              aria-label="Start action prompt"
            />
          )}
          {startAction?.type === "candles" && (
            <Input
              type="number"
              min={1}
              max={10}
              value={startAction.count}
              onChange={(e) =>
                updateStartAction({ count: Number(e.target.value) || 1 })
              }
              aria-label="Candle count"
            />
          )}
        </section>
      </div>

      {/* ── Decorations ─────────────────────────────── */}
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-sm font-semibold">Floating decorations</h3>
          <Select
            value={decorations?.density ?? "medium"}
            onChange={(e) =>
              updateConfig({
                content: {
                  ...content,
                  decorations: {
                    elements: decorations?.elements ?? [],
                    density: e.target.value as "light" | "medium" | "heavy",
                  },
                },
              })
            }
            aria-label="Decoration density"
            className="h-7 w-28 text-xs"
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          {DECORATION_ELEMENTS.map((element) => {
            const active = decorations?.elements.includes(element) ?? false;
            return (
              <button
                key={element}
                type="button"
                aria-pressed={active}
                onClick={() => toggleDecoration(element)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  active
                    ? "border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {element}
              </button>
            );
          })}
        </div>
        {decorations && decorations.elements.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No decorations — toggle some on above.
          </p>
        )}
      </section>

      {/* ── Music ───────────────────────────────────── */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Background music</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.enableMusic}
            onChange={(e) => updateSettings({ enableMusic: e.target.checked })}
            className="accent-pink-500"
          />
          Play background music through the experience
        </label>
        {settings.enableMusic && (
          <div className="space-y-2">
            <Label htmlFor="music-url">
              Music file URL{" "}
              <span className="text-muted-foreground">(mp3)</span>
            </Label>
            <Input
              id="music-url"
              value={content.musicUrl ?? ""}
              onChange={(e) =>
                updateConfig({
                  content: { ...content, musicUrl: e.target.value || undefined },
                })
              }
              placeholder="/music/birthday-song.mp3"
              maxLength={500}
            />
          </div>
        )}
      </section>
    </div>
  );
};
