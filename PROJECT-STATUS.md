# Wishire — Project Status

**Last updated:** 2026-11-14

## What Is Wishire?

A web app that lets non-technical people create personalized interactive surprise websites for birthdays and special occasions. Creators build through an 8-step dashboard (anonymous auth — no signup wall); recipients open a unique `/w/[slug]` link and go through an animated gift-like experience with challenges, photos, songs, and a gated main gift.

**Tech stack:** Next.js 16 (App Router) + TypeScript 5 + Tailwind CSS 4 + Prisma 6/PostgreSQL + Supabase (Auth/Storage, SSR) + Motion + Vercel

---

## Wave Status (source of record: `NEXT-TASKS.md`)

| Wave | Scope | Status |
|------|-------|--------|
| 0 — Decisions | Model C anonymous auth; Myanmar = recipient flow first | ✅ done |
| 1 — Text pipeline | `copy.ts` dictionary, Padauk/Playfair fonts, Burmese copy, visual pass | ✅ done |
| 2 — Gift challenges | Multiple-choice (server-validated), heart-catch game, legacy PIN; visual check folds into 5.1 | ✅ code |
| 3 — Flow modes | Scroll stack + interactive material grid demos | ✅ done |
| 4 — Creator flow | Model C auth (anon entry, magic link, claim banner), wish CRUD + rate limits, 8-step builder w/ autosave, media upload, YouTube song, all-3-challenge gift config, experience step (incl. **music picker with preview**), preview mode, validated publish + QR share card, dashboard list, landing page redesign, **4.14 visual pass passed 2026-11-14** | ✅ done |
| 5 — Wrap | 5.1 E2E passed, 5.2 docs, 5.3 prod verified live (2026-11-14) — **all waves complete** | ✅ done |

**Test suite:** 118+ tests green, `tsc --noEmit` clean, changed files lint-clean (16 pre-existing lint errors in legacy recipient components — see NEXT-TASKS backlog).

---

## Supabase Prerequisites (dashboard)

| Item | Status |
|------|--------|
| Anonymous provider enabled | ✅ verified in 4.14 pass (Start Creating works) |
| Custom SMTP (magic links to non-team emails) | ✅ verified 2026-11-14 (3/3 invites delivered) |
| `wish-media` public storage bucket | ✅ created in Phase 1 — re-confirm during 5.1 media upload |
| `REWARD_HMAC_SECRET` in Vercel prod env | ✅ set 2026-11-14 (Wave 5.3) |

---

## What's Next

### Wave 5 — Wrap ✅ (closed 2026-11-14)

- 5.1 E2E passed (3 modes × occasions, edge cases, challenge gates, media)
- 5.3 Prod live + verified: `the-wishire.vercel.app` — landing/login/health/4 demo wishes 200, Burmese SSR, ISR headers
- **Deploy fix:** win32 packages moved to `optionalDependencies` (EBADPLATFORM had failed every deploy since 2026-08-26); `NEXT_PUBLIC_SUPABASE_URL`/`_ANON_KEY` + `REWARD_HMAC_SECRET` added to Vercel env
- **Network note:** `api.vercel.com` unreachable from this network — use GitHub commit statuses + Vercel dashboard via VPN for logs

### Backlog (post Wave 5)

- Myanmar translation for creator-facing UI
- Theme toggle (dark styles exist, unreachable — no `.dark` class setter)
- Logout button (no `signOut` in codebase)
- Facts chapter consumes `content.birthdate` (collected, unused)
- More templates (only `birthday-classic`), music/poem library growth
- Lint debt in legacy recipient components

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/             # login, signup (magic link)
│   ├── (dashboard)/        # dashboard + 8-step wish editor
│   ├── api/                # wishes CRUD, media, publish, challenge/spin/rewards
│   └── w/[slug]/           # public recipient experience (+ ?preview=1)
├── components/
│   ├── ui/                 # shadcn (render-prop pattern)
│   ├── auth/               # ClaimBanner, MagicLinkForm
│   ├── dashboard/          # wish list
│   └── wish/               # stages, screens, chapters, orchestrator
├── config/                 # copy.ts, occasions, plans, music, templates
├── lib/                    # prisma, supabase (server/client), auth, rewards, validators
├── templates/              # birthday/classic.json
└── types/                  # wish, experience, template types
```

---

## Key Files

| File | Purpose |
|------|---------|
| `NEXT-TASKS.md` | Wave plan + status (source of record) |
| `src/config/copy.ts` | All recipient-facing strings (EN + MY) |
| `src/lib/auth.ts` | `getSessionUser` / `ensureUser` / `ensureUserRow` (Model C) |
| `src/lib/rewards.ts` | Spin RNG + HMAC proof signatures |
| `src/app/(dashboard)/dashboard/create/editor/` | 8-step builder shell + steps |
| `prisma/seed-config.ts` | 4 demo wishes (sarah + 3 mode demos) |
| `.planning/REQUIREMENTS.md` | Full requirements list |

---

## Known Gotchas

- Prisma pinned to 6.19.3 (7+ broke traditional workflow); project uses `prisma db push` (no migrations dir)
- Seed: `npx tsx prisma/seed.ts` (`npx prisma db seed` is a no-op — no script in package.json)
- shadcn/ui uses `render={<Link />}` pattern, not `asChild`
- Zod 4 needs `z.record(z.string(), z.unknown())` (2 args)
- Motion imported from `motion/react`, not `framer-motion`
- Next 16: middleware renamed → `proxy.ts`
- WSL dev: `NEXT_TEST_WASM=1 npm run dev -- --webpack` (WASM skips lockfile error; Turbopack needs native). Windows PowerShell `npm run dev` is the normal path
- Anonymous users get `<id>@anonymous.wishire.local` placeholder emails; Supabase serializes missing anon email as `""` (handled in `ensureUserRow`)
- Theme: `.dark` class variant defined but never toggled — use devtools `<html class="dark">` to test dark mode
