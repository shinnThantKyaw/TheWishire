"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StepProps } from "../types";

const LETTER_MAX = 5000;

/**
 * Step 2 — Story (4.5): the letter + poem (the dynamic text fields from
 * the string inventory). Poem is optional — removing it clears the
 * chapter; birthdate lives in Basics.
 */
export const StoryStep = ({
  config,
  updateConfig,
  onValidityChange,
}: StepProps) => {
  const letter = config.content.letter ?? "";
  const poem = config.content.poem;
  const [poemOpen, setPoemOpen] = useState(Boolean(poem));

  const valid = letter.length <= LETTER_MAX;

  useEffect(() => {
    onValidityChange(valid);
  }, [valid, onValidityChange]);

  const updateLetter = (value: string) => {
    updateConfig({ content: { ...config.content, letter: value || undefined } });
  };

  const updatePoem = (patch: Partial<NonNullable<typeof poem>>) => {
    const next = { id: "poem-1", title: "", author: "", text: "", ...poem, ...patch };
    const empty = !next.title.trim() && !next.author.trim() && !next.text.trim();
    updateConfig({
      content: {
        ...config.content,
        poem: empty ? undefined : next,
      },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Story</h2>
        <p className="text-sm text-muted-foreground">
          The letter the recipient opens first, and an optional poem.
        </p>
      </div>

      {/* ── Letter ─────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="letter-body">Letter</Label>
          <span
            className={`text-xs ${letter.length > LETTER_MAX ? "text-destructive" : "text-muted-foreground"}`}
            aria-live="polite"
          >
            {letter.length}/{LETTER_MAX}
          </span>
        </div>
        <Textarea
          id="letter-body"
          value={letter}
          onChange={(e) => updateLetter(e.target.value)}
          placeholder="Dear ဂျူလီယာ, …"
          rows={10}
          maxLength={LETTER_MAX + 500}
          aria-invalid={letter.length > LETTER_MAX}
        />
        <p className="text-xs text-muted-foreground">
          Shows on the letter chapter — first thing they read.
        </p>
      </div>

      {/* ── Poem (optional) ────────────────────────── */}
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Poem</h3>
            <p className="text-xs text-muted-foreground">
              Optional — leave closed to skip the poem chapter.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={poemOpen ? "outline" : "default"}
            onClick={() => {
              if (poemOpen) {
                setPoemOpen(false);
                updateConfig({
                  content: { ...config.content, poem: undefined },
                });
              } else {
                setPoemOpen(true);
                updatePoem({});
              }
            }}
          >
            {poemOpen ? "Remove" : "Add poem"}
          </Button>
        </div>

        {poemOpen && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="poem-title">Poem title</Label>
                <Input
                  id="poem-title"
                  value={poem?.title ?? ""}
                  onChange={(e) => updatePoem({ title: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poem-author">Author</Label>
                <Input
                  id="poem-author"
                  value={poem?.author ?? ""}
                  onChange={(e) => updatePoem({ author: e.target.value })}
                  maxLength={100}
                  placeholder="Anonymous"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="poem-text">Poem text</Label>
              <Textarea
                id="poem-text"
                value={poem?.text ?? ""}
                onChange={(e) => updatePoem({ text: e.target.value })}
                rows={6}
                maxLength={2000}
                placeholder="အာရေးဘီးယန်း …"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
