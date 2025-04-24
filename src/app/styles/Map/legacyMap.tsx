"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Style.module.css";
import { useGameState } from "@/context/gamestatecontext";
interface Props {
  latlong: [string, number, number, number][];
  onGuessSubmit: (score: number, error: number) => void;
  onnextclick: () => void;
  totalscore: number;
  Rounds: number;
}

const baseMapStyle = {
  position: "fixed",
  bottom: "0",
  right: "0",
  marginRight: "2vw",
  zIndex: "5",
  transition: "width 0.3s ease, height 0.3s ease",
};
const latlengthmeter = 111.32 * 1000;
const longtiduelengthmeter = (40075 * 1000 * 0.75346369194) / 360; // 0.75346369194 is cosine of latitude

let score = 0;
const beemarker = L.icon({
  iconUrl: "/Icons/Bee-Marker.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});
let timeforshrink: NodeJS.Timeout;

const Map = ({
  latlong,
  onGuessSubmit,
  onnextclick,
  totalscore,
  Rounds,
}: Props) => {
  const { isitresults, isitconclusion, isitpregame, rndnum, aspectRatio } =
    useGameState();
  const isitsubmitted = useRef(false);
  const position = useRef<[number, number]>([0, 0]);
  const guessRef = useRef<L.Marker | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    41.10474805585872, 29.022884681711798,
  ]);
  const [infovisibility, setinfovisibility] = useState(styles.none);
  const imglat = useRef(0);
  const imglng = useRef(0);
  const youundidtheredotoredidtheredo = useRef(true);
  const allguesses = useRef<Array<[number, number]>>([]);
  const alllocations = useRef<Array<[number, number]>>([]);
  const ismarkeronmap = useRef<boolean>(false);
  const secondsleft = useRef<NodeJS.Timeout | null>(null);
  const passedtime = useRef(0);
  // const [passedtime,setpassedtime] = useState(0);
  const [mapStyle, setMapStyle] = useState<React.CSSProperties>({
    position: "fixed",
    width: "20vw",
    height: "25vh",
    bottom: "0",
    right: "0",
    marginRight: "2vw",
    marginBottom: "5vh",
  });
  const [submitClassName, setSubmitClassName] = useState(styles.placemarker);
  const [updater, setupdater] = useState(0);
  const [path, setpath] = useState(`
    M 85 0 
    L 20 0 
    A 20 20 0 1 0 20 40 
    L 150 40 
    A 20 20 0 0 0 150 0 
    L 85 0
    `);
  const timerborder = useRef<NodeJS.Timeout | null>(null);
  const line1 = useRef(85);
  const line2 = useRef(150);
  const line3 = useRef(20);
  const helpertemp = useRef(400);
  const [strokeDasharray, setstrokeDasharray] = useState(helpertemp.current);
  const yellow = useRef(255);
  const isitmobile = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current === null) {
      const map = L.map("map", {
        center: mapCenter,
        zoom: 16,
        maxBounds: [
          [41.08807268468239, 29.00938475141975],
          [41.12383548170815, 29.043887364827734],
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 15,
      });
      mapRef.current = map;

      const openstreetmap = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20,
        }
      );

      openstreetmap.addTo(map);

      map.on("click", (e) => {
        if (!isitsubmitted.current) {
          if (ismarkeronmap.current) {
            if (guessRef.current) {
              guessRef.current.setLatLng(e.latlng);
              position.current = [e.latlng.lat, e.latlng.lng];
            }
          } else {
            guessRef.current = L.marker(e.latlng, {
              icon: beemarker,
              draggable: true,
            }).addTo(map);
            position.current = [e.latlng.lat, e.latlng.lng];
            ismarkeronmap.current = true;
            const buttonElement = document.getElementById("button");

            if (buttonElement) {
              buttonElement.innerText = "SUBMIT";
            }
            if (aspectRatio > 0.85) {
              setSubmitClassName(styles.biggersubmit);
            } else {
              setSubmitClassName(styles.mobilesubmit);
            }
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(mapCenter);
      mapRef.current.invalidateSize();
    }
  }, [mapCenter]);

  useEffect(() => {
    const handleSpaceKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (
          !isitresults &&
          ismarkeronmap.current &&
          !isitpregame &&
          !isitconclusion
        ) {
          guessSubmit();
        } else if (isitresults && !isitpregame && !isitconclusion) {
          onnextclick();
        }
      }
    };
    if (!latlong || !latlong[rndnum]) {
      return;
    }

    imglng.current = latlong[rndnum][3];
    imglat.current = latlong[rndnum][2];

    function guessSubmit() {
      const latLngArr = position.current;

      alllocations.current.push([imglat.current, imglng.current]);
      allguesses.current.push(latLngArr);
      mapRef.current?.eachLayer(function (layer) {
        if (!(layer instanceof L.TileLayer)) {
          mapRef.current?.removeLayer(layer);
        }
      });
      if (mapRef.current) {
        L.marker(position.current, { icon: beemarker }).addTo(mapRef.current);
        L.marker([imglat.current, imglng.current], {
          icon: L.icon({
            iconUrl: "/Icons/flag.png",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).addTo(mapRef.current);
      }

      isitsubmitted.current = true;

      const error = Math.floor(
        Math.sqrt(
          ((imglat.current - latLngArr[0]) * latlengthmeter) ** 2 +
            ((imglng.current - latLngArr[1]) * longtiduelengthmeter) ** 2
        )
      );
      if (mapRef.current && secondsleft.current && timerborder.current) {
        score =
          Math.floor(
            5000 *
              Math.E **
                ((-5 *
                  Math.sqrt(
                    (imglat.current - latLngArr[0]) ** 2 +
                      (imglng.current - latLngArr[1]) ** 2
                  )) /
                  0.01947557727)
          ) + 1;
        setMapStyle({
          position: "fixed",
          width: "100%",
          height: "80vh",
          top: "0",
        });

        L.polyline([[imglat.current, imglng.current], position.current], {
          color: "black",
          dashArray: "10, 10",
          dashOffset: "10",
        }).addTo(mapRef.current);

        setSubmitClassName(styles.none);
        setinfovisibility(styles.none);
        setMapCenter([
          (imglat.current + latLngArr[0]) / 2,
          (imglng.current + latLngArr[1]) / 2,
        ]);
        onGuessSubmit(score, error);
        clearInterval(secondsleft.current);
        clearInterval(timerborder.current);
      }

      passedtime.current = 0;
      line1.current = 85;
      line2.current = 150;
      line3.current = 20;
      helpertemp.current = 400;
      setstrokeDasharray(helpertemp.current);
    }
    function controlclick() {
      if (ismarkeronmap.current && youundidtheredotoredidtheredo.current) {
        guessSubmit();
        youundidtheredotoredidtheredo.current = false;
      }
    }
    window.addEventListener("keydown", handleSpaceKey);
    document.getElementById("button")?.addEventListener("click", controlclick);
    return () => {
      window.removeEventListener("keydown", handleSpaceKey);
    };
  }, [latlong, isitresults, isitpregame, isitconclusion]);

  useEffect(() => {
    function timer() {
      secondsleft.current = setInterval(() => {
        if (passedtime.current === 59) {
          if (secondsleft.current) {
            clearInterval(secondsleft.current);
          }
          timerunout();
        }

        passedtime.current++;
        setupdater(passedtime.current);
      }, 1000);
      if (passedtime.current > 500) {
        console.log(updater);
      }
    }
    function timerprogress() {
      let timerprogressforcolor = 0;

      timerborder.current = setInterval(() => {
        if (line1.current < 150) {
          line1.current += 0.5;
        } else if (helpertemp.current > 257) {
          if (helpertemp.current === 400) {
            helpertemp.current = 320;
            setstrokeDasharray(helpertemp.current);
          }
          helpertemp.current -= 0.5;
          setstrokeDasharray(helpertemp.current);
        } else if (line2.current > 20) {
          line2.current -= 0.5;
        } else if (helpertemp.current > 65) {
          if (helpertemp.current === 257) {
            helpertemp.current = 126;
            setstrokeDasharray(126);
          }
          helpertemp.current -= 0.5;
          setstrokeDasharray(helpertemp.current);
        } else if (line3.current < 85) {
          line3.current += 0.5;
        } else {
          if (timerborder.current) {
            clearInterval(timerborder.current);
          }
        }
        if (line1.current < 150) {
          setpath(`M 85 0 
      L ${line3.current} 0 
      A 20 20 0 1 0 20 40 
      L ${line2.current} 40 
      A 20 20 0 0 0 150 0 
      L ${line1.current} 0`);
        } else if (helpertemp.current > 257) {
        } else if (line2.current > 20) {
          setpath(`M 85 0 
      L ${line3.current} 0 
      A 20 20 0 1 0 20 40 
      L ${line2.current} 40
      `);
        } else if (helpertemp.current > 65) {
        } else {
          setpath(`M 85 0 
      L ${line3.current} 0 
      `);
        }

        timerprogressforcolor++;
        if (timerprogressforcolor > 513) {
          yellow.current = 255 - (timerprogressforcolor - 513 / 257) * 255;
        }
      }, 77.92);
    }
    function timerunout() {
      if (ismarkeronmap.current) {
        const event = new KeyboardEvent("keydown", {
          key: " ",
          code: "Space",
          keyCode: 32,
          which: 32,
          bubbles: true,
        });
        document.dispatchEvent(event);
      } else {
        if (secondsleft.current && timerborder.current) {
          clearInterval(secondsleft.current);
          clearInterval(timerborder.current);
        }
        clearTimeout(timeforshrink);
        allguesses.current.push([0, 0]);
        alllocations.current.push([imglat.current, imglng.current]);
        setMapStyle({ position: "fixed", width: "100%", height: "85vh" });
        ismarkeronmap.current = true;
        if (mapRef.current) {
          L.marker([imglat.current, imglng.current], {
            icon: L.icon({
              iconUrl: "/Icons/flag.png",
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            }),
          }).addTo(mapRef.current);
        }

        isitsubmitted.current = true;
        setSubmitClassName(styles.none);
        setMapCenter([imglat.current, imglng.current]);
        passedtime.current = 0;
        line1.current = 85;
        line2.current = 150;
        line3.current = 20;
        helpertemp.current = 400;
        setstrokeDasharray(helpertemp.current);
        setinfovisibility(styles.none);
        onGuessSubmit(0, 0);
      }
    }

    //! this is supposed to be next but idk nextim
    if (!isitresults && !isitconclusion && !isitpregame) {
      if (aspectRatio > 0.85) {
        setMapStyle({
          position: "fixed",
          bottom: "0",
          right: "0",
          marginRight: "2vw",
          zIndex: "5",
          opacity: "0.5",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh",
          marginBottom: "5vh",
        });
        shrinksubmitandmap();
        mapRef.current?.invalidateSize(true);
      } else {
        setMapStyle({
          position: "fixed",
          width: "100vw",
          height: "calc(100vh - 100vw/4*3)",
          bottom: "0",
          right: "0",
        });
        setMapCenter([41.10474805585872, 29.022884681711798]);
      }

      if (aspectRatio > 0.85) {
        setSubmitClassName(styles.placemarker);
      } else {
        setSubmitClassName(styles.mobileplacemarker);
      }
      setinfovisibility("");

      isitsubmitted.current = false;
      ismarkeronmap.current = false;
      yellow.current = 255;
      const buttonElement = document.getElementById("button");

      if (buttonElement && mapRef.current) {
        buttonElement.innerText = "PLACE MARKER ON THE MAP";
        mapRef.current.eachLayer(function (layer) {
          if (!(layer instanceof L.TileLayer) && mapRef.current) {
            mapRef.current.removeLayer(layer);
          }
        });
      }
      youundidtheredotoredidtheredo.current = true;
      timer();
      timerprogress();
      //!timers
    } else if (isitconclusion && !isitpregame) {
      //!conclusion
      const mapid = document.getElementById("map");
      if (mapid) {
        setMapStyle({
          position: "fixed",
          width: "%100",
          height: "70vh",
          top: "0",
        });
      }

      setSubmitClassName(styles.none);
      setinfovisibility(styles.none);
      if (mapRef.current) {
        mapRef.current.eachLayer(function (layer) {
          if (!(layer instanceof L.TileLayer) && mapRef.current) {
            mapRef.current.removeLayer(layer);
          }
        });
        const bounds = L.latLngBounds(
          alllocations.current[0],
          allguesses.current[0]
        );

        for (let i = 0; i < 5; i++) {
          if (
            allguesses.current[i][0] === 0 &&
            allguesses.current[i][1] === 0
          ) {
            L.marker(alllocations.current[i], {
              icon: L.icon({
                iconUrl: `Icons/${i + 1}.svg`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              }),
            }).addTo(mapRef.current);
          } else {
            L.marker(allguesses.current[i], { icon: beemarker }).addTo(
              mapRef.current
            );
            L.marker(alllocations.current[i], {
              icon: L.icon({
                iconUrl: `Icons/${i + 1}.svg`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              }),
            }).addTo(mapRef.current);
            const conclusionline = L.polyline(
              [alllocations.current[i], allguesses.current[i]],
              {
                color: "black",
                weight: 3,
                dashArray: "10, 10",
                dashOffset: "10",
              }
            ).addTo(mapRef.current);
            bounds.extend(conclusionline.getBounds());
          }
        }
        mapRef.current.fitBounds(bounds);
      }
    } else if (isitpregame) {
      //! pregame
      if (aspectRatio > 0.85) {
        setMapStyle({
          ...baseMapStyle,
          opacity: "0.5",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh",
          marginBottom: "5vh",
        } as React.CSSProperties);
      } else {
        setMapStyle({
          position: "fixed",
          width: "100vw",
          height: "calc(100vh - 100vw/4*3)",
          bottom: "0",
          right: "0",
        });
      }

      allguesses.current = [];
      alllocations.current = [];
    }
  }, [isitresults, isitpregame, isitconclusion]);
  useEffect(() => {
    if (aspectRatio < 0.85 && !isitmobile.current) {
      const mapcenter = mapRef.current?.getCenter();
      isitmobile.current = true;
      setMapStyle({
        position: "absolute",
        width: "100vw",
        height: "calc(100vh - 100vw/4*3)",
        zIndex: "-50",
        right: "0",
      });

      if (ismarkeronmap.current) {
        setSubmitClassName(styles.mobilesubmit);
      } else {
        setSubmitClassName(styles.mobileplacemarker);
      }
      if (mapcenter) {
        setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
    } else if (isitmobile && aspectRatio > 0.85) {
      const mapcenter = mapRef.current?.getCenter();
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
      if (ismarkeronmap.current) {
        setSubmitClassName(styles.submit);
      } else {
        setSubmitClassName(styles.placemarker);
      }
      isitmobile.current = false;
    }
  }, [aspectRatio]);
  function enlargenmapandsubmitbutton() {
    if (!isitresults && !isitconclusion && !isitpregame && aspectRatio > 0.85) {
      const mapcenter = mapRef.current?.getCenter();
      setMapStyle({
        ...baseMapStyle,
        width: "clamp(70vh,50vw,50vw)",
        height: "clamp(60vh,35vw,70vh)",
        marginBottom: "8vh",
      } as React.CSSProperties);
      if (ismarkeronmap.current) {
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
  function shrinksubmitandmap() {
    if (!isitresults && !isitconclusion && !isitpregame && aspectRatio > 0.85) {
      timeforshrink = setTimeout(() => {
        const mapcenter = mapRef.current?.getCenter();
        setMapStyle({
          ...baseMapStyle,
          opacity: "0.5",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh",
          marginBottom: "5vh",
        } as React.CSSProperties);

        if (ismarkeronmap.current) {
          setSubmitClassName(styles.submit);
        } else {
          setSubmitClassName(styles.placemarker);
        }
        if (mapcenter) {
          setMapCenter([mapcenter.lat, mapcenter.lng]);
        }
      }, 700);
    }
  }
  function shrinkinstantly() {
    const mapcenter = mapRef.current?.getCenter();
    setMapStyle({
      ...baseMapStyle,
      opacity: "0.5",
      width: "clamp(200px,20vw,20vw)",
      height: "25vh",
      marginBottom: "5vh",
    } as React.CSSProperties);

    if (ismarkeronmap.current) {
      setSubmitClassName(styles.submit);
    } else {
      setSubmitClassName(styles.placemarker);
    }
    if (mapcenter) {
      setMapCenter([mapcenter.lat, mapcenter.lng]);
    }
  }

  return (
    <div>
      <button
        onClick={shrinkinstantly}
        className={
          infovisibility === styles.none
            ? infovisibility
            : aspectRatio > 0.85
            ? styles.outsideofmap
            : styles.none
        }
      ></button>
      <div
        onMouseOver={enlargenmapandsubmitbutton}
        onMouseOut={shrinksubmitandmap}
        className={!isitpregame ? "" : styles.none}
      >
        <div
          id="map"
          style={mapStyle}
          className={isitmobile.current ? styles.down : ""}
        ></div>
        <div>
          <button
            id="button"
            style={{
              transition: "width 0.3s ease, height 0.3s ease",
              zIndex: "5",
            }}
            className={submitClassName}
          >
            PLACE MARKER ON THE MAP
          </button>
        </div>
      </div>
      <div className={infovisibility}>
        <div className={styles.timerdiv}>
          <p className={styles.timer}>
            00:
            {passedtime.current < 0
              ? "00"
              : 60 - passedtime.current < 10
              ? "0" + (60 - passedtime.current)
              : 60 - passedtime.current}
          </p>
        </div>
        <svg
          width="175"
          height="50"
          viewBox="-5 -5 180 50"
          className={styles.timerprogress}
        >
          <path
            d={path}
            fill="none"
            stroke={`rgb(255 ${yellow.current} ${yellow.current})`}
            strokeWidth="5"
            strokeDasharray={`${strokeDasharray}`}
            strokeDashoffset="0"
          />
        </svg>
        <div className={styles.ingamedetails}>
          <p className={styles.tournumber}>{Rounds}/5</p>
          <p className={styles.tournumberinfo}>Rounds</p>
          <p className={styles.totalscore}>{totalscore}</p>
          <p className={styles.totalscoreinfo}>Score</p>
        </div>
      </div>
    </div>
  );
};

export default Map;
