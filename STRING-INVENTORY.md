# Wishire — Static vs Dynamic String Inventory (Task 1.1)

**Created:** 2026-10-20 (Wave 1, task 1.1)
**Scope:** recipient-facing wish flow — `src/components/wish/**`, `src/app/w/**`, plus `src/lib/rewards-shared.ts` + `src/lib/reward-ticket.ts` (gift-chapter copy used by verify page + PNG tickets).
**Out of scope:** creator-facing UI (`src/config/templates.ts`, `occasions.ts`, `plans.ts`, dashboard/auth) — English until post-Wave-4 backlog per task 0.2.

## Classification

| Class | Meaning | Destination in task 1.2 |
|---|---|---|
| **S** | Static — hard-coded English, same for every viewer | `copy.ts` value |
| **F** | Frame — static sentence with a dynamic slot (`{name}`, `{n}`) | `copy.ts` template; slot stays in code |
| **D** | Dynamic — creator input / DB / derived from data | never in dictionary |
| **A** | A11y — `aria-label` / `alt` | `copy.ts` too (screen readers read them) |
| **P** | Dev placeholder — Phase 2.1/2.6 skeleton copy, will be replaced | defer; exclude from dictionary until real |

Duplicate flag **⧉** = same/similar string appears in multiple files — dictionary key should be shared.

---

## 1. Route shell — `src/app/w/[slug]/`

| String | Class | File:Line |
|---|---|---|
| `Unwrapping your surprise...` | S | loading.tsx:13 |
| `A little hiccup` | S | error.tsx:143 |
| `Something went wrong` | S | error.tsx:161 |
| `We couldn't load this wish. It might have been removed or the link may be incorrect.` | S | error.tsx:165 |
| `Try again` | S | error.tsx:176 |
| `Reload page` | S | error.tsx:183 |
| `Wish not found` (metadata title) | S | page.tsx:21 |

## 2. Verify page — `src/app/w/[slug]/verify/[token]/page.tsx`

| String | Class | File:Line |
|---|---|---|
| `Verify Reward Proof — Wishire` (metadata) | S | :12 |
| `Proof of reward` | S | :119 |
| `Authentic prize ticket` / `Ticket could not be verified` | S | :131 |
| `This ticket was issued by Wishire and matches the official record.` | S | :137 |
| `Won on` | S | :160 |
| `Serial` | S | :166 |
| `For` | S | :174 |
| `Signature verified · record stored on Wishire` | S | :185 |
| `The signature on this ticket does not match the official record. It may have been altered. Contact the sender if you think this is a mistake.` | S | :190 |
| serial / date / recipient name values | D | — |

## 3. Orchestrator & shared wrappers

| String | Class | File:Line |
|---|---|---|
| `Are you ready to see your surprise? 💕` (default yes-no gate prompt) | S | experience-orchestrator.tsx:75 |
| `Tap to reveal your surprise! 🎁` (default tap gate prompt) | S | experience-orchestrator.tsx:77 |
| `Tap to open your gift! 🎁` (default gift gate) | S | gift-chapter.tsx:136 |
| `This stage is coming soon` | P | wish-experience.tsx:338 |
| `Skip →` | S | wish-experience.tsx:350 |
| `Back` | S | navigation-controls.tsx:50 |
| `Finish 🎉` / `Next` | S | navigation-controls.tsx:63 |
| `Tap to reveal ✨` (default hint) | S | reveal-wrapper.tsx:21 |
| `Tap to read the poem ✨` | ⧉ S | main-content-stage.tsx:70 |
| `Tap to see photos 📸` | ⧉ S | main-content-stage.tsx:83 |
| `Tap to open the letter ✉️` | ⧉ S | main-content-stage.tsx:208 |
| `Mute music` / `Play music` (aria) | A | music-player.tsx:98 |
| `Character` (default alt) | A | character-gif.tsx:18 |
| decorations.tsx | — | no user-facing strings (emoji only) |

## 4. Screens — `src/components/wish/screens/`

### start-screen.tsx

| String | Class | File:Line |
|---|---|---|
| `Hey ` + `{recipientName}!` | F | :112 |
| `{senderName} prepared a birthday cake for you. Light the candles and start celebrating your birthday!` | F ⚠ | :148 — hard-codes **birthday** for all occasions; review in 0.3 |
| `Tap the candles to light them. ({lit}/{count})` | F | :519 |
| `🎉 Happy Birthday!` | ⚠ S | :534 — candles success; birthday-only in practice but shown regardless of occasion |
| `Get ready for your surprise...` | ⧉ S | :540 |
| `Yes, I'm ready! 😍` | S | :596 |
| `Not yet...` | S | :611 |
| `Wrong answer! Try again 💕` | ⧉ S | :622 (also gift-chapter.tsx:960) |
| `Type the secret code to continue` | S | :662 |
| `Enter code...` (placeholder) | ⧉ S | :674 (also gift-chapter.tsx:891) |
| `Unlock ✨` | ⧉ S | :694 (also gift-chapter.tsx:904) |
| `Wrong code — try again!` | S | :704 (variant `Wrong code!` in gift-chapter:908) |
| `Let's go! 🎉` | S | :748 |
| gate prompt / password answer | D | creator `StartAction` |

### introduction-screen.tsx

| String | Class | File:Line |
|---|---|---|
| Occasion labels: `Birthday`, `Anniversary`, `Valentine's Day`, `Wedding`, `Graduation`, `Friendship`, `Thank You`, `Special Moment` | S | :28–110 (occasion-keyed config) |
| Occasion `celebrationText`: `your birthday`, `your anniversary`, `Valentine's Day`, `your special day`, `your graduation`, `our friendship`, `this special moment` | S | :29–110 |
| Occasion descriptions (8 long sentences, e.g. `Someone who cares about you deeply wanted to take a moment to celebrate the day you were born — and everything you bring to the world.`) | S | :31–112 |
| `Hey {recipientName}!` | F | :364 |
| `Someone made something special just for you.` | S | :372 |
| `{senderName} prepared a special surprise for you to celebrate {celebrationText}.` | F | :403–408 |
| `Cut the ribbon to unwrap your surprise` / `Opening your surprise...` | S | :682–683 |
| `Cut the ribbon to open your surprise` (aria) | A | :635 |
| `Wishire` (alt) | A | :288 |

### unlock-screen.tsx + screen-placeholder.tsx

| String | Class | File:Line |
|---|---|---|
| `Tap to unlock` / `Cut the ribbon` / `Break the seal` / `Break the chain` (gate hints) | S | unlock-screen.tsx:14–17 |
| `Surprise Unlock` (screen name) | S | unlock-screen.tsx:41 |
| `Screen {n}` | F | screen-placeholder.tsx:49 |
| `← Back` | S | screen-placeholder.tsx:89 |
| `Next →` | ⧉ S | screen-placeholder.tsx:104 |
| name / subtitle props of placeholder | P | only unlock-screen consumes today |

### gift-reveal-screen.tsx

| String | Class | File:Line |
|---|---|---|
| `Something special awaits...` | S | :60 |
| `Tap to open 💝` | S | :192 |
| `Open the gift` (aria) | ⧉ A | :69 (also gift-opening-screen:373) |

### gift-opening-screen.tsx

| String | Class | File:Line |
|---|---|---|
| Per-occasion `heading` ×8: `A Birthday Gift, Just for You`, `A Gift of Love`, `A Little Token of Love`, `A Gift for Your Special Day`, `A Gift for Your Achievement`, `A Gift from the Heart`, `A Gift of Gratitude`, `A Gift, Made with Love` | S | :29–129 |
| Per-occasion `description` ×8 (long sentences) | S | :31–131 |
| Per-occasion `openPrompt` ×8: `Tap to unwrap your gift`, `Tap to open your gift` ⧉, `Tap to receive your gift` | S | :32–132 |
| Material labels (~45): `A Letter`, `A Song`, `A Wish`, `A Poem`, `Our Story`, `Memories`, `Photos`, `A Promise`, `A Rose`, `A Love Note`, `A Heart`, `A Hug`, `Roses`, `A Toast`, `Blessings`, `Cheers`, `A Note`, `Pride`, `Wisdom`, `Gratitude`, `Warmth`, … | S | :34–139 (emoji + label pairs) |
| `You've received a gift` | S | :344 |
| `Tap to open` | ⧉ S | :797 (also photos-chapter:377) |
| `from` (gift tag) | S | :737 |
| `Here are gifts for you!` | S | :857 |
| `See the gifts →` | S | :897 |
| `Open the gift` (aria) | ⧉ A | :373 |
| senderName | D | :747 |

### closing-screen.tsx

| String | Class | File:Line |
|---|---|---|
| Finale headlines (occasion-keyed, name-optional): `Happy Birthday, {n}!`/`Happy Birthday!`, `Congratulations!`, `So Proud of You, {n}!`, `With All My Love, {n}`/`With All My Love`, `Cheers to You, {n}!`, `Lucky to Know You, {n}!`/`Lucky to Have You`, `Thank You, {n}!`/`Thank You!`, `With Love, {n}`/`With Love` | F | :22–35 |
| `Thank you for being part of this beautiful journey. Every chapter was written with love — just for you. May all your wishes come true!` | S | :215 |
| `The End` | S | :234 |
| `With love from ` + `{senderName}` | F | :245 |
| `Made with love by ` + `Wishire` | F | :252 |
| `✨ Experience Again` | S | :279 |
| `🎁 Create Your Own Wish` | S | :292 |

## 5. Stages — `src/components/wish/stages/`

| String | Class | File:Line |
|---|---|---|
| `You've got a special surprise!` (default prompt) | S | envelope-stage.tsx:22 |
| `Tap the envelope to open` | S | envelope-stage.tsx:209 |
| `Open envelope` (aria) | ⧉ A | envelope-stage.tsx:70 |
| `Tap to unwrap` | S | gift-box-stage.tsx:218 |
| `Open gift box` (aria) | A | gift-box-stage.tsx:50 |
| `Make a wish! 🎂` | S | cake-stage.tsx:238 |
| `Happy Birthday! 🎉` | ⚠ S | cake-stage.tsx:262 — birthday string, all occasions |
| `Blow out candle {i}` / `Candle {i} blown out` (aria) | F | cake-stage.tsx:119 |
| `Continue` | ⧉ S | main-content-stage.tsx:107, memory-timeline-stage.tsx:131, fancy-facts-stage.tsx:183, gift-chapter.tsx:2445 |
| `Fold letter` / `Open letter` | S | main-content-stage.tsx:189,196 |
| `Our Story` (eyebrow default) | ⧉ S | memory-timeline-stage.tsx:62 |
| `Every moment with you is a beautiful chapter in our story.` | ⧉ S | memory-timeline-stage.tsx:65 (variant `...in my life story.` timeline-chapter.tsx:65) |
| Fancy-facts sample set: eyebrow `Fun facts, lucky charms, and birthday magic` + 6 facts (`category`/`title`/`detail`: Zodiac, Birthstone, Birth Flower, Fun Fact, Lucky Color, Birthday Wish) | S ⚠ | fancy-facts-stage.tsx:17–101 — birthday-specific demo content |
| `With love ❤️` | S | closing-stage.tsx:83 |

## 6. Chapters — `src/components/wish/chapters/`

### letter-chapter.tsx

| String | Class | File:Line |
|---|---|---|
| `No letter yet` | S (empty state) | :44 |
| `Open the letter` | S | :446 |
| `Fold back` | S | :478 |
| `Just for You` | ⧉ S | :643 (variant `Just for You ✨` gift-chapter:1354) |
| `Open envelope to read letter` (aria) | A | :82 |
| letter body | D | creator input |

### photos-chapter.tsx

| String | Class | File:Line |
|---|---|---|
| `Chapter 02` | S ⚠ | :228 — hard-coded chapter number |
| `Our Memories` | ⧉ S | :238, :326, :641 |
| `A little collection of moments I never want to forget.` | S | :244 |
| `A collection of ` + `{n}` | F | :316, :1420 |
| `A STORY WORTH KEEPING` | S | :334 |
| `Tap to open` | ⧉ S | :377 |
| `Click sides or use arrow keys` | S | :595 |
| `Swipe or tap the sides to flip` | S | :611 |
| `Previous` / `Next` | ⧉ S | :633, :658 |
| `Close album` | S | :681 |
| `Moving Memory` | S | :701 |
| `A Moment That Came Alive` | S | :710 |
| `one of those moments worth keeping` | S | :743 |
| `The beginning` / `Memory {n}` | F | :928, :933 |
| `More memories to come...` | S | :978 |
| `Opening your memories` | S | :1473 |
| `More memories...` | S | :1511 |
| `Open memory album` / `Previous page` / `Next page` (aria) | A | :263, :546, :553 |
| `Memory {n}` (alt on full-size photos) | F | :820, :1030 — **added by 0.3 review** |
| photo URLs / captions | D | creator media |

### poem-chapter.tsx

| String | Class | File:Line |
|---|---|---|
| `No poem yet` | S (empty state) | :32 |
| poem title / author / text | D | creator/library selection |

### song-chapter.tsx

| String | Class | File:Line |
|---|---|---|
| `The Turntable is Waiting` | S | :337 |
| `No melody has been placed on the record yet — but the rest of your surprise is waiting just ahead.` | S | :358 |
| `A Song, Just for You` | S | :507 |
| `Now Playing` | S | :537 |
| `A song picked for you` (fallback title) | S | :547, :602 |
| `Play {title \|\| "the song picked for you"}` (aria) | F | :613 |
| `▶ Tap to play` | S | :679 |
| `Pause the song` / `Play the song` (aria) | A | :696 |
| `Playing` / `Paused` / `Buffering…` / `Replay` | S | :721–727 |
| `Watch on YouTube` | S | :761 |
| song title / artist / URL | D | creator `SongSelection` |

### timeline-chapter.tsx

| String | Class | File:Line |
|---|---|---|
| `No memories yet` | S (empty state) | :44 |
| `Our Story` (default chapterLabel) | ⧉ S | :33 |
| `Memory` (titleLead) + `Timeline` (titleAccent) — two-tone "Memory Timeline" heading | S | timeline-chapter.tsx:62–63, memory-timeline-stage.tsx:63–64 — **added by 0.3 review** (rendered via `TimelineHeader`, timeline-visuals.tsx:124) |
| `Every moment with you is a beautiful chapter in my life story.` | ⧉ S | :65 |
| timeline entry date/title/description | D | creator `MemoryTimelineEntry[]` |

### gift-chapter.tsx

| String | Class | File:Line |
|---|---|---|
| `Here is a special surprise gift for you!` | S | :159 |
| `Hint` | S | :266 |
| `Wrong PIN! Try again 💔` | S | :366 |
| `The answer is ` / `correct!` | S | :634, :766 |
| `Unlocked!` | S | :840 |
| `Your gift is waiting…` | S | :851 |
| `Enter code...` (placeholder) | ⧉ S | :891 |
| `Unlock ✨` | ⧉ S | :904 |
| `Wrong code!` | ⧉ S | :908 |
| `Yes! 😍` | S | :939 |
| `No...` | S | :950 |
| `Wrong answer! Try again 💕` | ⧉ S | :960 |
| `Just for You ✨` | ⧉ S | :1354 |
| `{continuing ? "Opening..." : "Continue →"}` | S | :1386 |
| `Bonus round` | S | :1551 |
| `But wait, there's more!` | S | :1572 |
| `Here are some more surprises for you!` | S | :1583 |
| `You have {n} chance(s) to win!` / `All chances used — your prizes await!` | F/S | :1600–1601 |
| `Something went wrong — try again` (fallback) | S | :1775 |
| `Network error — check your connection and try again` | S | :1828 |
| `Spin` / `Spinning…` / `SPIN!` | S | :1975, :2034, :2041 |
| `{remaining} chance(s) left` (attempts chip) | F | :1858 — **added by 0.3 review** |
| `No chances left` | S | :2037 |
| `You won!` | S | :2106 |
| `Download proof ticket` | S | :2147 |
| `See my rewards` | S | :2172 |
| `Download PNG` | S | :2291 |
| `No.` (serial prefix) | S | :2321 |
| `Scan QR to verify` | S | :2333 |
| `Redeemed` | S | :2353 |
| `Prize Booth` | S | :2397 |
| `All your prizes are redeemed!` | S | :2405 |
| `You won {n} prize(s)! Download your proof tickets and send them to claim your rewards.` | F | :2404 — **added by 0.3 review** |
| `Digit {i+1}: filled` / `Digit {i+1}: empty` (aria) | F | :295 — **added by 0.3 review** |
| `Continue` | ⧉ S | :2445 |
| `PIN challenge` / `PIN entry display` / `Numeric keypad` / `Digit {n}` / `Backspace` / `PIN correct` (aria) | A | :252–452 |
| `Your special gift` (alt) | A | :1268 |
| PIN / hint / password answer / mainGiftMessage / reward items | D | creator config |

### modes/ — click-through, scroll, interactive

| String | Class | File:Line |
|---|---|---|
| `Finish →` / `Next →` | S | click-through.tsx:190 |
| `Chapter 05` (timeline label) | S ⚠ | click-through.tsx:137 — hard-coded chapter number |
| `Scroll Mode` / `Continuous scroll with all chapters visible.` / `Coming in Phase 2.6.` | P | scroll-mode.tsx:31–36 |
| `Skip to Closing →` | P ⧉ | scroll-mode.tsx:45, interactive-mode.tsx:62 |
| `Interactive Mode` / `Tap materials to open each chapter.` / `Coming in Phase 2.6.` | P | interactive-mode.tsx:31–36 |

## 7. Lib (gift rewards)

### `src/lib/rewards-shared.ts` — default prize pool

| String | Class | File:Line |
|---|---|---|
| Labels ×8: `Love Note`, `Flowers`, `Chocolate`, `Warm Hug`, `Sweet Song`, `Star Gift`, `Lucky Cat`, `Golden Star` | S | :10–17 |
| Descriptions ×8: `A sweet note`, `Virtual flowers`, `Sweet treat`, `Extra warm hug`, `A song for you`, `Special prize`, `Lucky companion`, `Rarest prize` | S | :10–17 |

⚠ Server-shared (client **and** server import this) — `copy.ts` must stay import-safe (no `"use client"` dependency).

### `src/lib/reward-ticket.ts` — PNG canvas renderer

| String | Class | File:Line |
|---|---|---|
| `PRIZE TICKET` | S | :97 |
| `WISHIRE · PROOF OF REWARD` | S | :100 |
| `{n} BONUS POINTS` | F | :119 |
| `No. {serial}` | F | :135 |
| `Won on {date}` | F | :141 |
| `Send this ticket to your wish sender to claim your prize.` | S | :141 |
| `SCAN TO VERIFY` | S | :177 |

⚠ Canvas `fillText` — Myanmar text here needs font loaded first (task 1.4 registers Padauk).

## 8. Server API errors that surface in the recipient UI — **added by 0.3 review**

Not in any component file — these strings travel API → client and render raw in `spinError` (gift-chapter.tsx:1775 `setSpinError(data.error ?? ...)`).

| String | Class | File:Line |
|---|---|---|
| `No attempts left` | S | api/w/[slug]/spin/route.ts:72 — **recipient-seen** when attempts exhausted |
| `Invalid JSON body` | S | spin/route.ts:40 — fallback-shown |
| `Invalid playerId` | ⧉ S | spin/route.ts:45, rewards/route.ts:24 — fallback-shown |
| `Wish not found` | ⧉ S | spin/route.ts:53, rewards/route.ts:32 — fallback-shown |
| `No prizes configured` | S | spin/route.ts:80 — fallback-shown |

⚠ **Decision needed for 1.2:** localize client-side (map known server error codes → dictionary strings) OR keep server messages English and only translate the ones the client re-maps. Server must stay import-safe for `copy.ts` (same constraint as rewards-shared.ts).

---

## Summary counts (approx.)

| Class | Count | Notes |
|---|---|---|
| S (static) | ~156 | dictionary candidates (incl. 5 server errors from §8) |
| F (frame) | ~34 | templates with slots |
| A (a11y) | ~25 | also translate |
| P (placeholder) | ~10 | defer (Phase 2.6 skeleton) |
| D (dynamic) | — | never in dictionary |

## Flags for task 0.3 (fresh-eyes review)

**Status: reviewed 2026-10-20.** New strings found during review marked **added by 0.3 review** inline above (gift-chapter ×3, timeline title ×2 files, photos alt, server API section §8).

1. **Birthday hard-coding in shared paths** — start-screen:148 greeting, cake-stage:262 `Happy Birthday! 🎉`, fancy-facts sample set are birthday copy shown for every occasion (fancy-facts confirmed live — wish-experience.tsx:299 renders stage type `fancy-facts`). Either occasion-key them in `copy.ts` or confirm product intent.
2. **Server errors reach recipients untranslated** — spin/rewards API `error` strings render raw in `spinError` (new §8). 1.2 must decide client-side remap vs accepting English.
3. **Duplicated copy** — `Wrong answer! Try again 💕`, `Enter code...`, `Unlock ✨`, `Our Memories`, `Continue`, `Tap to open`, aria `Open the gift` each live in 2+ files → single shared keys in 1.2.
4. **Near-duplicate subtitles** — timeline subtitle differs by one word (`our story` vs `my life story`); decide one or keep both keyed.
5. **Hard-coded chapter numbers** — `Chapter 02` (photos), `Chapter 05` (click-through→timeline) will desync if chapters reorder.
6. **Verified clean** — occasion configs complete (introduction 6+default, gift-opening 6+fallback, matches `Occasion` type); `classic.json` template, decorations, timeline-visuals, stage-container, page.tsx metadata carry no recipient copy. Classification spot-checks (frames, defaults, prize pool) confirmed correct.

## Method notes (reproduce for 0.3)

- `rg -U -o '>\s*[A-Za-z"]...<'` multi-line JSX text nodes
- `rg` quoted strings (double-quote pass allows apostrophes; single-quote pass; backtick pass)
- copy props: `placeholder|aria-label|alt|title|label|hint|subtitle|heading|message`
- single-word ternary/conditional strings: `? "Word"` / `: "Word"`
- manual reads: start-screen, gift-chapter, closing-screen, introduction-screen, gift-opening config
