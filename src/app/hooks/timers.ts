// import React from "react";
// interface Props {
//   onTimeRunOut: () => void;
// }
// export function useTimers(
//   { onTimeRunOut }: Props,
//   {
//     yellow,
//     line1,
//     line2,
//     line3,
//     helpertemp,
//     timerborder,
//     secondsleft,
//     passedtime,
//     setstrokeDasharray,
//     setpath,
//   }: {
//     yellow: React.MutableRefObject<number>;
//     line1: React.MutableRefObject<number>;
//     line2: React.MutableRefObject<number>;
//     line3: React.MutableRefObject<number>;
//     helpertemp: React.MutableRefObject<number>;
//     timerborder: React.MutableRefObject<NodeJS.Timeout | null>;
//     setstrokeDasharray: React.Dispatch<React.SetStateAction<number>>;
//     setpath: React.Dispatch<React.SetStateAction<string>>;
//     setpassedtime: React.Dispatch<React.SetStateAction<number>>;
//     secondsleft: React.RefObject<NodeJS.Timeout | null>;
//   }
// ) {
//   function timerprogress() {
//     let timerprogressforcolor = 0;

//     timerborder.current = setInterval(() => {
//       if (line1.current < 150) {
//         line1.current += 0.5;
//       } else if (helpertemp.current > 257) {
//         if (helpertemp.current === 400) {
//           helpertemp.current = 320;
//           setstrokeDasharray(helpertemp.current);
//         }
//         helpertemp.current -= 0.5;
//         setstrokeDasharray(helpertemp.current);
//       } else if (line2.current > 20) {
//         line2.current -= 0.5;
//       } else if (helpertemp.current > 65) {
//         if (helpertemp.current === 257) {
//           helpertemp.current = 126;
//           setstrokeDasharray(126);
//         }
//         helpertemp.current -= 0.5;
//         setstrokeDasharray(helpertemp.current);
//       } else if (line3.current < 85) {
//         line3.current += 0.5;
//       } else {
//         if (timerborder.current) {
//           clearInterval(timerborder.current);
//         }
//       }
//       if (line1.current < 150) {
//         setpath(`M 85 0
//         L ${line3.current} 0
//         A 20 20 0 1 0 20 40
//         L ${line2.current} 40
//         A 20 20 0 0 0 150 0
//         L ${line1.current} 0`);
//       } else if (helpertemp.current > 257) {
//       } else if (line2.current > 20) {
//         setpath(`M 85 0
//         L ${line3.current} 0
//         A 20 20 0 1 0 20 40
//         L ${line2.current} 40
//         `);
//       } else if (helpertemp.current > 65) {
//       } else {
//         setpath(`M 85 0
//         L ${line3.current} 0
//         `);
//       }

//       timerprogressforcolor++;
//       if (timerprogressforcolor > 513) {
//         yellow.current = 255 - (timerprogressforcolor - 513 / 257) * 255;
//       }
//     }, 77.92);
//   }
//   function timer() {
//     secondsleft.current = setInterval(() => {
//       if (passedtime === 59) {
//         if (secondsleft.current) {
//           clearInterval(secondsleft.current);
//         }
//         onTimeRunOut();
//       }

//       setpassedtime(passedtime + 1);
//     }, 1000);
//     if (passedtime > 500) {
//       console.log();
//     }
//   }
//   return { timer, timerprogress, passedtime };
// }
