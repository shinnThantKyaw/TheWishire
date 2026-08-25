# Architecture Research

**Domain:** Interactive surprise/gift website platform
**Researched:** 2026-08-25
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
+-------------------------------------------------------------------+
|                         PRESENTATION LAYER                         |
+-------------------------------------------------------------------+
|  +-------------------+    +--------------------+                   |
|  | Creator Dashboard |    |  Recipient Experience|                  |
|  | /dashboard/*      |    | /w/[slug]           |                  |
|  | (Next.js Pages)   |    | (Full-screen Client) |                  |
|  +--------+----------+    +---------+----------+                   |
|           |                         |                              |
|           | Server Actions          | Client-side render            |
|           | + Route Handlers        | + Framer Motion               |
+-----------+-------------------------+------------------------------+
|                       APPLICATION LAYER                            |
+-------------------------------------------------------------------+
|  +------------------+  +------------------+  +------------------+  |
|  | Template Engine  |  | Wish State Mgr   |  | Media Pipeline   |  |
|  | (JSON -> React)  |  | (Stage Machine)  |  | (Upload/Optimize)|  |
|  +------------------+  +------------------+  +------------------+  |
|  +------------------+  +------------------+  +------------------+  |
|  | Payment Gateway  |  | Link Shortener   |  | Auth Service     |  |
|  | (Stripe)         |  | (slug lookup)    |  | (Supabase Auth)  |  |
|  +------------------+  +------------------+  +------------------+  |
+-------------------------------------------------------------------+
|                        DATA LAYER                                  |
+-------------------------------------------------------------------+
|  +------------------+  +------------------+  +------------------+  |
|  | PostgreSQL       |  | Supabase Storage |  | Redis/Edge Cache |  |
|  | (Prisma ORM)     |  | (Media files)    |  | (Page speed)     |  |
|  +------------------+  +------------------+  +------------------+  |
+-------------------------------------------------------------------+
|                      EXTERNAL SERVICES                             |
+-------------------------------------------------------------------+
|  +------------------+  +------------------+                        |
|  | Stripe           |  | Vercel           |                        |
|  | (Payments)       |  | (Hosting/Edge)   |                        |
|  +------------------+  +------------------+                        |
+-------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| **Creator Dashboard** | Wish creation flow, template selection, content editing, preview, publish | Next.js App Router pages under `/dashboard`, React Hook Form + Zod for forms |
| **Recipient Experience** | Full-screen animated wish viewing, stage transitions, interactivity | Client component at `/w/[slug]`, Framer Motion orchestration, no auth required |
| **Template Engine** | Map JSON template configs to React component trees with animation variants | Component registry pattern, recursive renderer, variant generators |
| **Wish State Manager** | Track recipient progress through experience stages, persist state | React context + useReducer on client, no server state needed during viewing |
| **Media Pipeline** | Upload, validate, optimize, store photos/videos/voice | Server Actions for upload, Supabase Storage for persistence, client-side preview |
| **Payment Gateway** | Handle freemium gating, checkout sessions, webhook processing | Stripe Checkout + Webhooks, server-side subscription verification |
| **Link Service** | Generate and resolve unique shareable slugs | Short UUID slugs, server lookup by slug to fetch wish data |
| **Auth Service** | Creator authentication, session management | Supabase Auth, Next.js middleware for protected routes |

## Recommended Project Structure

```
src/
+-- app/                          # Next.js App Router
|   +-- layout.tsx                # Root layout (fonts, providers)
|   +-- page.tsx                  # Landing/marketing page
|   +-- (auth)/                   # Route group: auth pages
|   |   +-- login/page.tsx
|   |   +-- signup/page.tsx
|   |   +-- auth/callback/route.ts
|   +-- (dashboard)/              # Route group: creator dashboard
|   |   +-- layout.tsx            # Dashboard shell (sidebar, nav)
|   |   +-- dashboard/
|   |   |   +-- page.tsx          # Dashboard home (wish list)
|   |   |   +-- create/
|   |   |   |   +-- page.tsx      # Quick Create flow
|   |   |   |   +-- [wishId]/
|   |   |   |       +-- page.tsx  # Customize flow
|   |   |   +-- preview/
|   |   |       +-- [wishId]/page.tsx
|   |   +-- pricing/page.tsx
|   |   +-- settings/page.tsx
|   +-- w/                        # Public: recipient experience
|   |   +-- [slug]/page.tsx       # Dynamic wish viewer
|   +-- api/                      # Route Handlers
|       +-- webhooks/stripe/route.ts
|       +-- upload/route.ts
|       +-- wishes/route.ts
+-- components/
|   +-- ui/                       # Shared UI primitives (shadcn/ui)
|   |   +-- button.tsx
|   |   +-- card.tsx
|   |   +-- dialog.tsx
|   |   +-- ...
|   +-- dashboard/                # Creator dashboard components
|   |   +-- wish-card.tsx
|   |   +-- template-picker.tsx
|   |   +-- content-editor.tsx
|   |   +-- media-uploader.tsx
|   |   +-- stage-configurator.tsx
|   +-- experience/               # Recipient experience components
|   |   +-- wish-experience.tsx   # Main orchestrator
|   |   +-- stages/               # Individual stage components
|   |   |   +-- envelope.tsx
|   |   |   +-- gift-box.tsx
|   |   |   +-- cake.tsx
|   |   |   +-- ribbon-reveal.tsx
|   |   |   +-- main-content.tsx
|   |   |   +-- letter.tsx
|   |   |   +-- photo-gallery.tsx
|   |   |   +-- video-player.tsx
|   |   |   +-- voice-message.tsx
|   |   |   +-- music-player.tsx
|   |   |   +-- poem-display.tsx
|   |   |   +-- memory-timeline.tsx
|   |   |   +-- gift-challenge.tsx
|   |   |   +-- spin-wheel.tsx
|   |   |   +-- closing.tsx
|   |   +-- animations/           # Framer Motion variant definitions
|   |       +-- stage-transitions.ts
|   |       +-- reveal-animations.ts
|   |       +-- particle-effects.ts
|   +-- payments/                 # Payment UI
|       +-- pricing-card.tsx
|       +-- upgrade-prompt.tsx
+-- lib/
|   +-- supabase/                 # Supabase client setup
|   |   +-- client.ts             # Browser client
|   |   +-- server.ts             # Server client
|   |   +-- middleware.ts         # Auth middleware helper
|   +-- prisma.ts                 # Prisma client singleton
|   +-- stripe.ts                 # Stripe client setup
|   +-- auth.ts                   # Auth helper (session verification)
|   +-- utils.ts                  # cn(), slug generation, etc.
|   +-- validators.ts             # Zod schemas for wish data
+-- templates/                    # Template system
|   +-- registry.ts               # Template registry (maps IDs to configs)
|   +-- renderer.tsx              # JSON-to-React renderer
|   +-- variants.ts               # Animation variant generators
|   +-- birthday/                 # Birthday template configs
|   |   +-- classic.json
|   |   +-- playful.json
|   |   +-- elegant.json
|   +-- types.ts                  # Template type definitions
+-- actions/                      # Server Actions
|   +-- wish-actions.ts           # Create, update, publish wishes
|   +-- upload-actions.ts         # Media upload handling
|   +-- payment-actions.ts        # Checkout session creation
|   +-- auth-actions.ts           # Sign in, sign up, sign out
+-- hooks/                        # Custom React hooks
|   +-- use-wish-state.ts         # Stage machine state
|   +-- use-media-upload.ts       # Upload progress tracking
|   +-- use-animation-stage.ts    # Current animation phase
+-- types/                        # Shared TypeScript types
|   +-- wish.ts                   # Wish, WishConfig, WishMedia
|   +-- template.ts               # TemplateConfig, StageConfig
|   +-- payment.ts                # Subscription, Plan types
+-- config/                       # App configuration
|   +-- plans.ts                  # Pricing tiers and feature gates
|   +-- occasions.ts              # Occasion metadata and defaults
|   +-- templates.ts              # Available templates metadata
```

### Structure Rationale

- **`(auth)/` and `(dashboard)/` route groups:** Separates auth flows from dashboard flows with different layouts. The `(dashboard)` group has a shell layout with sidebar navigation; `(auth)` has a centered card layout. Neither affects the URL.
- **`/w/[slug]/`:** The public recipient experience lives at its own top-level route. This keeps it completely separate from the dashboard -- different layout (no nav, no auth), different rendering strategy (heavy client-side), different optimization (no ISR needed, always fresh data).
- **`templates/`:** Templates are first-class citizens, not buried in `components/`. They are data (JSON configs) plus logic (renderer, variants). This separation makes adding new templates as simple as adding a JSON file.
- **`experience/stages/`:** Each stage is its own component. The orchestrator composes them based on the template config. This maps directly to the user flow in PROJECT.md.
- **`actions/`:** Server Actions are extracted into dedicated files rather than inlined in components. This keeps components focused on rendering and makes server logic testable.
- **`lib/supabase/`:** Separate client and server Supabase instances. The server client uses `@supabase/ssr` with cookie-based auth. The browser client uses the standard `@supabase/supabase-js` client.

## Architectural Patterns

### Pattern 1: JSON Template Renderer (Component Registry)

**What:** A recursive renderer that maps JSON config nodes to React components via a registry. Templates define the structure, content, and animation parameters as data. The renderer interprets this data into a live React component tree.

**When to use:** When you need multiple visual "experiences" that share the same rendering infrastructure but differ in structure, styling, and animation. Perfect for a template-driven product where new templates should be addable without code changes.

**Trade-offs:**
- (+) New templates are JSON files, not new React components
- (+) Consistent rendering pipeline, easier to maintain
- (+) Templates can be stored in the database and loaded dynamically
- (-) Less type safety than direct JSX (mitigated by Zod validation)
- (-) Complex animations still need React components; JSON only configures them

**Example:**
```typescript
// templates/types.ts
interface TemplateConfig {
  id: string;
  name: string;
  occasion: 'birthday' | 'anniversary' | 'valentine';
  stages: StageConfig[];
  theme: ThemeConfig;
}

interface StageConfig {
  type: 'envelope' | 'gift-box' | 'cake' | 'ribbon' | 'main-content' | 'closing';
  enabled: boolean;
  props: Record<string, unknown>;
  animation?: AnimationConfig;
}

// templates/registry.ts
const templateRegistry: Record<string, TemplateConfig> = {};

export function registerTemplate(config: TemplateConfig) {
  templateRegistry[config.id] = config;
}

export function getTemplate(id: string): TemplateConfig | undefined {
  return templateRegistry[id];
}

// templates/renderer.tsx
const stageComponents = {
  'envelope': EnvelopeStage,
  'gift-box': GiftBoxStage,
  'cake': CakeStage,
  'ribbon': RibbonRevealStage,
  'main-content': MainContentStage,
  'closing': ClosingStage,
};

export function TemplateRenderer({ config, wishData }: Props) {
  return (
    <AnimatePresence mode="wait">
      {config.stages
        .filter(stage => stage.enabled)
        .map((stage, index) => {
          const StageComponent = stageComponents[stage.type];
          return (
            <StageComponent
              key={stage.type}
              config={stage}
              data={wishData}
              animation={stage.animation}
              onNext={() => goToNextStage(index)}
            />
          );
        })}
    </AnimatePresence>
  );
}
```

### Pattern 2: Stage Machine (Experience State)

**What:** A finite state machine that tracks the recipient's progress through the experience. Each stage has entry conditions, an active state, and exit conditions. The machine drives which stage component is rendered and triggers transitions.

**When to use:** When an experience has a fixed sequence of discrete phases, each with its own visual and interactive behavior. Essential for the "unwrap" feeling -- the recipient progresses through stages, never goes backward (unless they replay).

**Trade-offs:**
- (+) Clear, predictable state transitions
- (+) Easy to add/remove stages by editing the config
- (+) State is deterministic -- no race conditions
- (-) Strict sequencing might feel rigid for simple wishes
- (-) Need to handle "skip" logic for optional stages

**Example:**
```typescript
// hooks/use-wish-state.ts
type Stage = 
  | 'sealed'        // Initial: link opened, envelope visible
  | 'opening'       // User interacted to open
  | 'gift-box'      // Gift box reveal
  | 'cake'          // Candle interaction
  | 'ribbon'        // Secondary reveal
  | 'main-content'  // Photos, letter, memories
  | 'voice-video'   // Multimedia section
  | 'challenge'     // Gift unlock challenge
  | 'bonus-gifts'   // Spin wheel / lottery
  | 'closing';      // Final message

interface WishState {
  currentStage: Stage;
  stageIndex: number;
  completedStages: Stage[];
  wishData: WishData;
  templateConfig: TemplateConfig;
}

function wishReducer(state: WishState, action: WishAction): WishState {
  switch (action.type) {
    case 'ADVANCE': {
      const enabledStages = state.templateConfig.stages.filter(s => s.enabled);
      const nextIndex = state.stageIndex + 1;
      if (nextIndex >= enabledStages.length) {
        return { ...state, currentStage: 'closing', stageIndex: nextIndex };
      }
      return {
        ...state,
        currentStage: enabledStages[nextIndex].type,
        stageIndex: nextIndex,
        completedStages: [...state.completedStages, state.currentStage],
      };
    }
    case 'SET_STAGE':
      return { ...state, currentStage: action.stage };
    default:
      return state;
  }
}
```

### Pattern 3: Freemium Feature Gating

**What:** Server-side subscription verification that determines which features a creator can use. Free users can create and preview wishes. Paid users can publish and access premium features. Gating happens in Server Actions, not in the client.

**When to use:** When you need to restrict access to features based on subscription tier. The key principle: never trust the client. Verify on the server.

**Trade-offs:**
- (+) Secure -- cannot be bypassed by manipulating client state
- (+) Clear separation of business logic from UI
- (+) Easy to add new premium features by adding gate checks
- (-) Extra database lookup per gated action (mitigated by caching)
- (-) Need to handle subscription expiry gracefully

**Example:**
```typescript
// lib/gate.ts
import { Stripe } from 'stripe';
import { prisma } from './prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function getSubscriptionTier(userId: string): Promise<'free' | 'pro'> {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
  });
  return subscription ? 'pro' : 'free';
}

export async function canPublishWish(userId: string): Promise<boolean> {
  const tier = await getSubscriptionTier(userId);
  return tier === 'pro';
}

// actions/wish-actions.ts
'use server'

export async function publishWish(wishId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const allowed = await canPublishWish(session.user.id);
  if (!allowed) {
    throw new Error('Publishing requires a Pro subscription');
  }

  // Generate slug, mark as published, etc.
  const slug = generateUniqueSlug();
  await prisma.wish.update({
    where: { id: wishId },
    data: { published: true, slug, publishedAt: new Date() },
  });

  return { slug };
}
```

### Pattern 4: Supabase Auth + Next.js Middleware

**What:** Middleware-based authentication that creates a Supabase server client on every request, verifies the session, and redirects unauthenticated users away from protected routes. Public routes (the recipient experience) bypass auth entirely.

**When to use:** When you need session-based auth with Supabase in Next.js App Router. The middleware runs on every matched request and handles cookie-based session refresh automatically.

**Trade-offs:**
- (+) Transparent session management -- no manual refresh logic
- (+) Protected routes enforced at the edge, before any page renders
- (+) Public recipient routes have zero auth overhead
- (-) Middleware runs on every matched request (mitigated by matcher config)
- (-) Must return supabaseResponse as-is to avoid cookie sync issues

**Example:**
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard and auth-required routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Recipient experience (/w/*) is ALWAYS public -- no auth check
  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/settings/:path*'],
};
```

## Data Flow

### Request Flow: Recipient Opens a Wish

```
Recipient clicks link: wishire.vercel.app/w/abc123
    |
    v
Next.js Route: /w/[slug]/page.tsx (Server Component)
    |
    +--> Query: SELECT * FROM wishes WHERE slug = 'abc123' AND published = true
    |    (Prisma, server-side, no auth needed)
    |
    +--> Fetch template config from DB or templates/ registry
    |
    +--> Fetch media URLs from Supabase Storage (public bucket)
    |
    v
Server renders: <WishExperience config={config} wishData={wishData} />
    |
    v
Client hydration: React + Framer Motion takes over
    |
    v
Stage Machine initializes: currentStage = 'sealed'
    |
    v
Envelope component renders (full-screen, animated)
    |
    v
User interaction (tap, swipe, click) triggers ADVANCE action
    |
    v
AnimatePresence transitions: old stage exits -> new stage enters
    |
    v
[...stages progress until 'closing']
```

### Request Flow: Creator Publishes a Wish

```
Creator clicks "Publish" in dashboard
    |
    v
Client calls Server Action: publishWish(wishId)
    |
    v
Server Action: verify auth (Supabase session)
    |
    v
Server Action: check subscription tier (Prisma query)
    |
    +--> Free tier? Return upgrade prompt
    |
    +--> Pro tier? Continue:
    |
    v
Generate unique slug (nanoid or cuid)
    |
    v
Update wish record: published = true, slug, publishedAt
    |
    v
Revalidate dashboard path
    |
    v
Return { slug } to client
    |
    v
Client shows share dialog with link: wishire.vercel.app/w/{slug}
```

### Request Flow: Creator Uploads Media

```
Creator drags photo into uploader
    |
    v
Client-side validation (Zod schema: file type, max size)
    |
    v
Client calls Server Action: uploadMedia(wishId, file)
    |
    v
Server Action: verify auth + ownership of wish
    |
    v
Upload to Supabase Storage: wishes/{wishId}/{filename}
    |
    v
Storage policy: creator can write to their own folder
    |
    v
Return public URL to client
    |
    v
Client updates wish state with new media URL
```

### Key Data Flows

1. **Template Resolution:** Template configs are stored as JSON in the `templates` table. On wish creation, the selected template ID is saved to the wish record. When rendering, the template config is fetched and passed to the renderer. For built-in templates, configs can also be imported from the `templates/` directory at build time.

2. **Stage Progression:** The recipient experience is entirely client-side after initial page load. The stage machine is a React reducer. No server calls during stage transitions. This is critical for the "unwrap" feeling -- transitions must be instant and smooth, not blocked by network requests.

3. **Media Serving:** Media files live in Supabase Storage with public read access (public bucket). When a wish is published, media URLs are stored in the wish record as an array. The recipient experience page fetches these URLs server-side and passes them to client components. Images use Next.js `Image` for optimization; videos use native HTML5 playback.

4. **Payment State:** Stripe checkout creates a session. On success, a webhook fires to `/api/webhooks/stripe`. The webhook updates the subscription record in PostgreSQL. The dashboard checks subscription status on each Server Action call. Client-side gating (showing/hiding premium UI) is supplementary -- the real gate is server-side.

## Recommended Database Schema

```sql
-- Core tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  occasion TEXT NOT NULL DEFAULT 'birthday',
  template_id TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',       -- Full wish configuration
  published BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE wish_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID REFERENCES wishes(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                        -- 'photo', 'video', 'voice'
  url TEXT NOT NULL,
  filename TEXT,
  size_bytes INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  plan TEXT NOT NULL DEFAULT 'pro',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY,                       -- e.g., 'birthday-classic'
  name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  config JSONB NOT NULL,                     -- Full template configuration
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_wishes_user_id ON wishes(user_id);
CREATE INDEX idx_wishes_slug ON wishes(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_wishes_published ON wishes(published, published_at);
CREATE INDEX idx_wish_media_wish_id ON wish_media(wish_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

### Schema Rationale

- **`wishes.config` as JSONB:** The wish configuration is a flexible JSON document. It stores the stage setup, content (letter text, poem selection, etc.), and interaction settings. This avoids creating dozens of tables for every possible feature combination. The Zod schemas in `lib/validators.ts` validate this JSON at the application layer.
- **`templates.config` as JSONB:** Same flexibility for template definitions. New templates are added by inserting rows, not by deploying new code.
- **`wish_media` separate from `wishes.config`:** Media references are stored as a separate table because they have their own lifecycle (upload, delete, reorder) and need to reference Supabase Storage paths. The `config` JSON stores the media *placement* (which stage, what position), while `wish_media` stores the *files*.
- **No `template_id` FK constraint:** Templates can be either database-stored (for future custom templates) or code-defined (the built-in ones). The `template_id` is a string reference, not a foreign key, to allow both sources.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Current architecture is fine. Vercel serverless, Supabase free tier. No optimization needed. |
| 1k-100k users | Add CDN caching for published wishes (Vercel Edge Config or ISR). Optimize Supabase Storage with image transformations. Monitor database query performance on `wishes.slug` index. |
| 100k+ users | Consider edge caching of wish data. Move template configs to Edge Config for sub-ms reads. Potentially separate the recipient experience into its own deployment for independent scaling. |

### Scaling Priorities

1. **First bottleneck:** Database reads for wish lookup on `/w/[slug]`. Fix: ISR with revalidation on publish, or edge-cached wish data.
2. **Second bottleneck:** Supabase Storage bandwidth for media-heavy wishes. Fix: Cloudflare R2 or similar CDN for media assets.

## Anti-Patterns

### Anti-Pattern 1: Client-Side Auth for Public Wishes

**What people do:** Requiring authentication to view a wish, or running auth checks in client components for the recipient experience.

**Why it's wrong:** Recipients should never need to sign up or log in. The "unwrap" feeling is destroyed by a login wall. Auth also adds latency to every page load.

**Do this instead:** The `/w/[slug]` route is always public. The middleware matcher excludes it from auth checks. Wish data is fetched server-side without auth. The only auth-gated routes are `/dashboard/*` and `/settings/*`.

### Anti-Pattern 2: Storing All Wish Data as Flat JSON

**What people do:** Putting everything (letter text, media URLs, stage config, theme settings) into a single JSONB column with no structure.

**Why it's wrong:** Makes it impossible to query, index, or validate specific fields. A single malformed config breaks the entire wish. No way to do partial updates efficiently.

**Do this instead:** Use a hybrid approach. Store structured data in columns (title, recipient_name, template_id, published, slug). Store the flexible stage configuration in a JSONB `config` column. Store media in a separate table. Validate the JSONB with Zod schemas at the application layer.

### Anti-Pattern 3: Animation Logic in Template Config

**What people do:** Putting actual animation code (Framer Motion props, transition configs) inside the JSON template config.

**Why it's wrong:** JSON cannot contain functions or React components. Animation configs in JSON become an untyped, untestable mess. You end up building a custom DSL for animations.

**Do this instead:** Templates define *what* stages are enabled and *what content* goes in each stage. Animation *how* lives in React components. The template config passes parameters (duration, delay, style) that components interpret. The component registry maps stage types to React components that know how to animate.

### Anti-Pattern 4: Server Calls During Stage Transitions

**What people do:** Making API calls when the recipient advances from one stage to the next.

**Why it's wrong:** Network latency destroys the "unwrap" feeling. A 200ms delay between stages feels broken. Stage transitions must be instant.

**Do this instead:** Fetch ALL wish data on initial page load (server-side). Pass it all to the client. The stage machine is purely client-side with no network calls. The only exception might be analytics pings (fire-and-forget, non-blocking).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Supabase Auth** | `@supabase/ssr` server client + middleware | Cookie-based sessions. Must return supabaseResponse as-is in middleware. |
| **Supabase Storage** | Public bucket for wish media | Public read, authenticated write. Use `createSignedUploadUrl` for direct uploads. |
| **Supabase PostgreSQL** | Prisma ORM | Connection pooling via Prisma. Use `datasource db` with `pgbouncer` for serverless. |
| **Stripe** | Checkout Sessions + Webhooks | Checkout for payment, webhooks for subscription lifecycle. Verify signatures on webhooks. |
| **Vercel** | Hosting + Edge | Serverless functions for API routes. Edge for middleware. ISR for static-ish pages. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Dashboard <-> Template Engine** | Props (config objects) | Dashboard passes template config and wish data to the renderer. No shared state. |
| **Template Engine <-> Experience** | Props (config + data) | Renderer maps config stages to components. Components receive data as props. |
| **Experience <-> Stage Machine** | React context + dispatch | Stages dispatch ADVANCE actions. Machine provides currentStage to determine what renders. |
| **Dashboard <-> Server Actions** | `'use server'` imports | Dashboard components call Server Actions directly. Actions handle auth + DB. |
| **Recipient Experience <-> Server** | Initial load only | Server renders page with all data. Client takes over. No further server calls during viewing. |

## Build Order Implications

Based on the architecture, the components should be built in this dependency order:

1. **Foundation (no dependencies):** Prisma schema, Supabase client setup, auth middleware, type definitions
2. **Template Engine (depends on Foundation):** JSON renderer, component registry, type definitions for templates
3. **Stage Components (depends on Template Engine):** Individual stage components with Framer Motion animations
4. **Wish Experience (depends on Stage Components):** The orchestrator that composes stages based on template config
5. **Creator Dashboard (depends on Foundation):** Wish CRUD, template selection, content editing
6. **Media Pipeline (depends on Foundation):** Upload handling, Supabase Storage integration
7. **Publishing Flow (depends on Dashboard + Media):** Slug generation, publish action, share dialog
8. **Payment System (depends on Foundation):** Stripe integration, subscription checks, feature gating

This order ensures that by the time you build the recipient experience, the template engine and stage components are ready. The dashboard can be built in parallel with stage components since they serve different users.

## Sources

- Next.js App Router documentation (Context7: `/vercel/next.js`) - route groups, layouts, server components, server actions
- Framer Motion documentation (Context7: `/grx7/framer-motion`) - AnimatePresence, variants, orchestration, stagger
- Supabase documentation (Context7: `/supabase/supabase`) - storage buckets, auth middleware, public URLs
- Supabase Next.js auth examples - middleware pattern, cookie handling, server client creation
- JSON-driven rendering patterns - component registry, recursive renderer, dynamic imports
- State machine patterns for animation sequencing - useReducer-based stage management
- Stripe + Next.js integration patterns - Checkout sessions, webhooks, server-side gating

---
*Architecture research for: Wishire interactive surprise/gift website*
*Researched: 2026-08-25*
