"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile } from "@/lib/supabase/storage";
import { MAX_FILE_BYTES, formatBytes } from "@/lib/media-limits";
import type { GiftChapterConfig, GiftChallengeConfig } from "@/types/wish";
import type { MiniGameConfig, RewardItem } from "@/types/experience";
import type { StepProps } from "../types";

type ChallengeType = "none" | GiftChallengeConfig["type"];

const CHALLENGE_OPTIONS: { value: ChallengeType; label: string }[] = [
  { value: "none", label: "No challenge (tap to open)" },
  { value: "pin", label: "Number PIN with hint" },
  { value: "multiple-choice", label: "Multiple choice question" },
  { value: "heart-catch", label: "Heart catch game" },
];

const DEFAULT_ITEMS: RewardItem[] = [
  { id: "1", label: "Love Note", emoji: "💌", description: "A sweet handwritten note", probability: 30 },
  { id: "2", label: "Flowers", emoji: "🌸", description: "A bouquet of virtual flowers", probability: 30 },
  { id: "3", label: "Chocolate", emoji: "🍫", description: "Your favorite chocolate box", probability: 40 },
];

const makeItem = (): RewardItem => ({
  id: `r-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  label: "",
  emoji: "🎁",
  description: "",
  probability: 10,
});

/**
 * Step 6 — Gift (4.9): challenge gate (all three types), main gift
 * message + photos, and the spin-wheel bonus config. Everything lands in
 * config.settings.giftChapter.
 */
export const GiftStep = ({
  config,
  updateConfig,
  onValidityChange,
}: StepProps) => {
  const gift: GiftChapterConfig = config.settings.giftChapter ?? {};
  const challenge = gift.challenge;
  const miniGame = gift.miniGame;
  const giftPhotoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingGift, setUploadingGift] = useState(false);
  const [giftError, setGiftError] = useState<string | null>(null);

  const challengeType: ChallengeType = challenge?.type ?? "none";

  const setGift = (patch: Partial<GiftChapterConfig>) => {
    updateConfig({
      settings: {
        ...config.settings,
        giftChapter: { ...gift, ...patch },
      },
    });
  };

  const setChallenge = (type: ChallengeType) => {
    if (type === "none") {
      setGift({ challenge: undefined });
      return;
    }
    const fresh: GiftChallengeConfig =
      type === "pin"
        ? { type: "pin", pin: "", hint: "" }
        : type === "multiple-choice"
          ? {
              type: "multiple-choice",
              question: "",
              options: ["", ""],
              correctIndex: 0,
            }
          : { type: "heart-catch", heartsToCatch: 8, timeLimitSeconds: 15 };
    setGift({ challenge: fresh });
  };

  const updateChallenge = (patch: Partial<GiftChallengeConfig>) => {
    if (!challenge) return;
    setGift({ challenge: { ...challenge, ...patch } as GiftChallengeConfig });
  };

  const setMiniGame = (patch: Partial<MiniGameConfig>) => {
    setGift({
      miniGame: {
        type: "spin-wheel",
        attempts: 3,
        items: DEFAULT_ITEMS,
        ...miniGame,
        ...patch,
      },
    });
  };

  // ── Validity ─────────────────────────────────────────
  let valid = true;
  if (challenge?.type === "pin") {
    valid = challenge.pin.trim().length >= 4 && challenge.hint.trim().length > 0;
  } else if (challenge?.type === "multiple-choice") {
    const filled = challenge.options.filter((o) => o.trim().length > 0);
    valid =
      challenge.question.trim().length > 0 &&
      filled.length >= 2 &&
      challenge.correctIndex < challenge.options.length &&
      challenge.options[challenge.correctIndex]?.trim().length > 0;
  } else if (challenge?.type === "heart-catch") {
    valid = challenge.heartsToCatch >= 1 && challenge.timeLimitSeconds >= 3;
  }
  if (miniGame) {
    valid =
      valid &&
      miniGame.attempts >= 1 &&
      miniGame.items.length >= 1 &&
      miniGame.items.every((i) => i.label.trim().length > 0 && i.probability > 0);
  }

  useEffect(() => {
    onValidityChange(valid);
  }, [valid, onValidityChange]);

  // ── Gift photo upload ───────────────────────────────
  const handleGiftPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setGiftError(null);
    setUploadingGift(true);
    try {
      const current = gift.mainGiftPhotoIds ?? [];
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > MAX_FILE_BYTES) {
          setGiftError(`${file.name} exceeds ${formatBytes(MAX_FILE_BYTES)}.`);
          continue;
        }
        const { url } = await uploadFile(`gift-${Date.now()}`, file);
        urls.push(url);
      }
      if (urls.length > 0) {
        setGift({ mainGiftPhotoIds: [...current, ...urls].slice(0, 3) });
      }
    } catch (err) {
      console.error(err);
      setGiftError("Upload failed — try again.");
    } finally {
      setUploadingGift(false);
      if (giftPhotoInputRef.current) giftPhotoInputRef.current.value = "";
    }
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Gift</h2>
        <p className="text-sm text-muted-foreground">
          The gate before the main gift, the gift itself, and bonus rewards.
        </p>
      </div>

      {/* ── Challenge ──────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Challenge gate</h3>
        <div className="space-y-2">
          {CHALLENGE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm ${
                challengeType === opt.value
                  ? "border-pink-500 bg-pink-50 dark:bg-pink-950/30"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="challenge-type"
                value={opt.value}
                checked={challengeType === opt.value}
                onChange={() => setChallenge(opt.value)}
                className="accent-pink-500"
              />
              {opt.label}
            </label>
          ))}
        </div>

        {challenge?.type === "pin" && (
          <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pin-code">PIN (4+ digits/characters)</Label>
              <Input
                id="pin-code"
                value={challenge.pin}
                onChange={(e) => updateChallenge({ pin: e.target.value })}
                placeholder="1609"
                maxLength={12}
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin-hint">Hint shown to the recipient</Label>
              <Input
                id="pin-hint"
                value={challenge.hint}
                onChange={(e) => updateChallenge({ hint: e.target.value })}
                placeholder="our anniversary date"
                maxLength={100}
              />
            </div>
          </div>
        )}

        {challenge?.type === "multiple-choice" && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="mc-question">Question</Label>
              <Input
                id="mc-question"
                value={challenge.question}
                onChange={(e) => updateChallenge({ question: e.target.value })}
                placeholder="ကျွန်တော်တို့ တွေ့ခဲ့တဲ့နေ့က ဘယ်နှစ်လလဲ?"
                maxLength={300}
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Options — pick the correct one</legend>
              {challenge.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mc-correct"
                    checked={challenge.correctIndex === index}
                    onChange={() => updateChallenge({ correctIndex: index })}
                    aria-label={`Mark option ${index + 1} correct`}
                    className="accent-green-600"
                  />
                  <Input
                    value={option}
                    onChange={(e) => {
                      const next = [...challenge.options];
                      next[index] = e.target.value;
                      updateChallenge({ options: next });
                    }}
                    placeholder={`Option ${index + 1}`}
                    maxLength={200}
                    aria-label={`Option ${index + 1}`}
                  />
                  {challenge.options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove option ${index + 1}`}
                      onClick={() => {
                        const next = challenge.options.filter((_, i) => i !== index);
                        updateChallenge({
                          options: next,
                          correctIndex: Math.min(challenge.correctIndex, next.length - 1),
                        });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              {challenge.options.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateChallenge({ options: [...challenge.options, ""] })
                  }
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add option
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                The correct answer is only stored server-side — recipients
                never see it in the page source.
              </p>
            </fieldset>
          </div>
        )}

        {challenge?.type === "heart-catch" && (
          <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="hc-hearts">Hearts to catch</Label>
              <Input
                id="hc-hearts"
                type="number"
                min={1}
                max={50}
                value={challenge.heartsToCatch}
                onChange={(e) =>
                  updateChallenge({ heartsToCatch: Number(e.target.value) || 1 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hc-time">Time limit (seconds)</Label>
              <Input
                id="hc-time"
                type="number"
                min={3}
                max={120}
                value={challenge.timeLimitSeconds}
                onChange={(e) =>
                  updateChallenge({ timeLimitSeconds: Number(e.target.value) || 3 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hc-spawn">Spawn interval (ms)</Label>
              <Input
                id="hc-spawn"
                type="number"
                min={200}
                max={5000}
                step={100}
                value={challenge.spawnIntervalMs ?? 900}
                onChange={(e) =>
                  updateChallenge({ spawnIntervalMs: Number(e.target.value) || 900 })
                }
              />
            </div>
          </div>
        )}
      </section>

      {/* ── Main gift ───────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Main gift</h3>
        <div className="space-y-2">
          <Label htmlFor="gift-message">
            Message <span className="text-muted-foreground">(optional personal note)</span>
          </Label>
          <Textarea
            id="gift-message"
            value={gift.mainGiftMessage ?? ""}
            onChange={(e) => setGift({ mainGiftMessage: e.target.value || undefined })}
            rows={3}
            maxLength={1000}
            placeholder="I hope this makes you smile…"
          />
        </div>

        <div className="space-y-2">
          <Label>Gift photos (up to 3)</Label>
          <div className="flex flex-wrap items-center gap-3">
            {(gift.mainGiftPhotoIds ?? []).map((url, index) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Gift photo ${index + 1}`}
                  className="h-20 w-20 rounded-md border object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove gift photo ${index + 1}`}
                  onClick={() =>
                    setGift({
                      mainGiftPhotoIds: (gift.mainGiftPhotoIds ?? []).filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                  className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => giftPhotoInputRef.current?.click()}
              disabled={uploadingGift || (gift.mainGiftPhotoIds ?? []).length >= 3}
            >
              {uploadingGift ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-1.5 h-4 w-4" />
              )}
              Add photo
            </Button>
            <input
              ref={giftPhotoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              aria-label="Upload gift photos"
              onChange={(e) => void handleGiftPhotos(e.target.files)}
            />
          </div>
          {giftError && (
            <p className="text-sm text-destructive" role="alert">
              {giftError}
            </p>
          )}
        </div>
      </section>

      {/* ── Spin wheel (bonus rewards) ──────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Spin wheel bonus</h3>
            <p className="text-xs text-muted-foreground">
              Optional bonus round after the main gift — server-decides the
              winner.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={miniGame ? "outline" : "default"}
            onClick={() =>
              miniGame
                ? setGift({ miniGame: undefined })
                : setMiniGame({})
            }
          >
            {miniGame ? "Remove" : "Add spin wheel"}
          </Button>
        </div>

        {miniGame && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="sm:max-w-[180px]">
              <div className="space-y-2">
                <Label htmlFor="spin-attempts">Attempts per recipient</Label>
                <Input
                  id="spin-attempts"
                  type="number"
                  min={1}
                  max={10}
                  value={miniGame.attempts}
                  onChange={(e) =>
                    setMiniGame({ attempts: Number(e.target.value) || 1 })
                  }
                />
              </div>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Prize items</legend>
              {miniGame.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-2 rounded-md border p-3 sm:grid-cols-[64px_1fr_90px_auto]"
                >
                  <Input
                    value={item.emoji}
                    onChange={(e) => {
                      const items = [...miniGame.items];
                      items[index] = { ...item, emoji: e.target.value };
                      setMiniGame({ items });
                    }}
                    maxLength={4}
                    aria-label={`Prize ${index + 1} emoji`}
                    className="text-center"
                  />
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const items = [...miniGame.items];
                      items[index] = { ...item, label: e.target.value };
                      setMiniGame({ items });
                    }}
                    placeholder="Prize label"
                    maxLength={50}
                    aria-label={`Prize ${index + 1} label`}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={item.probability}
                    onChange={(e) => {
                      const items = [...miniGame.items];
                      items[index] = {
                        ...item,
                        probability: Number(e.target.value) || 1,
                      };
                      setMiniGame({ items });
                    }}
                    aria-label={`Prize ${index + 1} weight`}
                    title="Weight (relative chance)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove prize ${index + 1}`}
                    disabled={miniGame.items.length <= 1}
                    onClick={() =>
                      setMiniGame({
                        items: miniGame.items.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMiniGame({ items: [...miniGame.items, makeItem()] })}
                  disabled={miniGame.items.length >= 8}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add prize
                </Button>
                <span className="text-xs text-muted-foreground">
                  Weight = relative chance (e.g. 30 vs 10 = 3× more likely)
                </span>
              </div>
            </fieldset>
          </div>
        )}
      </section>
    </div>
  );
};
