import { notFound } from "next/navigation";
import { Check, ShieldCheck, ShieldX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifyRewardSignature } from "@/lib/rewards";
import { copy, interpolate } from "@/config/copy";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; token: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy.verify.metaTitle };
}

/**
 * Public proof-of-reward verification (GIFT-03).
 *
 * Anyone holding the QR/code from a prize ticket can open this page.
 * The database row is the authoritative record; the HMAC signature
 * check confirms the ticket was issued for this exact prize + time.
 */
export default async function VerifyRewardPage({ params }: Props) {
  const { slug, token } = await params;

  const proof = await prisma.rewardProof.findUnique({
    where: { verifyToken: token },
    include: { wish: { select: { slug: true, title: true, senderName: true, recipientName: true } } },
  });

  // Token must exist AND belong to this wish's slug
  if (!proof || proof.wish.slug !== slug) {
    notFound();
  }

  const signatureValid = verifyRewardSignature(
    proof.wishId,
    proof.verifyToken,
    proof.label,
    proof.wonAt,
    proof.signature,
  );

  const wonDate = proof.wonAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 px-4 py-10 dark:from-[#1a0a12] dark:via-[#120810] dark:to-[#0a0508]">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(233,30,99,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-md rounded-[28px] border border-pink-500/25 bg-white/75 px-8 py-12 text-center shadow-[0_25px_50px_-12px_rgba(233,30,99,0.18)] backdrop-blur-xl dark:border-pink-400/20 dark:bg-white/10">
        {/* Corner ticks */}
        {[
          { top: 14, left: 14, rotate: 0 },
          { top: 14, right: 14, rotate: 90 },
          { bottom: 14, right: 14, rotate: 180 },
          { bottom: 14, left: 14, rotate: 270 },
        ].map((pos, i) => (
          <svg
            key={i}
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 18 18"
            className="pointer-events-none absolute"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rotate}deg)`,
              opacity: 0.5,
            }}
          >
            <path
              d="M2 2 L2 8 M2 2 L8 2"
              stroke="#E91E63"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ))}

        {/* Verdict seal */}
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: signatureValid
              ? "linear-gradient(145deg, #E91E63, #9d174d)"
              : "linear-gradient(145deg, #9ca3af, #4b5563)",
            boxShadow: signatureValid
              ? "0 0 30px rgba(233,30,99,0.35), inset 0 2px 4px rgba(255,255,255,0.3)"
              : "0 0 20px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.2)",
          }}
        >
          {signatureValid ? (
            <Check className="h-9 w-9 text-white" strokeWidth={3} aria-hidden />
          ) : (
            <ShieldX className="h-9 w-9 text-white" aria-hidden />
          )}
        </div>

        <div className="mb-4 flex items-center justify-center gap-3">
          <span
            className="h-px w-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(233,30,99,0.6))" }}
          />
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">
            {copy.verify.heading}
          </p>
          <span
            className="h-px w-8"
            style={{ background: "linear-gradient(90deg, rgba(233,30,99,0.6), transparent)" }}
          />
        </div>

        <h1
          className="text-2xl font-bold text-pink-950 dark:text-pink-50"
          style={{ fontFamily: "var(--wish-font-heading), 'Playfair Display', Georgia, serif" }}
        >
          {signatureValid ? copy.verify.authentic : copy.verify.unverified}
        </h1>

        {signatureValid ? (
          <>
            <p className="mx-auto mt-3 max-w-[36ch] text-sm leading-relaxed text-pink-800/70 dark:text-pink-200/70">
              {copy.verify.issuedNote}
            </p>

            <div className="mt-6 rounded-2xl border border-pink-500/25 bg-white/60 px-6 py-5 text-left dark:border-pink-400/20 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <span className="text-4xl" aria-hidden>
                  {proof.emoji}
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate text-lg font-bold text-pink-950 dark:text-pink-50"
                    style={{ fontFamily: "var(--wish-font-heading), 'Playfair Display', Georgia, serif" }}
                  >
                    {proof.label}
                  </p>
                  <p className="truncate text-xs text-pink-800/60 dark:text-pink-200/60">
                    {proof.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-pink-500/15 pt-4 text-xs dark:border-pink-400/15">
                <div>
                  <p className="uppercase tracking-wider text-pink-900/40 dark:text-pink-100/40">
                    {copy.verify.wonOn}
                  </p>
                  <p className="mt-0.5 font-medium text-pink-900 dark:text-pink-100">{wonDate}</p>
                </div>
                <div>
                  <p className="uppercase tracking-wider text-pink-900/40 dark:text-pink-100/40">
                    {copy.verify.serial}
                  </p>
                  <p className="mt-0.5 font-mono font-medium text-pink-900 dark:text-pink-100">
                    {proof.serial}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="uppercase tracking-wider text-pink-900/40 dark:text-pink-100/40">
                    {copy.verify.forLabel}
                  </p>
                  <p className="mt-0.5 font-medium text-pink-900 dark:text-pink-100">
                    {interpolate(copy.verify.forValue, {
                      recipient: proof.wish.recipientName,
                      title: proof.wish.title,
                      sender: proof.wish.senderName,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-pink-700 dark:text-pink-300">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              {copy.verify.signatureOk}
            </p>
          </>
        ) : (
          <p className="mx-auto mt-3 max-w-[36ch] text-sm leading-relaxed text-pink-800/70 dark:text-pink-200/70">
            {copy.verify.signatureFail}
          </p>
        )}
      </div>
    </div>
  );
}
