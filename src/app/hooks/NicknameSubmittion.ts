import { useState, useRef, useEffect, use } from "react";
import { usePreGameContext } from "@/context/PreGameContext";
export function useInputSubmittion() {
  const { BlinkModeLeaderboard, NormalModeLeaderboard } = usePreGameContext();
  const currentparticipant = useRef<string>(null);

  function addparticipant(user: string | undefined, blinkmode: boolean) {
    let goodornah = true;
    // console.log(
    //   BlinkModeLeaderboard,
    //   "blinkmode",
    //   NormalModeLeaderboard,
    //   "normalmode"
    // );
    let isinputwrong = false;
    // console.log(BlinkModeLeaderboard, NormalModeLeaderboard, user);
    (blinkmode ? BlinkModeLeaderboard : NormalModeLeaderboard).forEach(
      (element) => {
        if (element[0] == user) {
          // console.log(element[0], user);
          goodornah = false;
          isinputwrong = true;
          return isinputwrong;
        }
      }
    );
    if (user && user.length < 31 && user.trim().length > 2 && goodornah) {
      isinputwrong = false;
    } else {
      isinputwrong = true;
    }
    return isinputwrong;
  }
  function appendPlaytoCsv() {}

  return { addparticipant, appendPlaytoCsv };
}
