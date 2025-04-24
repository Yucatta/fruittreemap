import { useState, useRef, useEffect } from "react";
import styles from "@/app/styles/MapComponent.module.css";
import { useGameState } from "@/context/gamestatecontext";
interface Props {
  Rounds: number;
  totalscore: number;
  timerunout: () => void;
}
const Timer = ({ Rounds, timerunout, totalscore }: Props) => {
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
  const secondsleft = useRef<NodeJS.Timeout | null>(null);
  const passedtime = useRef(0);
  const { isitpregame, isitconclusion, isitresults } = useGameState();

  useEffect(() => {
    if (
      (isitconclusion || isitresults || isitpregame) &&
      line1.current !== 85
    ) {
      passedtime.current = 0;
      line1.current = 85;
      line2.current = 150;
      line3.current = 20;
      helpertemp.current = 400;
      if (secondsleft.current && timerborder.current) {
        clearInterval(secondsleft.current);
        clearInterval(timerborder.current);
      }
      setstrokeDasharray(helpertemp.current);
    } else if (!isitconclusion && !isitpregame && !isitresults) {
      timer();
      timerprogress();
    }
  }, [isitconclusion, isitpregame, isitresults]);
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
  function timer() {
    secondsleft.current = setInterval(() => {
      if (passedtime.current === 59) {
        if (secondsleft.current) {
          clearInterval(secondsleft.current);
        }
        timerunout();
      }
      passedtime.current++;
    }, 1000);
  }

  return (
    <div
      className={
        !isitconclusion && !isitpregame && !isitresults ? "" : styles.none
      }
    >
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
  );
};

export default Timer;
