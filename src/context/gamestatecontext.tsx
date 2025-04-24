"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GameContext = {
  aspectRatio: number;
  setaspectRatio: (val: number) => void;
};
// const initialrndnum = Math.floor(Math.random() * 5205);
const GameStateContext = createContext<GameContext | null>(null);
export function GameStateProvider({ children }: { children: ReactNode }) {
  const [aspectRatio, setaspectRatio] = useState(1);

  return (
    <GameStateContext.Provider
      value={{
        aspectRatio,
        setaspectRatio,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("aaaaaa");
  }
  return context;
}
