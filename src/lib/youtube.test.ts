import { describe, it, expect } from "vitest";
import { extractYouTubeId, youTubeThumbnail } from "./youtube";

describe("extractYouTubeId", () => {
  it("parses standard watch URLs", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=uRFJzVyR7X8")).toBe(
      "uRFJzVyR7X8",
    );
  });

  it("parses youtu.be short URLs with extra params", () => {
    expect(extractYouTubeId("https://youtu.be/uRFJzVyR7X8?si=abc")).toBe(
      "uRFJzVyR7X8",
    );
  });

  it("parses shorts and embed paths", () => {
    expect(extractYouTubeId("https://www.youtube.com/shorts/uRFJzVyR7X8")).toBe(
      "uRFJzVyR7X8",
    );
    expect(extractYouTubeId("https://www.youtube.com/embed/uRFJzVyR7X8")).toBe(
      "uRFJzVyR7X8",
    );
  });

  it("accepts bare video IDs", () => {
    expect(extractYouTubeId("uRFJzVyR7X8")).toBe("uRFJzVyR7X8");
  });

  it("adds https:// to protocol-less URLs", () => {
    expect(extractYouTubeId("youtube.com/watch?v=uRFJzVyR7X8")).toBe(
      "uRFJzVyR7X8",
    );
  });

  it("rejects garbage", () => {
    expect(extractYouTubeId("")).toBeNull();
    expect(extractYouTubeId("not a url")).toBeNull();
    expect(extractYouTubeId("https://example.com/watch?v=uRFJzVyR7X8")).toBeNull();
    expect(extractYouTubeId("https://www.youtube.com/watch?v=short")).toBeNull();
    expect(extractYouTubeId("https://www.youtube.com/playlist?list=PL123")).toBeNull();
  });
});

describe("youTubeThumbnail", () => {
  it("builds the hqdefault thumbnail URL", () => {
    expect(youTubeThumbnail("uRFJzVyR7X8")).toBe(
      "https://img.youtube.com/vi/uRFJzVyR7X8/hqdefault.jpg",
    );
  });
});
