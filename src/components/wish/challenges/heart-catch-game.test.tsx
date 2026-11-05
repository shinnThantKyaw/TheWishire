/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { HeartCatchGame } from "./heart-catch-game";
import { copy, interpolate } from "@/config/copy";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

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
});

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date"],
  });
});

const HEARTS = 2;
const SECONDS = 10;

const renderGame = (onComplete = vi.fn()) => {
  const utils = render(
    <HeartCatchGame
      heartsToCatch={HEARTS}
      timeLimitSeconds={SECONDS}
      spawnIntervalMs={500}
      onComplete={onComplete}
      primaryColor="#E91E63"
      foregroundColor="#1A1A1A"
    />,
  );
  return { ...utils, onComplete };
};

const startGame = () => {
  fireEvent.click(screen.getByRole("button", { name: copy.challenges.heartCatch.start }));
};

const getHearts = () => screen.getAllByRole("button", { name: "❤️" });
// getAllByRole throws on empty — use query for the zero-heart assertions
const queryHearts = () => screen.queryAllByRole("button", { name: "❤️" });

describe("HeartCatchGame", () => {
  it("shows the interpolated intro before starting", () => {
    renderGame();
    expect(
      screen.getByText(
        interpolate(copy.challenges.heartCatch.intro, { hearts: HEARTS, seconds: SECONDS }),
      ),
    ).toBeDefined();
    expect(queryHearts()).toHaveLength(0);
  });

  it("spawns hearts while playing and counts catches toward the goal", () => {
    renderGame();
    startGame();

    act(() => vi.advanceTimersByTime(600));
    expect(getHearts().length).toBeGreaterThan(0);

    fireEvent.click(getHearts()[0]);
    expect(
      screen.getByText(interpolate(copy.challenges.heartCatch.progress, { caught: 1, hearts: HEARTS })),
    ).toBeDefined();
  });

  it("validates with the server on reaching the goal and completes", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { onComplete } = renderGame();

    startGame();
    // t=600ms: first catch; cross the 1s server floor; t=1100ms: second catch
    act(() => vi.advanceTimersByTime(600));
    fireEvent.click(getHearts()[0]);
    act(() => vi.advanceTimersByTime(500));
    fireEvent.click(getHearts()[0]);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.type).toBe("heart-catch");
    expect(body.caught).toBe(HEARTS);
    expect(body.elapsedMs).toBeGreaterThanOrEqual(1000);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(900);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("fails when time runs out before the goal is reached", () => {
    renderGame();
    startGame();

    act(() => vi.advanceTimersByTime((SECONDS + 1) * 1000));

    expect(screen.getByText(copy.challenges.heartCatch.timeUp)).toBeDefined();
    // Retry button back at a fresh run
    expect(
      screen.getByRole("button", { name: copy.challenges.heartCatch.start }),
    ).toBeDefined();
  });

  it("returns to a playable state after retrying a failed run", () => {
    renderGame();
    startGame();
    act(() => vi.advanceTimersByTime((SECONDS + 1) * 1000));

    fireEvent.click(screen.getByRole("button", { name: copy.challenges.heartCatch.start }));
    act(() => vi.advanceTimersByTime(600));

    expect(getHearts().length).toBeGreaterThan(0);
    expect(screen.queryByText(copy.challenges.heartCatch.timeUp)).toBeNull();
  });
});
