import { describe, it, expect } from "vitest";
import { slugify, generateSlug } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates ASCII titles", () => {
    expect(slugify("Happy Birthday, Julia!")).toBe("happy-birthday-julia");
  });

  it("collapses punctuation and trims hyphens", () => {
    expect(slugify("  For  My Love?? ")).toBe("for-my-love");
  });

  it("falls back to 'wish' for non-Latin titles", () => {
    expect(slugify("မင်္ဂလာပါ")).toBe("wish");
    expect(slugify("!!!")).toBe("wish");
  });

  it("caps length and never ends with a hyphen", () => {
    const slug = slugify("a".repeat(200));
    expect(slug.length).toBeLessThanOrEqual(60);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("generateSlug", () => {
  it("appends a random suffix to the slugified title", () => {
    const slug = generateSlug("For Julia");
    expect(slug).toMatch(/^for-julia-[0-9a-z]{6}$/);
  });

  it("produces unique values across calls", () => {
    const seen = new Set(Array.from({ length: 50 }, () => generateSlug("For Julia")));
    expect(seen.size).toBe(50);
  });
});
