import { useState, useEffect, useReducer, useRef } from "react";
import { useGameState } from "@/context/gamestatecontext";
import styles from "@/app/styles/MapComponent.module.css";

import { useMapState } from "@/context/MapStateContext";
interface MapProps {}
const baseMapStyle = {
  position: "fixed",
  bottom: "0",
  right: "0",
  marginRight: "2vw",
  zIndex: "5",
  transition: "width 0.3s ease, height 0.3s ease",
};
let timeforshrink: NodeJS.Timeout;

export function useMapInteractions() {
  const { aspectRatio, isitresults, isitconclusion, isitpregame } =
    useGameState();
  const [mapCenter, setMapCenter] = useState<[number, number]>();
  const graceperiod = useRef(false);
  const {
    ismarkeronmap,
    Map,
    isitmobile,
    setMapStyle,
    setSubmitClassName,
    setisitmobile,
    setismarkeronmap,
  } = useMapState();
  function enlargenmapandsubmitbutton() {
    if (
      aspectRatio > 0.85 &&
      Map &&
      !graceperiod.current &&
      !isitresults &&
      !isitconclusion
    ) {
      const mapcenter = Map.getCenter();
      setMapStyle({
        ...baseMapStyle,
        width: "clamp(70vh,50vw,50vw)",
        height: "clamp(60vh,35vw,70vh)",
        marginBottom: "8vh",
      } as React.CSSProperties);
      if (ismarkeronmap) {
        setSubmitClassName(styles.biggersubmit);
      } else {
        setSubmitClassName(styles.biggerplacemarker);
      }
      setTimeout(() => {
        if (mapcenter) {
          setMapCenter([mapcenter.lat, mapcenter.lng]);
        }
      }, 300);
      clearTimeout(timeforshrink);
    }
  }
  useEffect(() => {
    if (!isitresults || isitpregame) {
      graceperiod.current = true;
      setTimeout(() => {
        graceperiod.current = false;
      }, 25);
    } else {
      setismarkeronmap(false);
    }
  }, [isitresults, isitpregame]);
  useEffect(() => {
    if (Map && mapCenter) {
      Map.panTo(mapCenter);
      Map.invalidateSize();
    }
  }, [mapCenter]);
  function shrinksubmitandmap() {
    if (aspectRatio > 0.85 && Map && !isitresults && !isitconclusion) {
      timeforshrink = setTimeout(() => {
        shrinkinstantly();
      }, 700);
    }
  }
  function shrinkinstantly() {
    if (Map) {
      const mapcenter = Map.getCenter();
      setMapStyle({
        ...baseMapStyle,
        opacity: "0.5",
        width: "clamp(200px,20vw,20vw)",
        height: "25vh",
        marginBottom: "5vh",
      } as React.CSSProperties);

      if (ismarkeronmap) {
        setSubmitClassName(styles.submit);
      } else {
        setSubmitClassName(styles.placemarker);
      }
      if (mapcenter) {
        setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
    }
  }
  function handleResize() {
    if (
      aspectRatio < 0.85 &&
      Map &&
      !isitmobile &&
      !isitresults &&
      !isitconclusion
    ) {
      const mapcenter = Map.getCenter();
      setisitmobile(true);
      setMapStyle({
        position: "absolute",
        width: "100vw",
        height: "calc(100vh - 100vw/4*3)",
        zIndex: "-50",
        right: "0",
      });

      if (ismarkeronmap) {
        setSubmitClassName(styles.mobilesubmit);
      } else {
        setSubmitClassName(styles.mobileplacemarker);
      }
      if (mapcenter) {
        setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
    } else if (isitmobile && Map && aspectRatio > 0.85) {
      const mapcenter = Map.getCenter();
      setMapStyle({
        ...baseMapStyle,
        opacity: "0.5",
        width: "clamp(200px,20vw,20vw)",
        height: "25vh",
        marginBottom: "5vh",
      } as React.CSSProperties);
      if (mapcenter) {
        setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
      if (ismarkeronmap) {
        setSubmitClassName(styles.submit);
      } else {
        setSubmitClassName(styles.placemarker);
      }
      setisitmobile(false);
    }
  }
  return {
    shrinkinstantly,
    shrinksubmitandmap,
    enlargenmapandsubmitbutton,
    handleResize,
  };
}
