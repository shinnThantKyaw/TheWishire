# Phase 2: The Recipient Surprise Experience — Complete Implementation Plan

## Context

The current `/w/[slug]` recipient experience (Phase 2) is a flat linear stage machine: Envelope → Gift Box → Cake → Main Content → Poem → Timeline → Facts → Closing. It works but lacks the anticipation, emotional arc, and premium feel the product needs.

We are **completely replacing** the current stage machine with a multi-act cinematic journey that builds anticipation and emotional investment before revealing the main surprise. This plan covers **Phase 2 only** — the demo/prototype of the recipient experience. Phase 3 (Creator Dashboard) will follow in its own plan.

---

## Core Emotional Journey

Every design and animation decision must serve this progression:

```
"Why did I get this?"          → Gate (curiosity + mystery)
"Oh, someone made this for me." → Gate reveal (personal touch)
"What's inside?"               → Prologue (building anticipation)
"I'm ready!"                   → Prologue completion (commitment)
"Wow, there's a gift box!"     → Gift Box appearance (excitement)
"What's inside?"               → Gift Box opening (peak moment)
"This letter is for me."       → Letter chapter (emotion)
"These are our memories."      → Timeline chapter (nostalgia)
"There's even more!"           → Gift chapter intro (surprise)
"I won something!"             → Mini-game reward (delight)
"That was really special."     → Closing (gratitude)
```

---

## Complete Recipient Flow (Slide-by-Slide)

```
┌─────────────────────────────────────────────────────────────────────┐
│  WISHIRE LINK OPENED                                                │
│                                                                     │
│  SCREEN 1: SURPRISE INTRODUCTION                                    │
│  Mystery/curiosity screen. Dark background with floating particles. │
│  "Hey {recipientName}, you have a special surprise!"                │
│  Context: from {senderName}                                         │
│  [Continue] button                                                  │
│                                                                     │
│  SCREEN 2: SURPRISE UNLOCK                                          │
│  Interactive lock/ribbon/seal — recipient must interact to proceed   │
│  Gate types: padlock tap / ribbon cut / wax seal break / chain snap │
│  On success: "Surprise Unlocked!" celebration                        │
│  [Auto-advance after animation]                                     │
│                                                                     │
│  SCREEN 3: SURPRISE START / ARE YOU READY?                          │
│  Occasion-specific CTA page                                         │
│  Birthday → Light candles on cake                                   │
│  Anniversary → "Are you ready?" Yes/No                              │
│  General → Password / Tap to reveal                                 │
│  [Action completion auto-advances]                                  │
│                                                                     │
│  SCREEN 4: GIFT REVEAL                                              │
│  Premium gift box appears with music starting                        │
│  Beautiful 3D box with ribbons, bow, decorations                    │
│  Prompt: "Tap to open" / "Cut the ribbon" / "Shake to open"        │
│  [Interactive open trigger]                                         │
│                                                                     │
│  SCREEN 5: OPEN GIFT BOX                                            │
│  Box opens with massive celebration                                  │
│  Confetti burst + music volume increases                             │
│  Material items fly out and settle on screen                         │
│  Transition to the experience mode                                   │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════     │
│  CREATOR CHOSE: A. Click-through (slide-by-slide)                   │
│  ═══════════════════════════════════════════════════════════════     │
│                                                                     │
│  SCREEN 6: LETTER                                                   │
│  Paper-textured card with fold/unfold animation                      │
│  Creator's letter text with typewriter reveal                        │
│  Optional: photos below the letter                                   │
│  [Next →]                                                           │
│                                                                     │
│  SCREEN 7: PHOTOS & VIDEOS                                          │
│  Masonry grid of photos with staggered entrance                      │
│  Each photo tappable for lightbox view                               │
│  Video embed with play button (if creator added video)               │
│  [← Back] [Next →]                                                  │
│                                                                     │
│  SCREEN 8: POEM                                                     │
│  Beautiful typographic layout on gradient background                  │
│  Line-by-line animation reveal                                       │
│  Author attribution card                                             │
│  [← Back] [Next →]                                                  │
│                                                                     │
│  SCREEN 9: MEMORY TIMELINE                                           │
│  Vertical timeline with animated line drawing                         │
│  Cards alternate left/right, each with date + content                 │
│  Optional photos per card                                             │
│  [← Back] [Next →]                                                  │
│                                                                     │
│  SCREEN 10: GIFTS & REWARDS                                          │
│  ┌──────────────────────────────────────────────┐                    │
│  │ SCREEN 10A: GIFT CHALLENGE                   │                    │
│  │ "Here is a special surprise gift for you!"   │                    │
│  │ Pre-reveal gate: password / yes-no / action  │                    │
│  │ [Complete the challenge]                     │                    │
│  ├──────────────────────────────────────────────┤                    │
│  │ SCREEN 10B: MAIN GIFT REVEAL                │                    │
│  │ Gift opens with celebration animation        │                    │
│  │ Photos of physical gift + short message      │                    │
│  │ Decorations, sparkles, premium UI             │                    │
│  ├──────────────────────────────────────────────┤                    │
│  │ SCREEN 10C: BONUS GIFTS INTRODUCTION         │                    │
│  │ "Here are some more surprises for you!"      │                    │
│  │ "You have {N} chances to win!"               │                    │
│  ├──────────────────────────────────────────────┤                    │
│  │ SCREEN 10D: SPIN WHEEL / LUCKY DRAW          │                    │
│  │ Interactive mini-game                        │                    │
│  │ Creator chose: spin-wheel or lucky-draw      │                    │
│  │ Uses available attempts                       │                    │
│  ├──────────────────────────────────────────────┤                    │
│  │ SCREEN 10E: REWARD RESULT                    │                    │
│  │ "You won: {item}!" with celebration          │                    │
│  │ Download reward proof/ticket button          │                    │
│  │ Repeat if attempts remain                     │                    │
│  └──────────────────────────────────────────────┘                    │
│  [← Back] [Next →]                                                  │
│                                                                     │
│  SCREEN 11: CLOSING                                                 │
│  Warm gradient background with floating particles                    │
│  "Thank you for being part of this special moment. 💜"              │
│  "Made with love by Wishire" branding                                │
│  Two CTA buttons:                                                   │
│  [✨ Experience Again] [🎁 Create Your Own Wish]                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Naming Reference

| Concept | Name | Description |
|---------|------|-------------|
| The full journey | **Surprise Experience** | Everything from link open to closing |
| Screen 1 | **Surprise Introduction** | Mystery context screen |
| Screen 2 | **Surprise Unlock** | The lock/ribbon/seal interaction |
| Screen 3 | **Surprise Start** | "Are you ready?" / CTA page |
| Screen 4 | **Gift Reveal** | The gift box appears |
| Screen 5 | **Gift Box Opening** | Box opens, confetti, materials launch |
| Screens 6-9 | **Chapters** | Letter, Photos, Poem, Timeline |
| Screen 10 | **Gifts & Rewards** | Gift challenge + main gift + bonus games |
| Screen 11 | **Closing** | Thank you + CTAs |
| Flow modes | **Click-through / Scroll / Interactive** | The 3 ways to experience chapters |
| Interactive items | **Materials** | Objects that represent each chapter |
| Mini-game prizes | **Rewards** | Won from spin wheel / lucky draw |
| Prize proof | **Reward Ticket** | Downloadable JPG proof |

---

## Technical Architecture

### State Machine

```typescript
// Top-level experience phases (maps to screens)
type ExperiencePhase =
  | "introduction"    // Screen 1: Surprise Introduction
  | "unlock"          // Screen 2: Surprise Unlock
  | "start"           // Screen 3: Are You Ready?
  | "gift-reveal"     // Screen 4: Gift Box appears
  | "gift-opening"    // Screen 5: Box opens + materials launch
  | "chapters"        // Screens 6-10: The main experience
  | "closing";        // Screen 11: Final

// Within "chapters" phase
type ChapterIndex = 0 | 1 | 2 | 3 | 4;
// 0 = Letter, 1 = Photos & Video, 2 = Poem, 3 = Timeline, 4 = Gifts & Rewards

// Within chapter 4 (Gifts & Rewards), sub-screens
type GiftSubScreen =
  | "challenge"       // Screen 10A: Pre-reveal gate
  | "main-gift"       // Screen 10B: Main gift reveal
  | "bonus-intro"     // Screen 10C: Bonus gifts intro
  | "mini-game"       // Screen 10D: Spin wheel / lucky draw
  | "reward-result"   // Screen 10E: Won item + download
  | "complete";       // Done with gift chapter

// Flow mode (creator's choice)
type FlowMode = "click-through" | "scroll" | "interactive";

// Gate types (Screen 2)
type GateType = "padlock" | "ribbon" | "wax-seal" | "chain";

// Prologue action (Screen 3)
type StartAction =
  | { type: "candles"; count: number }
  | { type: "yes-no"; prompt: string }
  | { type: "password"; answer: string }
  | { type: "tap"; prompt: string };

// Gift box open method (Screen 4)
type BoxOpenMethod = "tap" | "ribbon-cut" | "shake";

// Mini-game type (Screen 10D)
type MiniGameType = "spin-wheel" | "lucky-draw";

// Reward item
type RewardItem = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  probability: number;
};

// Mini-game configuration
type MiniGameConfig = {
  type: MiniGameType;
  attempts: number;
  items: RewardItem[];
};

// Material theme (for interactive mode)
type MaterialTheme =
  | "chocolates" | "flowers" | "stars"
  | "hearts" | "balloons" | "books"
  | "presents" | "butterflies" | "fireflies";
```

### Updated FlowMode mapping

| Old Name | New Name | Behavior |
|----------|----------|----------|
| `buttons` | `click-through` | Next/Back buttons, one chapter at a time |
| `scroll` | `scroll` | Continuous page, all chapters visible |
| `tap-to-reveal` | `interactive` | Materials from box, tap to open each |

### File Structure

```
src/
├── components/
│   └── wish/
│       ├── experience-orchestrator.tsx    ← NEW: Main state machine + screen router
│       ├── screens/
│       │   ├── introduction-screen.tsx    ← NEW: Screen 1
│       │   ├── unlock-screen.tsx          ← NEW: Screen 2 (gate types)
│       │   ├── start-screen.tsx           ← NEW: Screen 3 (are you ready)
│       │   ├── gift-reveal-screen.tsx     ← NEW: Screen 4 (box appears)
│       │   ├── gift-opening-screen.tsx    ← NEW: Screen 5 (box opens)
│       │   └── closing-screen.tsx         ← NEW: Screen 11
│       ├── chapters/
│       │   ├── letter-chapter.tsx         ← REFACTORED from main-content-stage
│       │   ├── photos-chapter.tsx         ← NEW: Photos + Video
│       │   ├── poem-chapter.tsx           ← REFACTORED from main-content-stage
│       │   ├── timeline-chapter.tsx       ← REFACTORED from memory-timeline-stage
│       │   └── gift-chapter.tsx           ← NEW: Gifts & Rewards (Screen 10)
│       ├── modes/
│       │   ├── click-through.tsx          ← NEW: Chapter cards with Next/Back
│       │   ├── scroll-mode.tsx            ← NEW: Continuous scroll
│       │   └── interactive-mode.tsx       ← NEW: Materials from box
│       ├── gift/
│       │   ├── gift-gate.tsx              ← NEW: Screen 10A (challenge)
│       │   ├── main-gift-reveal.tsx       ← NEW: Screen 10B
│       │   ├── bonus-intro.tsx            ← NEW: Screen 10C
│       │   ├── spin-wheel.tsx             ← NEW: Screen 10D variant
│       │   ├── lucky-draw.tsx             ← NEW: Screen 10D variant
│       │   ├── reward-result.tsx          ← NEW: Screen 10E
│       │   └── reward-ticket.tsx          ← NEW: Downloadable JPG
│       ├── gate/
│       │   ├── padlock.tsx                ← NEW: Padlock variant
│       │   ├── ribbon-cut.tsx             ← NEW: Ribbon cutting variant
│       │   ├── wax-seal.tsx               ← NEW: Wax seal variant
│       │   └── chain-break.tsx            ← NEW: Chain breaking variant
│       └── shared/
│           ├── confetti-burst.tsx         ← NEW: canvas-confetti wrapper
│           ├── material-item.tsx          ← NEW: Reusable material shape
│           ├── stage-container.tsx        ← EXISTS (keep, update animations)
│           ├── decorations.tsx            ← EXISTS (keep)
│           ├── music-player.tsx           ← EXISTS (keep, enhance)
│           └── character-gif.tsx          ← EXISTS (keep)
├── types/
│   ├── experience.ts                      ← NEW: All experience types
│   ├── wish.ts                            ← MODIFY: FlowMode + settings
│   └── template.ts                        ← MODIFY: New stage types
├── lib/
│   ├── experience-state.ts                ← NEW: State machine logic
│   ├── confetti-presets.ts                ← NEW: Confetti configurations
│   ├── reward-ticket-renderer.ts          ← NEW: Canvas-based ticket generator
│   └── wish-merge.ts                      ← MODIFY: Updated merge logic
├── config/
│   ├── materials.ts                       ← NEW: Material theme definitions
│   └── rewards.ts                         ← NEW: Default reward item sets
└── templates/
    ├── birthday/
    │   └── classic.json                   ← MODIFY: New structure
    └── anniversary/
        └── elegant.json                   ← NEW: Anniversary template
```

---

## Phase Plan (7 Phases)

---

### Phase 2.1 — Architectural Refactor: The 11-Screen Skeleton
**Goal:** Replace the flat stage machine with the 11-screen flow. Every screen renders as a styled placeholder. The full click-through flow works end-to-end with Next/Back navigation.

**Deliverables:**
- [ ] `src/types/experience.ts` — all types defined above
- [ ] `src/types/wish.ts` — update `FlowMode` to `click-through | scroll | interactive`
- [ ] `src/types/template.ts` — new stage types matching the 11 screens
- [ ] `src/lib/experience-state.ts` — state machine managing:
  - `ExperiencePhase` (top level)
  - `ChapterIndex` (within chapters)
  - `GiftSubScreen` (within gift chapter)
  - Navigation functions: `next()`, `back()`, `goToPhase()`, `goToChapter()`
  - Derived state: `isFirstScreen`, `isLastScreen`, `progress`
- [ ] `src/components/wish/experience-orchestrator.tsx` — main component:
  - Renders the correct screen based on `ExperiencePhase`
  - Uses `<AnimatePresence mode="wait">` for screen transitions
  - Passes navigation callbacks down to each screen
  - Applies theme via CSS custom properties
  - Renders overlay components (music, decorations)
- [ ] Placeholder screen components for all 11 screens:
  - Each shows screen number, name, and a "Next" / "Back" button
  - Styled with the theme colors for visual feedback
- [ ] Update `wish-merge.ts` to produce new stage structure
- [ ] Update `page.tsx` server component to pass new props
- [ ] Update `birthday-classic.json` template

**Verification:** Open `/w/[slug]` → Screen 1 (Introduction) → Next → Screen 2 (Unlock) → Next → Screen 3 (Start) → Next → Screen 4 (Gift Reveal) → Next → Screen 5 (Gift Opening) → Next → Screen 6 (Letter) → ... → Screen 10 (Gifts) → Screen 11 (Closing). Back button works. Full flow navigable.

---

### Phase 2.2 — Screen 1 + 2: Introduction & Unlock (The Gate)
**Goal:** Build the mystery introduction and the interactive lock/unlock experience.

**Screen 1 — Surprise Introduction:**
- [ ] Dark gradient background (deep purple → midnight blue)
- [ ] Floating sparkle/star particles drifting upward (using existing `Decorations` component)
- [ ] Centered content with staggered fade-in animation:
  - Gift box emoji/icon at top (subtle breathing animation)
  - "Hey {recipientName}!" — fades in first
  - "You have a special surprise..." — fades in second
  - "From: {senderName}" — fades in third
  - Occasion badge (e.g., "🎂 Birthday Surprise") — fades in last
- [ ] "Continue" button at bottom — gradient, glows subtly
- [ ] On click: slide transition to Screen 2

**Screen 2 — Surprise Unlock (4 variants):**
- [ ] **Padlock variant**: 3D CSS padlock with hasp and keyhole. Tap to "insert key" — key appears, rotates 90°, shackle lifts open. Sparkle particles burst on unlock.
- [ ] **Ribbon variant**: Wrapped gift door. Scissors icon follows finger/cursor. Drag across ribbon to cut — ribbon splits with satisfying animation, pieces fall away.
- [ ] **Wax seal variant**: Parchment texture with red wax seal. Tap seal — crack appears, pieces shatter outward with physics, parchment unfurls.
- [ ] **Chain variant**: Chain links across screen. Tap each link to break — link shatters with spark particles. After all links broken, door opens.
- [ ] All variants: dark mysterious background, ambient glow behind the lock mechanism
- [ ] On unlock success: "✨ Surprise Unlocked!" text animates in, then auto-advance to Screen 3 after 1.5s
- [ ] Mobile touch optimized — all interactions work with finger taps/drags

**Verification:** Both screens look premium and feel interactive. All 4 gate variants work. Unlock animation is satisfying. Auto-advance to Screen 3 works.

---

### Phase 2.3 — Screen 3 + 4 + 5: Start, Gift Reveal & Opening
**Goal:** Build the "Are you ready" page, the gift box appearance, and the box opening celebration.

**Screen 3 — Surprise Start / Are You Ready:**
- [ ] Warmer background than previous screens (shift from dark to warm tones)
- [ ] Personalized greeting based on occasion:
  - **Birthday**: "Hey {name}, I prepared a birthday surprise for you! 🎂 Light the candles to start celebrating." → Renders the cake with interactive tappable candles (adapt existing `CakeStage`)
  - **Anniversary/Valentine**: "Hey my love, I prepared something special for you. 💕 Are you ready to see it?" → Two buttons: [Yes, I'm ready! 😍] and [Not yet...] (No triggers playful "Wrong answer! Try again 💕" shake animation)
  - **General**: "Hey {name}, {sender} prepared something special for you! 🎁 Are you ready?" → [Let's go!] button or password input field
- [ ] Each action type has its own micro-animation on completion
- [ ] On success: smooth transition to Screen 4

**Screen 4 — Gift Reveal:**
- [ ] Background brightens — celebratory but not yet explosive
- [ ] Premium 3D gift box renders center screen:
  - Detailed box with body, lid, vertical + horizontal ribbons, bow (two loops + knot)
  - Subtle idle animation: gentle float/bob, sparkle highlights on ribbon
  - Box matches the theme color scheme
- [ ] Background music starts here (first interaction unlocked browser audio)
- [ ] Open method variants (matches creator's choice):
  - **Tap**: "Tap to open 💝" text pulses. On tap: box shakes 3 times, then opens.
  - **Ribbon cut**: Scissors appear, drag across ribbon to cut. Same mechanism as gate ribbon.
  - **Shake**: "Shake your phone!" text with phone shake animation. On desktop: animated "Shake" button.
- [ ] On trigger: transition to Screen 5

**Screen 5 — Gift Box Opening:**
- [ ] THE peak moment of the experience
- [ ] Box lid flies off (3D rotation)
- [ ] Ribbons shrink and fly away, bow spins off
- [ ] MASSIVE confetti burst using `canvas-confetti`:
  - Emoji shapes: 🎁 💖 🎉 🎊 ⭐
  - Multi-layered burst from center (use `fire()` pattern from Context7 research)
  - Continuous fireworks for 3 seconds
- [ ] Music volume increases to full
- [ ] 5 material items spring out from inside the box with physics:
  - Each item: starts inside box, launches upward with random trajectories, uses Motion `useSpring` for natural bounce on landing
  - Items settle in a visually pleasing arrangement
  - Each item has a brief glow/pulse once settled
- [ ] After materials settle (2s pause): auto-transition to Screen 6 (chapters begin)

**Verification:** Birthday candles work. Anniversary Yes/No works. Gift box looks premium. Opening is spectacular with confetti. Materials fly out and land naturally. Music starts and continues.

---

### Phase 2.4 — Screens 6-9: The Chapters (Click-through Mode)
**Goal:** Build the 4 content chapters with the click-through navigation (Next/Back).

**Click-through Mode Container (`click-through.tsx`):**
- [ ] Top: progress dots (● ● ○ ○ ○) — filled dots for completed chapters, hollow for upcoming
- [ ] Center: current chapter content with AnimatePresence slide transitions
- [ ] Bottom: navigation bar — [← Back] [Chapter 2/5] [Next →]
- [ ] First chapter: Back button disabled. Last chapter: Next shows "Finish →"
- [ ] Keyboard support: ArrowRight = Next, ArrowLeft = Back
- [ ] Smooth slide animation: current slides out left, new slides in from right (reverse on Back)

**Screen 6 — Letter Chapter (`letter-chapter.tsx`):**
- [ ] Paper-textured card (CSS noise texture + subtle shadow)
- [ ] Wax seal or heart icon at top of card
- [ ] Letter text with typewriter animation (characters appear one by one, or line-by-line fade)
- [ ] Paper fold/unfold interaction: letter starts partially folded, tap to unfold full text
- [ ] Below letter: photo grid (2 columns) if creator added photos alongside the letter
- [ ] Each photo has hover/tap scale effect
- [ ] Warm, intimate color palette — cream paper on soft gradient background
- [ ] Floating gentle particles (petals or sparkles)

**Screen 7 — Photos & Videos Chapter (`photos-chapter.tsx`):**
- [ ] Section title: "Our Memories Together 💕" (or custom text)
- [ ] Masonry-style grid layout:
  - Photos arranged in a Pinterest-style masonry grid
  - 2 columns on mobile, 3 on tablet+
  - Each photo: rounded corners, subtle shadow, staggered entrance animation
- [ ] Tap any photo → full-screen lightbox:
  - Photo zooms to fill screen
  - Dark overlay backdrop
  - Swipe or tap to navigate between photos
  - Close button top-right
- [ ] Video embed (if creator added video):
  - Prominent thumbnail with play button overlay
  - Inline playback on tap (not fullscreen by default)
  - Custom video controls styled to match theme
- [ ] Gentle parallax on photos as you scroll within the chapter

**Screen 8 — Poem Chapter (`poem-chapter.tsx`):**
- [ ] Beautiful typographic layout — centered text with generous line-height
- [ ] Background: soft gradient (theme colors, muted)
- [ ] Line-by-line animation: each line fades in from below with slight delay
- [ ] Optional: decorative quotation marks or floral borders
- [ ] Author attribution at bottom: "— {author}" in italic
- [ ] Optional: small illustration or icon matching poem theme
- [ ] Peaceful, contemplative vibe — slower animations than other chapters

**Screen 9 — Memory Timeline Chapter (`timeline-chapter.tsx`):**
- [ ] Vertical timeline with animated line that draws itself downward
- [ ] Cards alternate left/right on desktop, all left on mobile
- [ ] Each card contains:
  - Date badge (top, theme-colored pill)
  - Title (bold)
  - Description text
  - Optional: photo (full-width within card)
- [ ] Cards enter with staggered cascade animation (use Motion `staggerChildren`)
- [ ] Timeline line glows/pulses as it passes each card
- [ ] Top of timeline: heart or star icon. Bottom: continuing line fades out
- [ ] Scroll within the chapter for many timeline entries

**Verification:** All 4 chapters render beautifully. Next/Back navigation works. Keyboard arrows work. Letter typewriter effect works. Photo lightbox works. Poem line animation works. Timeline draws itself.

---

### Phase 2.5 — Screen 10: Gifts & Rewards (The Sub-Experience)
**Goal:** Build the complete Gift chapter — challenge gate, main gift reveal, bonus mini-games, and reward download.

**Gift Chapter Container (`gift-chapter.tsx`):**
- [ ] Manages its own internal sub-screen state (GiftSubScreen)
- [ ] Within click-through mode: renders as a single chapter with internal navigation
- [ ] Within scroll mode: renders all sub-screens stacked

**Screen 10A — Gift Gate / Challenge (`gift-gate.tsx`):**
- [ ] Header: "Here is a special surprise gift for you! 🎁"
- [ ] Subtext: "But first, {challenge instruction}..."
- [ ] Challenge variants (creator's choice):
  - **Password**: Text input field. "Type the secret code to open your gift" → validates against creator-set password. Wrong password = shake animation + "Try again!" hint
  - **Yes/No**: "Are you ready to see your gift?" → [Yes! 😍] proceeds. [Not yet...] = playful "Wrong answer! Try again 💕" with shake/bounce animation
  - **Action**: Custom action button. "Give me a kiss 💋" / "Say the magic words ✨" / "Tap the heart ❤️" → interactive element to complete
- [ ] On success: celebration particles + transition to 10B

**Screen 10B — Main Gift Reveal (`main-gift-reveal.tsx`):**
- [ ] The creator's actual gift — shown as uploaded photos
- [ ] Gift "unwrapping" animation (paper tears away, box opens, etc.)
- [ ] Photos of the physical gift displayed in a beautiful carousel or gallery
- [ ] Creator's short message: "I hope you love this! 💕" (or custom text)
- [ ] Decorations: sparkles, floating hearts, theme-colored particles
- [ ] Premium feel — this is the emotional core of the gift chapter
- [ ] Auto-advance or [Continue] button to 10C

**Screen 10C — Bonus Gifts Introduction (`bonus-intro.tsx`):**
- [ ] Transition text: "But wait, there's more! 🎉" with bounce animation
- [ ] "Here are some more surprises for you!"
- [ ] Shows available attempts: "You have {N} chances to win! 🍀"
- [ ] Mini-game preview: shows which game they'll play (spin wheel icon or card deck icon)
- [ ] [Let's Play!] button to start the mini-game
- [ ] Excitement-building animations — elements bounce in, sparkle

**Screen 10D — Mini-Game (`spin-wheel.tsx` or `lucky-draw.tsx`):**

*Spin Wheel variant:*
- [ ] Custom SVG wheel with configurable colored segments
- [ ] Each segment has: label text, emoji, color
- [ ] Center button: "SPIN!" with pulse animation
- [ ] On spin: wheel rotates with realistic deceleration (Motion `useSpring` with damping)
- [ ] Pointer at top indicates winning segment
- [ ] On land: segment glows, winning celebration with confetti
- [ ] Attempts counter: "Chances remaining: {N}"
- [ ] When attempts exhausted: transition to reward summary

*Lucky Draw variant:*
- [ ] Grid of face-down cards (3×3, configurable)
- [ ] Each card has mystery back design (question mark or themed pattern)
- [ ] Tap to flip — 3D flip animation using CSS perspective transform
- [ ] Reveals the reward item with reveal animation (scale up + glow)
- [ ] Cards that have been picked show their item, others remain hidden
- [ ] Attempts counter: "Picks remaining: {N}"
- [ ] When attempts exhausted: transition to reward summary

**Screen 10E — Reward Result (`reward-result.tsx`):**
- [ ] "Congratulations! 🎉" header with confetti burst
- [ ] Won item displayed prominently: emoji + label + description
- [ ] Celebratory animation: item scales up with glow, particles around it
- [ ] "Download Your Reward" button → generates reward ticket
- [ ] `reward-ticket.tsx`: Canvas-rendered ticket with:
  - Item emoji and name
  - Recipient name
  - Date
  - "Won on Wishire" branding
  - Decorative border
  - Download as JPG via Canvas API → `download()` trigger
- [ ] If more attempts remain: [Spin Again] / [Pick Another] button
- [ ] If all attempts used: [Continue →] to close the gift chapter

**Verification:** Gift gate challenge works for all 3 types. Main gift photos display beautifully. Spin wheel spins with realistic physics. Lucky draw cards flip with 3D animation. Reward ticket downloads as JPG. Attempt counter works correctly.

---

### Phase 2.6 — Screen 11: Closing + Scroll/Interactive Modes
**Goal:** Build the closing screen, the scroll mode, and the interactive mode.

**Screen 11 — Closing (`closing-screen.tsx`):**
- [ ] Warm gradient background (theme colors, soft)
- [ ] Floating heart/sparkle particles
- [ ] Central content with staggered entrance:
  - "Thank you for being part of this special moment. 💜" — main message
  - "Made with love by **Wishire**" — branding with subtle breathing scale animation
  - Divider line or decorative flourish
- [ ] Two CTA buttons:
  - [✨ Experience Again] — gradient button, restarts from Screen 1
  - [🎁 Create Your Own Wish] — outline button, links to Wishire homepage
- [ ] Both buttons have hover glow effect
- [ ] Background music fades out gently

**Scroll Mode (`scroll-mode.tsx`):**
- [ ] All 5 chapters rendered as full-width sections stacked vertically
- [ ] Screen 5 (Gift Opening) transitions into a continuous scroll
- [ ] Each section enters viewport with scroll-triggered animations:
  - Use Motion's `useInView` + `useAnimate` pattern
  - Fade in + slide up as each section crosses viewport threshold
- [ ] Sticky progress bar at top (thin, theme-colored, updates with scroll position)
- [ ] Background transitions between sections (subtle gradient shifts using `scroll()` API)
- [ ] Decorative dividers between sections (sparkle lines, flourish SVGs)
- [ ] Gift chapter renders all sub-screens (10A-10E) stacked inline
- [ ] Closing section at the very bottom
- [ ] Design direction: "long-form editorial" — like Apple's product pages

**Interactive Mode (`interactive-mode.tsx`):**
- [ ] After Screen 5, materials settle on a canvas/grid layout
- [ ] 5 material items displayed as themed objects:
  - Each is a beautifully styled card/object representing its chapter
  - Label underneath: "Letter", "Photos", "Poem", "Memories", "Gift"
- [ ] Tap a material → zoom/scale animation → chapter content fills screen
- [ ] Back/close button (X or ←) returns to materials view
- [ ] Opened materials get a checkmark/badge and golden glow
- [ ] Materials can be opened in any order
- [ ] After all 5 opened: auto-transition to Closing
- [ ] Subtle pulse animation on unopened materials to guide the eye

**Verification:** Closing screen looks premium. Both buttons work. Scroll mode: all chapters visible, animations trigger on scroll. Interactive mode: materials display, tapping opens chapters, tracking works.

---

### Phase 2.7 — Polish, Templates & End-to-End Integration
**Goal:** Wire everything into templates, add polish, and ensure the complete experience works flawlessly.

**Deliverables:**
- [ ] Update `birthday-classic.json` with all 11 screens configured
- [ ] Create `anniversary-elegant.json` template
- [ ] Confetti presets library (`src/lib/confetti-presets.ts`):
  - `introductionBurst()` — subtle sparkle
  - `unlockBurst()` — key/lock themed
  - `giftOpeningBurst()` — massive celebration
  - `rewardBurst()` — winning moment
  - `closingBurst()` — gentle farewell
- [ ] Music integration polish:
  - Starts Screen 4 (Gift Reveal) on first interaction
  - Volume: 30% at start, 60% at Gift Opening, 100% at chapters
  - Fade out at Closing
  - Pause/resume toggle throughout
- [ ] Accessibility:
  - ARIA labels on all interactive elements
  - Keyboard navigation: Tab through interactive elements, Enter to activate
  - `prefers-reduced-motion`: skip confetti, reduce animation durations, no parallax
  - Screen reader: announce phase transitions with `aria-live` regions
- [ ] Performance:
  - Lazy load chapter content not yet needed
  - No layout shifts during animations (use `layout` prop from Motion)
  - 60fps on mid-range mobile devices
  - Optimize image loading: blur-up placeholders for photos
- [ ] Mobile-specific polish:
  - Touch feedback (scale down on press for all buttons)
  - Safe area insets for notched phones
  - Prevent overscroll bounce on iOS
  - Optimize for both portrait and landscape
- [ ] Update `PROJECT-STATUS.md` and memory files
- [ ] Full E2E testing:
  - Birthday click-through: complete flow
  - Anniversary click-through: complete flow
  - Birthday scroll mode: complete flow
  - Birthday interactive mode: complete flow
  - Edge cases: no photos, no poem, no timeline, no bonus gifts

---

## Dependency Graph

```
Phase 2.1 (Skeleton) ──────────────────────────────────────┐
       │                                                    │
       ├── Phase 2.2 (Introduction + Unlock)                │
       │                                                    │
       ├── Phase 2.3 (Start + Gift Reveal + Opening)        │
       │                                                    │
       └── Phase 2.4 (Chapters: Letter/Photos/Poem/Timeline)│
              │                                             │
              └── Phase 2.5 (Gifts & Rewards sub-experience)│
                     │                                      │
                     ├── Phase 2.6 (Closing + Scroll + Interactive)
                     │                                      │
                     └── Phase 2.7 (Polish & Integration) ──┘
```

---

## Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Browser audio autoplay | Music won't auto-start | Start on first user interaction (Screen 2 unlock or Screen 4 tap). Existing MusicPlayer handles this. |
| Mobile performance | Jank on low-end phones | `canvas-confetti` is hardware-accelerated. Limit particles on mobile. Respect `prefers-reduced-motion`. |
| Spin wheel physics | Feels fake or janky | Use Motion's `useSpring` with realistic damping. Random initial velocity. Tested on mobile. |
| Ticket download | Canvas API varies | Use simple canvas rendering. Fallback: show ticket on screen without download. |
| 11 screens = heavy bundle | Slow initial load | Lazy load screen components with `React.lazy()`. Only load what's needed for current phase. |
| Gift chapter sub-screens | Nested state feels complex | Keep sub-screen state local to GiftSubScreen component, not in the global experience state. |
| Scroll mode performance | Lots of DOM at once | Use `useInView` with `once: true` for animations. Don't render off-screen content until needed. |
| Interactive mode | Users confused about what to tap | Pulse animation on unopened materials. "Tap to open" tooltip. Glow tracking for opened items. |

---

## Key Library Usage

| Library | Where Used | API |
|---------|-----------|-----|
| `motion/react` | All animations | `AnimatePresence`, `motion.div`, `useSpring`, `useInView`, `useAnimate`, `useDragControls`, `useMotionValue` |
| `canvas-confetti` | Gift opening, reward reveals | `confetti()`, `shapeFromText()` for emoji confetti, custom burst presets |
| Canvas API | Reward ticket download | `document.createElement('canvas')`, `drawImage`, `toDataURL`, `download()` |
| CSS 3D Transforms | Gate lock, card flips | `perspective`, `rotateX/Y`, `transform-style: preserve-3d` |

---

## Critical Files to Modify/Create

**Modify:**
- `src/app/w/[slug]/page.tsx` — Server entry (new props)
- `src/types/wish.ts` — FlowMode + WishSettings
- `src/types/template.ts` — StageType union
- `src/lib/wish-merge.ts` — Merge logic
- `src/templates/birthday/classic.json` — Template structure

**Create (key files only):**
- `src/types/experience.ts` — All experience types
- `src/lib/experience-state.ts` — State machine
- `src/components/wish/experience-orchestrator.tsx` — Main orchestrator
- `src/components/wish/screens/introduction-screen.tsx` — Screen 1
- `src/components/wish/screens/unlock-screen.tsx` — Screen 2
- `src/components/wish/screens/start-screen.tsx` — Screen 3
- `src/components/wish/screens/gift-reveal-screen.tsx` — Screen 4
- `src/components/wish/screens/gift-opening-screen.tsx` — Screen 5
- `src/components/wish/screens/closing-screen.tsx` — Screen 11
- `src/components/wish/chapters/letter-chapter.tsx` — Screen 6
- `src/components/wish/chapters/photos-chapter.tsx` — Screen 7
- `src/components/wish/chapters/poem-chapter.tsx` — Screen 8
- `src/components/wish/chapters/timeline-chapter.tsx` — Screen 9
- `src/components/wish/chapters/gift-chapter.tsx` — Screen 10
- `src/components/wish/modes/click-through.tsx` — Navigation container
- `src/components/wish/modes/scroll-mode.tsx` — Scroll container
- `src/components/wish/modes/interactive-mode.tsx` — Materials container
- `src/components/wish/gift/spin-wheel.tsx` — Spin wheel
- `src/components/wish/gift/lucky-draw.tsx` — Lucky draw cards
- `src/components/wish/gift/reward-ticket.tsx` — Downloadable ticket
- `src/components/wish/gate/padlock.tsx` — Padlock variant
- `src/components/wish/gate/ribbon-cut.tsx` — Ribbon variant
- `src/lib/confetti-presets.ts` — Confetti configurations
