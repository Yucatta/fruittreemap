import { useEffect, useRef, useState } from "react";
import { usePreGameContext } from "@/context/PreGameContext";

export function useAPIcalls() {
  const { setBlinkModeLeaderboard, setNormalModeLeaderboard } =
    usePreGameContext();
  async function updateCsv(participantinformations: {
    name: string | undefined;
    score: number;
    blinkmode: boolean;
  }) {
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(participantinformations),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  }
  async function fetchCsv() {
    try {
      const res = await fetch("/api/getcsvfile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      const temp = data.csvData;
      const tempblinkmode: string[][] = [];
      const tempnormalmode: string[][] = [];
      temp.forEach((element: string[]) => {
        if (element[2] === "true") {
          tempblinkmode.push([element[0], element[1]]);
        } else if (element[2] === "false") {
          tempnormalmode.push([element[0], element[1]]);
        }
      });
      setBlinkModeLeaderboard(tempblinkmode);
      setNormalModeLeaderboard(tempnormalmode);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  }

  return { updateCsv, fetchCsv };
}
