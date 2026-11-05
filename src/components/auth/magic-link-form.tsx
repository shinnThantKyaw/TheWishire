"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface MagicLinkFormProps {
  mode: "login" | "signup";
}

/**
 * Passwordless email sign-in (magic link) — single auth code path for
 * both returning users and account claims. The link lands on
 * /auth/callback which exchanges the code for a session.
 */
export const MagicLinkForm = ({ mode }: MagicLinkFormProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (otpError) throw otpError;
      setStatus("sent");
    } catch (err) {
      console.error("Magic link failed:", err);
      setError("Couldn't send the link. Check your email address and try again.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="space-y-3 text-center" role="status">
        <p className="text-sm font-medium">Check your email</p>
        <p className="text-sm text-muted-foreground">
          We sent a sign-in link to <span className="font-medium">{email}</span>.
          It expires shortly — click it to continue.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setStatus("idle")}
        >
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={status === "sending"}>
        {status === "sending"
          ? "Sending…"
          : mode === "login"
            ? "Send sign-in link"
            : "Send account link"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {mode === "login"
          ? "No password needed — we'll email you a secure link."
          : "We'll email you a link to set up your account."}
      </p>
    </form>
  );
};
