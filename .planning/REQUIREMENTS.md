# Requirements

**Project:** Wishire
**Version:** 1.0 (Birthday MVP)
**Last updated:** 2026-08-25

## v1 Requirements

### Infrastructure

- [x] **INFRA-01**: Next.js project initialized with App Router, TypeScript, and Tailwind CSS
- [ ] **INFRA-02**: Supabase project configured (PostgreSQL database, storage buckets with RLS policies and file size limits) — auth is NOT required for v1
- [x] **INFRA-03**: Prisma schema defined and deployed (wishes, users, media, templates tables)
- [ ] **INFRA-04**: Vercel deployment configured with ISR for published wishes
- [x] **INFRA-05**: Template JSON schema defined with Zod validation (strict contract before templates exist)

### Templates & Design

- [ ] **TMPL-01**: Creator can select from 3-5 complete birthday templates, each a self-contained visual experience with colors, typography, decorations, and animations
- [ ] **TMPL-02**: Selected template automatically applies occasion-driven theming (birthday decorations, colors, typography) — creator never manually designs decorations

### Core Experience

- [ ] **CORE-01**: Creator can write a letter/message with recipient name personalization; recipient sees their name interpolated into the message
- [ ] **CORE-02**: Creator can upload multiple photos; recipient views them in an auto-layout gallery
- [ ] **CORE-03**: Creator can embed videos via YouTube/Vimeo links; recipient can play them inline
- [ ] **CORE-04**: Creator can preview the full wish experience exactly as the recipient will see it (defaulting to mobile viewport)
- [ ] **CORE-05**: Creator can publish a wish, generating a unique shareable link (wishire.vercel.app/w/[slug])
- [ ] **CORE-06**: Creator and recipient can copy the wish link or use native share sheet (WhatsApp, text, email)
- [ ] **CORE-07**: Every screen and interaction is fully mobile-responsive — most recipients open on phones
- [ ] **CORE-08**: Creator can choose an opening interaction (simple button, yes/no, secret code, playful interaction like "button runs away"); recipient must complete the interaction to unlock the surprise
- [ ] **CORE-09**: Creator can enable a gift box reveal stage; recipient sees an animated gift box that opens (lid lift, ribbon untie, or reveal animation) after completing the opening interaction
- [ ] **CORE-10**: Creator can enable a cake stage; recipient can interact with the cake (light candles, blow them out); celebration/confetti animation follows
- [ ] **CORE-11**: Creator can enable a ribbon/secondary reveal before the main content; the order of post-opening stages (gift box, cake, ribbon) is configurable

### Content & Media

- [ ] **MEDIA-01**: Creator can record or upload a voice message; recipient plays it back with an audio player
- [ ] **MEDIA-02**: Creator can select background music from a categorized library (mood/occasion); music plays during the recipient experience
- [ ] **MEDIA-03**: Creator can select a poem from a curated library; poem displays as a postcard-style element
- [ ] **MEDIA-04**: Creator can build a memory timeline with entries containing date, title, description, photo, and optional video; recipient views a chronological journey
- [ ] **MEDIA-05**: Creator can select a GIF/animation as a visual companion (e.g., cute character playing violin)

### Creation Flow

- [ ] **CREATE-01**: Quick Create flow available — preset-driven, minimal input (occasion, template, names, letter, photos), completes in under 5 minutes
- [ ] **CREATE-02**: Customize flow available — progressive disclosure of advanced features (opening interaction, gift box, cake, ribbon, layout, timeline, music, poem, gifts, surprise lock), max 5-7 steps, each step has curated presets with sensible defaults

### Gifts & Gamification

- [ ] **GIFT-01**: Creator can configure a Main Gift unlocked via a challenge (quiz, secret code, or question like "Where did we first meet?"); correct answer reveals the gift
- [ ] **GIFT-02**: Creator can add multiple Bonus Gifts placed into a Spin Wheel or Lottery; recipient spins/picks to reveal fun rewards (dinner, movie night, chocolate, etc.)

### Other

- [ ] **OTHER-01**: Creator can lock the wish until a specific date/time; before that time, recipient sees "Your surprise isn't ready yet" with a countdown; after the time, normal experience is available

## v2 Requirements (Deferred)

- [ ] Freemium model with publish gating — free users create/preview, paid users publish; free wish fully functional
- [ ] Creator accounts and authentication (Supabase Auth)
- [ ] Memory timeline enhancements (more layout options, transitions)
- [ ] Additional occasion support (Anniversary, Valentine's Day, Wedding, Graduation, Friendship, Thank You)
- [ ] Premium templates (monetization expansion)
- [ ] Custom audio upload (legal/licensing complexity)
- [ ] Export/download wish (premium feature)
- [ ] Custom domain support (DNS complexity, premium feature)
- [ ] Multi-language support (English first, i18n after product-market fit)
- [ ] Advanced analytics (view tracking, engagement metrics)
- [ ] QR code generation for sharing
- [ ] Group wishes (multiple contributors)

## Out of Scope

- Self-hosted/export option for MVP — premium feature, future
- Non-birthday occasions for MVP — expand after validation
- E-commerce integration — not core to the product
- Video editing — videos are embedded, not edited
- Native mobile app — responsive web first
- Real-time collaboration — single creator flow
- Social features (wish feed, public wishes) — private wishes only
- API for third-party integrations — not needed yet
- AI-generated content — keep the human voice central

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| (Filled by roadmap) | | |

## Quality Criteria

Each requirement is:
- **Specific and testable:** "Creator can upload multiple photos" not "Support photos"
- **User-centric:** "Creator can X" / "Recipient sees Y" not "System does Z"
- **Atomic:** One capability per requirement
- **Independent:** Minimal dependencies on other requirements

---
*Last updated: 2026-08-25 after initialization*
