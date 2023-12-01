import run from "aocrunner";
import { toSum } from "../utils/toSum.js";
import { toTrimmedLines } from "../utils/toTrimmedLines.js";

const parseInput = (rawInput: string) => toTrimmedLines(rawInput);

const part1 = (rawInput: string) => {
  return parseInput(rawInput)
    .map(toFirstLastDigitNumber)
    .reduce(toSum, 0)
    .toString();
};

const part2 = (rawInput: string) => {
  return parseInput(rawInput)
    .map(toStringWithParsedDigits)
    .map(toFirstLastDigitNumber)
    .reduce(toSum, 0)
    .toString();
};

const DIGITS = {
  one: "one1one",
  two: "two2two",
  three: "three3three",
  four: "four4four",
  five: "five5five",
  six: "six6six",
  seven: "seven7seven",
  eight: "eight8eight",
  nine: "nine9nine",
} as const;

const toStringWithParsedDigits = (str: string): string => {
  const digits = Object.keys(DIGITS);
  return digits.reduce(
    (accumulator, digit) =>
      accumulator.replaceAll(digit, DIGITS[digit as keyof typeof DIGITS]),
    str,
  );
};

const toFirstLastDigitNumber = (line: string): number => {
  const digitStr = line.replace(/[^0-9]/g, "");
  return parseInt(`${digitStr.at(0)}${digitStr.at(-1)}`, 10);
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`,
        expected: "142",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen`,
        expected: "281",
      },
      {
        input: `onetwo
        threenine`,
        expected: "51",
      },
      {
        input: `
        eightfour2fourvzksqhxmlkpkfktmdzpmthreetwonehv
        nine86kzqvkjqtjfourmpcggd8
        8nstjmtmstcnffnksqh
        bvgcmbcrgqfourpvs5xs`,
        expected: `${81 + 98 + 88 + 45}`, // ????
      },
      {
        input: `twone`,
        expected: `21`,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
