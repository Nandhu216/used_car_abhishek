import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => safeParse(localStorage.getItem("user")) || null);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const value = useMemo(() => {
    const isAuthed = Boolean(token);
    const isAdmin = user?.role === "admin";

    return {
      token,
      user,
      isAuthed,
      isAdmin,
      login: ({ token: nextToken, user: nextUser }) => {
        setToken(nextToken || "");
        setUser(nextUser || null);
      },
      logout: () => {
        setToken("");
        setUser(null);
      },
    };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

