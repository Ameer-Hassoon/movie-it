import { describe, expect, it } from "vitest";
import {
  certification,
  runtime,
  trailerKey,
  uniqueById,
  year,
} from "../api/tmdbHelpers.js";

describe("year", () => {
  it("reads release_date for movies", () => {
    expect(year({ release_date: "1999-03-30" })).toBe("1999");
  });

  it("falls back to first_air_date for shows", () => {
    expect(year({ first_air_date: "2019-12-18" })).toBe("2019");
  });

  it("returns N/A when there is no date", () => {
    expect(year({})).toBe("N/A");
    expect(year(null)).toBe("N/A");
  });
});

describe("uniqueById", () => {
  it("keeps the first occurrence and drops falsy rows", () => {
    const list = [
      { id: 1, title: "one" },
      { id: 2, title: "two" },
      { id: 1, title: "duplicate" },
      null,
      { id: 3, title: "three" },
    ];

    expect(uniqueById(list)).toEqual([
      { id: 1, title: "one" },
      { id: 2, title: "two" },
      { id: 3, title: "three" },
    ]);
  });

  it("defaults to an empty list", () => {
    expect(uniqueById()).toEqual([]);
  });
});

const movieDetails = {
  release_dates: {
    results: [
      {
        iso_3166_1: "DE",
        release_dates: [{ certification: "12" }],
      },
      {
        iso_3166_1: "US",
        release_dates: [{ certification: "" }, { certification: "R" }],
      },
    ],
  },
};

const tvDetails = {
  content_ratings: {
    results: [
      { iso_3166_1: "GB", rating: "15" },
      { iso_3166_1: "US", rating: "TV-MA" },
    ],
  },
};

describe("certification", () => {
  it("prefers the US movie certification", () => {
    expect(certification("movie", movieDetails)).toBe("R");
  });

  it("falls back to the first available movie certification", () => {
    expect(
      certification("movie", {
        release_dates: {
          results: [
            { iso_3166_1: "US", release_dates: [{ certification: "" }] },
            { iso_3166_1: "JP", release_dates: [{ certification: "PG12" }] },
          ],
        },
      })
    ).toBe("PG12");
  });

  it("prefers the US TV rating and falls back otherwise", () => {
    expect(certification("tv", tvDetails)).toBe("TV-MA");
    expect(
      certification("tv", {
        content_ratings: { results: [{ iso_3166_1: "FR", rating: "16" }] },
      })
    ).toBe("16");
  });

  it("returns N/A without ratings", () => {
    expect(certification("movie", {})).toBe("N/A");
    expect(certification("tv", { content_ratings: { results: [] } })).toBe("N/A");
  });
});

describe("trailerKey", () => {
  const base = { site: "YouTube", key: "key" };

  it("prefers the official trailer", () => {
    const videos = {
      results: [
        { ...base, type: "Trailer", official: false, key: "unofficial" },
        { ...base, type: "Teaser", official: true, key: "teaser" },
        { ...base, type: "Trailer", official: true, key: "official" },
      ],
    };

    expect(trailerKey(videos)).toBe("official");
  });

  it("falls back to any YouTube trailer, then a teaser", () => {
    expect(
      trailerKey({
        results: [
          { ...base, type: "Clip", key: "clip" },
          { ...base, type: "Trailer", key: "trailer" },
        ],
      })
    ).toBe("trailer");

    expect(
      trailerKey({ results: [{ ...base, type: "Teaser", key: "teaser" }] })
    ).toBe("teaser");

    expect(
      trailerKey({
        results: [
          { ...base, type: "Clip", key: "clip" },
          { site: "Vimeo", type: "Trailer", key: "vimeo" },
        ],
      })
    ).toBe("");
  });

  it("returns an empty string without videos", () => {
    expect(trailerKey(undefined)).toBe("");
    expect(trailerKey({ results: [] })).toBe("");
  });
});

describe("runtime", () => {
  it("formats hours and minutes", () => {
    expect(runtime(135)).toBe("2h 15m");
    expect(runtime(120)).toBe("2h");
    expect(runtime(45)).toBe("45m");
  });

  it("returns an empty string for missing or zero runtime", () => {
    expect(runtime(0)).toBe("");
    expect(runtime(undefined)).toBe("");
  });
});
