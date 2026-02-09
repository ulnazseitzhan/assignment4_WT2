import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  // persist token
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // persist user
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login(email, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: { email, password }
    });

    setToken(data.token);
    setUser(data.user);
  }

  async function register(username, email, password) {
    const data = await api("/auth/register", {
      method: "POST",
      body: { username, email, password }
    });

    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed: Boolean(token),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}