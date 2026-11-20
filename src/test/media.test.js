import { describe, expect, it } from "vitest";
import { pickVideos } from "../lib/media.js";

const video = (
  id,
  type,
  {
    official = false,
    site = "YouTube",
    published_at = "2020-01-01T00:00:00.000Z",
  } = {}
) => ({
  id,
  key: `key-${id}`,
  name: id,
  site,
  type,
  official,
  published_at,
});

const ids = (videos, max) => pickVideos(videos, max).map((v) => v.id);

describe("pickVideos", () => {
  it("keeps only YouTube videos of the supported types", () => {
    const videos = {
      results: [
        video("trailer", "Trailer"),
        video("recap", "Recap"),
        video("vimeo", "Trailer", { site: "Vimeo" }),
        video("teaser", "Teaser"),
        video("opening", "Opening Credits"),
      ],
    };

    expect(ids(videos)).toEqual(["trailer", "teaser"]);
  });

  it("orders by type: trailer, teaser, clip, featurette, behind the scenes, bloopers", () => {
    const videos = {
      results: [
        video("bloopers", "Bloopers", { published_at: "2021-06-01T00:00:00.000Z" }),
        video("behind", "Behind the Scenes", {
          published_at: "2021-05-01T00:00:00.000Z",
        }),
        video("featurette", "Featurette", {
          published_at: "2021-04-01T00:00:00.000Z",
        }),
        video("clip", "Clip", { published_at: "2021-03-01T00:00:00.000Z" }),
        video("teaser", "Teaser", { published_at: "2021-02-01T00:00:00.000Z" }),
        video("trailer", "Trailer", { published_at: "2021-01-01T00:00:00.000Z" }),
      ],
    };

    expect(ids(videos)).toEqual([
      "trailer",
      "teaser",
      "clip",
      "featurette",
      "behind",
      "bloopers",
    ]);
  });

  it("prefers official videos within the same type", () => {
    const videos = {
      results: [
        video("unofficial", "Trailer", { official: false }),
        video("official", "Trailer", { official: true }),
      ],
    };

    expect(ids(videos)).toEqual(["official", "unofficial"]);
  });

  it("sorts newest first when type and official status match", () => {
    const videos = {
      results: [
        video("old", "Trailer", {
          official: true,
          published_at: "2019-01-01T00:00:00.000Z",
        }),
        video("new", "Trailer", {
          official: true,
          published_at: "2021-01-01T00:00:00.000Z",
        }),
        video("mid", "Trailer", {
          official: true,
          published_at: "2020-06-01T00:00:00.000Z",
        }),
      ],
    };

    expect(ids(videos)).toEqual(["new", "mid", "old"]);
  });

  it("applies the ordering across mixed types", () => {
    const videos = {
      results: [
        video("old-official-teaser", "Teaser", {
          official: true,
          published_at: "2019-01-01T00:00:00.000Z",
        }),
        video("new-unofficial-trailer", "Trailer", {
          official: false,
          published_at: "2021-01-01T00:00:00.000Z",
        }),
      ],
    };

    expect(ids(videos)).toEqual([
      "new-unofficial-trailer",
      "old-official-teaser",
    ]);
  });

  it("defaults to at most 12 videos", () => {
    const videos = {
      results: Array.from({ length: 15 }, (_, i) =>
        video(`trailer-${i}`, "Trailer", {
          published_at: `2020-01-${String(i + 1).padStart(2, "0")}T00:00:00.000Z`,
        })
      ),
    };

    expect(pickVideos(videos)).toHaveLength(12);
  });

  it("respects an explicit maximum", () => {
    const videos = {
      results: Array.from({ length: 5 }, (_, i) =>
        video(`clip-${i}`, "Clip", {
          published_at: `2020-01-0${i + 1}T00:00:00.000Z`,
        })
      ),
    };

    expect(ids(videos, 3)).toEqual(["clip-4", "clip-3", "clip-2"]);
    expect(pickVideos(videos, 0)).toEqual([]);
    expect(pickVideos(videos, 99)).toHaveLength(5);
  });

  it("returns an empty list for missing or empty input", () => {
    expect(pickVideos(undefined)).toEqual([]);
    expect(pickVideos(null)).toEqual([]);
    expect(pickVideos({})).toEqual([]);
    expect(pickVideos({ results: [] })).toEqual([]);
    expect(pickVideos({ results: [video("recap", "Recap")] })).toEqual([]);
  });

  it("does not mutate the input list", () => {
    const videos = {
      results: [
        video("a", "Clip"),
        video("b", "Trailer"),
        video("c", "Teaser"),
      ],
    };
    const before = videos.results.map((v) => v.id);

    pickVideos(videos);

    expect(videos.results.map((v) => v.id)).toEqual(before);
  });
});
