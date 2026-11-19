import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { discover, getPopular, searchTmdb } from "../api/tmdb.js";
import { usePagedSearch } from "../hooks/usePagedSearch.js";

vi.mock("../api/tmdb.js", () => ({
  getPopular: vi.fn(),
  searchTmdb: vi.fn(),
  discover: vi.fn(),
}));

function page(ids, totalPages = 1) {
  return {
    results: ids.map((id) => ({ id, title: `Title ${id}` })),
    total_results: ids.length * totalPages,
    total_pages: totalPages,
  };
}

const ids = (items) => items.map((item) => item.id);

describe("usePagedSearch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("searches when there is a query", async () => {
    searchTmdb.mockResolvedValue(page([1, 2]));

    const { result } = renderHook(() => usePagedSearch("movie", "dune"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(searchTmdb).toHaveBeenCalledTimes(1);
    expect(searchTmdb.mock.calls[0][0]).toBe("movie");
    expect(searchTmdb.mock.calls[0][1]).toBe("dune");
    expect(searchTmdb.mock.calls[0][2]).toBe(1);
    expect(getPopular).not.toHaveBeenCalled();
    expect(discover).not.toHaveBeenCalled();
    expect(ids(result.current.items)).toEqual([1, 2]);
  });

  it("ignores filters while searching (TMDB search has no genre filter)", async () => {
    searchTmdb.mockResolvedValue(page([1]));

    const { result } = renderHook(() =>
      usePagedSearch("movie", "dune", { genre: 28, sort: "vote_average.desc" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(searchTmdb).toHaveBeenCalledTimes(1);
    expect(discover).not.toHaveBeenCalled();
  });

  it("uses the popular endpoint when no filter is active", async () => {
    getPopular.mockResolvedValue(page([5]));

    const { result } = renderHook(() =>
      usePagedSearch("tv", "", { genre: "", sort: "popularity.desc" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(getPopular).toHaveBeenCalledWith("tv", 1, expect.anything());
    expect(discover).not.toHaveBeenCalled();
  });

  it("discovers when a genre or non-default sort is set", async () => {
    discover.mockResolvedValue(page([7]));

    const { result } = renderHook(() =>
      usePagedSearch("movie", "", { genre: 28, sort: "vote_average.desc" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(discover).toHaveBeenCalledTimes(1);
    const [kind, options, signal] = discover.mock.calls[0];
    expect(kind).toBe("movie");
    expect(options).toEqual({
      genre: 28,
      sort: "vote_average.desc",
      page: 1,
    });
    expect(signal).toBeTruthy();
    expect(getPopular).not.toHaveBeenCalled();
  });

  it("never discovers for people", async () => {
    getPopular.mockResolvedValue(page([11]));

    const { result } = renderHook(() =>
      usePagedSearch("person", "", { genre: 28 })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(getPopular).toHaveBeenCalledWith("person", 1, expect.anything());
    expect(discover).not.toHaveBeenCalled();
  });

  it("resets to page 1 when a filter changes", async () => {
    getPopular
      .mockResolvedValueOnce(page([1], 3))
      .mockResolvedValueOnce(page([2], 3));
    discover.mockResolvedValue(page([9]));

    const { result, rerender } = renderHook(
      ({ filters }) => usePagedSearch("movie", "", filters),
      { initialProps: { filters: {} } }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(ids(result.current.items)).toEqual([1]);

    act(() => result.current.loadMore());
    await waitFor(() => expect(ids(result.current.items)).toEqual([1, 2]));

    rerender({ filters: { genre: 28 } });

    await waitFor(() => expect(discover).toHaveBeenCalledTimes(1));
    expect(discover.mock.calls[0][1]).toEqual({
      genre: 28,
      sort: "popularity.desc",
      page: 1,
    });
    await waitFor(() => expect(ids(result.current.items)).toEqual([9]));
    expect(getPopular).toHaveBeenCalledTimes(2);
  });

  it("appends the next page and drops duplicates", async () => {
    getPopular
      .mockResolvedValueOnce(page([1, 2], 2))
      .mockResolvedValueOnce(page([2, 3], 2));

    const { result } = renderHook(() => usePagedSearch("movie", ""));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasMore).toBe(true);

    act(() => result.current.loadMore());

    await waitFor(() => expect(ids(result.current.items)).toEqual([1, 2, 3]));
    expect(getPopular.mock.calls[1][1]).toBe(2);
    expect(result.current.hasMore).toBe(false);
  });

  it("exposes retry after a failed request", async () => {
    const failure = new Error("boom");
    getPopular.mockRejectedValueOnce(failure).mockResolvedValueOnce(page([4]));

    const { result } = renderHook(() => usePagedSearch("movie", ""));

    await waitFor(() => expect(result.current.error).toBe(failure));

    act(() => result.current.retry());

    await waitFor(() => expect(ids(result.current.items)).toEqual([4]));
    expect(result.current.error).toBeNull();
  });
});
