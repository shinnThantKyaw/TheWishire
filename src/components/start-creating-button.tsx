"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface StartCreatingButtonProps {
  className?: string;
  /** Applied to the inner Button — hero/footer CTAs need custom size/color. */
  buttonClassName?: string;
  children?: React.ReactNode;
}

/**
 * Model C entry: silently creates an anonymous Supabase session (no login
 * wall) and opens the builder. Returns visitors with an existing session
 * skip straight through. If anonymous sign-in fails (provider disabled),
 * fall back to the login page instead of dead-ending.
 */
export const StartCreatingButton = ({
  className,
  buttonClassName,
  children,
}: StartCreatingButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleStart = async () => {
    if (loading) return;
    setLoading(true);
    setFailed(false);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
      }
      router.push("/dashboard/create");
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        size="lg"
        onClick={handleStart}
        disabled={loading}
        className={buttonClassName}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {children ?? "Start Creating"}
      </Button>
      {failed && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          Couldn&apos;t start a session. Try signing in instead.{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="underline"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
};
