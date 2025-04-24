import { useRef, useEffect, useState } from "react";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
import { usePreGameContext } from "@/context/PreGameContext";
import { useInputSubmittion } from "./NicknameSubmittion";
export function useChangeGameState() {
  const {
    isitconclusion,
    isitresults,
    isitpregame,
    rndnum,
    setrndnum,
    setisitconclusion,
    setisitpregame,
    setisitresults,
  } = useGameState();
  const round = useRef(0);
  // const { isinputwrong, setisinputwrong } = usePreGameContext();
  // const { addparticipant } = useInputSubmittion();
  function handleKeyDown(ismarkeronmap: boolean) {
    console.log(isitresults);
    if (isitresults) {
      setisitresults(false);
      round.current++;
      if (round.current === 5) {
        setisitconclusion(true);
        round.current = 0;
      }
    } else if (isitconclusion) {
      setisitconclusion(false);
      setisitpregame(true);
    } else if (ismarkeronmap) {
      setisitresults(true);
    }
  }
  function handlePregameskip(user: string, blinkmode: boolean) {}
  return { handleKeyDown };
}
