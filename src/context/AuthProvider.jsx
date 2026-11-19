import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

const USERS_KEY = "movieAppUsers";
const TOKEN_KEY = "movieAppToken";
const USER_KEY = "movieAppUser";

// Demo-only auth: registered users (including plain-text passwords) are kept
// in localStorage so sign-up survives a reload. Never store credentials
// client-side in production — use a real backend with hashed passwords.
function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toUserInfo(user) {
  return { id: user.id, email: user.email, name: user.name };
}

function startSession(user) {
  const userInfo = toUserInfo(user);
  localStorage.setItem(TOKEN_KEY, "demo-session");
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  return userInfo;
}

function simulateRequest(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userData = localStorage.getItem(USER_KEY);

    if (token && userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    await simulateRequest();

    const user = readUsers().find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const userInfo = startSession(user);
    setCurrentUser(userInfo);
    return userInfo;
  };

  // Register function
  const register = async (name, email, password) => {
    await simulateRequest();

    const users = readUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser = { id: Date.now(), name, email, password };
    writeUsers([...users, newUser]);

    const userInfo = startSession(newUser);
    setCurrentUser(userInfo);
    return userInfo;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
