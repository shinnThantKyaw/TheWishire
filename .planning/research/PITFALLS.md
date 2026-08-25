# Pitfalls Research

**Domain:** Interactive animated surprise/gift websites
**Researched:** 2026-08-25
**Confidence:** MEDIUM (Context7 docs = MEDIUM; training-based analysis = MEDIUM; no live web search results obtained)

## Critical Pitfalls

### Pitfall 1: Animation Performance Collapse on Mobile

**What goes wrong:**
The recipient opens the surprise link on their phone and experiences janky, stuttering animations instead of a smooth, delightful reveal. The gift box animation drops frames, the confetti lags, the page scrolls in jerky jumps. The emotional moment is destroyed by technical failure. Mobile devices have weaker GPUs, less memory, and battery-saving throttling that desktops do not.

**Why it happens:**
Developers build and test primarily on desktop, where Framer Motion runs smoothly at 60fps. On mobile, animating layout-affecting properties (width, height, top, left) forces synchronous reflows on every frame. Framer Motion's `layout` prop triggers layout thrashing — it reads DOM geometry and writes transforms in the same frame. AnimatePresence for exit animations compounds the overhead. Multiple simultaneous animations (gift box opening + confetti + text reveal) can exceed mobile GPU capacity.

**How to avoid:**
- Animate ONLY `transform` and `opacity` — these are GPU-composited and never trigger reflow.
- Never animate `width`, `height`, `top`, `left`, `padding`, `margin` directly. Use `scale`, `translateY`, `opacity` as substitutes.
- Limit concurrent animations to 3-4 per view on mobile. Stagger reveals sequentially rather than simultaneously.
- Use Framer Motion's `layout` prop sparingly — one layout animation per transition, not per element.
- Test on real low-end Android devices (not just iPhone). Use Chrome DevTools CPU throttling (4x slowdown) as a proxy.
- Add `prefers-reduced-motion` media query support to skip or simplify animations for sensitive users.
- Use `LazyMotion` with `domAnimation` features instead of importing the full Framer Motion bundle.

**Warning signs:**
- Chrome DevTools Performance tab shows "Recalculate Style" or "Layout" taking >16ms per frame.
- Lighthouse mobile performance score below 70.
- Animations look smooth on desktop but "feel off" on phone — ask a non-developer to test.
- Battery draining noticeably during preview.

**Phase to address:**
Phase 1 (Core Animation Engine) — establish performance baselines and constraints from day one. Phase 2 (Template System) — enforce animation rules in template configs.

---

### Pitfall 2: Template System Becomes Unmanageable Configuration Soup

**What goes wrong:**
The template-as-JSON-configs approach starts clean but grows into a sprawling schema where each new template option requires touching 15 files. Templates drift from the schema. Validation becomes permissive to avoid breaking changes. The rendering engine becomes a giant switch statement. Adding a new animation style means updating the engine, the schema, the template, and the creator UI simultaneously.

**Why it happens:**
JSON configs are flexible — that flexibility is the trap. Without strict schema boundaries, template authors (even solo developers) add fields incrementally. "Just one more optional field" compounds. The rendering engine accumulates conditional logic for every template variant. Schema validation loosens to avoid breaking existing templates. Eventually the template system is harder to maintain than hardcoded components.

**How to avoid:**
- Define a strict Zod schema for template configs BEFORE building templates. Treat schema changes as breaking changes.
- Limit template config to visual parameters only (colors, fonts, timing, layout choice). Animation sequences should be pre-built compositions, not configurable timelines.
- Use a "template contract" — each template implements a fixed set of animation slots (opening, reveal, main, closing) with limited parameterization per slot.
- Never allow arbitrary CSS or animation values in template configs. Use enums for animation types (fade, slide, scale, confetti) not open-ended duration/easing/property configs.
- Build a template validator that runs in CI and catches schema drift.
- Keep template configs under 200 lines of JSON. If a template exceeds this, split it into composable parts with strict interfaces.

**Warning signs:**
- Template config files exceeding 200 lines.
- Schema has more than 5 optional fields per animation slot.
- Adding a new template requires modifying the rendering engine.
- Validation is done at runtime instead of build time.
- "Just one more field" appears in more than 2 consecutive commits.

**Phase to address:**
Phase 1 (Core Animation Engine) — define the template schema and rendering contract before building any templates. Phase 2 (Template System) — enforce schema validation and template boundaries.

---

### Pitfall 3: The Over-Customization Trap — Creators Drown in Options

**What goes wrong:**
The creator opens the Customize flow and is confronted with 12+ configuration steps, each with multiple options. They feel overwhelmed, abandon the creation, or publish something ugly because they picked defaults randomly. The "Customize" flow becomes so complex that nobody uses it, and the "Quick Create" flow is too basic to produce something that feels special. The product falls into the gap between too simple and too complex.

**Why it happens:**
Feature-driven development adds options for every capability. Each feature (gift box, cake, ribbon, timeline, music, poem) seems individually simple, but their combination creates exponential complexity. The creator does not think in terms of components — they think in terms of "I want to make my friend feel special." Presenting 12 configuration steps breaks the emotional intent.

**How to avoid:**
- The Customize flow should have MAXIMUM 5-7 steps. Each step configures a category (Opening, Gift Reveal, Content, Extras, Closing), not individual components.
- Within each step, offer 2-3 curated presets, not raw configuration. "Elegant" vs "Playful" vs "Dramatic" — not individual color pickers and timing sliders.
- Default everything to "just works." Every optional feature should produce a beautiful result with zero configuration.
- Use progressive disclosure ruthlessly: show Quick Create first, Customize as "Want more control?" link, never force the path.
- Build a "preview after each step" pattern so creators see results immediately, reducing anxiety about choices.
- Track analytics on which Customize steps have the highest abandonment — cut or simplify those steps.

**Warning signs:**
- Creator spends more than 5 minutes in the Customize flow without reaching preview.
- Abandonment rate on any Customize step exceeds 30%.
- Quick Create produces results indistinguishable from Customize with defaults.
- Support questions about "what does this option do?" appear regularly.

**Phase to address:**
Phase 3 (Creator Experience) — design the wizard flow with strict step limits and preset-based choices. Phase 4 (Content Features) — ensure each new feature adds at most one step, never sub-steps.

---

### Pitfall 4: File Upload and Storage Cost Explosion

**What goes wrong:**
Users upload 5MB photos from their phones. Supabase Storage free tier has ~2GB bandwidth/month and ~50MB max file size. A single viral wish with 10 photos viewed by 100 people burns through bandwidth in hours. The app runs out of storage quota. Images load slowly because there is no CDN. The creator uploads a 40MB video and the upload silently fails or times out.

**Why it happens:**
File storage seems simple until scale hits. Supabase Storage free tier limits are aggressive: ~50MB default file size limit, ~2GB bandwidth/month. Without client-side image compression, users upload full-resolution photos (4000x3000, 8MB+). Without CDN headers, every image request goes to Supabase origin. Without upload progress feedback, users assume uploads failed and retry, doubling storage use. RLS policies on storage buckets often silently block uploads with cryptic errors.

**How to avoid:**
- Compress and resize images client-side before upload. Target max 1500px on longest edge, JPEG quality 80, resulting in ~200-500KB per image. Use browser-native Canvas API or a lightweight library.
- Set Supabase Storage bucket `fileSizeLimit` to 5MB and `allowedMimeTypes` to `['image/jpeg', 'image/png', 'image/webp']`.
- Add Cache-Control headers to storage objects for CDN caching (Supabase Storage supports this via upload options).
- For the freemium model: limit free users to 5 photos max, paid users to 20. This is a natural upgrade trigger AND a cost control.
- Show upload progress with a clear percentage. Handle failures with retry and clear error messages.
- Test RLS policies early — the #1 Supabase Storage issue is uploads silently failing due to missing INSERT policies.
- For videos: use embedding (YouTube, Vimeo) rather than direct upload. This avoids storage costs entirely.

**Warning signs:**
- Supabase Storage dashboard shows bandwidth approaching 1GB/month.
- Users reporting "upload failed" or "photo not showing."
- Image load times exceeding 3 seconds on 3G connections.
- RLS policy errors in Supabase logs.

**Phase to address:**
Phase 1 (Core Infrastructure) — set up storage buckets with correct limits and RLS from day one. Phase 4 (Content Features) — implement client-side compression before upload.

---

### Pitfall 5: Sharing Link Breaks — The Death of a Gift

**What goes wrong:**
The creator shares the link via WhatsApp. The recipient clicks it. The page loads but shows a blank screen, a 404, or the wrong wish. The surprise is ruined. The link works on the creator's laptop but not on the recipient's phone. The link works initially but breaks after a Vercel redeploy. The creator accidentally shares the preview URL instead of the published URL.

**Why it happens:**
SPA routing with Next.js App Router means the wish page is a dynamic route (`/wish/[id]`). If the route is not properly configured for static generation or ISR, it requires a serverless function call on every visit — and cold starts can cause the first visit to fail or timeout. Vercel Hobby plan has 100GB-hrs of serverless execution — a popular wish can exhaust this. The creator might share `/preview/abc123` instead of `/w/abc123`. If the wish data is stored only in Prisma/Postgres and not cached, every visit hits the database.

**How to avoid:**
- Use ISR (Incremental Static Regeneration) for published wishes. This pre-renders the wish as static HTML, serves from Vercel's CDN, and revalidates in the background. First visit is fast, subsequent visits are instant.
- Use a short, clean URL format: `wishire.com/w/abc123` — easy to type, easy to share, no accidental preview link confusion.
- Generate preview and publish URLs with clear visual distinction in the creator dashboard. Never show raw URLs — always show "Copy Share Link" button.
- Set `revalidate` to a reasonable interval (e.g., 3600 seconds) so wishes are served from cache, not serverless functions.
- Test the link on 3+ devices before the creator shares it. Include a "Test Link" button that opens in incognito.
- Handle the edge case where a wish is published but the database query fails — serve a cached version or a graceful "This wish is being prepared" message, never a blank screen.
- Store wish content as a self-contained JSON blob in the database, not as separate relational queries. This makes ISR caching simple and avoids N+1 on page load.

**Warning signs:**
- Any user reporting "link doesn't work" or "blank page."
- Vercel function execution approaching Hobby plan limits.
- Cold start times visible in Vercel analytics (p95 > 2s).
- Preview URL and publish URL are not clearly differentiated in the UI.

**Phase to address:**
Phase 2 (Wish Rendering) — implement ISR and static generation correctly. Phase 3 (Publishing) — build robust sharing link flow with testing.

---

### Pitfall 6: The Uncanny Valley of Forced Emotional UX

**What goes wrong:**
The experience feels manipulative rather than heartfelt. Over-the-top animations, excessive confetti, mandatory music playback, and aggressive "surprise!" messaging make the recipient feel awkward rather than touched. The creator's letter — the most personal part — is buried under layers of animated decoration. The emotional arc feels engineered, not genuine. Recipients close the tab before reaching the actual content.

**Why it happens:**
Developers (and creators) conflate "more animation" with "more emotional." Every feature gets maximum visual intensity because that's what's fun to build. The opening interaction becomes a 30-second gauntlet before the recipient can read the letter. Music auto-plays without user consent (and gets blocked by browser autoplay policies anyway). The gift box animation is longer than the time it takes to read the actual message.

**How to avoid:**
- The letter/message should be reachable within 15 seconds of opening the link. Everything before it is atmosphere, not a gate.
- Never auto-play audio. Always require user interaction first. "Play music" button with clear indication.
- Confetti and celebration effects should be SHORT (2-3 seconds max) and triggered by meaningful moments (opening the gift, blowing candles), not continuous.
- Let creators control intensity: "Subtle" vs "Celebration" presets, not raw animation configuration.
- The emotional arc should follow: anticipation (2-3s) -> reveal (3-5s) -> content (self-paced) -> closing warmth. Not: anticipation (30s) -> reveal (15s) -> content (rushed).
- Test with real recipients. Ask: "Did this feel genuine or forced?" Not: "Did the animations work?"
- Respect `prefers-reduced-motion` — some recipients are in public spaces or have motion sensitivity.

**Warning signs:**
- Opening interaction takes more than 10 seconds before content is visible.
- Recipient analytics show high drop-off rates in the first 15 seconds.
- Creators disabling most features in Customize mode because "it's too much."
- Browser console shows autoplay blocked errors for audio/video.

**Phase to address:**
Phase 2 (Recipient Experience) — design the emotional arc with strict timing budgets. Phase 3 (Creator Experience) — ensure creators can control intensity without drowning in options.

---

### Pitfall 7: Non-Creator Users Feel Lost During Creation

**What goes wrong:**
The creator — a non-technical person — opens the app and doesn't know where to start. They feel like they're "building a website" instead of "making a gift." They upload a photo but don't see it in the preview. They write a letter but can't figure out how to add it. They preview the wish but can't tell if it's "done." They abandon the creation halfway through, or publish something incomplete because they're afraid of breaking it.

**Why it happens:**
The creation interface is designed by developers who understand the system architecture. Non-technical users don't think in terms of "steps" or "components" — they think in terms of "I want to say something nice and show some photos." The interface exposes the system's internal model (template selection, component configuration, layout choice) instead of the user's mental model (what will they see, in what order, does it look good).

**How to avoid:**
- The creation flow should mirror the recipient's experience: "First they'll see this, then this, then this." Linear, predictable, preview-driven.
- Show a live preview on EVERY step, not just at the end. The preview should update instantly as the creator makes changes.
- Never use technical language: not "template" but "style," not "component" but "section," not "layout" but "how it flows."
- Auto-save everything. Never lose a creator's work. Show "Saved" status visibly.
- The Quick Create flow should be completable in under 5 minutes with ZERO documentation needed.
- If a step can be skipped, mark it clearly as "Optional — you can always add this later." Never make creators feel incomplete for skipping.
- Build a "What does my friend see?" button that shows a simplified, non-editable preview from the recipient's perspective.

**Warning signs:**
- Creator starts over from scratch instead of editing an existing draft.
- Support questions about "how do I add my letter?" or "where do my photos go?"
- Completion rate (started -> published) below 50%.
- Average creation time exceeds 10 minutes for Quick Create.
- Creators ask friends "can you help me set this up?"

**Phase to address:**
Phase 3 (Creator Experience) — this is THE core UX challenge. Every phase after must preserve creator confidence.

---

### Pitfall 8: Freemium Gating Kills the Viral Loop

**What goes wrong:**
The creator spends 20 minutes crafting the perfect surprise, hits "Publish," and sees a paywall. They abandon. They tell their friend "I tried this app but it's paywalled." The friend never tries it. The product's viral growth — driven by recipients becoming creators — dies at the paywall. Alternatively, the free tier is too generous and nobody ever pays.

**Why it happens:**
The paywall is placed at the wrong point in the emotional journey. The creator has invested time and emotion — hitting a paywall at that moment feels like betrayal, not a reasonable business model. Or the opposite: gating the wrong features (like "remove watermark" or "add music") that recipients don't care about, so creators see no value in upgrading.

**How to avoid:**
- Gate by QUANTITY not by QUALITY. Free users can create 1 wish with full features. Paid users can create unlimited wishes. This preserves the viral loop (every recipient can try creating one) while monetizing power users.
- Show the paywall BEFORE the creation flow, not after. "Create your first wish free" — transparent, no surprises.
- The free wish must be fully functional and beautiful. No watermarks, no degraded experience. The recipient should not be able to tell it's free.
- Gate premium templates and advanced features (custom audio, analytics) not core functionality.
- Consider: free users publish with a subtle "Made with Wishire" footer. Premium removes it. This is the classic freemium pattern — the free version advertises the product.
- Track: how many recipients click "Create your own" after receiving a wish? If this number is low, the viral loop is broken.

**Warning signs:**
- Publish abandonment rate (hit paywall -> close tab) exceeds 70%.
- Referral tracking shows recipients do not become creators.
- Free-to-paid conversion below 2% (industry average for freemium SaaS).
- Support emails about "why can't I publish?"
- Creators sharing screenshots of the paywall with negative sentiment.

**Phase to address:**
Phase 3 (Publishing + Freemium) — design the paywall placement and free tier boundaries carefully. Revisit after launch with real user data.

---

### Pitfall 9: Vercel Hobby Plan Limits Hit Unexpectedly

**What goes wrong:**
A wish goes semi-viral — shared in a WhatsApp group, viewed by 500 people in an hour. The Vercel Hobby plan's 100GB-hrs of serverless execution is exhausted. The site goes down. Or: image optimization quota (1000 source images/month) is consumed by a few wishes with many photos. Or: the 100GB bandwidth limit is hit. The site that was "working fine" suddenly returns errors.

**Why it happens:**
Vercel Hobby plan limits are generous for development but tight for production with real traffic. Serverless cold starts add execution overhead. Image optimization is charged per unique transformation — a 5-photo wish viewed on 3 different screen sizes = 15 unique optimizations. Bandwidth includes all assets served.

**How to avoid:**
- Use ISR (Incremental Static Regeneration) for published wishes. Static pages served from CDN do NOT count against serverless execution hours.
- Use a custom image loader (Cloudinary free tier or imgix) instead of Vercel's built-in image optimization. This bypasses the 1000-image quota entirely.
- Set `images.unoptimized: true` in next.config.js and handle optimization at the CDN/storage layer.
- Monitor Vercel usage dashboard weekly. Set up alerts at 80% of any limit.
- For bandwidth: use Supabase Storage with CDN for user-uploaded images. This keeps bandwidth off Vercel.
- Have a migration plan to Vercel Pro before limits are hit, not after. The cost of downtime > cost of Pro plan.
- Consider: pre-render all published wishes as static HTML. A wish viewed 1000 times costs $0 in serverless execution.

**Warning signs:**
- Vercel dashboard showing >50% of any limit consumed.
- Cold start times visible in analytics (p95 > 3s).
- Build failures due to function size limits.
- Unexpected Vercel bill at end of month.

**Phase to address:**
Phase 1 (Core Infrastructure) — set up ISR and image strategy from day one. Phase 5 (Production Hardening) — add monitoring and alerting.

---

### Pitfall 10: Preview ≠ Reality — The "Looks Different on Recipient's Phone" Problem

**What goes wrong:**
The creator previews the wish on their laptop, loves it, shares the link. The recipient opens it on their phone and the layout is broken, photos are cropped awkwardly, text is too small, animations trigger at wrong times, or the experience is completely different from what the creator expected. The creator feels embarrassed. The recipient is confused.

**Why it happens:**
The preview is rendered in the creator's browser (desktop, specific viewport). The recipient's experience depends on their device, screen size, browser, connection speed, and whether JavaScript loads correctly. Mobile viewports crop landscape photos. Touch interactions differ from mouse interactions. Slow connections delay animation loading. Safari handles some CSS differently than Chrome.

**How to avoid:**
- The "Preview as Recipient" mode MUST simulate a mobile viewport (375px wide, iPhone dimensions). Default to mobile preview, not desktop.
- Test all templates on: iPhone SE (small), iPhone 14 (standard), Android mid-range, iPad, desktop Chrome, Safari mobile.
- Photos should be displayed in portrait-friendly crops on mobile. Use `object-fit: cover` with sensible aspect ratios.
- Never rely on hover interactions — recipients are on mobile. All interactions must be tap-based.
- Show a "How it looks on different devices" preview with 3 viewport thumbnails (phone, tablet, desktop).
- The creator dashboard should flag when content might look different: "This landscape photo may be cropped on phones."

**Warning signs:**
- Creator asking "why does it look different on my phone?"
- Layout breakage reports on specific devices.
- Photos appearing cropped or stretched on mobile previews.
- Animations not triggering on touch devices.

**Phase to address:**
Phase 2 (Recipient Experience) — build mobile-first rendering. Phase 3 (Creator Experience) — build device-aware preview.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip ISR, render wishes server-side | Faster to build, simpler code | Cold starts destroy recipient experience; can't scale | Never — recipient experience is the product |
| Store wish data as separate relational tables | Proper normalization, easier queries | N+1 queries on page load, complex ISR caching | Never — store wish as self-contained JSON blob |
| Skip `prefers-reduced-motion` | Less code to write | Accessibility violation, alienates motion-sensitive users | Never — add it in Phase 1, takes 30 minutes |
| Use full Framer Motion import instead of LazyMotion | Zero config, works immediately | 40KB+ added to bundle, slower mobile load | Acceptable in Phase 1 prototype only |
| Hardcode template animations instead of config-driven | Faster to build first template | Every new template requires engine changes | Acceptable for first 2 templates, refactor before #3 |
| Skip image compression, trust Supabase limits | Less client-side code | Storage costs explode, slow loads on 3G | Never — compress before upload |
| Auto-play music on page load | Immediate emotional impact | Browser blocks it, bad UX, accessibility issue | Never — always require user interaction |
| Use hash-based routing for wish URLs | Simpler SPA routing, no server config | URLs look unprofessional, some analytics break | Never — Next.js handles this natively |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Supabase Storage | Missing INSERT RLS policy — uploads silently fail | Test upload in production-like environment BEFORE building creator flow |
| Supabase Storage | No file size limit set — users upload 40MB photos | Set bucket `fileSizeLimit` and `allowedMimeTypes` at bucket creation time |
| Supabase Storage | No CDN caching headers — every image request hits origin | Set `Cache-Control: public, max-age=31536000` on uploads |
| Vercel | Not configuring `images.remotePatterns` — next/image fails for Supabase URLs | Add Supabase storage domain to `remotePatterns` in next.config.js |
| Vercel | Using serverless functions for wish rendering instead of ISR | Use `revalidate` option in `generateStaticParams` for static generation |
| Vercel | Ignoring function size limits — bundle includes heavy dependencies | Monitor `next build` output for function sizes; split large dependencies |
| Framer Motion | Importing from `framer-motion` instead of `motion/react` | Use tree-shakeable imports; import only needed features |
| Zod | Validating at runtime only, not at build time | Use `z.infer<>` for TypeScript types and validate at API boundaries |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Server-rendered wishes without ISR | First-visit latency >2s, Vercel execution hours climbing | Pre-render all published wishes as static HTML with ISR | ~100 concurrent visitors |
| Uncompressed user photos | 3-second image load on 3G, storage costs rising | Client-side Canvas compression before upload (target <500KB) | First user with iPhone Pro photos |
| Full Framer Motion bundle on recipient page | 40KB+ JS shipped, slow TTI on mobile | Use LazyMotion with domAnimation features | First test on slow 3G connection |
| N+1 database queries for wish data | Page load >1s, database connections exhausted | Store wish as single JSON column, query once | ~50 concurrent wish views |
| No image CDN caching | Every image request goes to Supabase origin, bandwidth consumed | Cache-Control headers on storage uploads | ~500 wish views/month |
| Multiple simultaneous animations | Frame drops on mid-range phones, battery drain | Stagger animations, limit concurrent to 3-4 per view | Test on $100 Android phone |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Public Supabase Storage bucket without auth | Anyone can upload malicious files to your bucket | Use authenticated-only buckets with RLS INSERT policies |
| Wish content accessible without authentication check | Someone guesses wish IDs and reads private messages | Validate wish ownership/visibility on every request; use unguessable IDs (cuid2, not sequential) |
| Creator can edit any wish by changing ID in URL | Unauthorized modification of other users' wishes | Server-side ownership check on every mutation, not just client-side |
| Rate limiting absent on wish creation | Abuse: create thousands of wishes, exhaust storage/bandwidth | Implement rate limiting on wish creation endpoint (e.g., 10/hour for free users) |
| User-uploaded photos used for XSS | Malicious image metadata or SVG uploads | Validate MIME types server-side; strip EXIF data; never serve user uploads as HTML |
| Preview URLs guessable | Someone previews unpublished wishes | Use separate, authenticated preview tokens; expire after 24h |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No progress indicator during creation | Creator doesn't know how much is left, abandons | Show "Step 3 of 7" with clear labels and progress bar |
| Preview only available at the end | Creator invests 20 minutes before seeing result | Live preview on every step, auto-updating |
| "Publish" button does not explain what happens | Creator unsure if link is public, editable, deletable | Show: "Your wish will be accessible at wishire.com/w/abc123. You can edit it after publishing." |
| No undo for destructive actions | Creator accidentally deletes content, panics | Auto-save drafts; show "Undo" toast for 10 seconds after delete |
| Mobile keyboard covers input fields | Creator can't see what they're typing on phone | Scroll input into view; use `visualViewport` API to adjust layout |
| Long letter text with no formatting | Wall of text is hard to read, loses emotional impact | Support paragraph breaks, bold text, and a reasonable max length with character count |
| Photos displayed in upload order, not visual order | Creator can't arrange photos to tell a story | Allow drag-to-reorder photos before publishing |
| No indication of what's "optional" vs "required" | Creator skips required fields, gets confused by errors | Mark optional sections clearly; never show validation errors for skipped optional sections |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Animation System:** Works on desktop Chrome — verify on Safari mobile, low-end Android, and with `prefers-reduced-motion` enabled.
- [ ] **File Upload:** Photos upload successfully — verify with 403/413 errors, network interruption mid-upload, duplicate uploads, and 0-byte files.
- [ ] **Sharing Link:** Link opens correctly — verify in WhatsApp in-app browser, iMessage preview, email client click, incognito mode, and after Vercel redeploy.
- [ ] **Preview Mode:** Shows recipient experience — verify it matches actual recipient view on same device/viewport. Check that preview URL cannot be shared as real wish.
- [ ] **Freemium Gate:** Paywall appears at right moment — verify creator sees it BEFORE investing time, not after. Verify free wish has no degraded recipient experience.
- [ ] **Auto-Save:** Draft persists — verify by closing tab mid-creation, losing network, and returning later. Check that auto-save doesn't create orphaned drafts.
- [ ] **Music/Audio:** Play button works — verify browser autoplay policy compliance, user gesture requirement, and audio pause on tab switch.
- [ ] **Mobile Layout:** All content readable — verify on iPhone SE (375px), standard phone (390px), and tablet (768px). Check photo cropping and text sizing.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Animation performance collapse | MEDIUM | Profile with Chrome DevTools; replace layout animations with transform-only; add `LazyMotion`; test on real devices |
| Template schema drift | HIGH | Freeze current schema; add strict Zod validation; migrate existing templates to schema; reject any template that doesn't validate |
| Creator overwhelm | LOW | A/B test step reduction; add analytics to find abandonment points; default more aggressively; cut optional steps |
| Storage cost explosion | MEDIUM | Implement client-side compression retroactively; add RLS policies; set bucket limits; migrate existing uploads |
| Link breakage | HIGH | Switch to ISR immediately; pre-render all published wishes; add monitoring; create emergency static fallback |
| Forced emotional UX | LOW | Reduce animation duration; make music opt-in; shorten opening interaction; add intensity presets |
| Creator confusion | MEDIUM | User test with 5 non-technical people; rewrite all copy; add live preview; simplify navigation |
| Freemium killing viral loop | HIGH | Move paywall before creation; make free tier fully featured; track recipient-to-creator conversion |
| Vercel limits hit | MEDIUM | Migrate to ISR; switch to external image CDN; upgrade to Pro; add usage monitoring |
| Preview mismatch | LOW | Default to mobile preview; add device simulator; test all templates on target devices |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Animation performance collapse | Phase 1 (Core Engine) | Lighthouse mobile score >80; no frame drops on $100 Android |
| Template schema drift | Phase 1 (Core Engine) | Zod schema validates all templates in CI; no runtime validation |
| File upload/storage explosion | Phase 1 (Infrastructure) | Upload compression reduces avg photo to <500KB; RLS policies tested |
| Vercel limits hit | Phase 1 (Infrastructure) | ISR configured; all published wishes served from CDN; usage dashboard monitored |
| Preview mismatch | Phase 2 (Recipient Experience) | All templates render correctly on iPhone SE, standard phone, desktop |
| Forced emotional UX | Phase 2 (Recipient Experience) | Opening interaction <10s; music opt-in; `prefers-reduced-motion` supported |
| Creator overwhelm | Phase 3 (Creator Experience) | Quick Create <5min; Customize ≤7 steps; completion rate >60% |
| Sharing link breaks | Phase 3 (Publishing) | Link tested on 3 devices before publish; ISR serves from CDN; 404 handled gracefully |
| Freemium killing viral loop | Phase 3 (Publishing) | Paywall before creation; free wish fully featured; recipient-to-creator tracking |
| Template complexity | Phase 4 (Template System) | All templates <200 lines config; no template requires engine changes |
| Creator confusion | Phase 3 (Creator Experience) | 5 non-technical users complete Quick Create without help; zero "how do I?" support questions |

## Sources

- Framer Motion source code: will-change management, layout animation internals (via Context7, MEDIUM confidence)
- Next.js documentation: image optimization configuration, serverless function limits, ISR configuration (via Context7, MEDIUM confidence)
- Supabase documentation: Storage bucket creation, file size limits, RLS policies (via Context7, MEDIUM confidence)
- Training data analysis: freemium conversion patterns, Vercel Hobby plan limits, mobile animation performance (MEDIUM confidence — based on training data up to early 2025)
- PROJECT.md: Wishire product context, user personas, feature requirements, tech stack decisions

---
*Pitfalls research for: Wishire (interactive animated surprise/gift websites)*
*Researched: 2026-08-25*
