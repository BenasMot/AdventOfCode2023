import run from "aocrunner";
import { toTrimmedLines } from "../utils/toTrimmedLines.js";
import { toSum } from "../utils/toSum.js";
import { toProduct } from "../utils/toProduct.js";

const parseInput = (rawInput: string) => toTrimmedLines(rawInput);

const part1 = (rawInput: string) => {
  return parseInput(rawInput)
    .map((row) => {
      const [game, ...sets] = row.split(/: |; /g);

      const id = parseInt(game.split(" ").at(1)!, 10);

      const setMaximums = sets
        .map((set) => set.split(", ").map((pair) => pair.split(" ")))
        .map(
          (valuePairs) =>
            Object.fromEntries(
              valuePairs
                .map((pair) => pair.reverse())
                .map(([key, value]) => [key, parseInt(value, 10)]),
            ) as Record<string, number>,
        )
        .reduce((accumulator, mapping) => {
          return {
            red: Math.max(accumulator["red"] ?? 0, mapping["red"] ?? 0),
            green: Math.max(accumulator["green"] ?? 0, mapping["green"] ?? 0),
            blue: Math.max(accumulator["blue"] ?? 0, mapping["blue"] ?? 0),
          };
        });

      return { id, setMaximums };
    })
    .filter(
      (rowInfo) =>
        (rowInfo.setMaximums["red"] ?? 0) <= 12 &&
        (rowInfo.setMaximums["green"] ?? 0) <= 13 &&
        (rowInfo.setMaximums["blue"] ?? 0) <= 14,
    )
    .map((rowInfo) => rowInfo.id)
    .reduce(toSum, 0);
};

const part2 = (rawInput: string) => {
  return parseInput(rawInput)
    .map((row) => {
      const [game, ...sets] = row.split(/: |; /g);

      const id = parseInt(game.split(" ").at(1)!, 10);

      const setMaximums = sets
        .map((set) => set.split(", ").map((pair) => pair.split(" ")))
        .map(
          (valuePairs) =>
            Object.fromEntries(
              valuePairs
                .map((pair) => pair.reverse())
                .map(([key, value]) => [key, parseInt(value, 10)]),
            ) as Record<string, number>,
        )
        .reduce((accumulator, mapping) => {
          return {
            red: Math.max(accumulator["red"] ?? 0, mapping["red"] ?? 0),
            green: Math.max(accumulator["green"] ?? 0, mapping["green"] ?? 0),
            blue: Math.max(accumulator["blue"] ?? 0, mapping["blue"] ?? 0),
          };
        });

      return { id, setMaximums };
    })
    .map((rowInfo) => Object.values(rowInfo.setMaximums).reduce(toProduct, 1))
    .reduce(toSum, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 8,
      },
      {
        input: `
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        `,
        expected: 0,
      },
      {
        input: `
        Game 80: 13 red, 1 green; 15 red, 1 blue; 8 red, 1 green
        `,
        expected: 0,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
