/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MusicPicker } from "./music-picker";
import { MUSIC_TRACKS } from "@/config/music";

const playSpy = vi
  .spyOn(HTMLAudioElement.prototype, "play")
  .mockResolvedValue(undefined);
vi.spyOn(HTMLAudioElement.prototype, "pause").mockImplementation(() => {});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  playSpy.mockResolvedValue(undefined);
});

describe("MusicPicker", () => {
  it("renders every catalog track by name", () => {
    render(<MusicPicker value={undefined} onChange={vi.fn()} />);
    for (const track of MUSIC_TRACKS) {
      expect(screen.getByText(track.title)).toBeTruthy();
    }
  });

  it("selects a track on row click and reports its src", () => {
    const onChange = vi.fn();
    render(<MusicPicker value={undefined} onChange={onChange} />);
    const track = MUSIC_TRACKS[1];
    fireEvent.click(screen.getByText(track.title));
    expect(onChange).toHaveBeenCalledWith(track.src);
  });

  it("marks the stored track as pressed", () => {
    render(<MusicPicker value={MUSIC_TRACKS[0].src} onChange={vi.fn()} />);
    const selected = screen.getByRole("button", {
      name: MUSIC_TRACKS[0].title,
    });
    const other = screen.getByRole("button", { name: MUSIC_TRACKS[1].title });
    expect(selected.getAttribute("aria-pressed")).toBe("true");
    expect(other.getAttribute("aria-pressed")).toBe("false");
  });

  it("previews a track without changing the selection", () => {
    const onChange = vi.fn();
    render(<MusicPicker value={undefined} onChange={onChange} />);
    const track = MUSIC_TRACKS[0];
    fireEvent.click(screen.getByRole("button", { name: `Preview ${track.title}` }));
    expect(playSpy).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reveals the custom-link field and writes typed URLs", () => {
    const onChange = vi.fn();
    render(<MusicPicker value={undefined} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /use your own link/i }));
    const input = screen.getByRole("textbox", { name: /custom music file url/i });
    fireEvent.change(input, { target: { value: "/music/custom.mp3" } });
    expect(onChange).toHaveBeenCalledWith("/music/custom.mp3");
  });

  it("clears a custom value when the field is emptied", () => {
    const onChange = vi.fn();
    render(<MusicPicker value="/music/custom.mp3" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: /custom music file url/i });
    fireEvent.change(input, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("auto-opens the custom field for non-catalog values", () => {
    render(<MusicPicker value="/music/other.mp3" onChange={vi.fn()} />);
    const input = screen.getByRole("textbox", { name: /custom music file url/i });
    expect((input as HTMLInputElement).value).toBe("/music/other.mp3");
  });
});
