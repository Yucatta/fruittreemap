import React from "react";
import { useMapState } from "@/context/MapStateContext";
import { useMap } from "react-leaflet";
interface Props {
  submitClassName: string;
  handleButtonClick: () => void;
}
const MapButton = ({ submitClassName, handleButtonClick }: Props) => {
  const { ismarkeronmap } = useMapState();
  return (
    <button
      id="button"
      style={{
        transition: "width 0.3s ease, height 0.3s ease",
        zIndex: "5",
      }}
      className={submitClassName}
      onClick={handleButtonClick}
    >
      {ismarkeronmap ? "SUBMIT" : "PLACE MARKER ON THE MAP"}
    </button>
  );
};

export default MapButton;
