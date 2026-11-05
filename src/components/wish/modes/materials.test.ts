import { describe, it, expect } from "vitest";
import { copy } from "@/config/copy";
import { MATERIALS } from "./materials";

describe("MATERIALS", () => {
  it("has one material per chapter, in chapter order 0-5", () => {
    expect(MATERIALS.map((m) => m.chapterIndex)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(MATERIALS).toHaveLength(6);
  });

  it("gift is the last material", () => {
    expect(MATERIALS[5].chapterIndex).toBe(5);
    expect(MATERIALS[5].emoji).toBeTruthy();
  });

  it("labels come from copy.ts, not hardcoded strings", () => {
    const expected = copy.modes.interactive.materials;
    expect(MATERIALS[0].label).toBe(expected.letter);
    expect(MATERIALS[1].label).toBe(expected.photos);
    expect(MATERIALS[2].label).toBe(expected.poem);
    expect(MATERIALS[3].label).toBe(expected.song);
    expect(MATERIALS[4].label).toBe(expected.timeline);
    expect(MATERIALS[5].label).toBe(expected.gift);
    for (const material of MATERIALS) {
      expect(material.label.length).toBeGreaterThan(0);
    }
  });
});
