import { useGameState } from "@/context/gamestatecontext";

const latlengthmeter = 111.32 * 1000;
const longtiduelengthmeter = (40075 * 1000 * 0.75346369194) / 360; // 0.75346369194 is cosine of latitude

export function useCalculations() {
  const { setscoreanderror } = useGameState();
  function guessSubmit(
    imglat: number,
    imglng: number,
    positionlat: number,
    positionlng: number
  ) {
    const error = Math.floor(
      Math.sqrt(
        ((imglat - positionlat) * latlengthmeter) ** 2 +
          ((imglng - positionlng) * longtiduelengthmeter) ** 2
      )
    );
    const score =
      Math.floor(
        5000 *
          Math.E **
            ((-5 *
              Math.sqrt(
                (imglat - positionlat) ** 2 + (imglng - positionlng) ** 2
              )) /
              0.01947557727)
      ) + 1;
    setscoreanderror([score, error]);
  }
  function maybemabye() {}

  return { guessSubmit, maybemabye };
}
