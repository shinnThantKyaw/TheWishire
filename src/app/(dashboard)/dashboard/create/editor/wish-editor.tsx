"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTemplate, getAllTemplates } from "@/templates/registry";
import { createDefaultConfig, mergeConfig, type WishConfigPatch } from "@/lib/wish-config";
import type { WishConfig } from "@/types/wish";
import type { CreateWishInput } from "@/lib/validators";
import { STEPS, type StepId, type StepProps, type WishRow } from "./types";
import { BasicsStep } from "./steps/basics-step";
import { StoryStep } from "./steps/story-step";
import { MediaStep } from "./steps/media-step";
import { SongStep } from "./steps/song-step";
import { TimelineStep } from "./steps/timeline-step";
import { GiftStep } from "./steps/gift-step";
import { ExperienceStep } from "./steps/experience-step";
import { PublishStep } from "./steps/publish-step";

const AUTOSAVE_DELAY_MS = 800;

type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * WishEditor — multi-step builder shell (4.3).
 *
 * Loads the draft once, keeps the config in client state, and persists
 * via PATCH: basics fields save immediately (they gate validation),
 * config patches debounce through mergeConfig so steps only send their
 * own slice. Progress chips allow non-linear navigation; each step
 * reports validity to gate the Next button.
 */
export const WishEditor = ({ id }: { id: string }) => {
  const router = useRouter();
  const [wish, setWish] = useState<WishRow | null>(null);
  const [config, setConfig] = useState<WishConfig | null>(null);
  const [step, setStep] = useState<StepId>("basics");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [stepValid, setStepValid] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const configRef = useRef<WishConfig | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  // ── Load draft ────────────────────────────────────────
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    (async () => {
      try {
        const res = await fetch(`/api/wishes/${id}`);
        if (res.status === 404) {
          router.replace("/dashboard");
          return;
        }
        if (!res.ok) throw new Error(`Load failed: ${res.status}`);
        const data = (await res.json()) as { wish: WishRow };
        const row = data.wish;

        // Seed an empty draft config from the template so every step
        // always sees a valid WishConfig.
        let draft = row.config as WishConfig | null;
        if (!draft?.stages?.length || !draft.settings) {
          const template =
            getTemplate(row.templateId) ?? getAllTemplates()[0];
          if (!template) throw new Error("No templates registered");
          draft = createDefaultConfig(template);
          const seedRes = await fetch(`/api/wishes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ config: draft }),
          });
          if (!seedRes.ok) throw new Error("Seed failed");
        }

        setWish(row);
        configRef.current = draft;
        setConfig(draft);
      } catch (error) {
        console.error(error);
        setLoadError("Couldn't load this wish. Check your connection and retry.");
      }
    })();
  }, [id, router]);

  // ── Persistence ───────────────────────────────────────
  const patchWish = useCallback(
    async (patch: Partial<CreateWishInput>) => {
      setSaveState("saving");
      try {
        const res = await fetch(`/api/wishes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error(`Save failed: ${res.status}`);
        const data = (await res.json()) as { wish: WishRow };
        setWish(data.wish);
        setSaveState("saved");
      } catch (error) {
        console.error(error);
        setSaveState("error");
      }
    },
    [id],
  );

  const updateBasics = useCallback(
    (patch: Partial<CreateWishInput>) => {
      // Optimistic: name/occasion fields are controlled inputs
      setWish((prev) => (prev ? { ...prev, ...patch } : prev));
      void patchWish(patch);
    },
    [patchWish],
  );

  const updateConfig = useCallback(
    (patch: WishConfigPatch) => {
      const current = configRef.current;
      if (!current) return;
      const next = mergeConfig(current, patch);
      configRef.current = next;
      setConfig(next);

      setSaveState("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/wishes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ config: configRef.current }),
          });
          if (!res.ok) throw new Error(`Save failed: ${res.status}`);
          setSaveState("saved");
        } catch (error) {
          console.error(error);
          setSaveState("error");
        }
      }, AUTOSAVE_DELAY_MS);
    },
    [id],
  );

  // Flush any pending autosave when leaving the page.
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, []);

  // ── Step navigation ───────────────────────────────────
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const goTo = (target: StepId) => {
    setStep(target);
    setStepValid(true);
    window.scrollTo({ top: 0 });
  };

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) goTo(STEPS[stepIndex + 1].id);
  };
  const goPrev = () => {
    if (stepIndex > 0) goTo(STEPS[stepIndex - 1].id);
  };

  const onValidityChange = useCallback((valid: boolean) => {
    setStepValid(valid);
  }, []);

  // ── Render ────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-destructive" role="alert">
          {loadError}
        </p>
        <Button variant="outline" onClick={() => router.replace("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  if (!wish || !config) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  const stepProps: StepProps = {
    wish,
    config,
    updateBasics,
    updateConfig,
    onValidityChange,
  };

  const renderStep = () => {
    switch (step) {
      case "basics":
        return <BasicsStep {...stepProps} />;
      case "story":
        return <StoryStep {...stepProps} />;
      case "media":
        return <MediaStep {...stepProps} />;
      case "song":
        return <SongStep {...stepProps} />;
      case "timeline":
        return <TimelineStep {...stepProps} />;
      case "gift":
        return <GiftStep {...stepProps} />;
      case "experience":
        return <ExperienceStep {...stepProps} />;
      case "publish":
        return <PublishStep {...stepProps} />;
    }
  };

  const saveLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? "Saved"
        : saveState === "error"
          ? "Save failed — retrying on next change"
          : "";

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">{wish.title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {wish.published ? "Published" : "Draft"}
            {saveLabel && (
              <span
                className={cn(
                  "ml-2",
                  saveState === "error" && "text-destructive",
                )}
                role="status"
                aria-live="polite"
              >
                {saveState === "saving" && (
                  <Loader2 className="mr-1 inline h-3 w-3 animate-spin" aria-hidden />
                )}
                {saveLabel}
              </span>
            )}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/w/${wish.slug ?? ""}?preview=1`)}
          disabled={!wish.slug}
        >
          Preview
        </Button>
      </div>

      {/* ── Progress chips (horizontally scrollable on small screens) ── */}
      <nav aria-label="Builder steps" className="-mx-4 overflow-x-auto px-4">
        <ol className="flex min-w-max gap-1.5">
          {STEPS.map((s, index) => {
            const isCurrent = s.id === step;
            const isDone = index < stepIndex;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(s.id)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    isCurrent &&
                      "border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
                    !isCurrent &&
                      "border-border text-muted-foreground hover:bg-muted",
                    isDone && !isCurrent && "border-green-200 text-green-700 dark:border-green-900 dark:text-green-400",
                  )}
                >
                  {isDone && !isCurrent && <Check className="h-3 w-3" aria-hidden />}
                  {index + 1}. {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ── Step content ───────────────────────────── */}
      <div className="min-h-[40vh] rounded-xl border bg-card p-4 shadow-sm sm:p-6">
        {renderStep()}
      </div>

      {/* ── Footer nav ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 pb-8">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={stepIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={goNext}
          disabled={stepIndex === STEPS.length - 1 || !stepValid}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
