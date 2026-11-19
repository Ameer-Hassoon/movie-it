import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider } from "../context/AuthProvider.jsx";
import { useAuth } from "../context/useAuth.js";

function Probe() {
  const { currentUser, isAuthenticated, login, register, logout } = useAuth();
  const [error, setError] = useState("");

  return (
    <div>
      <span data-testid="user">{currentUser?.email ?? "none"}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="error">{error}</span>
      <button
        type="button"
        onClick={() => register("Ameer", "ameer@example.com", "secret")}
      >
        register
      </button>
      <button
        type="button"
        onClick={() =>
          login("ameer@example.com", "secret").catch((e) => setError(e.message))
        }
      >
        login
      </button>
      <button
        type="button"
        onClick={() =>
          login("ameer@example.com", "wrong").catch((e) => setError(e.message))
        }
      >
        login wrong
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("registers a user and starts a session", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(await screen.findByRole("button", { name: "register" }));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("ameer@example.com")
    );
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    expect(localStorage.getItem("movieAppToken")).toBe("demo-session");
    expect(localStorage.getItem("movieAppUser")).toContain("ameer@example.com");
  });

  it("logs in a registered user and rejects a bad password", async () => {
    localStorage.setItem(
      "movieAppUsers",
      JSON.stringify([
        {
          id: 1,
          name: "Ameer",
          email: "ameer@example.com",
          password: "secret",
        },
      ])
    );

    const user = userEvent.setup();
    renderAuth();

    await user.click(await screen.findByRole("button", { name: "login wrong" }));

    await waitFor(() =>
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Invalid email or password"
      )
    );
    expect(screen.getByTestId("user")).toHaveTextContent("none");

    await user.click(screen.getByRole("button", { name: "login" }));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("ameer@example.com")
    );
  });

  it("logs out and clears the stored session", async () => {
    localStorage.setItem("movieAppToken", "demo-session");
    localStorage.setItem(
      "movieAppUser",
      JSON.stringify({ id: 1, email: "ameer@example.com", name: "Ameer" })
    );

    const user = userEvent.setup();
    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("ameer@example.com")
    );

    await user.click(screen.getByRole("button", { name: "logout" }));

    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(localStorage.getItem("movieAppToken")).toBeNull();
    expect(localStorage.getItem("movieAppUser")).toBeNull();
  });

  it("rejects a duplicate registration", async () => {
    localStorage.setItem(
      "movieAppUsers",
      JSON.stringify([
        {
          id: 1,
          name: "Ameer",
          email: "ameer@example.com",
          password: "secret",
        },
      ])
    );

    function Duplicate() {
      const { register } = useAuth();
      const [error, setError] = useState("");
      return (
        <>
          <span data-testid="error">{error}</span>
          <button
            type="button"
            onClick={() =>
              register("Ameer", "ameer@example.com", "secret").catch((e) =>
                setError(e.message)
              )
            }
          >
            register
          </button>
        </>
      );
    }

    render(
      <AuthProvider>
        <Duplicate />
      </AuthProvider>
    );

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "register" }));

    await waitFor(() =>
      expect(screen.getByTestId("error")).toHaveTextContent("User already exists")
    );
  });
});
