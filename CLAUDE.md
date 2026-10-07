# CLAUDE.md - Project Rules for Wishire

## Project Overview

Wishire is a Next.js 16 app for creating personalized, interactive surprise websites for birthdays and special occasions. Users build animated "wish" experiences and share them via unique links.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn (with base-ui/react render prop pattern)
- **Database:** Prisma 6 + PostgreSQL
- **Auth/Storage:** Supabase (SSR)
- **Forms:** React Hook Form + Zod 4 validation
- **Animations:** Motion (framer-motion successor)
- **Icons:** lucide-react

## Code Style Rules

### TypeScript

- Use `const` over `let`. Never use `var`.
- Prefer named exports over default exports (except Next.js page/layout/route files which require `export default`).
- Use arrow functions for utility functions and callbacks.
- Use early returns to reduce nesting.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- No unused variables or imports — remove them immediately.
- Use the `@/` path alias for imports from `src/` (e.g., `import { cn } from "@/lib/utils"`).

### React / Next.js

- Use functional components only — no class components.
- Use `"use client"` directive only when the component needs browser APIs, event handlers, or React hooks. Keep server components as the default.
- Place client components in the same directory as their related page, or in `src/components/` if shared.
- Use the App Router convention: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`.
- Server Components are the default — only add `"use client"` when necessary.

### Styling

- Use Tailwind CSS utility classes. Avoid custom CSS files.
- Use the `cn()` utility from `@/lib/utils` for conditional class merging.
- Follow the existing design system: pink primary color, dark mode support via `dark:` prefix.
- Use shadcn component variants via `class-variance-authority` (CVA).

### Responsive Design — Small Laptops (MANDATORY)

Every new page and every modified page **must** be responsive for small 13-inch laptops. Do not wait to be asked — assume this requirement on every UI change.

**Reference target: Dell Latitude 7320 (13.3" FHD 1920×1080).**

| Constraint | Value |
|---|---|
| Screen | 1920 × 1080 |
| Browser chrome (tabs + URL bar + bookmarks + UI) | ~80–120 px |
| **Real viewport to design for** | **≈ 1920 × 930–950** |
| Minimum supported | 1366 × 768 (older 13"/small Windows laptops) |

**Never assume full 1080 px height.** Vertical space is the scarce resource on small laptops — treat ~900 px as the design height, not 1080.

**Checklist for every page:**

1. **Viewport-height-aware layout** — full-screen stages must fit in `h-[100dvh]` / `min-h-0` space, not hard-coded `h-screen` against a design that assumed 1080. Use `dvh` where scrollbars would otherwise break the fold.
2. **No fixed pixel heights for large blocks** — prefer `min-h`, `max-h`, aspect-ratio, and flexible gaps over hard-coded `h-[700px]`.
3. **Test at 1366×768 and 1920×900** — not just 1920×1080 and mobile. Breakpoints and overflow must be verified at these laptop sizes.
4. **Long text / long names** — truncate with `line-clamp` or ellipsis; never let content push layout past the viewport.
5. **Fixed/sticky nav must not collide** — fixed headers, footers, and action bars need `top`/`bottom` offsets that respect `dvh` and safe areas.
6. **Scroll containers over page scroll for long content** — when a section exceeds the small-laptop viewport, make the section scroll (`overflow-y-auto` with `min-h-0` flex child), not the whole page, when that is the existing pattern.
7. **Fonts and spacing scale down** — avoid viewport-fixed large display type that overflows at 1366 width; clamp with `clamp()` or responsive `text-*` sizes.
8. **Verify dark mode too** — contrast and fixed overlays must work in both themes at small sizes.

**Definition of done:** page renders without horizontal scroll, without clipped content, and without vertical overflow at 1366×768 and 1920×900.

### Forms & Validation

- Use React Hook Form for form state management.
- Use Zod schemas for validation. Define schemas in `src/lib/validators.ts` or co-located with the feature.
- Use `@hookform/resolvers` to connect Zod to React Hook Form.

### Database

- Define all models in `src/../prisma/schema.prisma`.
- **Always run `npx prisma migrate dev` after schema changes** — never skip migrations.
- Use Prisma Client from `@/lib/prisma` (singleton pattern).
- Name migrations descriptively (e.g., `add_wish_table`, `add_user_avatar`).

## File Structure Convention

Match the existing project structure:

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Route group for auth pages
│   ├── (dashboard)/        # Route group for dashboard
│   ├── api/                # API routes
│   └── w/[slug]/           # Public wish pages
├── components/
│   └── ui/                 # shadcn UI components
├── config/                 # App configuration constants
├── lib/                    # Utilities, Prisma, Supabase clients
│   ├── prisma.ts
│   ├── supabase/
│   └── utils.ts
├── templates/              # Wish template definitions
└── types/                  # Shared TypeScript types
```

- Feature-specific code goes in the route group or page directory.
- Shared components go in `src/components/`.
- Shared utilities and clients go in `src/lib/`.
- Configuration constants go in `src/config/`.

## Git Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`, `perf`

**Examples:**
- `feat(wish): add confetti animation on reveal`
- `fix(auth): handle expired session redirect`
- `chore: update Prisma to 6.19.3`
- `docs: add API route documentation`

## Linting & Formatting

- **Ask permission before running** `npm run lint` or `npx prettier --write`.
- Fix all lint errors before committing.
- Use ESLint with the project's config (`eslint.config.mjs`).
- Use Prettier for formatting.

## Testing

- **Create or update tests when modifying or adding features.**
- Place test files next to the source file (e.g., `utils.test.ts` next to `utils.ts`) or in a `__tests__/` directory.
- Test component rendering, user interactions, and edge cases.
- Use descriptive test names that explain the expected behavior.

## Imports Order

1. React / Next.js imports
2. Third-party libraries (motion, lucide-react, etc.)
3. Internal components (`@/components/`)
4. Internal utilities (`@/lib/`, `@/config/`, `@/types/`)
5. Types (type-only imports with `import type`)

## Code Explanation Policy

Every time you write or modify code, explain it step by step BEFORE showing the code. The explanation must:

1. **Start with the "why"** — what problem this code solves or what it's for
2. **Walk through the logic** — explain each block/section of the code and why it's written that way
3. **Call out key decisions** — why you chose this pattern, library, or approach over alternatives
4. **Keep it conversational** — write like you're teaching a colleague, not writing docs

Do NOT just dump code. Explain first, then show code.

## Key Conventions

- **Responsive design:** every new/modified page must work on small 13-inch laptops (Dell Latitude 7320, ~1920×930 viewport; floor 1366×768) — see **Responsive Design — Small Laptops** under Styling. Never assume full 1080px height.
- **Singleton pattern** for Prisma Client (`src/lib/prisma.ts`) — never instantiate directly.
- **Supabase clients:** use `src/lib/supabase/server.ts` for server, `src/lib/supabase/client.ts` for browser.
- **Public wish pages** are at `/w/[slug]` — keep this route lightweight and performant.
- **Dark mode:** always support both light and dark themes using Tailwind's `dark:` variant.
- **Accessibility:** use semantic HTML, proper ARIA labels, and keyboard navigation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
