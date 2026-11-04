import type { FlowMode } from "@/types/experience";
import type { WishConfig, WishSettings } from "@/types/wish";

/**
 * Shared seed data — pure values, no Prisma import, so tests can validate
 * the exact config objects the seed writes to the database.
 */

export const SHARED_CONTENT: WishConfig["content"] = {
  letter: `Dear ဂျူလီယာ,

Happy 25th Birthday! 🎂

I can't believe it's been 10 years since we met in that college dorm hallway. Remember when we stayed up until 3am talking about our dreams? Look at us now — you're out there changing the world, one patient at a time.

You've always been the person everyone turns to when things get tough. Your kindness isn't just a trait — it's a superpower. And today, on your birthday, I want you to know how much you mean to me and everyone around you.

Here's to 25 more years of laughter, adventure, and memories together.

ချစ်ခြင်းမေတ္တာဖြင့်
ကိုကို ❤️`,
  poem: {
    id: "birthday-wish-1",
    title: "A Birthday Wish",
    author: "အီလစ်",
    text: "အာရေးဘီးယန်း သိုးဖြူလေးတွေ လိုပေါ့\nဟောဒီကမ္ဘာမှာ မင်းရှိနေရင် တော်ပါပြီ။",
  },
  song: {
    youtubeUrl: "https://www.youtube.com/watch?v=uRFJzVyR7X8",
  },
  memoryTimeline: [
    {
      date: "September 2016",
      title: "The Day We Met",
      description:
        "Freshman dorm hallway. You were carrying too many boxes and I offered to help. Best decision ever.",
    },
    {
      date: "March 2018",
      title: "Road Trip to the Coast",
      description:
        "12 hours in a car, one broken GPS, and the best sunset we've ever seen. Worth every wrong turn.",
    },
    {
      date: "December 2020",
      title: "You Got Into Nursing School",
      description:
        "The scream when you opened that acceptance letter still echoes in my head. I knew you'd make it.",
    },
    {
      date: "June 2023",
      title: "Your First Day as a Nurse",
      description:
        "Watching you walk into that hospital in your scrubs, I've never been prouder of anyone.",
    },
  ],
  musicUrl: "/music/birthday-song.mp3",
  characterGif: {
    src: "/gifs/musician-cat.gif",
    position: "bottom-right",
    alt: "Cute cat playing guitar",
  },
  decorations: {
    elements: ["sparkles", "hearts", "flowers"],
    density: "medium",
  },
};

type SeedSettingsBase = Omit<WishSettings, "flowMode" | "intensity">;

export const SHARED_SETTINGS_BASE: SeedSettingsBase = {
  enableGiftBox: true,
  enableCake: true,
  enableRibbon: false,
  enableVoiceMessage: false,
  enableMusic: true,
  enablePoem: true,
  enableTimeline: true,
  enableGiftChallenge: true,
  enableSpinWheel: true,
  giftChapter: {
    gateAction: {
      type: "pin",
      pin: "1609",
      hint: "our anniversary date",
    },
    // mainGiftMessage intentionally unset — demo shows the gift photo only
    // (creator can add a personal note per wish; Wave 4)
    mainGiftPhotoIds: ["/Gift.jpg"],
    // Bonus prize wheel — spins are server-authoritative; every win is
    // persisted as a verifiable proof ticket (GIFT-03)
    miniGame: {
      type: "spin-wheel",
      attempts: 3,
      items: [
        { id: "1", label: "Love Note", emoji: "💌", description: "A sweet handwritten note", probability: 22 },
        { id: "2", label: "Flowers", emoji: "🌸", description: "A bouquet of virtual flowers", probability: 18 },
        { id: "3", label: "Chocolate", emoji: "🍫", description: "Your favorite chocolate box", probability: 18 },
        { id: "4", label: "Warm Hug", emoji: "🤗", description: "One extra-long warm hug", probability: 14 },
        { id: "5", label: "Sweet Song", emoji: "🎵", description: "A song picked just for you", probability: 10 },
        { id: "6", label: "Movie Night", emoji: "🎬", description: "A cozy movie night together", probability: 8 },
        { id: "7", label: "Lucky Cat", emoji: "🐱", description: "A lucky companion for the year", probability: 6 },
        { id: "8", label: "Golden Star", emoji: "🌟", description: "The rarest prize of all", probability: 4 },
      ],
    },
  },
};

export const SHARED_STAGES: WishConfig["stages"] = [
  { type: "envelope", enabled: true, config: {} },
  { type: "gift-box", enabled: true, config: {} },
  { type: "cake", enabled: true, config: {} },
  { type: "main-content", enabled: true, config: {} },
  { type: "poem-display", enabled: true, config: {} },
  { type: "memory-timeline", enabled: true, config: {} },
  { type: "fancy-facts", enabled: true, config: {} },
  { type: "closing", enabled: true, config: {} },
];

export const TEST_PHOTOS = [
  { url: "/images/photo-1.jpg", sortOrder: 0 },
  { url: "/images/photo-2.jpg", sortOrder: 1 },
  { url: "/images/photo-3.jpg", sortOrder: 2 },
  { url: "/images/photo-4.jpg", sortOrder: 3 },
];

/** All 4 test wishes — same content, different layout modes */
export const TEST_WISHES: Array<{
  slug: string;
  title: string;
  flowMode: FlowMode;
  label: string;
}> = [
  {
    slug: "happy-birthday-sarah",
    title: "Happy Birthday, ဂျူလီယာ!",
    flowMode: "scroll",
    label: "Scroll layout (original)",
  },
  {
    slug: "demo-scroll",
    title: "Demo — Scroll Layout",
    flowMode: "scroll",
    label: "Scroll layout (demo)",
  },
  {
    slug: "demo-pages",
    title: "Demo — Pages Layout",
    flowMode: "buttons",
    label: "Pages layout (button navigation)",
  },
  {
    slug: "demo-interactive",
    title: "Demo — Interactive Layout",
    flowMode: "tap-to-reveal",
    label: "Interactive layout (tap-to-reveal)",
  },
];

/** Build the full WishConfig the seed persists for one flow mode. */
export const buildWishConfig = (flowMode: FlowMode): WishConfig => ({
  stages: SHARED_STAGES,
  content: SHARED_CONTENT,
  // Casual names for sender-voice copy slots; DB columns hold the full names
  recipientNickname: "ကလေး",
  senderNickname: "ကိုကို",
  settings: {
    ...SHARED_SETTINGS_BASE,
    intensity: "celebration",
    flowMode,
  },
});
