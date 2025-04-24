import React, { ReactNode, useContext, createContext, useState } from "react";

type PreGameContextType = {
  BlinkModeLeaderboard: string[][];
  NormalModeLeaderboard: string[][];
  blinkmode: boolean;
  isinputwrong: boolean;
  setBlinkModeLeaderboard: React.Dispatch<React.SetStateAction<string[][]>>;
  setNormalModeLeaderboard: React.Dispatch<React.SetStateAction<string[][]>>;
  setblinkmode: React.Dispatch<React.SetStateAction<boolean>>;
  setisinputwrong: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isinputwrong, setisinputwrong] = useState(false);

  return (
    <PreGameContext.Provider
      value={{
        BlinkModeLeaderboard,
        NormalModeLeaderboard,
        blinkmode,
        isinputwrong,
        setBlinkModeLeaderboard,
        setNormalModeLeaderboard,
        setblinkmode,
        setisinputwrong,
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
    throw new Error(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );
  }
  return context;
}
