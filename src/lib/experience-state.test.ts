// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExperienceState } from "./experience-state";

describe("useExperienceState.observeChapter", () => {
  it("sets chapterIndex without resetting giftSubScreen", () => {
    const { result } = renderHook(() => useExperienceState("scroll"));

    // Move gift chapter mid-flow (e.g. user spun the wheel)
    act(() => result.current.actions.nextGiftSubScreen());
    expect(result.current.state.giftSubScreen).toBe("main-gift");

    // Scrolling to another section must not wipe that state
    act(() => result.current.actions.observeChapter(3));
    expect(result.current.state.chapterIndex).toBe(3);
    expect(result.current.state.giftSubScreen).toBe("main-gift");
    expect(result.current.state.phase).toBe("chapters");
  });

  it("keeps progress in step with the observed chapter", () => {
    const { result } = renderHook(() => useExperienceState("scroll"));

    act(() => result.current.actions.observeChapter(2));
    // 2 of 6 chapters complete → 2/6
    expect(result.current.state.progress).toBeCloseTo(2 / 6, 5);

    act(() => result.current.actions.observeChapter(5));
    expect(result.current.state.progress).toBeCloseTo(5 / 6, 5);
  });

  it("goToChapter still resets giftSubScreen (regression guard)", () => {
    const { result } = renderHook(() => useExperienceState("click-through"));

    act(() => result.current.actions.nextGiftSubScreen());
    expect(result.current.state.giftSubScreen).toBe("main-gift");

    act(() => result.current.actions.goToChapter(1));
    expect(result.current.state.chapterIndex).toBe(1);
    expect(result.current.state.giftSubScreen).toBe("challenge");
  });
});
