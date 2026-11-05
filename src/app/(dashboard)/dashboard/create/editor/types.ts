import type { WishConfig } from "@/types/wish";
import type { CreateWishInput } from "@/lib/validators";
import type { WishConfigPatch } from "@/lib/wish-config";

export interface MediaRow {
  id: string;
  type: string;
  url: string;
  filename: string | null;
  sizeBytes: number | null;
  sortOrder: number;
}

/** Wish row shape returned by /api/wishes/[id]. */
export interface WishRow {
  id: string;
  userId: string;
  title: string;
  occasion: string;
  templateId: string;
  recipientName: string;
  senderName: string;
  config: unknown;
  published: boolean;
  slug: string | null;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  media?: MediaRow[];
}

export type StepId =
  | "basics"
  | "story"
  | "media"
  | "song"
  | "timeline"
  | "gift"
  | "experience"
  | "publish";

export interface StepMeta {
  id: StepId;
  label: string;
}

/** Builder steps in order (4.4-4.12). */
export const STEPS: StepMeta[] = [
  { id: "basics", label: "Basics" },
  { id: "story", label: "Story" },
  { id: "media", label: "Photos" },
  { id: "song", label: "Song" },
  { id: "timeline", label: "Timeline" },
  { id: "gift", label: "Gift" },
  { id: "experience", label: "Experience" },
  { id: "publish", label: "Publish" },
];

/** Props every step component receives from the shell. */
export interface StepProps {
  wish: WishRow;
  config: WishConfig;
  /** Patch DB-level fields (title, occasion, names) — saves immediately. */
  updateBasics: (patch: Partial<CreateWishInput>) => void;
  /** Patch the draft config — debounced autosave. */
  updateConfig: (patch: WishConfigPatch) => void;
  /** Steps gate the Next button (empty required fields, bad URLs, …). */
  onValidityChange: (valid: boolean) => void;
  /** Re-fetch the wish row (media uploads/deletes change it server-side). */
  refreshWish: () => void;
}
