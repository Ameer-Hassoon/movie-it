import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthContext } from "../context/authContext.js";
import { WatchlistProvider } from "../context/WatchlistProvider.jsx";
import { useWatchlist } from "../context/useWatchlist.js";

const matrix = {
  id: 603,
  title: "The Matrix",
  poster_path: "/matrix.jpg",
  vote_average: 8.2,
  release_date: "1999-03-30",
};

const breakingBad = {
  id: 1396,
  name: "Breaking Bad",
  poster_path: "/bb.jpg",
  vote_average: 8.9,
  first_air_date: "2008-01-20",
};

function Probe() {
  const { items, count, has, toggle, remove, clear } = useWatchlist();

  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="has-matrix">{String(has("movie", 603))}</span>
      <span data-testid="has-bb">{String(has("tv", 1396))}</span>
      <ul>
        {items.map((item) => (
          <li key={`${item.kind}-${item.id}`} data-testid="item">
            {item.title}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => toggle(matrix, "movie")}>
        toggle matrix
      </button>
      <button type="button" onClick={() => toggle(breakingBad, "tv")}>
        toggle bb
      </button>
      <button type="button" onClick={() => remove("movie", 603)}>
        remove matrix
      </button>
      <button type="button" onClick={clear}>
        clear
      </button>
    </div>
  );
}

function renderWatchlist(user = null) {
  return render(
    <AuthContext.Provider value={user ? { currentUser: user } : { currentUser: null }}>
      <WatchlistProvider>
        <Probe />
      </WatchlistProvider>
    </AuthContext.Provider>
  );
}

const stored = (key) => JSON.parse(localStorage.getItem(key) ?? "[]");

describe("watchlist", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("toggles items on and off, newest first", async () => {
    const user = userEvent.setup();
    renderWatchlist();

    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(screen.getByTestId("has-matrix")).toHaveTextContent("false");

    await user.click(screen.getByRole("button", { name: "toggle matrix" }));

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("has-matrix")).toHaveTextContent("true");
    expect(screen.getAllByTestId("item")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "toggle bb" }));

    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("has-bb")).toHaveTextContent("true");
    expect(screen.getAllByTestId("item")[0]).toHaveTextContent("Breaking Bad");

    await user.click(screen.getByRole("button", { name: "toggle matrix" }));

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("has-matrix")).toHaveTextContent("false");
  });

  it("removes a single entry and clears everything", async () => {
    const user = userEvent.setup();
    renderWatchlist();

    await user.click(screen.getByRole("button", { name: "toggle matrix" }));
    await user.click(screen.getByRole("button", { name: "toggle bb" }));

    await user.click(screen.getByRole("button", { name: "remove matrix" }));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("has-matrix")).toHaveTextContent("false");

    await user.click(screen.getByRole("button", { name: "clear" }));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("persists a normalized entry under the guest key", async () => {
    const user = userEvent.setup();
    renderWatchlist();

    await user.click(screen.getByRole("button", { name: "toggle matrix" }));

    await waitFor(() => expect(stored("movieItWatchlist:guest")).toHaveLength(1));

    const [entry] = stored("movieItWatchlist:guest");
    expect(entry).toMatchObject({
      id: 603,
      kind: "movie",
      title: "The Matrix",
      poster_path: "/matrix.jpg",
      vote_average: 8.2,
      release_date: "1999-03-30",
    });
    expect(typeof entry.addedAt).toBe("number");
  });

  it("normalizes shows (name -> title, first_air_date -> release_date)", async () => {
    const user = userEvent.setup();
    renderWatchlist();

    await user.click(screen.getByRole("button", { name: "toggle bb" }));

    await waitFor(() => expect(stored("movieItWatchlist:guest")).toHaveLength(1));

    expect(stored("movieItWatchlist:guest")[0]).toMatchObject({
      id: 1396,
      kind: "tv",
      title: "Breaking Bad",
      release_date: "2008-01-20",
    });
  });

  it("uses a per-user storage key", async () => {
    const user = userEvent.setup();
    renderWatchlist({ id: 42, email: "ameer@example.com", name: "Ameer" });

    await user.click(screen.getByRole("button", { name: "toggle matrix" }));

    await waitFor(() =>
      expect(stored("movieItWatchlist:42")).toHaveLength(1)
    );
    expect(localStorage.getItem("movieItWatchlist:guest")).toBeNull();
  });

  it("keeps separate lists per user", async () => {
    const user = userEvent.setup();
    const { unmount } = renderWatchlist({
      id: 1,
      email: "one@example.com",
      name: "One",
    });

    await user.click(screen.getByRole("button", { name: "toggle matrix" }));
    await waitFor(() => expect(stored("movieItWatchlist:1")).toHaveLength(1));
    unmount();

    renderWatchlist({ id: 2, email: "two@example.com", name: "Two" });

    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(screen.getByTestId("has-matrix")).toHaveTextContent("false");
  });

  it("syncs from other tabs through the storage event", async () => {
    renderWatchlist();

    act(() => {
      localStorage.setItem(
        "movieItWatchlist:guest",
        JSON.stringify([
          {
            id: 603,
            kind: "movie",
            title: "The Matrix",
            poster_path: null,
            vote_average: 8.2,
            release_date: "1999-03-30",
            addedAt: Date.now(),
          },
        ])
      );
      window.dispatchEvent(
        new StorageEvent("storage", { key: "movieItWatchlist:guest" })
      );
    });

    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));
    expect(screen.getByTestId("has-matrix")).toHaveTextContent("true");
  });
});
