# Project Research Summary

**Project:** Wishire
**Domain:** Interactive surprise/gift website platform
**Researched:** 2026-08-25
**Confidence:** HIGH

## Executive Summary

Wishire occupies a white space between digital greeting cards and interactive websites: a multi-stage, emotionally-arc'd surprise experience where creators build personalized "unwrapping" moments for recipients. No current competitor owns this category -- Canva makes cards, JibJab makes funny videos, Kudoboard makes group boards, but none create a cinematic, interactive reveal experience. The recommended approach is a Next.js 16 App Router application with Supabase (auth, storage, PostgreSQL), Prisma ORM, and Motion (framer-motion successor) for animation orchestration, deployed on Vercel. The architecture separates the creator dashboard (Server Components + Server Actions) from the recipient experience (full Client Components with animation), connected by a JSON template registry and a client-side stage machine.

The core technical risk is performance on mobile -- the recipient experience is animation-heavy, and mobile GPUs are significantly weaker than desktop. This must be addressed from day one by constraining animations to transform/opacity only, using LazyMotion, and limiting concurrent animations. The second major risk is the "over-customization trap": giving creators too many options leads to abandonment, while too few makes wishes feel generic. The solution is a strict Quick Create (preset-driven, under 5 minutes) vs. Customize (max 5-7 steps, curated presets) split. The third risk is the freemium paywall killing the viral loop -- gating must be by quantity (1 free wish with full features) not quality, and the paywall must appear before creation begins, not after emotional investment.

The project benefits from well-established patterns: Next.js App Router is battle-tested, Supabase auth middleware has a clear pattern, and the component-registry template system is a proven architecture. The main areas requiring careful design are the animation performance budget, the template JSON schema contract, and the creator UX flow. With 8 table-stakes features, 14 differentiators, and 12 anti-features to avoid, the MVP should target approximately 16 features across 2 phases, with Phase 1 delivering a working creation-to-sharing pipeline and Phase 2 adding the interactive "magic" that defines the product.

## Key Findings

### Recommended Stack

The stack is modern, well-supported, and aligned with the product's needs. Next.js 16 with App Router provides Server Components for the dashboard and Server Actions for CRUD, while the recipient experience uses Client Components exclusively for animation control. Supabase handles auth, file storage, and PostgreSQL hosting, while Prisma provides type-safe queries and schema migration management. Motion (the renamed framer-motion) is the animation backbone. All versions have been verified against the npm registry as of 2026-08-25.

**Core technologies:**
- **Next.js 16.3.2 (App Router):** Full-stack React framework -- Server Components reduce client JS for dashboard pages, Server Actions simplify form submissions, built-in Image optimization for photo-heavy experiences, seamless Vercel deployment
- **React 19.2.8:** Ships with Next.js 16 -- stable Server Components, use() hook, improved Suspense for streaming
- **Supabase 2.115.0 + @supabase/ssr 0.12.5:** Backend-as-a-Service -- PostgreSQL, file storage, auth, row-level security, generous free tier for MVP
- **Prisma 7.9.1 + @prisma/adapter-pg:** Type-safe ORM -- migration management, Prisma Studio for dev inspection, connects to Supabase PostgreSQL
- **Motion 13.1.1:** Animation library (successor to framer-motion) -- AnimatePresence for stage transitions, variants for orchestrated reveals, stagger for photo galleries
- **Tailwind CSS 4.3.3:** Utility-first styling -- rapid visual iteration, CSS-first config in v4
- **shadcn/ui 4.19.0:** Accessible UI components -- form inputs, buttons, dialogs for creation flow only (not recipient experience)
- **Zod 4.4.3 + React Hook Form 7.86.0:** Schema validation + form state -- type-safe validation for wish configs and creation forms

**Key compatibility:** Prisma 7 requires `@prisma/adapter-pg` driver adapter (versions must match exactly). The `framer-motion` package is now `motion` -- importing from the old name still works but signals outdated knowledge. Zod 4 resolver is included in `@hookform/resolvers` v5+.

### Expected Features

**Must have (table stakes):**
- Personalized greeting/message with recipient name -- core purpose of any greeting product
- Photo upload and display -- multiple photos, basic gallery layout
- Template selection -- 3-5 complete birthday templates, not a blank canvas
- Occasion-specific theming -- decorations, colors, typography auto-applied
- Unique shareable link -- clean URLs, reliable hosting, primary delivery mechanism
- Mobile-responsive experience -- most recipients open on phones, every stage must work perfectly
- Preview before publish -- "View as recipient" mode, must default to mobile viewport
- Social sharing -- copy link, native share sheet, WhatsApp/text/email
- Free tier -- create and preview free, publish gated

**Should have (competitive differentiators):**
- Interactive opening stage -- button/quiz/code entry before reveal; Wishire's signature feature
- Gift box reveal animation -- physical metaphor of opening a gift, lid lift, ribbon untie
- Cake with candle interaction -- light candles, blow them out, confetti; birthday-specific delight
- Multi-stage experience flow -- opening -> gift box -> cake -> main content -> gifts; this IS the product
- Voice message playback -- hearing someone's voice is more emotional than reading text
- Music library (mood-categorized) -- sets emotional atmosphere, curated tracks
- Quick Create flow -- speed for simple wishes, 2-minute creation path
- Customize flow -- full control with progressive disclosure, max 5-7 steps

**Defer (v2+):**
- Memory timeline -- chronological photo/story journey
- Gift challenge system -- interactive game/quiz before unlock
- Spin wheel / lottery bonus gifts -- gamification delight
- Surprise lock with countdown -- scheduled reveal
- Curated poem library -- literary/emotional depth
- Premium templates -- monetization expansion
- Custom domain -- DNS complexity, premium feature
- Multi-language support -- English first until product-market fit

### Architecture Approach

The architecture follows a clean three-layer separation: Presentation (Creator Dashboard at `/dashboard/*` as Server Components, Recipient Experience at `/w/[slug]` as Client Components), Application (Template Engine, Wish State Machine, Media Pipeline, Auth Service), and Data (PostgreSQL via Prisma, Supabase Storage for media). The two halves of the product -- creation and viewing -- are deliberately decoupled with different rendering strategies, different auth requirements, and different performance characteristics.

**Major components:**
1. **Creator Dashboard** -- wish CRUD, template selection, content editing, preview, publish; uses Next.js App Router pages with React Hook Form + Zod for forms
2. **Recipient Experience** -- full-screen animated wish viewing, stage transitions, interactivity; Client component at `/w/[slug]` with Motion orchestration, no auth required
3. **Template Engine** -- JSON config -> React component tree mapping via component registry; templates are data (JSON configs) plus logic (renderer, variant generators), adding new templates is adding a JSON file
4. **Wish State Machine** -- finite state machine tracking recipient progress through experience stages; React context + useReducer on client, no server calls during viewing
5. **Media Pipeline** -- upload, validate, optimize, store photos/videos/voice; Server Actions for upload, Supabase Storage for persistence

**Key architectural decisions:**
- Store wish data as a self-contained JSONB blob in `wishes.config`, not as separate relational tables -- enables simple ISR caching and avoids N+1 queries
- All wish data fetched server-side on initial page load, passed to client; stage transitions are purely client-side with zero network calls
- Templates define WHAT stages are enabled and WHAT content goes in each stage; animation HOW lives in React components, not in JSON configs
- Auth middleware excludes `/w/[slug]` entirely -- recipients never need to sign in
- Published wishes served via ISR (Incremental Static Regeneration) from Vercel's CDN

### Critical Pitfalls

1. **Animation Performance Collapse on Mobile** -- The most dangerous pitfall. Developers build on desktop where Motion runs at 60fps; on mobile, animating layout properties causes reflow thrashing. Prevention: animate ONLY transform and opacity, limit concurrent animations to 3-4 per view, use LazyMotion with domAnimation, test on real low-end Android devices, support `prefers-reduced-motion`.

2. **Sharing Link Breaks -- The Death of a Gift** -- A recipient clicking the shared link and seeing a blank screen or 404 destroys the surprise. Prevention: use ISR for all published wishes (served from CDN, not serverless functions), use clean `/w/abc123` URLs, generate preview vs. publish URLs with clear visual distinction, test link on 3+ devices before sharing.

3. **Template System Becomes Configuration Soup** -- The JSON-as-config approach drifts into unmanageable complexity. Prevention: define strict Zod schema BEFORE building templates, limit template configs to 200 lines, use fixed animation slots with limited parameterization, never allow arbitrary CSS/animation values in configs, add CI validation.

4. **The Over-Customization Trap** -- Creators drown in 12+ configuration steps and abandon. Prevention: Quick Create with presets (under 5 minutes), Customize limited to 5-7 steps with curated presets per step, default everything to "just works," progressive disclosure.

5. **Freemium Gating Kills the Viral Loop** -- Paywall after 20 minutes of creation feels like betrayal. Prevention: gate by QUANTITY (1 free wish with full features, paid for unlimited), show paywall BEFORE creation, free wish must be fully functional with no degraded recipient experience.

## Implications for Roadmap

Based on combined research, suggested phase structure:

### Phase 1: Foundation and Core Infrastructure
**Rationale:** Every subsequent phase depends on this. The Prisma schema, Supabase setup, auth middleware, and template schema contract must exist before anything else. Critically, this phase must also establish animation performance constraints and ISR strategy from day one -- retrofitting these is expensive and error-prone.
**Delivers:** Working Next.js app with Supabase auth, Prisma schema deployed, storage buckets configured with correct RLS policies and file size limits, template Zod schema defined, ISR configured for published wishes, basic project structure matching the architecture research.
**Addresses:** Prisma schema, Supabase client setup, auth middleware, template schema contract, storage bucket configuration, ISR strategy, animation performance budget, `prefers-reduced-motion` support.
**Avoids:** Storage cost explosion (set bucket limits day one), Vercel limits hit (ISR from day one), template schema drift (strict Zod before templates exist), animation performance collapse (constraints established early).

### Phase 2: Recipient Experience (The Core Product)
**Rationale:** The recipient experience IS the product. Building it early validates the hardest technical challenges (animation orchestration, stage machine, mobile performance) before investing in the creator flow. It also forces the template system to work end-to-end.
**Delivers:** A viewable, interactive wish experience at `/w/[slug]` with envelope opening, gift box reveal, cake interaction, main content (letter + photos), and closing. Stage machine driving transitions. Motion-powered animations. Mobile-first responsive design. ISR-served static pages.
**Addresses:** Interactive opening stage, gift box reveal animation, cake with candle interaction, multi-stage experience flow, mobile-responsive experience, unique shareable link, preview mode, prefers-reduced-motion support.
**Avoids:** Preview mismatch (build mobile-first), forced emotional UX (strict timing budgets: content reachable within 15 seconds, no auto-play audio), sharing link breaks (ISR from day one).

### Phase 3: Creator Dashboard and Creation Flow
**Rationale:** With the recipient experience working, the creator flow can be built to produce valid wish data. The template system is already validated by Phase 2. This phase focuses on the creator UX -- the hardest design challenge per the pitfalls research.
**Delivers:** Creator dashboard with wish listing, Quick Create flow (under 5 minutes, preset-driven), Customize flow (max 5-7 steps), template selection (3-5 birthday templates), letter/message editor, photo upload with client-side compression, live preview (defaulting to mobile viewport), publish with unique link, share dialog.
**Addresses:** Template selection, occasion theming, letter/message with personalization, photo gallery, preview as recipient, publish with unique link, share/copy link, Quick Create vs. Customize split, creator confidence (auto-save, progress indicators, live preview on every step).
**Avoids:** Creator overwhelm (strict step limits, preset-based choices), creator confusion (mirror recipient experience in creation flow, live preview, no technical language), file upload/storage explosion (client-side compression, photo limits).

### Phase 4: Freemium, Payments, and Polish
**Rationale:** Payments come after the core product works and the viral loop can be tested. Premature monetization risks killing growth. This phase also handles the remaining "delight" features and production hardening.
**Delivers:** Stripe integration, freemium gating (1 free wish, paid for unlimited), voice message playback, music selection, surprise lock with countdown, production monitoring, Vercel usage alerts, performance optimization.
**Addresses:** Voice message, music library, freemium gating, premium templates, production readiness.
**Avoids:** Freemium killing viral loop (paywall before creation, free wish fully featured), Vercel limits hit (monitoring, ISR, external image CDN).

### Phase Ordering Rationale

- **Foundation first** because every component depends on the schema, auth, and storage setup. Animation constraints and ISR strategy must be established day one -- retrofitting is 3-5x more expensive.
- **Recipient experience before creator dashboard** because the recipient experience IS the product. It validates the hardest technical challenges (animation, mobile performance, stage machine) before investing in the creation flow. The creator dashboard is complex but uses standard patterns (CRUD, forms, file upload).
- **Creator dashboard before payments** because the viral loop (recipient -> creator) must be testable before monetization. Payments are a layer on top, not a prerequisite.
- **Payments last** because premature monetization kills growth. The product must prove its value before asking for money.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** Animation orchestration specifics -- Motion API for complex multi-stage transitions, LazyMotion configuration, performance profiling strategy for mobile devices. The animation performance pitfall requires careful planning.
- **Phase 3:** Creator UX design patterns -- step wizard architecture, live preview implementation strategy, client-side image compression library selection (browser Canvas API vs. lightweight library), auto-save debounce strategy.
- **Phase 4:** Stripe integration specifics -- Checkout session flow, webhook handling, subscription lifecycle management, freemium gate implementation patterns.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Foundation setup -- Prisma schema, Supabase client, auth middleware, and Next.js project structure are all well-documented with clear patterns. The architecture research provides sufficient detail.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against npm registry. Architecture patterns verified via Context7 official docs. Clear rationale for every technology choice. |
| Features | MEDIUM | Competitive landscape analysis based on training data (web search did not return live results). Feature prioritization is well-reasoned but should be validated with real user interviews. Anti-features list is strong. |
| Architecture | HIGH | Component responsibilities, data flows, and database schema are thoroughly designed. Patterns (JSON template renderer, stage machine, freemium gating) are well-established. Project structure is detailed and rationale is clear. |
| Pitfalls | MEDIUM | Analysis based on Context7 docs (MEDIUM) and training-based analysis (MEDIUM). Pitfalls are domain-specific and well-identified, but severity estimates need real-world validation. |

**Overall confidence:** HIGH

### Gaps to Address

- **Competitor feature verification:** Web search did not return live results for competitor analysis. The feature comparison matrix should be validated against current competitor offerings before launch. Recommend periodic competitor audit.
- **User validation of feature priorities:** The MVP feature list (16 features across 2 phases) is well-reasoned but based on domain analysis, not user interviews. Recommend 5-10 user interviews before finalizing Phase 2 feature scope.
- **Animation performance baselines:** No actual performance benchmarks exist yet. Phase 2 planning should include specific performance targets (Lighthouse mobile >80, no frame drops on $100 Android) and profiling tools.
- **Supabase Storage cost modeling:** The free tier limits are known (~2GB bandwidth/month, ~50MB file size), but actual usage patterns with real users are unknown. Monitor closely after launch.
- **Stripe integration complexity:** The architecture research covers the pattern but not the implementation details. Phase 4 planning should research Stripe Checkout session flow, webhook signature verification, and subscription lifecycle handling.

## Sources

### Primary (HIGH confidence)
- npm registry (verified 2026-08-25): next@16.3.2, react@19.2.8, motion@13.1.1, prisma@7.9.1, supabase@2.115.0, zod@4.4.3, tailwindcss@4.3.3, shadcn@4.19.0
- Context7 `/vercel/next.js` (MEDIUM confidence): App Router docs, Server Actions, Form component, ISR configuration
- Context7 `/grx7/framer-motion` (MEDIUM confidence): AnimatePresence, variants, useAnimate, useMotionValue APIs
- Context7 `/supabase/supabase` (MEDIUM confidence): SSR integration, auth middleware, storage buckets, RLS policies
- Context7 `/prisma/prisma` (MEDIUM confidence): Prisma 7 schema config, driver adapter pattern, singleton export

### Secondary (MEDIUM confidence)
- Next.js App Router documentation -- route groups, layouts, server components, server actions
- Supabase Next.js auth examples -- middleware pattern, cookie handling, server client creation
- JSON-driven rendering patterns -- component registry, recursive renderer, dynamic imports
- State machine patterns for animation sequencing -- useReducer-based stage management
- Stripe + Next.js integration patterns -- Checkout sessions, webhooks, server-side gating

### Tertiary (LOW confidence)
- Competitor product analysis -- based on training data, not live verification. Features may have changed.
- Mobile animation performance thresholds -- based on general web performance knowledge, not measured benchmarks for this specific stack
- Freemium conversion rate expectations -- industry averages from training data, not validated for this product category

---
*Research completed: 2026-08-25*
*Ready for roadmap: yes*
