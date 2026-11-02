/**
 * copy.ts — single dictionary of recipient-facing UI strings (Wave 1, tasks 1.2 + 1.5).
 *
 * Bilingual since 1.5: translated values are Burmese; values still in English
 * are awaiting translation (see MYANMAR-COPY.md worksheet). Structure, keys,
 * and `{slot}` placeholders never translate — swap values only.
 *
 * Voice model: the introduction screen speaks as the product (formal);
 * everything from the cake screen onward is the SENDER speaking (second
 * person). Sender strings are default suggestion texts — Wave 4 lets the
 * creator edit them per wish.
 *
 * Plain data + one helper — import-safe from server components, canvas
 * renderers, and API-side code (no "use client", no React).
 *
 * Frame strings use `{slot}` placeholders — see `interpolate`.
 * Plural-sensitive strings ship as explicit *One/*Many pairs rather than a
 * plural function, so translators see whole sentences.
 *
 * Occasions (main set per 0.2): birthday, anniversary, valentine,
 * girlfriend-day, boyfriend-day, thadingyut, thingyan (+ fallback).
 * wedding / graduation / friendship / thank-you are parked (git history).
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
    continue: "ဆက်သွားမယ်",
    continueArrow: "ဆက်သွားမယ် →",
    nextArrow: "ရှေ့ဆက်မယ် →",
    tapToOpen: "ဖွင့်ရန် နှိပ်ပါ",
    wrongAnswer: "အဖြေမှားနေပါတယ်! ထပ်ကြိုးစားကြည့်ပါဦးနော် 💕",
    enterCode: "ကုဒ်ထည့်ပါ...",
    unlock: "ဖွင့်မည် ✨",
    wishire: "Wishire",
  },

  /** `src/app/w/[slug]` route shell. */
  route: {
    loading: "သင့်ရဲ့ surprise လေးကို ဖွင့်နေပါပြီ...",
    notFoundTitle: "Wish မတွေ့ပါ",
    metaTitle: "{title} — {sender} မှ {recipient} အတွက်",
    metaDescription: "{sender} က သင့်အတွက် surprise လေးတစ်ခု ပြင်ဆင်ထားပါတယ်!",
    error: {
      hiccup: "အနည်းငယ် အမှားအယွင်းရှိနေပါတယ်",
      wentWrong: "တစ်ခုခု မှားနေပါတယ်",
      body: "ဒီ wish ကို ဖွင့်လို့ မရပါ။ ပျက်သွားတာ ဖြစ်နိုင်သလို လင့်ခ်မှားနေတာလည်း ဖြစ်နိုင်ပါတယ်။",
      tryAgain: "ထပ်စမ်းကြည့်ပါ",
      reload: "pageကို ပြန်ဖတ်ကြည့်ပါ",
    },
  },

  /** Public verify page (`/w/[slug]/verify/[token]`). */
  verify: {
    metaTitle: "ဆုရရှိကြောင်းသက်သေ စစ်ဆေးရန် — Wishire",
    heading: "ဆုရရှိကြောင်းသက်သေ",
    authentic: "ဆုရရှိကြောင်းလက်မှတ်",
    unverified: "လက်မှတ်ကို စစ်ဆေးလို့မရနိုင်ပါ",
    issuedNote: "ဤလက်မှတ်ကို Wishire မှ ထုတ်ပေးခြင်း ဖြစ်ပြီး တရားဝင်မှတ်တမ်းနှင့် ကိုက်ညီပါသည်။",
    wonOn: "ရရှိခဲ့သည့်ရက်",
    serial: "အမှတ်စဉ်",
    forLabel: "အတွက်",
    forValue: "{recipient} — “{title}” ({sender} ထံမှ)",
    signatureOk: "လက်မှတ် မှန်ကန်သည် · မှတ်တမ်းကို Wishire တွင် သိမ်းဆည်းထားသည်",
    signatureFail:
      "ဤလက်မှတ်၏ လက်မှတ်သည် တရားဝင်မှတ်တမ်းနှင့် မကိုက်ညီပါ။ ပြင်ဆင်ခံရထားတာ အတုလုပ်ထားတာမျိုး ဖြစ်နိုင်ပါသည်။ တစ်ခုခုမှားနေတယ်လို့ ထင်ရင် ပေးပို့သူကို ဆက်သွယ်ပါ။",
  },

  /** Default gate prompts when creator set no custom one. */
  gateDefaults: {
    yesNo: "သင့်ရဲ့ surprise လေးကို ကြည့်ဖို့ အဆင့်သင့်ပဲလား?💕",
    tap: "surprise လေးကို ကြည့်ဖို့ ဒီကို နှိပ်လိုက်ပါ",
    gift: "လက်ဆောင်ပုံးလေးကို ဖွင့်ဖို့ နှိပ်လိုက်ပါ",
  },

  experience: {
    stageComingSoon: "ဤအဆင့်ကို မကြာမီ ရောက်လာပါမည်",
    skip: "ကျော်ရန် →",
  },

  navigation: {
    back: "နောက်သို့",
    next: "ရှေ့သို့",
    finish: "ပြီးပါပြီ 🎉",
  },

  /** RevealWrapper tap hints. */
  reveal: {
    default: "Tap to reveal ✨",
    poem: "ကဗျာဖတ်ရန် နှိပ်ပါ ✨",
    photos: "ဓာတ်ပုံကြည့်ရန် နှိပ်ပါ 📸",
    letter: "စာဖတ်ရန် နှိပ်ပါ ✉️",
  },

  music: {
    mute: "သီချင်းပိတ်ရန်",
    play: "သီချင်းဖွင့်ရန်",
  },

  characterGif: {
    defaultAlt: "ဇာတ်ကောင်",
  },

  /** Screen 3 — Surprise Start / Are You Ready. Sender voice. */
  start: {
    hey: "ဟိုင်း",
    birthdayGreeting:
      "{recipientName}ရေ ဒါကတော့ {recipientName}အတွက် မွေးနေ့ကိတ်လေးပါ။ ကဲ မွေးနေ့ပွဲလေးစလိုက်ရအောင် ဖယောင်းတိုင်လေးတွေ မီးညှိလိုက်တော့နော်။",
    candlesGuide: "မီးညှိဖို့အတွက်ဖယောင်းတိုင်တွေကိုနှိပ်ပါ။ ({lit}/{count})",
    candlesSuccess: "🎉 Happy Birthday!",
    getReady: "Get ready for your surprise...",
    yesButton: "Yes, I'm ready! 😍",
    notYet: "Not yet...",
    secretCode: "လျှို့ဝှက်ကုဒ် ရိုက်ထည့်ပါ",
    letsGo: "Let's go! 🎉",
    wrongCode: "ကုဒ်မှားနေပါတယ်နော် — ထပ်ကြိုးကြည့်ပါ!",
  },

  /** Screen 1 — Introduction (occasion-keyed config + fixed copy). Product voice (formal). */
  introduction: {
    hey: "ဟိုင်း {recipientName} ရေ",
    subtitle: "သင့်အတွက် surprise လေးတစ်ခု စောင့်ကြိုနေပါတယ်နော်...",
    senderLine: "{celebrationText}အတွက် {senderName}က အမှတ်တရ surprise လေးတစ်ခု စီစဉ်ပေးထားပါတယ်။",
    cutRibbon: "သင့်ရဲ့လက်ဆောင်လေးကိုကြည့်ဖို့ ဖဲကြိုးကိုဖြတ်လိုက်ပါ",
    opening: "Opening your surprise...",
    cutRibbonAria: "သင့်ရဲ့လက်ဆောင်လေးကိုကြည့်ဖို့ ဖဲကြိုးကိုဖြတ်လိုက်ပါ",
    logoAlt: "Wishire",
    occasions: {
      birthday: {
        emoji: "🎂",
        label: "မွေးနေ့",
        celebrationText: "သင့်ရဲ့မွေးနေ",
        description:
          "အစစအရာရာ ပျက်စီးဆွေးမြည့်ပြီး အမှောင်ထုကြီးစိုးနေတတ်တဲ့ ဒီလောကကြီးမှာ အနည်းဆုံးတော့ သင့်ကိုချစ်တဲ့သူတွေ ရှိနေပါသေးတယ်။ ဒီ surprise gift လေးက သူတို့ထဲက တစ်ယောက်ယောက်က သင့်ဆီကို ပေးပို့လိုက်တဲ့ ချစ်ခြင်းမေတ္တာတစ်ခုပေါ့လေ။ ကဲ ကြည့်ဖို့အဆင့်သင့်ဖြစ်ပြီဆိုရင် အောက်က ဖဲကြိုးလေးကို ဖြတ်လိုက်တော့နော်။",
      },
      anniversary: {
        emoji: "💕",
        label: "Anniversary",
        celebrationText: "သင်တို့ရဲ့ anniversary",
        description:
          "အစစအရာရာ ပျက်စီးဆွေးမြည့်ပြီး အမှောင်ထုကြီးစိုးနေတတ်တဲ့ ဒီလောကကြီးမှာ အနည်းဆုံးတော့ သင့်ကိုသိပ်ချစ်တဲ့သူတစ်ယောက်တော့ ရှိနေပါသေးတယ်။ ဒီ surprise gift လေးကတော့ သူက သင့်ဆီကို ပေးပို့လိုက်တဲ့ ချစ်ခြင်းမေတ္တာတစ်ခုပေါ့လေ။ ကဲ ကြည့်ဖို့အဆင့်သင့်ဖြစ်ပြီဆိုရင် အောက်က ဖဲကြိုးလေးကို ဖြတ်လိုက်တော့နော်။",
      },
      valentine: {
        emoji: "❤️",
        label: "ချစ်သူများနေ့",
        celebrationText: "ချစ်သူများနေ့",
        description:
          "အစစအရာရာ ပျက်စီးဆွေးမြည့်ပြီး အမှောင်ထုကြီးစိုးနေတတ်တဲ့ ဒီလောကကြီးမှာ အနည်းဆုံးတော့ သင့်ကိုသိပ်ချစ်တဲ့သူတစ်ယောက်တော့ ရှိနေပါသေးတယ်။ ဒီ surprise gift လေးကတော့ သူက သင့်ဆီကို ပေးပို့လိုက်တဲ့ ချစ်ခြင်းမေတ္တာတစ်ခုပေါ့လေ။ ကဲ ကြည့်ဖို့အဆင့်သင့်ဖြစ်ပြီဆိုရင် အောက်က ဖဲကြိုးလေးကို ဖြတ်လိုက်တော့နော်။",
      },
      "girlfriend-day": {
        emoji: "💗",
        label: "ချစ်သူမများနေ့",
        celebrationText: "ချစ်သူမများနေ့",
        description:
          "တချို့လူတွေက ဘယ်လိုပဲရှိရှိ သူတို့ရှိတာနဲ့ ဒီလောကကြီးကို ပိုပြီးနူးညံ့အောင်လုပ်ပေးတယ်။ ဒီနေ့မှာ မင်းလို နေ့ရက်တိုင်းကို ပိုလင်းစေတဲ့သူကို ဂုဏ်ပြုချင်တဲ့သူတစ်ယောက် ရှိခဲ့တာပါ။",
      },
      "boyfriend-day": {
        emoji: "💙",
        label: "ချစ်သူလေးများနေ့",
        celebrationText: "ချစ်သူလေးများနေ့",
        description:
          "အားလုံးက ပြောကြတာမဟုတ်ပေမယ့် တစ်ယောက်ယောက်က မင်းကို မင်းထင်တာထက် ပိုပြီး မကြာခဏ တွေးနေတယ်။ ဒီနေ့မှာ ဒါကို တရားဝင်ကြေညာချင်တယ် — ဒီနေ့က မင်းနေ့ပါ။",
      },
      thadingyut: {
        emoji: "🏮",
        label: "သီတင်းကျွတ်",
        celebrationText: "သီတင်းကျွတ်ပွဲတော်",
        description:
          "သီတင်းကျွတ်ပွဲတော်ရောက်ပြီး မီးအလှတွေ ထွန်းညှိကြတဲ့အချိန်မှာ တစ်ယောက်ယောက်က မင်းရဲ့သီတင်းကျွတ်ကို ပိုတောက်ပစေမယ့် မင်းအတွက်ပဲ ဖန်တီးထားတဲ့ အံ့သြဖွယ်လေး ပေးချင်ခဲ့တာပါ။",
      },
      thingyan: {
        emoji: "🌊",
        label: "သင်္ကြန်",
        celebrationText: "သင်္ကြန်ပွဲတော်",
        description:
          "နှစ်သစ်၊ အသစ်အသစ်အရာတွေနဲ့ စတင်ခြင်း။ တစ်ယောက်ယောက်က မင်းဆီကို ပျော်ရွှင်မှုရေစက်လေးတွေ ပို့ချင်ခဲ့တယ် — အဟောင်းနှစ်ကို ဆေးကြောပစ်ပြီး လာမယ့်အရာတွေကို ကြိုဆိုဖို့ အံ့သြဖွယ်လေး။",
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
      padlock: { emoji: "🔒", hint: "ဖွင့်ရန် နှိပ်ပါ" },
      ribbon: { emoji: "🎀", hint: "ဖဲကြိုးကိုဖြတ်ပါ" },
      "wax-seal": { emoji: "🔮", hint: "Break the seal" },
      chain: { emoji: "⛓️", hint: "ကြိုးကိုဖြတ်ပါ" },
    },
  },

  screenPlaceholder: {
    screen: "Screen {n}",
    back: "← နောက်သို့",
  },

  giftReveal: {
    teaser: "Something special awaits...",
    tapToOpen: "ဖွင့်ရန် နှိပ်ပါ 💝",
    openAria: "လက်ဆောင်ဖွင့်ရန်",
  },

  /** Screen 4 — Gift Opening (occasion-keyed box copy). Sender voice. */
  giftOpening: {
    received: "သင့်ဆီ လက်ဆောင်တစ်ခု ရောက်နေပါတယ်",
    fromTag: "မှ",
    giftsForYou: "သင့်အတွက် လက်ဆောင်တွေ ဒီမှာပါ!",
    seeGifts: "လက်ဆောင်တွေ ကြည့်မည် →",
    openAria: "လက်ဆောင်ဖွင့်ရန်",
    occasions: {
      birthday: {
        heading: "{recipientName} အတွက် မွေးနေ့လက်ဆောင်",
        subheading:
          "{recipientName}ရေ ဒါကတော့ {recipientName}အတွက် မွေးနေ့ကိတ်လေးပါ။ ကဲ မွေးနေ့ပွဲလေးစလိုက်ရအောင် ဖယောင်းတိုင်လေးတွေ မီးညှိလိုက်တော့နော်။",
        openPrompt: "လက်ဆောင်ကို ဖွင့်ရန် နှိပ်ပါ",
        contents: [
          { emoji: "💌", label: "စာ" },
          { emoji: "📸", label: "အမှတ်တရများ" },
          { emoji: "🎵", label: "သီချင်း" },
          { emoji: "🤫", label: "လျှို့ဝှက်ချက်!" },
          { emoji: "🖼️", label: "ဓာတ်ပုံများ" },
          { emoji: "📜", label: "ကဗျာ" },
        ],
      },
      anniversary: {
        heading: "{recipientName} အတွက် ချစ်သက်လက်ဆောင်",
        subheading: "{recipientName}ရေ ဒါကတော့ {recipientName}အတွက် လက်ဆောင်လေးပါ။",
        openPrompt: "သင့်လက်ဆောင်ကို ဖွင့်ရန် နှိပ်ပါ",
        contents: [
          { emoji: "💌", label: "စာ" },
          { emoji: "📸", label: "ကျွန်တော်တို့၏ ဇာတ်လမ်း" },
          { emoji: "💕", label: "ကတိ" },
          { emoji: "🌹", label: "နှင်းဆီ" },
          { emoji: "🖼️", label: "ဓာတ်ပုံများ" },
          { emoji: "📜", label: "ကဗျာ" },
        ],
      },
      valentine: {
        heading: "{recipientName} အတွက် ချစ်သက်လက်ဆောင်",
        subheading: "{recipientName}ရေ ဒါကတော့ {recipientName}အတွက် လက်ဆောင်လေးပါ။",
        openPrompt: "လက်ဆောင်လက်ခံရန် နှိပ်ပါ",
        contents: [
          { emoji: "💌", label: "A Love Note" },
          { emoji: "❤️", label: "နှလုံးသား" },
          { emoji: "🌹", label: "နှင်းဆီပွင့်များ" },
          { emoji: "🤫", label: "လျှို့ဝှက်ချက်!" },
          { emoji: "🖼️", label: "ဓာတ်ပုံများ" },
          { emoji: "📜", label: "ကဗျာ" },
        ],
      },
      "girlfriend-day": {
        heading: "{recipientName} အတွက် ချစ်သက်လက်ဆောင်",
        subheading: "{recipientName}ရေ ဒါကတော့ {recipientName}အတွက် လက်ဆောင်လေးပါ။",
        openPrompt: "သင့်လက်ဆောင်ကို ဖွင့်ရန် နှိပ်ပါ",
        contents: [
          { emoji: "💌", label: "A Love Note" },
          { emoji: "❤️", label: "နှလုံးသား" },
          { emoji: "🤫", label: "လျှို့ဝှက်ချက်!" },
          { emoji: "🖼️", label: "ဓာတ်ပုံများ" },
          { emoji: "📜", label: "ကဗျာ" },
        ],
      },
      "boyfriend-day": {
        heading: "{recipientName} အတွက် ချစ်သက်လက်ဆောင်",
        subheading: "{recipientName}ရေ ဒါကတော့ {recipientName}အတွက် လက်ဆောင်လေးပါ။",
        openPrompt: "သင့်လက်ဆောင်ကို ဖွင့်ရန် နှိပ်ပါ",
        contents: [
          { emoji: "💌", label: "မှတ်စု" },
          { emoji: "🤗", label: "ထွေးပိုက်မှု" },
          { emoji: "🤫", label: "လျှို့ဝှက်ချက်!" },
          { emoji: "🖼️", label: "ဓာတ်ပုံများ" },
          { emoji: "📜", label: "ကဗျာ" },
        ],
      },
      thadingyut: {
        heading: "{recipientName} အတွက် သီတင်းကျွတ်လက်ဆောင်",
        subheading: "{recipientName}ရေ ဒါကတော့ သီတင်းကျွတ်အတွက် လက်ဆောင်လေးပါ။",
        openPrompt: "သင့်လက်ဆောင်ကို ဖွင့်ရန် နှိပ်ပါ",
        contents: [
          { emoji: "💌", label: "စာ" },
          { emoji: "🎵", label: "သီချင်း" },
          { emoji: "🤫", label: "လျှို့ဝှက်ချက်!" },
          { emoji: "🖼️", label: "ဓာတ်ပုံများ" },
          { emoji: "📜", label: "ကဗျာ" },
        ],
      },
      thingyan: {
        heading: "{recipientName} အတွက် သင်္ကြန်လက်ဆောင်",
        subheading: "{recipientName}ရေ ဒါကတော့ သင်္ကြန်အတွက် လက်ဆောင်လေးပါ။",
        openPrompt: "သင့်လက်ဆောင်ကို ဖွင့်ရန် နှိပ်ပါ",
        contents: [
          { emoji: "📸", label: "အမှတ်တရများ" },
          { emoji: "💌", label: "စာ" },
          { emoji: "🤫", label: "လျှို့ဝှက်ချက်!" },
          { emoji: "🖼️", label: "ဓာတ်ပုံများ" },
          { emoji: "📜", label: "ကဗျာ" },
        ],
      },
      fallback: {
        heading: "A Gift, Made with Love",
        subheading: "Someone wanted to make this moment a little more special — just for you.",
        openPrompt: "သင့်လက်ဆောင်ကို ဖွင့်ရန် နှိပ်ပါ",
        contents: [
          { emoji: "💌", label: "စာ" },
          { emoji: "📸", label: "အမှတ်တရများ" },
          { emoji: "🎵", label: "သီချင်း" },
          { emoji: "🤫", label: "လျှို့ဝှက်ချက်!" },
          { emoji: "🖼️", label: "ဓာတ်ပုံများ" },
          { emoji: "📜", label: "ကဗျာ" },
        ],
      },
    } satisfies Record<string, GiftOpeningCopy>,
  },

  /** Screen 12 — Closing finale. `{name}` slots are filled with recipient name or empty. Sender voice. */
  closing: {
    headlines: {
      birthday: { withName: "Happy Birthday ပါ {name}ရေ!", plain: "Happy Birthday!" },
      anniversary: { withName: "ချစ်ခြင်းမေတ္တာဖြင့် {name}", plain: "ချစ်ခြင်းမေတ္တာဖြင့်" },
      valentine: { withName: "ချစ်ခြင်းမေတ္တာဖြင့် {name}", plain: "ချစ်ခြင်းမေတ္တာဖြင့်" },
      "girlfriend-day": {
        withName: "ချစ်သူမများနေ့ မင်္ဂလာပါ {name} ရေ!",
        plain: "ချစ်သူမများနေ့ မင်္ဂလာပါ!",
      },
      "boyfriend-day": {
        withName: "ချစ်သူလေးများနေ့ မင်္ဂလာပါ {name} ရေ!",
        plain: "ချစ်သူလေးများနေ့ မင်္ဂလာပါ!",
      },
      thadingyut: { withName: "သီတင်းကျွတ်မင်္ဂလာ ရှိပါစေ {name} ရေ!", plain: "သီတင်းကျွတ်မင်္ဂလာ ရှိပါစေ!" },
      thingyan: { withName: "သင်္ကြန်နှစ်သစ် မင်္ဂလာပါ {name} ရေ!", plain: "သင်္ကြန်နှစ်သစ် မင်္ဂလာပါ!" },
      fallback: { withName: "With Love, {name}", plain: "With Love" },
    } satisfies Record<string, { withName: string; plain: string }>,
    thankYou:
      "Thank you for being part of this beautiful journey. Every chapter was written with love — just for you. May all your wishes come true!",
    theEnd: "The End",
    withLoveFrom: "ချစ်ခြင်း‌ မေတ္တာဖြင့်",
    madeWithLoveBy: "Made with love by",
    experienceAgain: "✨ အစကပြန်သွားမယ်",
    createOwn: "🎁 သင့်ကိုယ်ပိုင် Wish ဖန်တီးရန်",
  },

  stages: {
    envelope: {
      prompt: "အထူးအံ့သြဖွယ်တစ်ခု ရောက်နေပါတယ်!",
      tap: "စာအိတ်ကို ဖွင့်ရန် နှိပ်ပါ",
      aria: "စာအိတ်ဖွင့်ရန်",
    },
    giftBox: {
      tap: "ဖွင့်ရန် နှိပ်ပါ",
      aria: "လက်ဆောင်ဘူးဖွင့်ရန်",
    },
    cake: {
      makeWish: "ဆုတောင်းပါ! 🎂",
      happyBirthday: "မွေးနေ့မင်္ဂလာ ရှိပါစေ! 🎉",
      candleBlowAria: "ဖယောင်းတိုင် {n} မှုတ်ရန်",
      candleBlownAria: "ဖယောင်းတိုင် {n} ၏ မီး ပိတ်ပြီးပါပြီ",
    },
    mainContent: {
      foldLetter: "စာ ခေါက်ရန်",
      openLetter: "စာ ဖွင့်ရန်",
    },
    /** Shared two-tone header used by memory-timeline stage + timeline chapter. */
    timeline: {
      eyebrow: "ကျွန်တော်တို့၏ ဇာတ်လမ်း",
      titleLead: "အမှတ်တရ",
      titleAccent: "မှတ်တမ်း",
      subtitleStory: "Every moment with you is a beautiful chapter in our story.",
      subtitleMine: "Every moment with you is a beautiful chapter in my life story.",
    },
    closing: {
      withLove: "အချစ်ဖြင့် ❤️",
    },
  },

  /** Screen — Fancy Facts sample content (birthday demo set, see inventory flag). */
  facts: {
    subtitle: "ပျော်စရာအချက်များ၊ ကံကောင်းလက်ဆောင်များနှင့် မွေးနေ့မှော်",
    sample: [
      {
        id: "zodiac",
        category: "ရာသီခွင်",
        title: "Born under a lucky star",
        detail:
          "သင်ရဲ့ရာသီခွင်က ပြောပြနေတဲ့ သင့်ရဲ့အားသာချက်များ — စူးစမ်းလိုစိတ်ရှိခြင်း၊ ဖန်တီးနိုင်စွမ်းကောင်းမွန်ခြင်း၊ ရဲရင့်တက်ကြွခြင်း",
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
      empty: "စာ မရှိသေးပါ",
      open: "စာဖွင့်ရန်",
      foldBack: "ပြန်ခေါက်ရန်",
      justForYou: "မင်းအတွက်ပဲ",
      envelopeAria: "စာဖတ်ရန် စာအိတ်ဖွင့်ရန်",
    },
    photos: {
      chapterNumber: "အခန်း ၀၂",
      title: "ကိုယ်တို့ရဲ့ အမှတ်တရလေးတွေ",
      subtitle: "ဒါကတော့ ကိုယ်တို့နှစ်ယောက်ရဲ့ အမှတ်တရပုံလေးတွေ စုထားတဲ့ ဓာတ်ပုံအယ်လ်ဘမ်လေးပါ",
      collectionOf: "စုစည်းမှု",
      coverAccent: "တန်ဖိုးဖြတ်လို့မရတဲ့ အမှတ်တရလေးများ",
      desktopHint: "ဘေးဘက်များကို နှိပ်ပါ သို့မဟုတ် မြှားခလုတ်များ သုံးပါ",
      mobileHint: "လှန်ကြည့်ရန် ဘေးဘက်များကို ဆွဲပါ သို့မဟုတ် နှိပ်ပါ",
      previous: "ယခင်",
      next: "နောက်",
      closeAlbum: "အယ်လ်ဘမ် ပိတ်ရန်",
      movingMemory: "Moving Memory",
      momentAlive: "တို့ရဲ့မှတ်ညာဏ်ထဲမှ အမြဲရှင်သန်နေမယ့်အခိုက်အတန့်လေးတွေ",
      worthKeeping: "one of those moments worth keeping",
      theBeginning: "အားလုံးရဲ့အစ",
      memoryN: "အမှတ်တရ {n}",
      moreToCome: "နောက်မှာ အများကြီး ကျန်သေးတယ်နော်",
      moreMemories: "More memories...",
      openingMemories: "သင့်အမှတ်တရတွေ ဖွင့်နေပါပြီ",
      openAlbumAria: "အမှတ်တရအယ်လ်ဘမ် ဖွင့်ရန်",
      prevPageAria: "ယခင်စာမျက်နှာ",
      nextPageAria: "နောက်စာမျက်နှာ",
    },
    poem: {
      empty: "ကဗျာ မရှိသေးပါ",
    },
    song: {
      eyebrow: "🎵 သီချင်း",
      emptyHeading: "The Turntable is Waiting",
      emptyBody:
        "လောလောဆယ် ရွေးထားတဲ့ သီချင်း မရှိသေးပါဘူး။ ဒါပေမယ့် နောက်မှာ တခြား surprise တွေ စောင့်နေပါတယ်နော်",
      heading: "{recipientName}နားထောင်ဖို့",
      nowPlaying: "ဖွင့်နေသည်",
      fallbackTitle: "မင်းအတွက် ရွေးချယ်ထားတဲ့ သီချင်း",
      playAria: "{title} ဖွင့်ရန်",
      tapToPlay: "▶️ ဖွင့်ရန် နှိပ်ပါ",
      pauseAria: "သီချင်း ရပ်ရန်",
      playAriaButton: "သီချင်းဖွင့်ရန်",
      playing: "ဖွင့်နေသည်",
      paused: "ရပ်ထားသည်",
      buffering: "တင်နေသည်…",
      replay: "ပြန်ဖွင့်ရန်",
      watchYouTube: "YouTube တွင် ကြည့်ရန်",
    },
    timeline: {
      empty: "အမှတ်တရ မရှိသေးပါ",
      chapterLabel: "ကျွန်တော်တို့၏ ဇာတ်လမ်း",
    },
    /** Screen 9 — Gift & Rewards chapter (largest group). Sender voice. */
    gift: {
      intro: "ဒါက မင်းအတွက် အထူးလက်ဆောင်တစ်ခုပါ!",
      mainGiftHeading: "🎁 မင်းအတွက် အထူးလက်ဆောင်",
      hint: "အကြံပြုချက်",
      wrongPin: "PIN မှားနေတယ်! ထပ်စမ်းကြည့်ပါ 💔",
      answerIs: "အဖြေက",
      correct: "မှန်ပါတယ်!",
      unlocked: "ဖွင့်ပြီးပါပြီ!",
      giftWaiting: "မင်းရဲ့လက်ဆောင် စောင့်နေတယ်…",
      wrongCode: "ကုဒ်မှားတယ်!",
      yes: "ဟုတ်ကဲ့! 😍",
      no: "မဟုတ်ဘူး...",
      justForYou: "မင်းအတွက်ပဲ ✨",
      opening: "ဖွင့်နေပြီ...",
      letsPlay: "ကစားရအောင်!",
      bonusRound: "ဘောနပ်စ်အဆင့်",
      bonusHeading: "စောင့်ပါဦး၊ နောက်ထပ်ရှိသေးတယ်!",
      bonusSubtitle: "နောက်ထပ်အံ့သြဖွယ်တွေ ဒီမှာပါ!",
      chancesOne: "ဆုရဖို့ အခွင့်အရေး {count} ခု ရှိတယ်!",
      chancesMany: "ဆုရဖို့ အခွင့်အရေး {count} ခု ရှိတယ်!",
      allChancesUsed: "အခွင့်အရေးအားလုံး ပြီးပါပြီ — မင့်ဆုလက်ဆောင်တွေ စောင့်နေတယ်!",
      spin: "လှည့်မည်",
      spinning: "လှည့်နေသည်…",
      spinBig: "လှည့်!",
      noChancesLeft: "အခွင့်အရေး မကျန်တော့ဘူး",
      chanceLeftOne: "အခွင့်အရေး {count} ခု ကျန်တယ်",
      chanceLeftMany: "အခွင့်အရေး {count} ခု ကျန်တယ်",
      youWon: "မင်းနိုင်တယ်!",
      downloadProof: "အထောက်အထားလက်မှတ် ဒေါင်းလုဒ်လုပ်ရန်",
      seeRewards: "ဆုတွေ ကြည့်မည်",
      downloadPng: "PNG ဒေါင်းလုဒ်လုပ်ရန်",
      serialPrefix: "အမှတ်",
      scanQr: "QR စကင်ဖတ် စစ်ဆေးရန်",
      qrFooterNote: "✨ လက်မှတ်တိုင်းမှာ QR ကုဒ်ပါတယ် — မင်းကိုပေးပို့သူက scan လုပ်ရင် အမှန်ဟုတ်မဟုတ် စစ်ဆေးလို့ရတယ်။",
      redeemed: "လဲယူပြီး",
      prizeBooth: "ဆုအခန်း",
      wonSummaryOne:
        "ဆု {count} ခု ရခဲ့တယ်! အထောက်အထားလက်မှတ်တွေ ဒေါင်းလုဒ်လုပ်ပြီး ဆုရယူဖို့ ပေးပို့ပါ။",
      wonSummaryMany:
        "ဆု {count} ခု ရခဲ့တယ်! အထောက်အထားလက်မှတ်တွေ ဒေါင်းလုဒ်လုပ်ပြီး ဆုရယူဖို့ ပေးပို့ပါ။",
      allRedeemed: "မင့်ဆုအားလုံး လဲယူပြီးပါပြီ!",
      giftPhotoAlt: "မင်းရဲ့အထူးလက်ဆောင်",
      pinChallengeAria: "PIN စမ်းသပ်မှု",
      pinDisplayAria: "PIN ထည့်ရာ ပြသမှု",
      keypadAria: "ဂဏန်းခလုတ်",
      digitAria: "ဂဏန်း {n}",
      digitFilledAria: "ဂဏန်း {n}: ဖြည့်ပြီး",
      digitEmptyAria: "ဂဏန်း {n}: ကွက်နေသည်",
      backspaceAria: "ဖျက်ရန်",
      pinCorrectAria: "PIN မှန်ပါသည်",
    },
  },

  modes: {
    finishArrow: "ပြီးဆုံး →",
    chapter05: "အခန်း ၀၅",
    scroll: {
      title: "စာမျက်နှာ လျှောက်မုဒ်",
      description: "အခန်းအားလုံးကို ဆက်တိုက် လျှောက်ကြည့်နိုင်ပါတယ်။",
      coming: "Phase 2.6 မှာ ရောက်လာပါမည်။",
    },
    interactive: {
      title: "အပြန်အလှန် ဆက်သွယ်မုဒ်",
      description: "ပစ္စည်းတွေကို နှိပ်ပြီး အခန်းတစ်ခုချင်း ဖွင့်ပါ။",
      coming: "Phase 2.6 မှာ ရောက်လာပါမည်။",
    },
    skipToClosing: "တိုက်ရိုက် ဇာတ်သိမ်းသို့ →",
  },

  /**
   * GIFT-03 — default prize pool. Labels/descriptions are the single source
   * for rewards-shared.ts (server) — probabilities live in rewards-shared.
   */
  rewards: {
    pool: [
      { id: "1", label: "အချစ်စာ", emoji: "💌", description: "ချစ်စရာစာလေး" },
      { id: "2", label: "ပန်းတွေ", emoji: "🌸", description: "အွန်လိုင်းပန်းတွေ" },
      { id: "3", label: "ချောကလက်", emoji: "🍫", description: "ချစ်စရာအစားအစာ" },
      { id: "4", label: "နွေးထွေးတဲ့ ဖက်ထွေးမှု", emoji: "🤗", description: "နောက်ထပ်နွေးထွေးတဲ့ ဖက်ထွေးမှု" },
      { id: "5", label: "ချစ်စရာသီချင်း", emoji: "🎵", description: "မင်းအတွက် သီချင်း" },
      { id: "6", label: "ကြယ်လက်ဆောင်", emoji: "⭐", description: "အထူးဆု" },
      { id: "7", label: "ကံကောင်းကြောင်", emoji: "🐱", description: "ကံကောင်းအဖော်" },
      { id: "8", label: "ရွှေကြယ်", emoji: "🌟", description: "ရှားပါးဆုံးဆု" },
    ],
    ticket: {
      prizeTicket: "ဆုလက်မှတ်",
      proofOfReward: "WISHIRE · ဆုအထောက်အထား",
      bonusPoints: "{points} ဘောနပ်စ်အမှတ်",
      serial: "အမှတ် {serial}",
      wonOn: "{date} ရရှိခဲ့သည်",
      claimFooter: "ဆုရယူဖို့ ဒီလက်မှတ်ကို မင်းရဲ့ wish ပေးပို့သူဆီ ပို့ပါ။",
      scanToVerify: "စစ်ဆေးရန် စကင်ဖတ်ပါ",
    },
  },

  /**
   * Server API errors → recipient-facing text (client-side remap).
   * Server keeps sending English; unknown errors fall back to `generic`.
   */
  serverErrors: {
    noAttemptsLeft: "ကြိုးစားခွင့် မကျန်တော့ဘူး",
    generic: "တစ်ခုခု မှားသွားတယ် — ထပ်ကြိုးစားပါ",
    network: "ကွန်ရက်ချိတ်ဆက်မှု ပြဿနာ — ချိတ်ဆက်မှုကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ",
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
