"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Loader2, Pencil, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { occasions } from "@/config/occasions";

export interface WishSummary {
  id: string;
  title: string;
  occasion: string;
  published: boolean;
  slug: string | null;
  updatedAt: string;
}

const occasionIcon = (id: string): string =>
  occasions.find((o) => o.id === id)?.icon ?? "🎁";

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/**
 * Dashboard wish cards (4.13): continue editing (works for published
 * wishes too — edit-after-publish), open/preview, copy share link,
 * delete with confirm. Server-rendered list, client mutations.
 */
export const WishList = ({ wishes }: { wishes: WishSummary[] }) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (wish: WishSummary) => {
    if (
      !window.confirm(
        `Delete "${wish.title}"? This can't be undone.`,
      )
    ) {
      return;
    }
    setBusyId(wish.id);
    setError(null);
    try {
      const res = await fetch(`/api/wishes/${wish.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Delete failed (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleCopy = async (wish: WishSummary) => {
    if (!wish.slug) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/w/${wish.slug}`);
      setCopiedId(wish.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setError("Couldn't copy the link.");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishes.map((wish) => (
          <li
            key={wish.id}
            className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold" title={wish.title}>
                  {occasionIcon(wish.occasion)} {wish.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Updated {formatDate(wish.updatedAt)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  wish.published
                    ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {wish.published ? "Published" : "Draft"}
              </span>
            </div>

            <div className="mt-auto flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant="outline"
                render={<Link href={`/dashboard/create/${wish.id}`} />}
              >
                <Pencil className="mr-1 h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                render={
                  <a
                    href={
                      wish.published && wish.slug
                        ? `/w/${wish.slug}`
                        : `/w/${wish.slug ?? ""}?preview=1`
                    }
                    target="_blank"
                    rel="noreferrer"
                  />
                }
                disabled={!wish.slug}
              >
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                {wish.published ? "Open" : "Preview"}
              </Button>
              {wish.published && wish.slug && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void handleCopy(wish)}
                  aria-label={`Copy share link for ${wish.title}`}
                >
                  <Share2 className="mr-1 h-3.5 w-3.5" />
                  {copiedId === wish.id ? "Copied!" : "Copy link"}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void handleDelete(wish)}
                disabled={busyId === wish.id}
                aria-label={`Delete ${wish.title}`}
              >
                {busyId === wish.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
