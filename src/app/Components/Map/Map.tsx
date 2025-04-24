"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "@/app/styles/Style.module.css";
import { useGameState } from "@/context/gamestatecontext";
import MapandSubmit from "./MapandSubmit";
import { MapStateProvider } from "@/context/MapStateContext";
import { useChangeInsideOfMap } from "@/app/hooks/insideofmapchanges";
import { useMapState } from "@/context/MapStateContext";
import { useChangeGameState } from "@/app/hooks/GameStateChanging";
interface Props {}

const Map = ({}: Props) => {
  const { handleMapClick, handleConclusion, handleSubmit, handleNext } =
    useChangeInsideOfMap();

  return (
    <MapStateProvider>
      <MapandSubmit></MapandSubmit>
    </MapStateProvider>
  );
};

export default Map;
