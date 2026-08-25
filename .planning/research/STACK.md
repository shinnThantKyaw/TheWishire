# Stack Research

**Domain:** Interactive surprise/gift websites
**Researched:** 2026-08-25
**Confidence:** HIGH (versions verified via npm registry; architecture patterns verified via Context7 official docs)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.3.2 | Full-stack React framework (App Router) | Server Components reduce client JS for gift preview pages. Server Actions simplify form submissions (wish creation). Built-in image optimization critical for photo-heavy experiences. Vercel deployment is seamless. The App Router is now the stable, recommended pattern. |
| React | 19.2.8 | UI library | Ships with Next.js 16. React 19 adds Server Components as stable, use() hook for promises, and improved Suspense for streaming. Required by Next.js 16. |
| TypeScript | 5.x | Type safety | Non-negotiable for a project with complex data models (wish configs, templates, user data). Catches template rendering bugs at compile time. |
| Tailwind CSS | 4.3.3 | Utility-first styling | Fast iteration on visual designs. Template system needs rapid color/spacing changes. Tailwind v4 uses CSS-first config. |
| Supabase | 2.115.0 (JS client) | Backend-as-a-Service | Single platform for PostgreSQL database, file storage (photos/videos), and auth. Row-Level Security ensures users only access their own wishes. Free tier is generous for MVP. Avoids managing separate services. |
| Prisma | 7.9.1 | ORM for PostgreSQL | Type-safe database queries. Migration management for schema evolution. Prisma Studio for data inspection during development. Prisma 7 requires `@prisma/adapter-pg` driver adapter. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Motion | 13.1.1 | Animation library (successor to framer-motion) | Core to the product. AnimatePresence for reveal sequences (gift box opening, cake interaction). Variants for orchestrated multi-element animations. Stagger for photo gallery reveals. Package name changed from `framer-motion` to `motion`. |
| shadcn/ui | 4.19.0 (CLI) | Accessible UI components | Form inputs, buttons, dialogs for the creation flow. Not for the recipient experience (that uses custom animated components). |
| Lucide React | 1.34.0 | Icons | Lightweight icon set for UI chrome (creation flow, navigation). |
| Zod | 4.4.3 | Schema validation | Validate wish configurations, form inputs, API payloads. Zod 4 is now stable with improved performance. Used with React Hook Form for type-safe form validation. |
| React Hook Form | 7.86.0 | Form state management | Wish creation forms (letter input, recipient name, settings). Minimal re-renders matter for smooth UX. |
| @hookform/resolvers | 5.9.1 | Zod integration for RHF | Connects Zod schemas to React Hook Form for automatic validation. |
| @supabase/ssr | 0.12.5 | Server-side Supabase auth | Next.js App Router integration for Supabase auth. Handles cookie-based sessions in Server Components and middleware. |
| Zustand | 5.0.15 | Client state management | Only if genuinely complex state emerges (e.g., multi-step creation wizard with undo). Start with React state/context; add Zustand when prop drilling becomes painful. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| @prisma/adapter-pg | Prisma 7 driver adapter | Required by Prisma 7 for PostgreSQL. Wraps the `pg` driver for PrismaClient. |
| ESLint + Prettier | Code quality | Standard setup. ESLint flat config with Next.js plugin. |
| Husky + lint-staged | Pre-commit hooks | Run lint/format on staged files. Prevents broken commits. |

## Installation

```bash
# Initialize Next.js project
npx create-next-app@latest wishire --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Core dependencies
npm install motion zod react-hook-form @hookform/resolvers zustand lucide-react

# Supabase
npm install supabase @supabase/ssr

# Prisma
npm install prisma @prisma/adapter-pg @prisma/client
npx prisma init

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input label dialog card

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom eslint eslint-config-next prettier
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 16 (App Router) | Next.js 15 (App Router) | If Next.js 16 has unstable edge cases at launch. 15.3.x is battle-tested. |
| Supabase + Prisma | Supabase alone (no ORM) | If you want maximum simplicity and don't need migration management. Supabase client is simpler but loses type-safe queries and schema versioning. |
| Supabase + Prisma | PlanetScale + Prisma | If you need MySQL or branching workflows. Overkill for this project. |
| Motion (framer-motion successor) | React Spring | If you need physics-based animations exclusively. Motion covers both declarative and physics-based. |
| Motion | GSAP | If you need timeline-level control for complex sequenced animations. GSAP is more powerful but heavier and less React-native. Consider for advanced cake/gift animations if Motion proves insufficient. |
| Tailwind CSS 4 | CSS Modules | If you strongly prefer scoped styles. Tailwind is faster for rapid visual iteration on templates. |
| shadcn/ui | Radix UI primitives | shadcn/ui is Radix with styling. Use raw Radix only if you need components shadcn/ui doesn't ship. |
| Vercel | Netlify | If you need cheaper hosting at scale. Vercel's Next.js integration is superior for this stack. |
| React Hook Form | Formik | RHF is lighter and faster. Formik is legacy at this point. |
| Zustand | Jotai/Recoil | If you need atomic state. Zustand is simpler for most cases. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` (as import) | Package renamed to `motion`. Using the old name still works but signals outdated knowledge. | `import { motion, AnimatePresence } from "motion"` |
| Next.js Pages Router | Pages Router is legacy. App Router is the standard with Server Components, Server Actions, and streaming. | Next.js App Router |
| Create React App | Deprecated. No SSR, no streaming, no Server Components. | Next.js |
| Express.js + React | Manual SSR setup is complex and unnecessary. Next.js handles this. | Next.js |
| MySQL / SQLite | Supabase runs on PostgreSQL. Using a different DB creates unnecessary friction. | PostgreSQL (via Supabase) |
| Firebase | Vendor lock-in, NoSQL data model doesn't fit structured wish data, more expensive at scale. | Supabase |
| Prisma 5 or 6 | Prisma 7 is current. Old versions lack driver adapters and edge runtime support. | Prisma 7.9.1 |
| Material UI / Chakra UI | Heavy component libraries with opinionated styling that conflicts with custom animated experiences. | shadcn/ui (unstyled primitives) + Tailwind |
| Redux | Overkill for this app's state needs. Adds boilerplate. | React state/context, Zustand if needed |

## Stack Patterns by Variant

**If building the creation flow (creator-side):**
- Use Next.js Server Components for the dashboard/listing pages (static, fast).
- Use Client Components only for interactive form steps.
- Server Actions for wish CRUD operations (create, update, publish).
- shadcn/ui components for all form elements.

**If building the recipient experience (unwrapping):**
- Entirely Client Components (animation-heavy, interactive).
- Motion's AnimatePresence for stage transitions (gift box -> cake -> main).
- Variants for orchestrated reveal sequences (staggered photo gallery, cascading confetti).
- No shadcn/ui here -- custom animated components for emotional impact.
- Consider dynamic imports (`next/dynamic`) to code-split heavy animation components.

**If handling file uploads (photos/videos):**
- Supabase Storage for file hosting.
- Client-side upload via Supabase JS client (direct to storage, no server roundtrip).
- Next.js Image component for optimized photo display.

**If template system needs runtime rendering:**
- Store templates as JSON configs in Supabase.
- Render templates dynamically via a single rendering engine.
- Each template config defines: colors, animations, layout, component order.

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| next@16.3.2 | react@19.2.8 | Required peer dependency. Next.js 16 requires React 19. |
| motion@13.1.1 | react@19.x | Motion 13.x supports React 19. |
| prisma@7.9.1 | @prisma/adapter-pg@7.9.1 | Versions must match exactly. |
| @supabase/ssr@0.12.5 | next@15.x / 16.x | Works with App Router. |
| zod@4.4.3 | @hookform/resolvers@5.9.1 | Zod 4 resolver is included in resolvers v5+. |
| tailwindcss@4.3.3 | next@16.x | Tailwind v4 uses PostCSS plugin or built-in Next.js support. |

## Key Architecture Decision: Prisma + Supabase

Using both Prisma and Supabase is intentional, not redundant:

- **Supabase** provides: PostgreSQL hosting, file storage, auth, row-level security, dashboard.
- **Prisma** provides: type-safe queries, schema migrations, Prisma Studio, generated types.

They layer cleanly: Prisma connects to the Supabase PostgreSQL database. Supabase handles auth and storage; Prisma handles data access and schema management.

**Alternative (simpler):** Skip Prisma, use Supabase client directly. You lose migration management and type-safe queries but reduce dependencies. Acceptable for MVP if speed is priority.

## Sources

- npm registry (verified 2026-08-25): next@16.3.2, motion@13.1.1, prisma@7.9.1, supabase@2.115.0, zod@4.4.3, tailwindcss@4.3.3
- Context7 `/vercel/next.js` (MEDIUM confidence): App Router docs, Server Actions, Form component
- Context7 `/grx7/framer-motion` (MEDIUM confidence): AnimatePresence, variants, useAnimate, useMotionValue APIs
- Context7 `/supabase/supabase` (MEDIUM confidence): SSR integration, auth middleware, server client patterns
- Context7 `/prisma/prisma` (MEDIUM confidence): Prisma 7 schema config, driver adapter pattern, singleton export
- Context7 `/colinhacks/zod` (MEDIUM confidence): Zod 4 API, React Hook Form integration, error formatting

---
*Stack research for: interactive surprise/gift websites*
*Researched: 2026-08-25*
