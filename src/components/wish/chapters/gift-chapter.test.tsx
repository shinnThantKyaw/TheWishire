/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { GiftChapter } from "./gift-chapter";
import type { GiftChallengeConfig } from "@/types/wish";

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
  // Relative fetch URLs are unsupported outside a server; stub for jsdom.
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
  );
});

const renderMainGift = () =>
  render(
    <GiftChapter
      giftSubScreen="main-gift"
      recipientName="ဂျူလီယာ"
      senderName="ကိုသျှား"
      recipientNickname="ကလေး"
      senderNickname="ကိုကို"
      onNextSubScreen={() => {}}
    />,
  );

const getDislikeButton = () =>
  screen.getByRole("button", { name: "သဘောမကျဘူး" });

describe("MainGiftReveal tease interaction", () => {
  it("shows tease line 1 only after first dislike click, keeping both buttons", () => {
    renderMainGift();

    expect(getDislikeButton()).toBeDefined();
    expect(screen.queryByText(/တကယ်သဘောမကျဘူးလားဟင်/)).toBeNull();

    fireEvent.click(getDislikeButton());

    expect(screen.getByText(/တကယ်သဘောမကျဘူးလားဟင်/)).toBeDefined();
    expect(getDislikeButton()).toBeDefined();
  });

  it("replaces the previous tease line when the next one appears", async () => {
    renderMainGift();

    fireEvent.click(getDislikeButton()); // → line 1
    expect(screen.getByText(/တကယ်သဘောမကျဘူးလားဟင်/)).toBeDefined();

    fireEvent.click(getDislikeButton()); // → line 2 replaces line 1
    await waitFor(
      () => {
        expect(
          screen.getByText(/ကိုကိုကတော့ စိတ်မကောင်းဖြစ်သွားပြီ/),
        ).toBeDefined();
        expect(screen.queryByText(/တကယ်သဘောမကျဘူးလားဟင်/)).toBeNull();
      },
      { timeout: 3000 },
    );
    expect(screen.queryByText(/စနေတာ မလားဟင်/)).toBeNull();
    expect(getDislikeButton()).toBeDefined();

    fireEvent.click(getDislikeButton()); // → line 3 replaces line 2
    await waitFor(
      () => {
        expect(screen.getByText(/စနေတာ မလားဟင်/)).toBeDefined();
        expect(
          screen.queryByText(/ကိုကိုကတော့ စိတ်မကောင်းဖြစ်သွားပြီ/),
        ).toBeNull();
      },
      { timeout: 3000 },
    );
    expect(getDislikeButton()).toBeDefined();
  });

  it("removes the dislike button and shows the final line on the last click", async () => {
    renderMainGift();

    fireEvent.click(getDislikeButton());
    fireEvent.click(getDislikeButton());
    fireEvent.click(getDislikeButton());
    fireEvent.click(getDislikeButton()); // → line 4, deny exits

    await waitFor(
      () => {
        expect(screen.getByText(/သဘောကျလိုက်ပေါနော်/)).toBeDefined();
        // exit animation keeps the button mounted until AnimatePresence finishes
        expect(
          screen.queryByRole("button", { name: "သဘောမကျဘူး" }),
        ).toBeNull();
      },
      { timeout: 3000 },
    );
    // agree button (kidding label) still available to continue
    expect(
      screen.getByRole("button", { name: "စတာပါ သဘောကျတယ်နော်" }),
    ).toBeDefined();
  });

  it("flips the agree button label after the first dislike click", () => {
    renderMainGift();

    expect(screen.getByRole("button", { name: "အရမ်းသဘောကျတယ်" })).toBeDefined();
    fireEvent.click(getDislikeButton());
    expect(
      screen.getByRole("button", { name: "စတာပါ သဘောကျတယ်နော်" }),
    ).toBeDefined();
  });
});

describe("GiftGate challenge instruction", () => {
  const renderGate = (challenge: GiftChallengeConfig) =>
    render(
      <GiftChapter
        giftSubScreen="challenge"
        recipientName="ဂျူလီယာ"
        senderName="ကိုသျှား"
        recipientNickname="ကလေး"
        senderNickname="ကိုကို"
        config={{ challenge }}
        onNextSubScreen={() => {}}
      />,
    );

  it("shows the multiple-choice instruction for MC challenges", () => {
    renderGate({
      type: "multiple-choice",
      question: "အနီရောင်က ဘာလဲ?",
      options: ["နှင်းဆီ", "ယုန်"],
      correctIndex: 0,
    });

    expect(
      screen.getByText(/ဘာလဲသိချင်ရင် အောက်ကအဖြေကိုမှန်အောင်ရွေးနော်/),
    ).toBeDefined();
    expect(screen.queryByText(/passcode/)).toBeNull();
  });

  it("shows the game instruction for heart-catch challenges", () => {
    renderGate({ type: "heart-catch", heartsToCatch: 8, timeLimitSeconds: 15 });

    expect(
      screen.getByText(/ဘာလဲသိချင်ရင် အောက်ကဂိမ်းလေးကိုနိုင်အောင်ဆော့နော်/),
    ).toBeDefined();
    expect(screen.queryByText(/passcode/)).toBeNull();
  });

  it("keeps the passcode instruction for PIN challenges", () => {
    renderGate({ type: "pin", pin: "1609", hint: "ချစ်သူ့မွေးနေ့" });

    expect(screen.getByText(/passcode လေးကို မှန်အောင်ဖြေနော်/)).toBeDefined();
  });
});
