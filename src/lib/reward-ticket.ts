import QRCode from "qrcode";
import { copy, interpolate } from "@/config/copy";
import type { SpinProof } from "@/types/experience";

/**
 * Client-side PNG prize-ticket renderer (GIFT-03).
 *
 * Draws a carnival-style ticket on <canvas>: cream paper, pink header,
 * prize info, perforated stub with a QR code pointing at the public
 * verify page. The PNG is cosmetic — authenticity comes from the DB
 * record + HMAC signature behind the QR link.
 */

interface TicketOptions {
  item: { label: string; emoji: string; description: string };
  proof: SpinProof;
  primaryColor: string;
  wishSlug: string;
}

const W = 760;
const H = 380;
const SCALE = 2; // retina crispness

const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/**
 * Resolve webfont family names for canvas `ctx.font` strings.
 *
 * next/font hashes family names (var(--font-padauk) → '__Padauk_xxx'), so
 * literal names like 'Padauk'/'Playfair Display' never match the loaded
 * webfont. Canvas can't use var() — read the declared value from the root
 * computed style instead, then force-load glyphs (Burmese sample for
 * Padauk) before drawing, since canvas does not trigger font downloads.
 */
const resolveCanvasFonts = async (): Promise<{ padauk: string; playfair: string }> => {
  const styles = getComputedStyle(document.documentElement);
  const padauk = styles.getPropertyValue("--font-padauk").trim() || "sans-serif";
  const playfair = styles.getPropertyValue("--font-playfair").trim() || "Georgia";
  try {
    await Promise.all([
      document.fonts.load(`700 34px ${padauk}`, "က"),
      document.fonts.load(`400 18px ${padauk}`, "က"),
      document.fonts.load(`700 34px ${playfair}`, "Ag"),
    ]);
  } catch {
    // Font already loaded or unavailable — drawing falls back down the stack.
  }
  return { padauk, playfair };
};

export const downloadRewardTicketPng = async ({
  item,
  proof,
  primaryColor,
  wishSlug,
}: TicketOptions): Promise<void> => {
  const fonts = await resolveCanvasFonts();
  const verifyUrl = `${window.location.origin}/w/${wishSlug}/verify/${proof.verifyToken}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 220,
    color: { dark: "#1A1A2E", light: "#FFFFFF" },
  });

  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(SCALE, SCALE);

  // ── Paper ──────────────────────────────────────────────
  const paperGrad = ctx.createLinearGradient(0, 0, W, H);
  paperGrad.addColorStop(0, "#F5E6C8");
  paperGrad.addColorStop(1, "#EBD9B5");
  drawRoundRect(ctx, 4, 4, W - 8, H - 8, 22);
  ctx.fillStyle = paperGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#D4A574";
  ctx.stroke();

  // Subtle paper grain
  ctx.save();
  drawRoundRect(ctx, 4, 4, W - 8, H - 8, 22);
  ctx.clip();
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#5C4033" : "#FFFFFF";
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }
  ctx.restore();

  const stubX = W - 220;

  // ── Header bar ─────────────────────────────────────────
  ctx.save();
  drawRoundRect(ctx, 4, 4, W - 8, 64, 22);
  ctx.clip();
  ctx.fillStyle = primaryColor;
  ctx.fillRect(4, 4, W - 8, 64);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(4, 40, W - 8, 32); // square off bottom of header
  ctx.restore();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold 20px ${fonts.padauk}, Georgia, serif`;
  ctx.textBaseline = "middle";
  ctx.fillText(copy.rewards.ticket.prizeTicket, 32, 36);
  ctx.font = `13px ${fonts.padauk}, Georgia, serif`;
  ctx.globalAlpha = 0.85;
  ctx.fillText(copy.rewards.ticket.proofOfReward, 190, 37);
  ctx.globalAlpha = 1;

  // ── Prize body ─────────────────────────────────────────
  ctx.font = "72px serif";
  ctx.fillText(item.emoji, 36, 150);

  ctx.fillStyle = "#5C4033";
  ctx.font = `bold 34px ${fonts.playfair}, ${fonts.padauk}, Georgia, serif`;
  ctx.fillText(item.label, 130, 128);

  ctx.globalAlpha = 0.75;
  ctx.font = `18px ${fonts.padauk}, Georgia, serif`;
  ctx.fillText(item.description, 130, 168);
  ctx.globalAlpha = 1;

  // Points + serial row
  ctx.fillStyle = primaryColor;
  ctx.font = `bold 16px ${fonts.padauk}, Georgia, serif`;
  ctx.fillText(interpolate(copy.rewards.ticket.bonusPoints, { points: proof.bonusPoints }), 36, 240);

  ctx.fillStyle = "#5C4033";
  ctx.globalAlpha = 0.7;
  ctx.font = `14px 'Courier New', ${fonts.padauk}, monospace`;
  ctx.fillText(interpolate(copy.rewards.ticket.serial, { serial: proof.serial }), 36, 272);
  ctx.globalAlpha = 1;

  // Won date
  const wonDate = new Date(proof.wonAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.globalAlpha = 0.7;
  ctx.font = `14px ${fonts.padauk}, Georgia, serif`;
  ctx.fillText(interpolate(copy.rewards.ticket.wonOn, { date: wonDate }), 36, 302);
  ctx.globalAlpha = 1;

  // Footer
  ctx.globalAlpha = 0.5;
  ctx.font = `12px ${fonts.padauk}, Georgia, serif`;
  ctx.fillText(copy.rewards.ticket.claimFooter, 36, H - 36);
  ctx.globalAlpha = 1;

  // ── Perforation ────────────────────────────────────────
  ctx.strokeStyle = "rgba(92, 64, 51, 0.45)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 7]);
  ctx.beginPath();
  ctx.moveTo(stubX, 24);
  ctx.lineTo(stubX, H - 24);
  ctx.stroke();
  ctx.setLineDash([]);

  // Notch holes
  ctx.fillStyle = "#FDFAF6";
  ctx.beginPath();
  ctx.arc(stubX, 10, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(stubX, H - 10, 12, 0, Math.PI * 2);
  ctx.fill();

  // ── Stub: QR + verify code ─────────────────────────────
  const qr = new Image();
  await new Promise<void>((resolve, reject) => {
    qr.onload = () => resolve();
    qr.onerror = () => reject(new Error("QR load failed"));
    qr.src = qrDataUrl;
  });
  const qrSize = 150;
  const qrX = stubX + (W - stubX - qrSize) / 2;
  ctx.drawImage(qr, qrX, 48, qrSize, qrSize);

  ctx.fillStyle = "#5C4033";
  ctx.textAlign = "center";
  ctx.font = `bold 13px ${fonts.padauk}, Georgia, serif`;
  ctx.fillText(copy.rewards.ticket.scanToVerify, stubX + (W - stubX) / 2, 224);
  ctx.globalAlpha = 0.7;
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillText(proof.verifyToken.slice(0, 16), stubX + (W - stubX) / 2, 248);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";

  // ── Download ───────────────────────────────────────────
  await new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wish-reward-${proof.serial}.png`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
};
