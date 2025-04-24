import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "@/app/styles/MapComponent.module.css";
import MapButton from "./MapButton";
import { useMapInteractions } from "@/app/hooks/mapsizechanges";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
import { useChangeInsideOfMap } from "@/app/hooks/insideofmapchanges";
import { useChangeGameState } from "@/app/hooks/GameStateChanging";
import { Tiro_Tamil } from "next/font/google";

const beemarker = L.icon({
  iconUrl: "/Icons/Bee-Marker.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

const MapandSubmit = () => {
  const {
    mapStyle,
    submitClassName,
    ismarkeronmap,
    Map,
    isitmobile,
    setMapStyle,
    setSubmitClassName,
    setismarkeronmap,
    setMap,
  } = useMapState();
  const {
    shrinkinstantly,
    shrinksubmitandmap,
    enlargenmapandsubmitbutton,
    handleResize,
  } = useMapInteractions();
  const [scoreanderror, setscoreanderror] = useState([0, 0]);
  const [infovisibility, setinfovisibility] = useState(styles.none);
  const ismarkeronmapref = useRef(false);
  const { handleMapClick, handleConclusion, handleSubmit, handleNext } =
    useChangeInsideOfMap();
  const totalscore = useRef(0);
  const { handleKeyDown } = useChangeGameState();
  useEffect(() => {
    if (typeof window !== "undefined" && Map === null) {
      const mapContainer = document.getElementById("map");
      if (mapContainer && (mapContainer as any)._leaflet_id) {
        return;
      }
      const InitialMap = L.map("map", {
        center: [41.10474805585872, 29.022884681711798],
        zoom: 16,
        maxBounds: [
          [41.08807268468239, 29.00938475141975],
          [41.12383548170815, 29.043887364827734],
        ],
        // maxBoundsViscosity: 1.0,
        minZoom: 15,
      });
      setMap(InitialMap);

      const openstreetmap = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20,
        }
      );
      openstreetmap.addTo(InitialMap);
      setMap(InitialMap);
    }
    if (Map) {
      Map.on("click", (e) => {
        handleMapClick(e);
      });
    }
  }, [Map]);
  useEffect(() => {
    function controlClick(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "Enter") {
        // console.log(ismarkeronmapref.current, "is marker on map");
        handleKeyDown(ismarkeronmap);
      }
    }

    window.addEventListener("keydown", controlClick);

    // console.log(mapStyle);
    return () => {
      window.removeEventListener("keydown", controlClick);
    };
  }, [ismarkeronmap]);
  useEffect(() => {
    shrinkinstantly();
  }, []);
  useEffect(() => {
    handleResize();
  }, [aspectRatio]);
  useEffect(() => {
    console.log(scoreanderror);
  }, [scoreanderror]);

  return (
    <div>
      <div className={infovisibility}>
        <button
          onClick={shrinkinstantly}
          className={styles.outsideofmap}
        ></button>
      </div>

      <div
        onMouseOver={() => {
          enlargenmapandsubmitbutton();
        }}
        onMouseOut={shrinksubmitandmap}
      >
        <div id="map" style={mapStyle}></div>
        <MapButton></MapButton>
      </div>
    </div>
  );
};

export default MapandSubmit;
