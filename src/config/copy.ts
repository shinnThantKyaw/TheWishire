/**
 * copy.ts — single dictionary of recipient-facing UI strings (Wave 1, task 1.2).
 *
 * English values first; Myanmar translation (task 1.5) swaps values only.
 * Plain data + one helper — import-safe from server components, canvas
 * renderers, and API-side code (no "use client", no React).
 *
 * Frame strings use `{slot}` placeholders — see `interpolate`.
 * Plural-sensitive strings ship as explicit *One/*Many pairs rather than a
 * plural function, so translators see whole sentences.
 */

/** Replace `{slot}` placeholders in a copy template. Unknown slots stay as-is. */
export const interpolate = (
  template: string,
  vars: Record<string, string | number>,
): string => template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));

export interface OccasionCopyConfig {
  emoji: string;
  label: string;
  celebrationText: string;
  description: string;
}

export interface GiftOpeningCopy {
  heading: string;
  subheading: string;
  openPrompt: string;
  contents: Array<{ emoji: string; label: string }>;
}

export const copy = {
  /** Short labels shared across components — dedupe targets. */
  common: {
    continue: "Continue",
    continueArrow: "Continue →",
    nextArrow: "Next →",
    tapToOpen: "Tap to open",
    wrongAnswer: "Wrong answer! Try again 💕",
    enterCode: "Enter code...",
    unlock: "Unlock ✨",
    wishire: "Wishire",
  },

  /** `src/app/w/[slug]` route shell. */
  route: {
    loading: "Unwrapping your surprise...",
    notFoundTitle: "Wish not found",
    metaTitle: "{title} — from {sender} to {recipient}",
    metaDescription: "{sender} made you a special surprise!",
    error: {
      hiccup: "A little hiccup",
      wentWrong: "Something went wrong",
      body: "We couldn't load this wish. It might have been removed or the link may be incorrect.",
      tryAgain: "Try again",
      reload: "Reload page",
    },
  },

  /** Public verify page (`/w/[slug]/verify/[token]`). */
  verify: {
    metaTitle: "Verify Reward Proof — Wishire",
    heading: "Proof of reward",
    authentic: "Authentic prize ticket",
    unverified: "Ticket could not be verified",
    issuedNote: "This ticket was issued by Wishire and matches the official record.",
    wonOn: "Won on",
    serial: "Serial",
    forLabel: "For",
    forValue: "{recipient} — “{title}” from {sender}",
    signatureOk: "Signature verified · record stored on Wishire",
    signatureFail:
      "The signature on this ticket does not match the official record. It may have been altered. Contact the sender if you think this is a mistake.",
  },

  /** Default gate prompts when creator set no custom one. */
  gateDefaults: {
    yesNo: "Are you ready to see your surprise? 💕",
    tap: "Tap to reveal your surprise! 🎁",
    gift: "Tap to open your gift! 🎁",
  },

  experience: {
    stageComingSoon: "This stage is coming soon",
    skip: "Skip →",
  },

  navigation: {
    back: "Back",
    next: "Next",
    finish: "Finish 🎉",
  },

  /** RevealWrapper tap hints. */
  reveal: {
    default: "Tap to reveal ✨",
    poem: "Tap to read the poem ✨",
    photos: "Tap to see photos 📸",
    letter: "Tap to open the letter ✉️",
  },

  music: {
    mute: "Mute music",
    play: "Play music",
  },

  characterGif: {
    defaultAlt: "Character",
  },

  /** Screen 3 — Surprise Start / Are You Ready. */
  start: {
    hey: "Hey",
    birthdayGreeting:
      "{senderName} prepared a birthday cake for you. Light the candles and start celebrating your birthday!",
    candlesGuide: "Tap the candles to light them. ({lit}/{count})",
    candlesSuccess: "🎉 Happy Birthday!",
    getReady: "Get ready for your surprise...",
    yesButton: "Yes, I'm ready! 😍",
    notYet: "Not yet...",
    secretCode: "Type the secret code to continue",
    letsGo: "Let's go! 🎉",
    wrongCode: "Wrong code — try again!",
  },

  /** Screen 1 — Introduction (occasion-keyed config + fixed copy). */
  introduction: {
    hey: "Hey {recipientName}!",
    subtitle: "Someone made something special just for you.",
    senderLine: "{senderName} prepared a special surprise for you to celebrate {celebrationText}.",
    cutRibbon: "Cut the ribbon to unwrap your surprise",
    opening: "Opening your surprise...",
    cutRibbonAria: "Cut the ribbon to open your surprise",
    logoAlt: "Wishire",
    occasions: {
      birthday: {
        emoji: "🎂",
        label: "Birthday",
        celebrationText: "your birthday",
        description:
          "Someone who cares about you deeply wanted to take a moment to celebrate the day you were born — and everything you bring to the world.",
      },
      anniversary: {
        emoji: "💕",
        label: "Anniversary",
        celebrationText: "your anniversary",
        description:
          "Love is worth celebrating, and someone wanted to remind you just how much this journey together means to them.",
      },
      valentine: {
        emoji: "❤️",
        label: "Valentine's Day",
        celebrationText: "Valentine's Day",
        description:
          "In a world full of people, someone chose to write their feelings just for you. This is a little token of love, made with heart.",
      },
      wedding: {
        emoji: "💍",
        label: "Wedding",
        celebrationText: "your special day",
        description:
          "Two hearts, one beautiful journey. Someone wanted to celebrate this incredible milestone with a personal touch.",
      },
      graduation: {
        emoji: "🎓",
        label: "Graduation",
        celebrationText: "your graduation",
        description:
          "All those late nights, hard work, and determination have paid off. Someone is incredibly proud of you and wanted you to know.",
      },
      friendship: {
        emoji: "🤝",
        label: "Friendship",
        celebrationText: "our friendship",
        description:
          "True friends are rare and precious. Someone wanted to take a moment to say thank you for being exactly who you are.",
      },
      "thank-you": {
        emoji: "💌",
        label: "Thank You",
        celebrationText: "this special moment",
        description:
          "Gratitude is one of the most beautiful feelings, and someone wanted to express theirs in a way that words alone can't capture.",
      },
      fallback: {
        emoji: "🎁",
        label: "Special Moment",
        celebrationText: "this special moment",
        description:
          "Someone wanted to create a little moment of joy, just for you. Take your time and enjoy what comes next.",
      },
    } satisfies Record<string, OccasionCopyConfig>,
    quote:
      "The best things in life are the people you love, the places you’ve been, and the memories you’ve made along the way.",
  },

  /** Screen 2 — Surprise Unlock. */
  unlock: {
    screenName: "Surprise Unlock",
    gates: {
      padlock: { emoji: "🔒", hint: "Tap to unlock" },
      ribbon: { emoji: "🎀", hint: "Cut the ribbon" },
      "wax-seal": { emoji: "🔮", hint: "Break the seal" },
      chain: { emoji: "⛓️", hint: "Break the chain" },
    },
  },

  screenPlaceholder: {
    screen: "Screen {n}",
    back: "← Back",
  },

  giftReveal: {
    teaser: "Something special awaits...",
    tapToOpen: "Tap to open 💝",
    openAria: "Open the gift",
  },

  /** Screen 4 — Gift Opening (occasion-keyed box copy). */
  giftOpening: {
    received: "You've received a gift",
    fromTag: "from",
    giftsForYou: "Here are gifts for you!",
    seeGifts: "See the gifts →",
    openAria: "Open the gift",
    occasions: {
      birthday: {
        heading: "A Birthday Gift, Just for You",
        subheading:
          "Someone who cares about you picked out something special to celebrate your birthday.",
        openPrompt: "Tap to unwrap your gift",
        contents: [
          { emoji: "💌", label: "A Letter" },
          { emoji: "📸", label: "Memories" },
          { emoji: "🎵", label: "A Song" },
          { emoji: "💝", label: "A Wish" },
          { emoji: "🖼️", label: "Photos" },
          { emoji: "📜", label: "A Poem" },
        ],
      },
      anniversary: {
        heading: "A Gift of Love",
        subheading:
          "Someone wanted to honor this beautiful journey you share with a personal surprise.",
        openPrompt: "Tap to open your gift",
        contents: [
          { emoji: "💌", label: "A Letter" },
          { emoji: "📸", label: "Our Story" },
          { emoji: "💕", label: "A Promise" },
          { emoji: "🌹", label: "A Rose" },
          { emoji: "🖼️", label: "Photos" },
          { emoji: "📜", label: "A Poem" },
        ],
      },
      valentine: {
        heading: "A Little Token of Love",
        subheading: "In a world full of people, someone chose to make something just for you.",
        openPrompt: "Tap to receive your gift",
        contents: [
          { emoji: "💌", label: "A Love Note" },
          { emoji: "❤️", label: "A Heart" },
          { emoji: "🌹", label: "Roses" },
          { emoji: "✨", label: "A Wish" },
          { emoji: "🖼️", label: "Photos" },
          { emoji: "📜", label: "A Poem" },
        ],
      },
      wedding: {
        heading: "A Gift for Your Special Day",
        subheading:
          "Two hearts, one beautiful journey. Someone wanted to celebrate this milestone with you.",
        openPrompt: "Tap to open your gift",
        contents: [
          { emoji: "💌", label: "A Toast" },
          { emoji: "💍", label: "Blessings" },
          { emoji: "📸", label: "Memories" },
          { emoji: "🥂", label: "Cheers" },
          { emoji: "🖼️", label: "Photos" },
          { emoji: "📜", label: "A Poem" },
        ],
      },
      graduation: {
        heading: "A Gift for Your Achievement",
        subheading: "All that hard work paid off. Someone is incredibly proud and wanted you to know.",
        openPrompt: "Tap to open your gift",
        contents: [
          { emoji: "💌", label: "A Letter" },
          { emoji: "🎓", label: "Pride" },
          { emoji: "⭐", label: "A Wish" },
          { emoji: "📖", label: "Wisdom" },
          { emoji: "🖼️", label: "Photos" },
          { emoji: "📜", label: "A Poem" },
        ],
      },
      friendship: {
        heading: "A Gift from the Heart",
        subheading:
          "True friends are rare. Someone wanted to say thank you for being exactly who you are.",
        openPrompt: "Tap to open your gift",
        contents: [
          { emoji: "💌", label: "A Note" },
          { emoji: "🤗", label: "A Hug" },
          { emoji: "📸", label: "Memories" },
          { emoji: "💛", label: "A Wish" },
          { emoji: "🖼️", label: "Photos" },
          { emoji: "📜", label: "A Poem" },
        ],
      },
      "thank-you": {
        heading: "A Gift of Gratitude",
        subheading:
          "Someone wanted to express their thanks in a way that words alone can't capture.",
        openPrompt: "Tap to open your gift",
        contents: [
          { emoji: "💌", label: "A Note" },
          { emoji: "🙏", label: "Gratitude" },
          { emoji: "🌸", label: "Warmth" },
          { emoji: "✨", label: "A Wish" },
          { emoji: "🖼️", label: "Photos" },
          { emoji: "📜", label: "A Poem" },
        ],
      },
      fallback: {
        heading: "A Gift, Made with Love",
        subheading: "Someone wanted to make this moment a little more special — just for you.",
        openPrompt: "Tap to open your gift",
        contents: [
          { emoji: "💌", label: "A Letter" },
          { emoji: "📸", label: "Memories" },
          { emoji: "🎵", label: "A Song" },
          { emoji: "💝", label: "A Wish" },
          { emoji: "🖼️", label: "Photos" },
          { emoji: "📜", label: "A Poem" },
        ],
      },
    } satisfies Record<string, GiftOpeningCopy>,
  },

  /** Screen 12 — Closing finale. `{name}` slots are filled with recipient name or empty. */
  closing: {
    headlines: {
      birthday: { withName: "Happy Birthday, {name}!", plain: "Happy Birthday!" },
      anniversary: { withName: "With All My Love, {name}", plain: "With All My Love" },
      valentine: { withName: "With All My Love, {name}", plain: "With All My Love" },
      graduation: { withName: "So Proud of You, {name}!", plain: "Congratulations!" },
      wedding: { withName: "Cheers to You, {name}!", plain: "Cheers to You!" },
      friendship: { withName: "Lucky to Know You, {name}!", plain: "Lucky to Have You" },
      "thank-you": { withName: "Thank You, {name}!", plain: "Thank You!" },
      fallback: { withName: "With Love, {name}", plain: "With Love" },
    } satisfies Record<string, { withName: string; plain: string }>,
    thankYou:
      "Thank you for being part of this beautiful journey. Every chapter was written with love — just for you. May all your wishes come true!",
    theEnd: "The End",
    withLoveFrom: "With love from",
    madeWithLoveBy: "Made with love by",
    experienceAgain: "✨ Experience Again",
    createOwn: "🎁 Create Your Own Wish",
  },

  stages: {
    envelope: {
      prompt: "You've got a special surprise!",
      tap: "Tap the envelope to open",
      aria: "Open envelope",
    },
    giftBox: {
      tap: "Tap to unwrap",
      aria: "Open gift box",
    },
    cake: {
      makeWish: "Make a wish! 🎂",
      happyBirthday: "Happy Birthday! 🎉",
      candleBlowAria: "Blow out candle {n}",
      candleBlownAria: "Candle {n} blown out",
    },
    mainContent: {
      foldLetter: "Fold letter",
      openLetter: "Open letter",
    },
    /** Shared two-tone header used by memory-timeline stage + timeline chapter. */
    timeline: {
      eyebrow: "Our Story",
      titleLead: "Memory",
      titleAccent: "Timeline",
      subtitleStory: "Every moment with you is a beautiful chapter in our story.",
      subtitleMine: "Every moment with you is a beautiful chapter in my life story.",
    },
    closing: {
      withLove: "With love ❤️",
    },
  },

  /** Screen — Fancy Facts sample content (birthday demo set, see inventory flag). */
  facts: {
    subtitle: "Fun facts, lucky charms, and birthday magic",
    sample: [
      {
        id: "zodiac",
        category: "Zodiac",
        title: "Born under a lucky star",
        detail:
          "Your zodiac sign reveals hidden strengths — curiosity, creativity, and a heart that never stops dreaming.",
      },
      {
        id: "birthstone",
        category: "Birthstone",
        title: "Diamond — April's gem",
        detail:
          "Symbol of eternal love and inner strength. Like you — unbreakable, brilliant, and one of a kind.",
      },
      {
        id: "birthFlower",
        category: "Birth Flower",
        title: "Sweet Pea & Daisy",
        detail:
          "Delicate, joyful, and full of life — just like the memories we've shared together.",
      },
      {
        id: "funFact",
        category: "Fun Fact",
        title: "Birthday number meaning",
        detail:
          "The 25th birthday is known as the 'Silver Jubilee' — a milestone marking a quarter century of making the world brighter.",
      },
      {
        id: "luckyColor",
        category: "Lucky Color",
        title: "Rose Gold & Lavender",
        detail:
          "These colors represent warmth, grace, and a touch of magic — your birthday palette for the year ahead.",
      },
      {
        id: "birthdayWish",
        category: "Birthday Wish",
        title: "Make it count",
        detail:
          "They say the first birthday wish whispered while blowing out candles always comes true. So make it a good one.",
      },
    ],
  },

  chapters: {
    letter: {
      empty: "No letter yet",
      open: "Open the letter",
      foldBack: "Fold back",
      justForYou: "Just for You",
      envelopeAria: "Open envelope to read letter",
    },
    photos: {
      chapterNumber: "Chapter 02",
      title: "Our Memories",
      subtitle: "A little collection of moments I never want to forget.",
      collectionOf: "A collection of",
      coverAccent: "A STORY WORTH KEEPING",
      desktopHint: "Click sides or use arrow keys",
      mobileHint: "Swipe or tap the sides to flip",
      previous: "Previous",
      next: "Next",
      closeAlbum: "Close album",
      movingMemory: "Moving Memory",
      momentAlive: "A Moment That Came Alive",
      worthKeeping: "one of those moments worth keeping",
      theBeginning: "The beginning",
      memoryN: "Memory {n}",
      moreToCome: "More memories to come...",
      openingMemories: "Opening your memories",
      moreMemories: "More memories...",
      openAlbumAria: "Open memory album",
      prevPageAria: "Previous page",
      nextPageAria: "Next page",
    },
    poem: {
      empty: "No poem yet",
    },
    song: {
      eyebrow: "🎵 သီချင်း",
      emptyHeading: "The Turntable is Waiting",
      emptyBody:
        "No melody has been placed on the record yet — but the rest of your surprise is waiting just ahead.",
      heading: "A Song, Just for You",
      nowPlaying: "Now Playing",
      fallbackTitle: "A song picked for you",
      playAria: "Play {title}",
      tapToPlay: "▶ Tap to play",
      pauseAria: "Pause the song",
      playAriaButton: "Play the song",
      playing: "Playing",
      paused: "Paused",
      buffering: "Buffering…",
      replay: "Replay",
      watchYouTube: "Watch on YouTube",
    },
    timeline: {
      empty: "No memories yet",
      chapterLabel: "Our Story",
    },
    /** Screen 9 — Gift & Rewards chapter (largest group). */
    gift: {
      intro: "Here is a special surprise gift for you!",
      mainGiftHeading: "🎁 Your Special Gift",
      letsPlay: "Let's Play!",
      hint: "Hint",
      wrongPin: "Wrong PIN! Try again 💔",
      answerIs: "The answer is",
      correct: "correct!",
      unlocked: "Unlocked!",
      giftWaiting: "Your gift is waiting…",
      wrongCode: "Wrong code!",
      yes: "Yes! 😍",
      no: "No...",
      justForYou: "Just for You ✨",
      opening: "Opening...",
      bonusRound: "Bonus round",
      bonusHeading: "But wait, there's more!",
      bonusSubtitle: "Here are some more surprises for you!",
      chancesOne: "You have {count} chance to win!",
      chancesMany: "You have {count} chances to win!",
      allChancesUsed: "All chances used — your prizes await!",
      spin: "Spin",
      spinning: "Spinning…",
      spinBig: "SPIN!",
      noChancesLeft: "No chances left",
      chanceLeftOne: "{count} chance left",
      chanceLeftMany: "{count} chances left",
      youWon: "You won!",
      downloadProof: "Download proof ticket",
      seeRewards: "See my rewards",
      downloadPng: "Download PNG",
      serialPrefix: "No.",
      scanQr: "Scan QR to verify",
      qrFooterNote: "✨ Each ticket has a QR code — your sender can scan it to verify it's real.",
      redeemed: "Redeemed",
      prizeBooth: "Prize Booth",
      wonSummaryOne:
        "You won {count} prize! Download your proof tickets and send them to claim your rewards.",
      wonSummaryMany:
        "You won {count} prizes! Download your proof tickets and send them to claim your rewards.",
      allRedeemed: "All your prizes are redeemed!",
      giftPhotoAlt: "Your special gift",
      pinChallengeAria: "PIN challenge",
      pinDisplayAria: "PIN entry display",
      keypadAria: "Numeric keypad",
      digitAria: "Digit {n}",
      digitFilledAria: "Digit {n}: filled",
      digitEmptyAria: "Digit {n}: empty",
      backspaceAria: "Backspace",
      pinCorrectAria: "PIN correct",
    },
  },

  modes: {
    finishArrow: "Finish →",
    chapter05: "Chapter 05",
    scroll: {
      title: "Scroll Mode",
      description: "Continuous scroll with all chapters visible.",
      coming: "Coming in Phase 2.6.",
    },
    interactive: {
      title: "Interactive Mode",
      description: "Tap materials to open each chapter.",
      coming: "Coming in Phase 2.6.",
    },
    skipToClosing: "Skip to Closing →",
  },

  /** GIFT-03 — default prize pool text; probabilities live in rewards-shared. */
  rewards: {
    pool: [
      { id: "1", label: "Love Note", emoji: "💌", description: "A sweet note" },
      { id: "2", label: "Flowers", emoji: "🌸", description: "Virtual flowers" },
      { id: "3", label: "Chocolate", emoji: "🍫", description: "Sweet treat" },
      { id: "4", label: "Warm Hug", emoji: "🤗", description: "Extra warm hug" },
      { id: "5", label: "Sweet Song", emoji: "🎵", description: "A song for you" },
      { id: "6", label: "Star Gift", emoji: "⭐", description: "Special prize" },
      { id: "7", label: "Lucky Cat", emoji: "🐱", description: "Lucky companion" },
      { id: "8", label: "Golden Star", emoji: "🌟", description: "Rarest prize" },
    ],
    ticket: {
      prizeTicket: "PRIZE TICKET",
      proofOfReward: "WISHIRE · PROOF OF REWARD",
      bonusPoints: "{points} BONUS POINTS",
      serial: "No. {serial}",
      wonOn: "Won on {date}",
      claimFooter: "Send this ticket to your wish sender to claim your prize.",
      scanToVerify: "SCAN TO VERIFY",
    },
  },

  /**
   * Server API errors → recipient-facing text (client-side remap).
   * Server keeps sending English; unknown errors fall back to `generic`.
   */
  serverErrors: {
    noAttemptsLeft: "No attempts left",
    generic: "Something went wrong — try again",
    network: "Network error — check your connection and try again",
  },
} as const;

/** Typed occasion key lookup for introduction copy (falls back to `fallback`). */
export const introductionOccasionCopy = (occasion: string): OccasionCopyConfig =>
  copy.introduction.occasions[occasion as keyof typeof copy.introduction.occasions] ??
  copy.introduction.occasions.fallback;

/** Typed occasion key lookup for gift-opening copy (falls back to `fallback`). */
export const giftOpeningOccasionCopy = (occasion: string): GiftOpeningCopy =>
  copy.giftOpening.occasions[occasion as keyof typeof copy.giftOpening.occasions] ??
  copy.giftOpening.occasions.fallback;
