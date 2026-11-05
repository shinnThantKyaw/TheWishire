"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getAvailableOccasions } from "@/config/occasions";
import { getAllTemplates, getTemplatesByOccasion } from "@/templates/registry";
import type { StepProps } from "../types";

/**
 * Step 1 — Basics (4.4): title, occasion, template, recipient/sender
 * names + casual nicknames, recipient birthdate (feeds the facts
 * chapter). DB fields save immediately; nicknames/birthdate ride the
 * config autosave.
 */
export const BasicsStep = ({
  wish,
  config,
  updateBasics,
  updateConfig,
  onValidityChange,
}: StepProps) => {
  const [title, setTitle] = useState(wish.title);
  const [recipientName, setRecipientName] = useState(wish.recipientName);
  const [senderName, setSenderName] = useState(wish.senderName);

  const availableOccasions = getAvailableOccasions();
  const templates =
    getTemplatesByOccasion(wish.occasion).length > 0
      ? getTemplatesByOccasion(wish.occasion)
      : getAllTemplates();

  const valid =
    title.trim().length > 0 &&
    recipientName.trim().length > 0 &&
    senderName.trim().length > 0;

  useEffect(() => {
    onValidityChange(valid);
  }, [valid, onValidityChange]);

  // Local state only mirrors DB values loaded on mount; edits flow out
  // through updateBasics on change (immediate PATCH per field group).
  const handleTitle = (value: string) => {
    setTitle(value);
    if (value.trim()) updateBasics({ title: value });
  };
  const handleRecipient = (value: string) => {
    setRecipientName(value);
    if (value.trim()) updateBasics({ recipientName: value });
  };
  const handleSender = (value: string) => {
    setSenderName(value);
    if (value.trim()) updateBasics({ senderName: value });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Basics</h2>
        <p className="text-sm text-muted-foreground">
          Who is this wish for, and what&apos;s the occasion?
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wish-title">Wish title</Label>
        <Input
          id="wish-title"
          value={title}
          onChange={(e) => handleTitle(e.target.value)}
          placeholder="Happy Birthday, Julia!"
          maxLength={100}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="wish-occasion">Occasion</Label>
          <Select
            id="wish-occasion"
            value={wish.occasion}
            onChange={(e) => updateBasics({ occasion: e.target.value })}
          >
            {availableOccasions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.icon} {o.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="wish-template">Template</Label>
          <Select
            id="wish-template"
            value={wish.templateId}
            onChange={(e) => updateBasics({ templateId: e.target.value })}
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="recipient-name">Recipient&apos;s name</Label>
          <Input
            id="recipient-name"
            value={recipientName}
            onChange={(e) => handleRecipient(e.target.value)}
            placeholder="Julia"
            maxLength={100}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sender-name">Your name</Label>
          <Input
            id="sender-name"
            value={senderName}
            onChange={(e) => handleSender(e.target.value)}
            placeholder="Alex"
            maxLength={100}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="recipient-nickname">
            Recipient&apos;s nickname <span className="text-muted-foreground">(casual copy)</span>
          </Label>
          <Input
            id="recipient-nickname"
            value={config.recipientNickname ?? ""}
            onChange={(e) =>
              updateConfig({ recipientNickname: e.target.value || undefined })
            }
            placeholder="Jules"
            maxLength={50}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sender-nickname">
            Your nickname <span className="text-muted-foreground">(casual copy)</span>
          </Label>
          <Input
            id="sender-nickname"
            value={config.senderNickname ?? ""}
            onChange={(e) =>
              updateConfig({ senderNickname: e.target.value || undefined })
            }
            placeholder="Al"
            maxLength={50}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipient-birthdate">
          Recipient&apos;s birth date <span className="text-muted-foreground">(powers the facts chapter)</span>
        </Label>
        <Input
          id="recipient-birthdate"
          type="date"
          value={config.content.birthdate ?? ""}
          onChange={(e) =>
            updateConfig({
              content: { ...config.content, birthdate: e.target.value || undefined },
            })
          }
          className="sm:max-w-[240px]"
        />
      </div>
    </div>
  );
};
