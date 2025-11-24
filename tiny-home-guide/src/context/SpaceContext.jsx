// src/context/SpaceContext.jsx
import { createContext, useContext, useState } from "react";

const SpaceContext = createContext(null);

export function SpaceProvider({ children }) {
  const [spaceProfile, setSpaceProfile] = useState(null);

  // favorites: array of { type: "layout" | "furniture", id: string }
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (type, id) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.type === type && f.id === id);
      if (exists) {
        // remove if already in favorites
        return prev.filter((f) => !(f.type === type && f.id === id));
      }
      // add new favorite
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
