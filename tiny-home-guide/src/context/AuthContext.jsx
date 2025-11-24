import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, login as apiLogin, signup as apiSignup } from "../services/api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "thg_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState(null);

  // load user if token exists
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!token) {
        setUser(null);
        setStatus("idle");
        return;
      }
      setStatus("loading");
      try {
        const data = await fetchMe(token);
        if (!cancelled) {
          setUser(data.user);
          setStatus("ready");
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          setStatus("error");
          setError(err?.message || "Auth error");
        }
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleLogin = async (email, password) => {
    setStatus("loading");
    setError(null);
    const data = await apiLogin({ email, password });
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    setStatus("ready");
    return data;
  };

  const handleSignup = async (payload) => {
    setStatus("loading");
    setError(null);
    const data = await apiSignup(payload);
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    setStatus("ready");
    return data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setStatus("idle");
    setError(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const value = {
    user,
    token,
    status,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
