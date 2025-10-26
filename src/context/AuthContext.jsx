import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("movieAppToken");
    const userData = localStorage.getItem("movieAppUser");

    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Mock user database
  const users = [
    {
      id: 1,
      email: "ameersafaa567@gmail.com",
      password: "asdfasdf",
      name: "Ameer Safaa",
    },
  ];

  // Login function
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
          };

          setCurrentUser(userInfo);
          localStorage.setItem("movieAppToken", "fake-jwt-token");
          localStorage.setItem("movieAppUser", JSON.stringify(userInfo));
          resolve(userInfo);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };

  // Register function
  const register = async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userExists = users.find((u) => u.email === email);

        if (userExists) {
          reject(new Error("User already exists"));
        } else {
          const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
          };
          users.push(newUser);

          const userInfo = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          };

          setCurrentUser(userInfo);
          localStorage.setItem("movieAppToken", "fake-jwt-token");
          localStorage.setItem("movieAppUser", JSON.stringify(userInfo));
          resolve(userInfo);
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("movieAppToken");
    localStorage.removeItem("movieAppUser");
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
