import React, { useEffect, useRef, useState } from "react";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapInteractions } from "@/app/hooks/mapsizechanges";
import styles from "@/app/styles/MapComponent.module.css";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
import { useMapClassChanges } from "./mapclasschanges";
import { useCalculations } from "./calculateerroranadscore";
interface Props {}

const beemarker = L.icon({
  iconUrl: "/Icons/Bee-Marker.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

export function useChangeInsideOfMap() {
  const { aspectRatio } = useGameState();
  const {
    mapStyle,
    ismarkeronmap,
    Map,
    setMapStyle,
    setSubmitClassName,
    setismarkeronmap,
    setMap,
  } = useMapState();
  const position = useRef<[number, number]>([0, 0]);
  const guessRef = useRef<L.Marker | null>(null);
  const allGuesses = useRef<Array<[number, number]>>([]);
  const allLocations = useRef<Array<[number, number]>>([]);
  const tempForMarker = useRef(false);
  const { guessSubmit } = useCalculations();
  const { handleConclusionClass, handleNextClass, handleSubmitClass } =
    useMapClassChanges();
  function handleMapClick(e: L.LeafletMouseEvent) {
    if (!Map) {
      return;
    }
    if (tempForMarker.current) {
      if (guessRef.current) {
        guessRef.current.setLatLng(e.latlng);
        position.current = [e.latlng.lat, e.latlng.lng];
      }
    } else {
      guessRef.current = L.marker(e.latlng, {
        icon: beemarker,
        draggable: true,
      }).addTo(Map);
      position.current = [e.latlng.lat, e.latlng.lng];
      setismarkeronmap(true);
      tempForMarker.current = true;
      if (aspectRatio > 0.85) {
        setSubmitClassName(styles.biggersubmit);
      } else {
        setSubmitClassName(styles.mobilesubmit);
      }
    }
  }
  function handleSubmit(imglat: number, imglng: number) {
    handleSubmitClass(imglat, imglng, position.current[0], position.current[1]);
    console.log(Map);
    if (!Map) {
      console.log("handlesubmit");

      return;
    }
    allLocations.current.push([imglat, imglng]);
    tempForMarker.current = false;
    console.log(ismarkeronmap, imglat, imglng);
    if (ismarkeronmap) {
      L.marker([imglat, imglng], {
        icon: L.icon({
          iconUrl: "/Icons/flag.png",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(Map);
      L.polyline([[imglat, imglng], position.current], {
        color: "black",
        dashArray: "10, 10",
        dashOffset: "10",
      }).addTo(Map);
      allGuesses.current.push(position.current);
    } else {
      L.marker([imglat, imglng], {
        icon: L.icon({
          iconUrl: "/Icons/flag.png",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(Map);
      allGuesses.current.push([0, 0]);
    }
    const temp = guessSubmit(
      imglat,
      imglng,
      position.current[0],
      position.current[1]
    );
    position.current = [0, 0];
    return temp;
  }
  function handleNext() {
    handleNextClass();
    if (!Map) {
      return;
    }
    Map.eachLayer(function (layer) {
      if (!(layer instanceof L.TileLayer)) {
        Map.removeLayer(layer);
      }
    });
  }
  function handleConclusion() {
    if (!Map) {
      return;
    }
    Map.eachLayer(function (layer) {
      if (!(layer instanceof L.TileLayer)) {
        Map.removeLayer(layer);
      }
    });
    const bounds = L.latLngBounds(
      allLocations.current[0],
      allGuesses.current[0]
    );
    console.log("why are you in conclusion");
    for (let i = 0; i < 5; i++) {
      if (allGuesses.current[i][0] === 0 && allGuesses.current[i][1] === 0) {
        L.marker(allLocations.current[i], {
          icon: L.icon({
            iconUrl: `Icons/${i + 1}.svg`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).addTo(Map);
      } else {
        L.marker(allGuesses.current[i], { icon: beemarker }).addTo(Map);
        L.marker(allLocations.current[i], {
          icon: L.icon({
            iconUrl: `Icons/${i + 1}.svg`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).addTo(Map);
        const conclusionline = L.polyline(
          [allLocations.current[i], allGuesses.current[i]],
          {
            color: "black",
            weight: 3,
            dashArray: "10, 10",
            dashOffset: "10",
          }
        ).addTo(Map);
        bounds.extend(conclusionline.getBounds());
      }
    }
    Map.fitBounds(bounds);
    allGuesses.current = [];
    allLocations.current = [];
    handleConclusionClass();
  }
  return { handleMapClick, handleNext, handleConclusion, handleSubmit };
}
