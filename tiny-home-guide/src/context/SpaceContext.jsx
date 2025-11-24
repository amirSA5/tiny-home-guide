// src/context/SpaceContext.jsx
import { createContext, useContext, useState } from "react";

const SpaceContext = createContext(null);

export function SpaceProvider({ children }) {
  const [spaceProfile, setSpaceProfile] = useState(null);

  const value = {
    spaceProfile,
    setSpaceProfile,
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
