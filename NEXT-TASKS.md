# Wishire — Next Tasks Breakdown

**Created:** 2026-10-20
**Estimates:** solo dev hours WITH Claude Code assist (build + test + polish). Range = uncertainty.

---

## Wave 0 — Decisions (do first, blocks later waves)

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| ~~0.1~~ | **DECIDED 2026-10-20:** Model C — Supabase anonymous auth + claim-later, 5 safeguards (RLS day one, rate limits, claim prompt, lost-session honesty, anonymous quota TBD) | done | — | Blocks resolved for Wave 4 |
| ~~0.2~~ | **DECIDED 2026-10-20:** Myanmar = recipient flow only first; landing/auth/builder/dashboard stay English (translate later, separate backlog) | done | — | Wave 1 scope = wish components only |
| ~~0.3~~ | **DONE 2026-10-25:** reviewed inventory with fresh eyes (caught chanceLeft addition) | done | 1.1 | Catch missed strings |

**Backlog (post Wave 4):** Myanmar translation for creator-facing UI (landing, auth, builder, dashboard).

---

## Wave 1 — Text pipeline (Myanmar)

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| ~~1.1~~ | **DONE:** inventory = `STRING-INVENTORY.md` (S/F/D/P classes) | done | — | Grep long strings; output = spreadsheet/markdown list |
| ~~1.2~~ | **DONE 2026-10-25:** `src/config/copy.ts` dictionary + all wish components consume it (English values first); server-error client remap wired; 5 keys added during migration (song.eyebrow, introduction.quote, gift.mainGiftHeading/letsPlay/qrFooterNote), 2 reused rewards.ticket.* | done | 1.1 | No translation yet — just indirection |
| ~~1.3~~ | **DONE 2026-10-25:** `--font-padauk` wired via themeToCSSVars setters (globals.css would be dead code — inline vars win); 10 `'Padauk'` literals → `var(--font-padauk)` | done | — | Myanmar glyph/line-height eyeball → 1.6 |
| ~~1.4~~ | **DONE 2026-10-25:** `resolveCanvasFonts()` reads `--font-padauk`/`--font-playfair` from computed style + `document.fonts.load` with Burmese sample before draw; 7 `rewards.ticket.*` keys wired (was missed by 1.2 — lib/ outside sweep scope) | done | 1.3 | Also fixed pre-existing `'Playfair Display'` canvas miss |
| ~~1.5~~ | **DONE 2026-10-25:** Burmese wired into copy.ts (worksheet `MYANMAR-COPY.md` = source of record). Follow-ups closed: Q1 A → server pool builds from `copy.rewards.pool`; Q2 A → dates stay en-US; Q3 approved. Occasion set swapped to 7 main (birthday, anniversary, valentine, girlfriend-day, boyfriend-day, thadingyut, thingyan); wedding/graduation/friendship/thank-you parked (git history). `Occasion` union + occasions.ts updated. Sender-voice strings (cake screen onward) = Wave 4 editable suggestion defaults. Section C new-occasion Burmese = drafts pending final review | done | 1.2, 0.2 | Untranslated blanks stay English |
| 1.6 | Visual pass: all screens at 1366×768, 1920×900, mobile — Myanmar wrapping, truncation, contrast | 1.5–2h | 1.5 | Dark mode too |

**Wave 1 total: ~11–14h**

---

## Wave 2 — Missing gift challenges

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| 2.1 | Multiple choice challenge: UI component + config type + Zod validator | 3–4h | 1.2 | Reuse gift-challenge gate pattern |
| 2.2 | Server-side answer validation API for multiple choice | 1h | 2.1 | Don't trust client |
| 2.3 | Heart catch game: canvas/touch game component (catch N hearts in T seconds) | 4–6h | 1.2 | Mobile-first; reuse spin-wheel attempt logic |
| 2.4 | Heart catch server validation + difficulty config | 1h | 2.3 | |
| 2.5 | Wire both into gift-chapter challenge selector + template schema | 1–2h | 2.1–2.4 | `challengeType` union grows |

**Wave 2 total: ~10–14h**

---

## Wave 3 — Scroll + interactive mode demos

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| 3.1 | Demo seed data: 3 wishes in DB (click-through, scroll, interactive) | 1–2h | — | Script or dashboard-less insert |
| 3.2 | Scroll mode real implementation: stacked sections, `useInView` animations, sticky progress bar | 5–7h | 1.2 | Replace placeholder `scroll-mode.tsx` |
| 3.3 | Interactive mode real implementation: materials from box, tap-to-open, glow tracking, all-opened → closing | 5–7h | 1.2 | Replace placeholder `interactive-mode.tsx` |
| 3.4 | Gift chapter sub-screens (10A–10E) in scroll mode (stacked) | 3–4h | 3.2 | Hardest scroll part |
| 3.5 | Gift chapter + closing in interactive mode (gift = last material, closing after all) | 2–3h | 3.3 | |
| 3.6 | Demo review session: pick mode behaviors to keep/adjust | 1h | 3.2–3.5 | User decision |

**Wave 3 total: ~17–24h**

---

## Wave 4 — Creator flow

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| 4.1 | Auth: Supabase magic link OR secret edit-token on wish row (per 0.1) | 2–5h | 0.1 | Magic link = higher end |
| 4.2 | Wish CRUD API routes + Zod + ownership check | 3–4h | 4.1 | |
| 4.3 | Create flow shell: multi-step form skeleton + progress + resume draft | 2–3h | 4.2 | React Hook Form + Zod per CLAUDE.md |
| 4.4 | Step: basics — occasion, template, recipient/sender names, dates | 2–3h | 4.3 | |
| 4.5 | Step: letter + poem + facts (all dynamic text fields from 1.1) | 2–3h | 4.4 | |
| 4.6 | Step: media upload UI → Supabase Storage (photos, video, gift photos) | 4–5h | 4.4 | Client upload + progress + delete; 5MB bucket limit per file |
| 4.7 | Step: song chapter — YouTube URL input + validation + thumbnail preview | 1–2h | 4.4 | |
| 4.8 | Step: timeline entries editor (add/remove/reorder) | 2–3h | 4.5 | |
| 4.9 | Step: gift chapter config — challenge type (all 3), main gift, bonus rewards, spin wheel items/attempts | 3–4h | 2.5, 4.5 | Depends on Wave 2 |
| 4.10 | Step: experience settings — gate type, start action, flow mode, decorations, music | 2–3h | 4.3 | Depends on 0.2 for labels |
| 4.11 | Preview mode: draft wish renders at `/w/[slug]?preview=1` without publish | 2–3h | 4.2 | |
| 4.12 | Publish: slug generation, status flip, share page (link + QR) | 2–3h | 4.6–4.10 | QR lib already in deps |
| 4.13 | Edit-after-publish + dashboard wish list (status, views, edit, delete) | 3–4h | 4.12 | |
| 4.14 | Creator flow visual polish + small-laptop pass | 1.5–2h | all | 1366×768 rule |

**Wave 4 total: ~30–43h**

---

## Wave 5 — Wrap

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| 5.1 | E2E manual test: 3 modes × birthday/anniversary, edge cases (no photos, no poem, no bonus) | 2–3h | Wave 4 | |
| 5.2 | Update `PROJECT-STATUS.md` + memory files | 1h | Wave 4 | Currently stale |
| 5.3 | Production deploy verify (Vercel) — fonts, uploads, ISR, Myanmar rendering live | 1h | 5.1 | |

**Wave 5 total: ~4–5h**

---

## Summary

| Wave | Hours |
|------|-------|
| 0 — Decisions | ~1.25h |
| 1 — Myanmar text | 11–14h |
| 2 — Missing challenges | 10–14h |
| 3 — Scroll/interactive demos | 17–24h |
| 4 — Creator flow | 30–43h |
| 5 — Wrap | 4–5h |
| **Total** | **~73–101h** |

~10–13 working days at 8h/day. Waves 1–3 independent of auth decision; start immediately. Wave 2 before Wave 4 (gift config step needs challenges). Wave 3 anytime after Wave 1.
