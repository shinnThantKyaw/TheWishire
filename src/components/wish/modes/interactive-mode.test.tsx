/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { InteractiveMode } from "./interactive-mode";
import { MATERIALS } from "./materials";
import { copy } from "@/config/copy";
import type { MergedStage } from "@/types/wish";
import type { ChapterIndex, GiftSubScreen } from "@/types/experience";

// vitest globals are off, so RTL's automatic cleanup never registers.
afterEach(cleanup);

// jsdom lacks matchMedia; motion's useReducedMotion needs it.
beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }
  if (!globalThis.crypto?.randomUUID) {
    vi.stubGlobal("crypto", {
      ...globalThis.crypto,
      randomUUID: () => Math.random().toString(36).slice(2),
    });
  }
  if (!globalThis.ResizeObserver) {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  }
  // Relative fetch URLs are unsupported outside a server; stub for jsdom.
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
  );
});

const LETTER_TEXT = "စာအကြောင်းအရာ စမ်းသပ်ချက်";

const makeStages = (): MergedStage[] => [
  {
    type: "letter",
    enabled: true,
    props: {},
    content: { photos: [], letter: LETTER_TEXT },
  },
  { type: "photos", enabled: true, props: {}, content: { photos: [] } },
  { type: "poem", enabled: true, props: {}, content: { photos: [] } },
  { type: "song", enabled: true, props: {}, content: { photos: [] } },
  { type: "timeline", enabled: true, props: {}, content: { photos: [] } },
];

interface RenderOptions {
  giftSubScreen?: GiftSubScreen;
  onComplete?: () => void;
}

const renderMode = ({
  giftSubScreen = "challenge",
  onComplete = vi.fn(),
}: RenderOptions = {}) => {
  const observeChapter = vi.fn();
  const utils = render(
    <InteractiveMode
      stages={makeStages()}
      recipientName="ဂျူလီယာ"
      senderName="ကိုသျှား"
      recipientNickname="ကလေး"
      senderNickname="ကိုကို"
      primaryColor="#E91E63"
      giftSubScreen={giftSubScreen}
      onNextGiftSubScreen={vi.fn()}
      observeChapter={observeChapter}
      onComplete={onComplete}
    />,
  );
  return { ...utils, observeChapter, onComplete };
};

const getMaterialButton = (label: string) =>
  screen.getByRole("button", { name: label });

const getCloseButton = () =>
  screen.getByRole("button", { name: copy.modes.interactive.closeAria });

/** Open a material from the grid, then close its overlay. */
const openAndClose = (label: string) => {
  fireEvent.click(getMaterialButton(label));
  fireEvent.click(getCloseButton());
};

const NON_GIFT_LABELS = MATERIALS.filter((m) => m.chapterIndex !== 5).map(
  (m) => m.label,
);

describe("InteractiveMode grid", () => {
  it("renders all six materials with their Burmese labels", () => {
    renderMode();

    for (const material of MATERIALS) {
      expect(getMaterialButton(material.label)).toBeDefined();
    }
    expect(MATERIALS).toHaveLength(6);
  });

  it("tapping a material opens the overlay with its chapter content", () => {
    renderMode();

    fireEvent.click(getMaterialButton("စာလေး"));

    expect(screen.getByText(LETTER_TEXT)).toBeDefined();
    expect(
      screen.getByRole("button", { name: copy.modes.interactive.closeAria }),
    ).toBeDefined();
    // Grid is inert while the overlay is open
    expect(getMaterialButton("စာလေး").closest("[inert]")).not.toBeNull();
  });

  it("closing the overlay returns to the grid and keeps the opened glow", () => {
    renderMode();

    openAndClose("စာလေး");

    const letter = getMaterialButton("စာလေး");
    expect(letter.getAttribute("aria-pressed")).toBe("true");
    // Visited chapter stays mounted (hidden), so reopening preserves state
    expect(screen.getByText(LETTER_TEXT)).toBeDefined();
  });

  it("reports the opened material for progress sync", () => {
    const { observeChapter } = renderMode();

    fireEvent.click(getMaterialButton("ဓာတ်ပုံတွေ"));

    expect(observeChapter).toHaveBeenCalledWith(1 satisfies ChapterIndex);
  });
});

describe("InteractiveMode gift finish", () => {
  it("gift-finish marks the gift opened and returns to the grid", () => {
    const { onComplete } = renderMode({ giftSubScreen: "reward-result" });

    fireEvent.click(getMaterialButton("လက်ဆောင်"));
    // Reward-result continue button (last gift sub-screen)
    fireEvent.click(screen.getByRole("button", { name: "ဆက်သွားမယ်" }));

    expect(getMaterialButton("လက်ဆောင်").getAttribute("aria-pressed")).toBe(
      "true",
    );
    // Not all materials opened yet → no auto-advance
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("auto-advances to closing once every material is opened", () => {
    const { onComplete } = renderMode({ giftSubScreen: "reward-result" });

    for (const label of NON_GIFT_LABELS) {
      openAndClose(label);
    }
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(getMaterialButton("လက်ဆောင်"));
    fireEvent.click(screen.getByRole("button", { name: "ဆက်သွားမယ်" }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
