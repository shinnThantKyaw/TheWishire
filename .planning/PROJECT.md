# Wishire

## What This Is

Wishire is a web application that lets non-technical people create personalized interactive surprise websites for special occasions. The recipient should feel like they are opening a special gift, not simply viewing a webpage.

The core product is an **interactive digital surprise/gift experience** — not a website builder, not a greeting card maker.

## What This Is NOT

- A generic website builder (Wishire controls the visual experience)
- A social media platform (wishes are private, shared via link)
- A card-making tool (the experience is animated and interactive, not static)
- A video editor (videos are embedded, not edited)

## Origin Story

The founder built a custom birthday website for their girlfriend. Friends wanted similar websites but couldn't code. People are already selling custom birthday/anniversary websites online. Wishire democratizes this — anyone should be able to create a beautiful, personalized surprise experience without knowing how to code.

## Core Value

**The "unwrap" feeling.** When a recipient opens a Wishire link, they should feel the same emotions as opening a physical gift — anticipation, surprise, delight, and warmth. Every design decision serves this emotional arc.

## Core Principles

1. **Simple by default, powerful when wanted.** Quick Create for speed, Customize for depth. Nobody should feel overwhelmed.
2. **Occasion-driven design.** The selected occasion automatically influences visuals, decorations, animations, and content. The creator never manually designs decorations.
3. **Templates are complete experiences.** Not component kits — full visual atmospheres with colors, typography, animations, and transitions that produce a beautiful result without further customization.
4. **Emotional, not informational.** This is a gift, not a webpage. Animation, pacing, and reveal sequences matter more than content density.
5. **Progressive disclosure.** Advanced features (gift box, cake, timeline, music) are opt-in, never forced on the creator.

## User Personas

### Creator (Primary)
- Non-technical person who wants to make someone they love feel special
- Has a phone with photos and knows what they want to say
- May have 5 minutes (Quick Create) or 30 minutes (Customize)
- Never wants to feel like they're "building a website"

### Recipient
- Receives a link (via text, WhatsApp, email, etc.)
- Opens it on their phone (likely) or laptop
- Experiences an animated, interactive surprise
- Should feel emotional, not confused

## User Flows

### Quick Create Flow
1. Choose occasion (Birthday)
2. Choose template
3. Enter sender/recipient names
4. Write letter
5. Add photos
6. Preview
7. Publish → share link

### Customize Flow
1. Choose occasion
2. Choose template
3. Configure opening interaction (optional)
4. Configure gift box (optional)
5. Configure cake (optional)
6. Configure ribbon reveal (optional)
7. Choose main layout (scroll/pages/interactive)
8. Add content (letter, photos, videos, voice, music, poem)
9. Add memory timeline (optional)
10. Add gifts/challenges (optional)
11. Configure surprise lock (optional)
12. Preview full experience
13. Publish → share link

### Recipient Experience Flow
1. Open Wishire link
2. Opening interaction (button, quiz, secret code, playful interaction)
3. Optional Gift Box reveal
4. Optional Cake interaction (birthday: light/blow candles)
5. Optional Ribbon/secondary reveal
6. Main celebration (photos, letter, memories)
7. Voice/video/music/poem
8. Optional Gift Challenge (quiz, code, question)
9. Main Gift unlocked
10. Optional Bonus Gifts (spin wheel, lottery)
11. Closing message

## Feature Categories

### Birthday Features (MVP)
- Occasion-specific decorations and templates
- Opening interaction (simple button, yes/no, secret code, playful)
- Gift box (open lid, untie ribbon, reveal animation)
- Cake with candle interaction (light/blow out, confetti)
- Ribbon/secondary reveal
- Main experience layouts (one-page scroll, multiple pages, interactive objects)
- Letter/message
- Multiple photos
- Short videos (embedded)
- Voice message
- Music (library, categorized by mood)
- Poem (curated library, postcard-style display)
- Memory timeline
- Gifts: Main Gift (unlocked via challenge) + Bonus Gifts (spin wheel, lottery)
- Surprise lock (countdown until reveal date)
- Preview as recipient
- Publish with unique link
- Share/copy link

### Future Occasions
- Anniversary (relationship duration, date-specific interactions)
- Valentine's Day
- Wedding
- Graduation
- Friendship
- Thank You
- Other Special Day

### Premium Features (Future)
- Premium templates
- Custom audio upload
- Export/download wish
- Custom domain
- Advanced analytics (who viewed, when)

### Out of Scope (for now)
- Self-hosted/export option (premium feature, future)
- E-commerce integration (no selling physical gifts through Wishire)
- Video editing (videos are embedded, not edited)
- Multi-language support (English first, i18n later)
- Native mobile app (responsive web first)
- Real-time collaboration on wish creation
- Social features (wish feed, public wishes)
- API for third-party integrations

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Birthday-only MVP | Nail one occasion perfectly before expanding | — Pending |
| Freemium with publish gating | Free users create/preview, paid users publish + premium | — Pending |
| Wishire-hosted (Vercel) | Non-technical users just share a link | — Pending |
| Templates as JSON configs | Same rendering engine serves all wishes, easy to add templates | — Pending |
| Supabase for backend | Auth + database + storage in one, fast to build with | — Pending |
| Framer Motion for animations | React-native, declarative, good for reveal sequences | — Pending |
| Solo development, no rush | Quality over speed, learn as we build | — Pending |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| UI/Components | shadcn/ui + custom Wishire components |
| Icons | Lucide React |
| Animations | Framer Motion |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase Auth (when accounts are introduced) |
| File Storage | Supabase Storage |
| Validation | Zod |
| Forms | React Hook Form + Zod |
| State Management | React state/context; Zustand only if genuinely complex state emerges |
| Server/API | Next.js Server Actions + Route Handlers |
| Deployment | Vercel |
| Package Manager | npm |
| Version Control | Git + GitHub |

## Context

- Solo developer, no hard deadline
- Deploying on Vercel (wishire.vercel.app)
- Brand name: Wishire
- The founder has already built one custom birthday website and validated demand through friends

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Birthday wish creation with Quick Create flow
- [ ] Birthday wish creation with Customize flow
- [ ] Template system with occasion-driven visuals
- [ ] Opening interaction options (button, yes/no, secret code, playful)
- [ ] Gift box post-opening stage
- [ ] Cake with candle interaction (birthday)
- [ ] Ribbon/secondary reveal
- [ ] Main experience layouts (scroll, pages, interactive objects)
- [ ] Letter/message content
- [ ] Photo gallery (multiple photos)
- [ ] Video embedding
- [ ] Voice message
- [ ] Music library (categorized by mood/occasion)
- [ ] Poem library (postcard-style display)
- [ ] Memory timeline
- [ ] Gift system (main gift via challenge + bonus gifts via spin wheel/lottery)
- [ ] Surprise lock with countdown
- [ ] Preview as recipient
- [ ] Publish with unique shareable link
- [ ] Share/copy link functionality
- [ ] Freemium model with publish gating
- [ ] Creator account system (Supabase Auth)
- [ ] Responsive design (mobile-first)

### Out of Scope

- Self-hosted/export option — premium feature, future
- Non-birthday occasions — expand after MVP validates
- Custom audio upload — legal/licensing complexity
- E-commerce integration — not core to the product
- Video editing — videos are embedded, not edited
- Multi-language support — English first
- Native mobile app — responsive web first
- Real-time collaboration — single creator flow
- Social features — private wishes only
- API for third-party integrations — not needed yet

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-25 after initialization*
