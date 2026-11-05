"use client";

import { useEffect } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MemoryTimelineEntry } from "@/types/wish";
import type { StepProps } from "../types";

const MAX_ENTRIES = 20;

/**
 * Step 5 — Timeline (4.8): add/remove/reorder memory entries. Entries
 * live in config.content.memoryTimeline; every mutation autosaves.
 * Next is gated while any entry is missing a date or title.
 */
export const TimelineStep = ({
  config,
  updateConfig,
  onValidityChange,
}: StepProps) => {
  const entries = config.content.memoryTimeline ?? [];

  const valid = entries.every(
    (e) => e.date.trim().length > 0 && e.title.trim().length > 0,
  );

  useEffect(() => {
    onValidityChange(valid);
  }, [valid, onValidityChange]);

  const setEntries = (next: MemoryTimelineEntry[]) => {
    updateConfig({
      content: {
        ...config.content,
        memoryTimeline: next.length > 0 ? next : undefined,
      },
    });
  };

  const addEntry = () => {
    if (entries.length >= MAX_ENTRIES) return;
    setEntries([
      ...entries,
      { date: "", title: "", description: "" },
    ]);
  };

  const updateEntry = (index: number, patch: Partial<MemoryTimelineEntry>) => {
    setEntries(entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const moveEntry = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= entries.length) return;
    const next = [...entries];
    [next[index], next[target]] = [next[target], next[index]];
    setEntries(next);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Timeline</h2>
          <p className="text-sm text-muted-foreground">
            Milestones in your story — {entries.length}/{MAX_ENTRIES} entries.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addEntry}
          disabled={entries.length >= MAX_ENTRIES}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add memory
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No memories yet — the timeline chapter stays empty until you add
          some.
        </div>
      ) : (
        <ol className="space-y-4">
          {entries.map((entry, index) => (
            <li key={index} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {index + 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move entry ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => moveEntry(index, -1)}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move entry ${index + 1} down`}
                    disabled={index === entries.length - 1}
                    onClick={() => moveEntry(index, 1)}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove entry ${index + 1}`}
                    onClick={() => removeEntry(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`entry-date-${index}`}>Date</Label>
                  <Input
                    id={`entry-date-${index}`}
                    value={entry.date}
                    onChange={(e) => updateEntry(index, { date: e.target.value })}
                    placeholder="September 2016"
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`entry-title-${index}`}>Title</Label>
                  <Input
                    id={`entry-title-${index}`}
                    value={entry.title}
                    onChange={(e) => updateEntry(index, { title: e.target.value })}
                    placeholder="The Day We Met"
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`entry-desc-${index}`}>
                  Description <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id={`entry-desc-${index}`}
                  value={entry.description ?? ""}
                  onChange={(e) =>
                    updateEntry(index, { description: e.target.value || undefined })
                  }
                  rows={2}
                  maxLength={500}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
