import run from "aocrunner";
import { toTrimmedLines } from "../utils/toTrimmedLines.js";
import { range } from "../utils/range.js";
import { toProduct } from "../utils/toProduct.js";

const parseInput = (rawInput: string) => toTrimmedLines(rawInput);

const part1 = (rawInput: string) => {
  const [times, distances] = parseInput(rawInput).map((line) =>
    line
      .split(/:[ ]+/)[1]
      .split(/[ ]+/g)
      .map((num) => parseInt(num, 10)),
  );

  const results = times.map((time, index) => {
    const distance = distances[index];
    const guessRange = range(1, time);

    const fasterTimes = guessRange
      .map((guessTime) => raceTime(guessTime, distance))
      .filter((raceTime) => raceTime < time);

    return fasterTimes.length;
  });

  return results.reduce(toProduct, 1);
};

const part2 = (rawInput: string) => {
  const [time, distance] = parseInput(rawInput).map((line) =>
    parseInt(line.split(/:[ ]+/)[1].replace(/\s/g, ""), 10),
  );

  const guessRange = range(1, time);

  const fasterTimes = guessRange
    .map((guessTime) => raceTime(guessTime, distance))
    .filter((raceTime) => raceTime < time);

  return fasterTimes.length;
};

const raceTime = (holdTime: number, distance: number) =>
  holdTime + distance / holdTime;

run({
  part1: {
    tests: [
      {
        input: `
        Time:      7  15   30
        Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Time:      7  15   30
        Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
