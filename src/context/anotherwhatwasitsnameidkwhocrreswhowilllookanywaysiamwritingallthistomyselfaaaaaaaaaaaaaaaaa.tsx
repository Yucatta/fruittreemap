import React, { ReactNode, useContext, createContext, useState } from "react";

type PreGameContextType = {
  BlinkModeLeaderboard: string[][];
  NormalModeLeaderboard: string[][];
  blinkmode: boolean;
  setBlinkModeLeaderboard: React.Dispatch<React.SetStateAction<string[][]>>;
  setNormalModeLeaderboard: React.Dispatch<React.SetStateAction<string[][]>>;
  setblinkmode: React.Dispatch<React.SetStateAction<boolean>>;
};

const PreGameContext = createContext<PreGameContextType | null>(null);

export function PreGameContextProvider({ children }: { children: ReactNode }) {
  const [BlinkModeLeaderboard, setBlinkModeLeaderboard] = useState<string[][]>(
    []
  );
  const [NormalModeLeaderboard, setNormalModeLeaderboard] = useState<
    string[][]
  >([]);
  const [blinkmode, setblinkmode] = useState<boolean>(false);

  return (
    <PreGameContext.Provider
      value={{
        BlinkModeLeaderboard,
        NormalModeLeaderboard,
        blinkmode,
        setBlinkModeLeaderboard,
        setNormalModeLeaderboard,
        setblinkmode,
      }}
    >
      {children}
    </PreGameContext.Provider>
  );
}

export function usePreGameContext() {
  const context = useContext(PreGameContext);
  // console.log(context);
  if (!context) {
    throw new Error("nooooooooooooo");
  }
  return context;
}
