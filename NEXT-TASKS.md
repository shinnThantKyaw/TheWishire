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
| ~~1.6~~ | **DONE 2026-11-05:** visual pass — user checked on Windows; timeline nicknames, gift tease, scroll stack all passed. Committed `723f9ed` + `f95de3a`. | done | 1.5 | Dark mode spot-check passed |

### 1.6 Visual test checklist (user runs on Windows — `npm run dev` → localhost:3000)

**Status: DONE (2026-11-05).**

- **Viewports:** 1366×768 + 1920×900 = no horizontal scroll, no clipped/overlapping content, no height overflow; quick 390px mobile pass too.
- **Slugs:** `/w/happy-birthday-sarah` (main), `/w/demo-scroll`, `/w/demo-interactive`, `/w/demo-pages`.
- **Padauk/font (1.3/1.4):** song eyebrow `🎵 သီချင်း` + `{nickname}နားထောင်ဖို့`; poem Burmese glyphs + line-height; gift contents labels; long-Burmese wrapping (intro descriptions, gift subheadings, closing) — no tofu, no overflow.
- **Voice/slots (1.5):** intro hey = `မင်္ဂလာပါ Sarahရေ`; senderLine `{occasion}အတွက် Alexက…` reads naturally; cake greeting + gift subheading = sender nick voice with name injected; Section C drafts (gf-day/bf-day/thadingyut/thingyan) reviewed.
- **Occasion switch** (changes intro/gift-opening/closing only): `node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.wish.update({where:{slug:'happy-birthday-sarah'},data:{occasion:process.argv[1]}}).then(()=>p.$disconnect())" thingyan` — try `girlfriend-day`,`boyfriend-day`,`thadingyut`,`thingyan`,`anniversary`,`valentine` → **reset to `birthday`**.
- **Gift run:** PIN `1609` → gift → Let's Play → spin (Burmese wheel) → PNG ticket (Burmese) → QR → verify page → Prize Booth.
- **Dark mode:** app pages spot-check.
- **Do NOT flag (intentional English blanks):** fallback occasion texts, closing thankYou + fallback headline, timeline subtitles, facts sample (except zodiac), photos movingMemory/worthKeeping/moreMemories, song emptyHeading, brand Wishire.
- ~~Findings → fix → then Wave 2~~ → **SKIPPED Wave 2 on 2026-11-05** (user decision: do Wave 3 first). Wave 2 still required before Wave 4.9.

**WSL dev recipe (works):** `NEXT_TEST_WASM=1 npm run dev -- --webpack` — WASM skips Next 16 lockfile (drvfs lock fails); Turbopack needs native so `--webpack` mandatory.

**Wave 1 total: ~11–14h**

---

## Wave 2 — Missing gift challenges

**DONE 2026-11-05** (skipped earlier same day, executed after Wave 3).

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| ~~2.1~~ | **DONE:** `GiftChallengeConfig` union (pin/multiple-choice/heart-catch) in types/wish.ts + `GiftChallengeConfigSchema` Zod discriminated union; `MultipleChoiceGate` component | done | 1.2 | |
| ~~2.2~~ | **DONE:** `POST /api/w/[slug]/challenge` — server compares answerIndex against DB config; client never receives correctIndex | done | 2.1 | 11 route tests |
| ~~2.3~~ | **DONE:** `HeartCatchGame` — falling hearts, tap to catch, N in T seconds, mobile-first (56px targets) | done | 1.2 | DOM/motion, not canvas |
| ~~2.4~~ | **DONE:** same route validates caught≥N + 1s≤elapsed≤T+500ms grace; difficulty from config (`heartsToCatch`/`timeLimitSeconds`/`spawnIntervalMs`) | done | 2.3 | |
| ~~2.5~~ | **DONE:** GiftGate renders `config.challenge` (legacy gateAction = fallback); seed: demo-scroll=MC, demo-pages=heart-catch, sarah/interactive=legacy PIN. Builder selector UI → Wave 4.9 | done | 2.1–2.4 | 54/54 tests |

**Visual check:** `/w/demo-scroll` (MC wrong-shake → correct opens gift), `/w/demo-pages` (heart game → server validate → gift), `/w/happy-birthday-sarah` (PIN 1609 unchanged).

**Wave 2 total: ~10–14h**

---

## Wave 3 — Scroll + interactive mode demos

**DONE 2026-11-05** (3.6 visual check passed; only scroll chapters full 1366×768 sweep remains optional).

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| ~~3.1~~ | **DONE:** 4 demo slugs in `prisma/seed-config.ts` (happy-birthday-sarah + demo-scroll/pages/interactive) | done | — | |
| ~~3.2~~ | **DONE:** stacked sections + `whileInView` + `onSectionVisible` → progress bar (commit e84d1b0, `scroll-sections.ts` + test) | done | 1.2 | |
| ~~3.3~~ | **DONE 2026-11-05:** material grid, tap-to-open overlay, glow tracking, all-opened → closing (commits f95de3a + 79cd67d, 6 RTL tests) | done | 1.2 | |
| ~~3.4~~ | **DONE:** gift island in scroll mode — GiftChapter receives `giftSubScreen`/`onNextGiftSubScreen` | done | 3.2 | |
| ~~3.5~~ | **DONE 2026-11-05:** gift = last material (finishes on final sub-screen continue), closing after all opened — shipped with 3.3 in 79cd67d | done | 3.3 | |
| ~~3.6~~ | **DONE 2026-11-05:** user visual check of `/w/demo-interactive` passed — no adjustments requested | done | 3.2–3.5 | |

**Wave 3 total: ~17–24h**

---

## Wave 4 — Creator flow

**CODE DONE 2026-11-05 (4.1–4.13); 4.14 awaiting user visual pass.**

| # | Task | Est | Depends | Notes |
|---|------|-----|---------|-------|
| ~~4.1~~ | **DONE:** Model C — `proxy.ts` session refresh, `ensureUser`/`ensureUserRow`, anonymous Start button, magic-link login/signup, ClaimBanner (safeguards 4+5) | done | 0.1 | Requires **Anonymous provider enabled** in Supabase dashboard |
| ~~4.2~~ | **DONE:** `/api/wishes` CRUD, owner-only (404 for non-owners), `UpdateWishSchema`, in-memory rate limits (10 creates/hour) | done | 4.1 | |
| ~~4.3~~ | **DONE:** `/dashboard/create` → immediate draft →8-step editor shell, chips nav, debounced autosave, template-seeded defaults. (Plain controlled state instead of RHF — fewer moving parts; resume = dashboard Edit reopens draft) | done | 4.2 | |
| ~~4.4~~ | **DONE:** Basics — title/occasion/template/names/nicknames + birthdate (`content.birthdate`) | done | 4.3 | |
| ~~4.5~~ | **DONE:** Story — letter (counter) + optional poem. Note: facts chapter still static copy — birthdate not consumed yet (backlog) | done | 4.4 | |
| ~~4.6~~ | **DONE:** Media — supabase upload + WishMedia rows, 5MB/10 photos/1 video both sides, bucket-URL allowlist, delete w/ storage cleanup | done | 4.4 | |
| ~~4.7~~ | **DONE:** Song — `extractYouTubeId` (watch/youtu.be/shorts/embed/bare) + thumbnail preview | done | 4.4 | |
| ~~4.8~~ | **DONE:** Timeline — add/remove/reorder, date+title validity | done | 4.5 | |
| ~~4.9~~ | **DONE:** Gift — challenge selector (all 3 types), main gift message/photos, spin-wheel attempts + weighted prizes | done | 2.5 | |
| ~~4.10~~ | **DONE:** Experience — flow mode/gate/start action/decorations/music; Zod now includes gateType/startAction/boxOpenMethod | done | 4.3 | |
| ~~4.11~~ | **DONE:** `/w/[slug]?preview=1` owner-only draft render, amber banner + noindex | done | 4.2 | |
| ~~4.12~~ | **DONE:** slug at draft creation, `POST …/publish` full-validation gate, share card (link + QR + copy), unpublish | done | 4.6–4.10 | |
| ~~4.13~~ | **DONE:** dashboard wish list (chips, edit/preview/copy/delete), edit-after-publish works via same editor | done | 4.12 | |
| 4.14 | Creator flow visual polish + small-laptop pass | 1.5–2h | all | Code audit done (breakpoints/truncate/dark tokens); **user visual pass pending** |

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
