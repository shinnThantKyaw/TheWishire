"use client";

import { useEffect, useState } from "react";
import { Link2, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const DISMISS_KEY = "wishire_claim_dismissed";

/**
 * Model C safeguard 4 (claim prompt) + 5 (lost-session honesty).
 *
 * Shown only to anonymous sessions: "Keep this wish forever" — link an
 * email via updateUser or a Google identity via linkIdentity; the same
 * user keeps every existing wish. Dismissal lasts for the tab session
 * only (the prompt re-appears next visit while still anonymous), and a
 * beforeunload warning fires while the session is unclaimed.
 */
export const ClaimBanner = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return;
      const anonymous = Boolean(user?.is_anonymous);
      setIsAnonymous(anonymous);
      if (anonymous) {
        setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Safeguard 5: warn before leaving with an unclaimed session.
  useEffect(() => {
    if (!isAnonymous) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isAnonymous]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const linkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setLinkError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        email: email.trim(),
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      console.error("Claim via email failed:", err);
      setLinkError("Couldn't send the confirmation email. Try again.");
      setStatus("idle");
    }
  };

  const linkGoogle = async () => {
    if (status === "sending") return;
    setStatus("sending");
    setLinkError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.linkIdentity({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
      // Redirects away on success; reset if it returns
      setStatus("idle");
    } catch (err) {
      console.error("Google link failed:", err);
      setLinkError("Couldn't start Google sign-in. Try again.");
      setStatus("idle");
    }
  };

  if (!isAnonymous || dismissed) return null;

  return (
    <div
      className="mb-6 rounded-xl border border-pink-200 bg-pink-50 p-4 dark:border-pink-900/40 dark:bg-pink-950/30"
      role="region"
      aria-label="Keep this wish forever"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 shrink-0 text-pink-600 dark:text-pink-400" />
          <p className="text-sm font-semibold">Keep this wish forever</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="rounded p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        You&apos;re browsing as a guest. Link an account so your wishes
        aren&apos;t lost if this browser&apos;s data is cleared.
      </p>

      {status === "sent" ? (
        <p className="mt-3 text-sm font-medium text-green-700 dark:text-green-400" role="status">
          Check your email — confirm the link and this account (with all its
          wishes) will be yours.
        </p>
      ) : (
        <form onSubmit={linkEmail} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email to link this account"
            className="sm:flex-1"
          />
          <Button type="submit" size="sm" disabled={status === "sending"}>
            <Mail className="mr-1.5 h-4 w-4" />
            {status === "sending" ? "Sending…" : "Link email"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={linkGoogle}
            disabled={status === "sending"}
          >
            Link Google
          </Button>
        </form>
      )}

      {linkError && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {linkError}
        </p>
      )}
    </div>
  );
};
