import { describe, it, expect } from "vitest";
import { GIFT_CHAPTER_INDEX, TOTAL_CHAPTERS } from "@/types/experience";
import { SCROLL_SECTIONS } from "./scroll-sections";

describe("SCROLL_SECTIONS", () => {
  it("lists all six chapters in reading order", () => {
    expect(SCROLL_SECTIONS.map((s) => s.id)).toEqual([
      "letter",
      "photos",
      "poem",
      "song",
      "timeline",
      "gift",
    ]);
    expect(SCROLL_SECTIONS.map((s) => s.chapterIndex)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(SCROLL_SECTIONS).toHaveLength(TOTAL_CHAPTERS);
  });

  it("maps content sections to their stage type and marks the gift island", () => {
    const byId = Object.fromEntries(SCROLL_SECTIONS.map((s) => [s.id, s]));
    expect(byId.letter.stageType).toBe("letter");
    expect(byId.photos.stageType).toBe("photos");
    expect(byId.poem.stageType).toBe("poem");
    expect(byId.song.stageType).toBe("song");
    expect(byId.timeline.stageType).toBe("timeline");

    expect(byId.gift.isGift).toBe(true);
    expect(byId.gift.chapterIndex).toBe(GIFT_CHAPTER_INDEX);
    expect(byId.gift.stageType).toBeUndefined();

    for (const section of SCROLL_SECTIONS) {
      if (section.id !== "gift") expect(section.isGift).toBe(false);
    }
  });
});
