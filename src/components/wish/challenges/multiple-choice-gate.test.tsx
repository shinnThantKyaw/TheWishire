/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { MultipleChoiceGate } from "./multiple-choice-gate";
import { copy } from "@/config/copy";

afterEach(cleanup);

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

const QUESTION = "ကျွန်တော်တို့ တွေ့ခဲ့တဲ့နေ့က ဘယ်နှစ်လလဲ?";
const OPTIONS = ["မတ်လ", "စက်တင်ဘာလ", "ဒီဇင်ဘာလ"];

const renderGate = (onComplete = vi.fn()) => {
  const utils = render(
    <MultipleChoiceGate
      question={QUESTION}
      options={OPTIONS}
      onComplete={onComplete}
      primaryColor="#E91E63"
      foregroundColor="#1A1A2E"
    />,
  );
  return { ...utils, onComplete };
};

const mockFetch = (ok: boolean, status: number) =>
  vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => ({ ok }),
  });

describe("MultipleChoiceGate", () => {
  it("renders the question and every option", () => {
    renderGate();
    expect(screen.getByText(QUESTION)).toBeDefined();
    for (const option of OPTIONS) {
      expect(screen.getByRole("button", { name: option })).toBeDefined();
    }
  });

  it("submits the picked index and completes on a server yes", async () => {
    const fetchMock = mockFetch(true, 200);
    vi.stubGlobal("fetch", fetchMock);
    const { onComplete } = renderGate();

    fireEvent.click(screen.getByRole("button", { name: "စက်တင်ဘာလ" }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/challenge");
    expect(JSON.parse(init.body as string)).toEqual({
      type: "multiple-choice",
      answerIndex: 1,
    });

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });
  });

  it("shows the wrong-answer message when the server rejects", async () => {
    vi.stubGlobal("fetch", mockFetch(false, 400));
    const { onComplete } = renderGate();

    fireEvent.click(screen.getByRole("button", { name: "မတ်လ" }));

    await waitFor(() =>
      expect(screen.getByText(copy.challenges.multipleChoice.wrong)).toBeDefined(),
    );
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("shows a retryable network error when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("offline")),
    );
    const { onComplete } = renderGate();

    fireEvent.click(screen.getByRole("button", { name: "ဒီဇင်ဘာလ" }));

    await waitFor(() =>
      expect(screen.getByText(copy.challenges.networkError)).toBeDefined(),
    );
    expect(onComplete).not.toHaveBeenCalled();
  });
});
