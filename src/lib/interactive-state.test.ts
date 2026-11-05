import { describe, it, expect } from "vitest";
import {
  initialInteractiveState,
  interactiveReducer,
  allOpened,
} from "./interactive-state";

describe("interactiveReducer", () => {
  it("open marks a chapter opened and sets it active", () => {
    const state = interactiveReducer(initialInteractiveState, { type: "open", index: 0 });
    expect(state.active).toBe(0);
    expect(state.opened[0]).toBe(true);
    expect(allOpened(state)).toBe(false);
  });

  it("opening the gift does NOT mark it opened — only gift-finish does", () => {
    const opened = interactiveReducer(initialInteractiveState, { type: "open", index: 5 });
    expect(opened.active).toBe(5);
    expect(opened.opened[5]).toBe(false);
    expect(allOpened(opened)).toBe(false);

    const finished = interactiveReducer(opened, { type: "gift-finish" });
    expect(finished.opened[5]).toBe(true);
    expect(finished.active).toBe(5); // overlay stays until user closes
  });

  it("close clears active but keeps opened state", () => {
    let state = interactiveReducer(initialInteractiveState, { type: "open", index: 2 });
    state = interactiveReducer(state, { type: "close" });
    expect(state.active).toBeNull();
    expect(state.opened[2]).toBe(true);
  });

  it("allOpened needs chapters 0-4 AND the finished gift", () => {
    let state = initialInteractiveState;
    for (const index of [0, 1, 2, 3, 4] as const) {
      state = interactiveReducer(state, { type: "open", index });
      state = interactiveReducer(state, { type: "close" });
    }
    expect(allOpened(state)).toBe(false); // gift still unopened

    state = interactiveReducer(state, { type: "open", index: 5 });
    state = interactiveReducer(state, { type: "gift-finish" });
    state = interactiveReducer(state, { type: "close" });
    expect(allOpened(state)).toBe(true);
  });

  it("gift-finish alone is not enough — other chapters must be opened too", () => {
    const state = interactiveReducer(initialInteractiveState, { type: "gift-finish" });
    expect(state.opened[5]).toBe(true);
    expect(allOpened(state)).toBe(false);
  });
});
