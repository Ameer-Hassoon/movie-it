import { afterEach, describe, expect, it, vi } from "vitest";
import {
  languageName,
  longDate,
  money,
  regionName,
  reviewText,
  userRegion,
} from "../lib/format.js";

// Node 22 (what CI runs) keeps a trailing zero for compact notation ("$160.0M");
// Node 24+ drops it ("$160M"). Normalize just that quirk so the spec's expected
// strings hold on both runtimes.
const compact = (value) => money(value).replace(/\.0(?=[KMB]$)/, "");

describe("money", () => {
  it("formats compact USD amounts", () => {
    expect(compact(160000000)).toBe("$160M");
    expect(compact(839030630)).toBe("$839M");
    expect(money(1200000000)).toBe("$1.2B");
  });

  it("returns an empty string for unknown or zero amounts", () => {
    expect(money(0)).toBe("");
    expect(money()).toBe("");
    expect(money(null)).toBe("");
    expect(money(undefined)).toBe("");
  });
});

describe("longDate", () => {
  it("formats an ISO date as a long US date", () => {
    expect(longDate("2010-07-15")).toBe("July 15, 2010");
  });

  it("builds a local calendar date, so no timezone can shift the day", () => {
    const spy = vi
      .spyOn(Date.prototype, "toLocaleDateString")
      .mockImplementation(function () {
        return `${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()}`;
      });

    expect(longDate("2010-07-15")).toBe("2010-7-15");

    spy.mockRestore();
  });

  it("keeps the day under other timezones", () => {
    const original = process.env.TZ;
    try {
      for (const tz of [
        "UTC",
        "America/Los_Angeles",
        "Pacific/Kiritimati",
        "Asia/Tokyo",
      ]) {
        process.env.TZ = tz;
        expect(longDate("2010-07-15")).toBe("July 15, 2010");
        expect(longDate("2010-01-01")).toBe("January 1, 2010");
      }
    } finally {
      if (original === undefined) delete process.env.TZ;
      else process.env.TZ = original;
    }
  });

  it("returns an empty string for missing dates", () => {
    expect(longDate("")).toBe("");
    expect(longDate()).toBe("");
    expect(longDate(null)).toBe("");
    expect(longDate(undefined)).toBe("");
  });

  it("defaults to January 1 for a bare year", () => {
    expect(longDate("2010")).toBe("January 1, 2010");
  });
});

describe("languageName", () => {
  it("maps ISO language codes to English names", () => {
    expect(languageName("en")).toBe("English");
    expect(languageName("ja")).toBe("Japanese");
  });

  it("returns an empty string without a code", () => {
    expect(languageName("")).toBe("");
    expect(languageName()).toBe("");
  });

  it("never throws for an unknown code", () => {
    expect(() => languageName("zz")).not.toThrow();
    expect(typeof languageName("zz")).toBe("string");
    expect(languageName("zz")).toBeTruthy();
  });
});

describe("regionName", () => {
  it("maps ISO region codes to English names", () => {
    expect(regionName("GB")).toBe("United Kingdom");
    expect(regionName("US")).toBe("United States");
  });

  it("returns an empty string without a code", () => {
    expect(regionName("")).toBe("");
    expect(regionName()).toBe("");
  });
});

describe("userRegion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("derives the region from the first locale that carries one", () => {
    vi.stubGlobal("navigator", { languages: ["en-GB"], language: "en-GB" });
    expect(userRegion()).toBe("GB");

    vi.stubGlobal("navigator", {
      languages: ["en-GB", "fr-FR"],
      language: "en-GB",
    });
    expect(userRegion()).toBe("GB");
  });

  it("maximizes a bare language tag to its likely region", () => {
    vi.stubGlobal("navigator", { languages: ["fr"], language: "fr" });
    expect(userRegion()).toBe("FR");
  });

  it("falls back to US without a usable locale", () => {
    vi.stubGlobal("navigator", { languages: [] });
    expect(userRegion()).toBe("US");

    vi.stubGlobal("navigator", { languages: undefined, language: undefined });
    expect(userRegion()).toBe("US");

    vi.stubGlobal("navigator", {});
    expect(userRegion()).toBe("US");
  });
});

describe("reviewText", () => {
  it("strips _emphasis_ pairs but keeps underscores inside words", () => {
    expect(reviewText("An _italic_ word and my_var_name stay.")).toBe("An italic word and my_var_name stay.");
  });

  it("strips HTML tags", () => {
    expect(reviewText("<p>Great <b>film</b>.</p><br />")).toBe("Great film.");
  });

  it("removes markdown emphasis markers", () => {
    expect(reviewText("**bold** and *italic* and __under__")).toBe(
      "bold and italic and under"
    );
  });

  it("normalizes line endings and collapses blank-line runs", () => {
    expect(reviewText("a\r\nb")).toBe("a\nb");
    expect(reviewText("a\n\n\n\nb")).toBe("a\n\nb");
    expect(reviewText("a\r\n\r\n\r\nb")).toBe("a\n\nb");
  });

  it("trims surrounding whitespace", () => {
    expect(reviewText("\n  spaced  \n")).toBe("spaced");
    expect(reviewText()).toBe("");
  });
});
