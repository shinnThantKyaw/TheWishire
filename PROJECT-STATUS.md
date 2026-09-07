# Wishire — Project Status

**Last updated:** 2026-08-31

## What Is Wishire?

A web app that lets non-technical people create personalized interactive surprise websites for birthdays. The recipient opens a link and goes through a gift-like experience — envelope, gift box, cake, letter, photos, etc.

**Tech stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Supabase + Prisma + Vercel

---

## What's Done

### Phase 1: Foundation ✅

| Area | Status | Details |
|------|--------|---------|
| Next.js project | ✅ | App Router, TypeScript, Tailwind CSS |
| Supabase | ✅ | Database connected, storage bucket `wish-media` (public, 5MB limit) |
| Prisma | ✅ | Schema deployed — users, wishes, wish_media, subscriptions, templates |
| Vercel | ✅ | Live at `the-wishire.vercel.app`, auto-deploy from GitHub |
| Template system | ✅ | Types, Zod validation, JSON schema, registry with 1 template |
| UI components | ✅ | shadcn/ui — button, card, dialog, input, label |
| Route pages | ✅ | Landing, login, signup, dashboard, `/w/[slug]` (placeholder) |
| Config files | ✅ | Occasions, plans, templates metadata |
| ISR | ✅ | `vercel.json` with cache headers for `/w/[slug]` |

**Not done in Phase 1:**
- Supabase Auth — deferred (no auth needed for MVP viewing)
- Only 1 template exists (birthday-classic), need 3-5

---

## What's Next

### Phase 2: Recipient Experience (NEXT)

The core product — what the recipient sees at `/w/[slug]`.

1. **Stage machine** — Client-side state machine that progresses: envelope → gift box → cake → main content → closing
2. **Stage components** — Each stage as a React component with Motion animations
3. **Mobile-first design** — Most recipients open on phones
4. **Seed test data** — Create test wishes in the database

### Phase 3: Creator Dashboard

The wish creation flow:

1. **Quick Create** — Preset-driven, <5 minutes (occasion, template, names, letter, photos)
2. **Customize** — Advanced features with progressive disclosure
3. **Media upload** — Photos, voice, video links to Supabase Storage
4. **Preview** — See exactly what recipient will see
5. **Publish** — Generate unique shareable link

### Phase 4: Content & Polish

1. More templates (3-5 birthday templates)
2. Music library, poem library, GIF library
3. Memory timeline component
4. Gift system (main gift via challenge + bonus spin wheel)
5. Surprise lock with countdown

### Phase 5+: Future

- Auth/accounts, freemium model, additional occasions, premium templates

---

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── page.tsx            # Landing page
│   ├── (auth)/             # Login, signup
│   ├── (dashboard)/        # Creator dashboard
│   └── w/[slug]/           # Recipient experience
├── components/ui/          # shadcn/ui components
├── config/                 # App config (occasions, plans, templates)
├── lib/                    # Utilities, Supabase clients, Prisma
├── templates/              # Template system (JSON configs + types)
└── types/                  # TypeScript types
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/templates/birthday/classic.json` | The one existing template config |
| `src/types/template.ts` | Template, Stage, Theme type definitions |
| `src/types/wish.ts` | Wish, WishConfig, WishSettings types |
| `src/lib/validators.ts` | Zod schemas for templates, wishes, animations |
| `src/config/templates.ts` | Template metadata (name, description, thumbnail) |
| `.planning/REQUIREMENTS.md` | Full requirements list |
| `.planning/PROJECT.md` | Product vision, user flows, decisions |

---

## Known Gotchas

- Prisma pinned to 6.19.3 (7+ broke traditional workflow)
- shadcn/ui v4 uses `render={<Link />}` not `asChild`
- Zod 4 needs `z.record(z.string(), z.unknown())` (2 args)
- Motion package imported from `motion/react`, not `framer-motion`
- `@supabase/ssr` breaks on Vercel Edge — middleware simplified for v1