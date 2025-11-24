// src/context/SpaceContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchFavorites,
  saveFavorites,
} from "../services/api.js";

const SpaceContext = createContext(null);

// localStorage keys
const SPACE_PROFILE_KEY = "thg_spaceProfile";
const FAVORITES_KEY = "thg_favorites";
const CLIENT_ID_KEY = "thg_clientId";

function generateClientId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function SpaceProvider({ children }) {
  // --- INIT FROM LOCALSTORAGE ---
  const normalizeProfile = (profile) => {
    if (!profile) return null;
    const next = { ...profile };
    if (!next.height) {
      next.height = 2.7; // sensible ceiling height default
    }
    if (!next.mobility) {
      next.mobility = "mobile";
    }
    if (!Array.isArray(next.zones) || next.zones.length === 0) {
      next.zones = ["sleep", "work", "kitchen"];
    }
    return next;
  };

  const [spaceProfile, setSpaceProfileState] = useState(() => {
    try {
      const stored = localStorage.getItem(SPACE_PROFILE_KEY);
      const parsed = stored ? JSON.parse(stored) : null;
      return normalizeProfile(parsed);
    } catch (e) {
      console.warn("Failed to parse spaceProfile from localStorage", e);
      return null;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Failed to parse favorites from localStorage", e);
      return [];
    }
  });

  const [clientId] = useState(() => {
    try {
      const existing = localStorage.getItem(CLIENT_ID_KEY);
      if (existing) return existing;
      const created = generateClientId();
      localStorage.setItem(CLIENT_ID_KEY, created);
      return created;
    } catch (e) {
      console.warn("Failed to init clientId", e);
      return generateClientId();
    }
  });

  const [favoritesHydrated, setFavoritesHydrated] = useState(false);
  const [favoritesSyncStatus, setFavoritesSyncStatus] = useState("idle");
  const [favoritesSyncError, setFavoritesSyncError] = useState(null);

  // --- SYNC TO LOCALSTORAGE WHEN CHANGED ---
  useEffect(() => {
    try {
      if (spaceProfile) {
        localStorage.setItem(SPACE_PROFILE_KEY, JSON.stringify(spaceProfile));
      } else {
        localStorage.removeItem(SPACE_PROFILE_KEY);
      }
    } catch (e) {
      console.warn("Failed to save spaceProfile to localStorage", e);
    }
  }, [spaceProfile]);

  useEffect(() => {
    try {
      if (clientId) {
        localStorage.setItem(CLIENT_ID_KEY, clientId);
      }
    } catch (e) {
      console.warn("Failed to save clientId to localStorage", e);
    }
  }, [clientId]);

  useEffect(() => {
    try {
      if (favorites && favorites.length > 0) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } else {
        localStorage.removeItem(FAVORITES_KEY);
      }
    } catch (e) {
      console.warn("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  // --- HYDRATE FAVORITES FROM SERVER ---
  useEffect(() => {
    let cancelled = false;

    async function loadFromServer() {
      if (!clientId) return;
      setFavoritesSyncStatus("loading");
      try {
        const data = await fetchFavorites(clientId);
        if (!cancelled && data?.favorites) {
          setFavorites(data.favorites);
        }
        if (!cancelled) {
          setFavoritesSyncStatus("ready");
          setFavoritesSyncError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setFavoritesSyncStatus("error");
          setFavoritesSyncError(err?.message || "Could not load favorites");
        }
      } finally {
        if (!cancelled) {
          setFavoritesHydrated(true);
        }
      }
    }

    loadFromServer();
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  // --- PERSIST FAVORITES TO SERVER ---
  useEffect(() => {
    let cancelled = false;
    async function persist() {
      if (!favoritesHydrated || !clientId) return;
      try {
        setFavoritesSyncStatus("saving");
        await saveFavorites(clientId, favorites);
        if (!cancelled) {
          setFavoritesSyncStatus("ready");
          setFavoritesSyncError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setFavoritesSyncStatus("error");
          setFavoritesSyncError(err?.message || "Could not save favorites");
        }
      }
    }
    persist();
    return () => {
      cancelled = true;
    };
  }, [favoritesHydrated, clientId, favorites]);

  // --- FAVORITES HELPERS ---
  const toggleFavorite = (type, id) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.type === type && f.id === id);
      if (exists) {
        return prev.filter((f) => !(f.type === type && f.id === id));
      }
      return [...prev, { type, id }];
    });
  };

  const isFavorite = (type, id) => {
    return favorites.some((f) => f.type === type && f.id === id);
  };

  const updateSpaceProfile = (profile) => {
    setSpaceProfileState(normalizeProfile(profile));
  };

  const value = {
    spaceProfile,
    setSpaceProfile: updateSpaceProfile,
    clientId,
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesSyncStatus,
    favoritesSyncError,
  };

  return (
    <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSpace() {
  const ctx = useContext(SpaceContext);
  if (!ctx) {
    throw new Error("useSpace must be used within a SpaceProvider");
  }
  return ctx;
}
