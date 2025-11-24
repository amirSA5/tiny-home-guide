import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchPreferences as apiFetchPreferences,
  savePreferences as apiSavePreferences,
} from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const { token, user } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | saving | error
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!token || !user) {
        setPreferences(null);
        setStatus("idle");
        setError(null);
        return;
      }
      setStatus("loading");
      setError(null);
      try {
        const data = await apiFetchPreferences(token);
        if (!cancelled) {
          setPreferences(data.preferences || null);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setPreferences(null);
          setStatus("error");
          setError(err?.message || "Could not load preferences");
        }
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [token, user]);

  const savePreferences = async (payload) => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    setStatus("saving");
    setError(null);
    const data = await apiSavePreferences(token, payload);
    setPreferences(data.preferences);
    setStatus("ready");
    return data.preferences;
  };

  const value = useMemo(
    () => ({
      preferences,
      status,
      error,
      savePreferences,
    }),
    [preferences, status, error]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
