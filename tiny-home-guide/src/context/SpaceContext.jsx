// src/context/SpaceContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const SpaceContext = createContext(null);

// localStorage keys
const SPACE_PROFILE_KEY = "thg_spaceProfile";
const FAVORITES_KEY = "thg_favorites";

export function SpaceProvider({ children }) {
  // --- INIT FROM LOCALSTORAGE ---
  const [spaceProfile, setSpaceProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(SPACE_PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
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
      if (favorites && favorites.length > 0) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } else {
        localStorage.removeItem(FAVORITES_KEY);
      }
    } catch (e) {
      console.warn("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

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

  const value = {
    spaceProfile,
    setSpaceProfile,
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
  );
}

export function useSpace() {
  const ctx = useContext(SpaceContext);
  if (!ctx) {
    throw new Error("useSpace must be used within a SpaceProvider");
  }
  return ctx;
}
