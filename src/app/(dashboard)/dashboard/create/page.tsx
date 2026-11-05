"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * /dashboard/create — creates a draft immediately (placeholder basics)
 * and hands off to the editor. Creating up-front means the draft gets a
 * slug + id from second one, so autosave and preview always have a home.
 */
export default function CreatePage() {
  const router = useRouter();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/wishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Untitled wish",
            occasion: "birthday",
            templateId: "birthday-classic",
            recipientName: "Recipient",
            senderName: "You",
          }),
        });
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
        const { wish } = (await res.json()) as { wish: { id: string } };
        router.replace(`/dashboard/create/${wish.id}`);
      } catch (error) {
        console.error(error);
        router.replace("/dashboard?error=create_failed");
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-muted-foreground" role="status">
        Starting your draft…
      </p>
    </div>
  );
}
