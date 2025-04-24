"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../app/styles/MapComponent.module.css";
type MapStates = {
  Map: L.Map | null;
  isitmobile: boolean;
  ismarkeronmap: boolean;
  mapStyle: React.CSSProperties;
  submitClassName: string;
  setMapStyle: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
  setSubmitClassName: React.Dispatch<React.SetStateAction<string>>;
  setMap: React.Dispatch<React.SetStateAction<L.Map | null>>;
  setismarkeronmap: React.Dispatch<React.SetStateAction<boolean>>;
  setisitmobile: React.Dispatch<React.SetStateAction<boolean>>;
};
const MapStateContext = createContext<MapStates | null>(null);
export function MapStateProvider({ children }: { children: ReactNode }) {
  const [mapStyle, setMapStyle] = useState<React.CSSProperties>({
    opacity: "0",
  });
  const [submitClassName, setSubmitClassName] = useState(styles.placemarker);
  const [ismarkeronmap, setismarkeronmap] = useState(false);
  const [Map, setMap] = useState<L.Map | null>(null);
  const [isitmobile, setisitmobile] = useState(false);
  return (
    <MapStateContext.Provider
      value={{
        mapStyle,
        submitClassName,
        ismarkeronmap,
        Map,
        isitmobile,
        setMapStyle,
        setSubmitClassName,
        setismarkeronmap,
        setMap,
        setisitmobile,
      }}
    >
      {children}
    </MapStateContext.Provider>
  );
}

export function useMapState() {
  const context = useContext(MapStateContext);
  // console.log(context);
  if (!context) {
    throw new Error("aaaaaaaaaaaa");
  }
  return context;
}
