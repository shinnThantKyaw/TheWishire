"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, ExternalLink, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StepProps } from "../types";

/**
 * Steps 8 — Preview + Publish (4.11/4.12).
 *
 * Preview opens /w/[slug]?preview=1 (owner-only, noindex). Publish runs
 * full server-side validation, flips the status, then reveals the share
 * card: link + copy + QR.
 */
export const PublishStep = ({ wish, onValidityChange, refreshWish }: StepProps) => {
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const shareUrl =
    typeof window !== "undefined" && wish.slug
      ? `${window.location.origin}/w/${wish.slug}`
      : null;

  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  // QR for the share link once published
  useEffect(() => {
    if (wish.published && shareUrl) {
      QRCode.toDataURL(shareUrl, { width: 240, margin: 1 })
        .then(setQrDataUrl)
        .catch((err) => console.error("QR failed:", err));
    }
  }, [wish.published, shareUrl]);

  const handlePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch(`/api/wishes/${wish.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: true }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          issues?: unknown;
        };
        throw new Error(data.error ?? `Publish failed (${res.status})`);
      }
      refreshWish();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch(`/api/wishes/${wish.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: false }),
      });
      if (!res.ok) throw new Error(`Unpublish failed (${res.status})`);
      refreshWish();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unpublish failed");
    } finally {
      setPublishing(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn't copy — select the link manually.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Preview &amp; Publish</h2>
        <p className="text-sm text-muted-foreground">
          See it as the recipient will, then make it shareable.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────── */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
        <div>
          <h3 className="text-sm font-semibold">Preview</h3>
          <p className="text-xs text-muted-foreground">
            Full experience with a private banner — only you can open it.
          </p>
        </div>
        <Button
          variant="outline"
          render={
            <a href={`/w/${wish.slug ?? ""}?preview=1`} target="_blank" rel="noreferrer" />
          }
          disabled={!wish.slug}
        >
          <ExternalLink className="mr-1.5 h-4 w-4" />
          Open preview
        </Button>
      </section>

      {/* ── Publish ─────────────────────────────────── */}
      {!wish.published ? (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
          <div>
            <h3 className="text-sm font-semibold">Publish</h3>
            <p className="text-xs text-muted-foreground">
              Validates everything, then makes the link live for anyone
              you share it with.
            </p>
          </div>
          <Button onClick={() => void handlePublish()} disabled={publishing}>
            {publishing ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="mr-1.5 h-4 w-4" />
            )}
            Publish wish
          </Button>
        </section>
      ) : (
        <section className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
                Published 🎉
              </h3>
              <p className="text-xs text-green-700/80 dark:text-green-400/80">
                Share the link — anyone with it can experience the wish.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void handleUnpublish()} disabled={publishing}>
              Unpublish
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Share link QR code"
                className="h-32 w-32 rounded-md border bg-white p-1.5"
              />
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                <input
                  readOnly
                  value={shareUrl ?? ""}
                  aria-label="Share link"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  aria-label="Copy share link"
                  className="rounded p-1.5 text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button
                size="sm"
                render={
                  <a href={`/w/${wish.slug ?? ""}`} target="_blank" rel="noreferrer" />
                }
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Open live wish
              </Button>
            </div>
          </div>
        </section>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
