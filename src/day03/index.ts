import run from "aocrunner";
import { toTrimmedLines } from "../utils/toTrimmedLines.js";
import { toSum } from "../utils/toSum.js";
import { toProduct } from "../utils/toProduct.js";
import { range } from "../utils/range.js";

const parseInput = (rawInput: string) => {
  const lines = toTrimmedLines(rawInput);

  const numbers: Record<string, { value: number; counted: boolean }> = {};
  const numberKeyLinks: Record<string, string> = {};
  const symbols: { row: number; col: number; value: string }[] = [];

  lines.forEach((line, rowIndex) => {
    let windowStart: number | undefined;
    let window: string[] = [];
    [...line].forEach((character, currentColumn) => {
      if (isDigit(character)) {
        if (windowStart === undefined) {
          windowStart = currentColumn;
        }

        window.push(character);
      }

      if (!isDigit(character) || currentColumn === line.length - 1) {
        if (isSymbol(character)) {
          symbols.push({
            row: rowIndex,
            col: currentColumn,
            value: character,
          });
        }

        if (windowStart !== undefined) {
          const startKey = `${rowIndex}:${windowStart}`;

          numbers[startKey] = {
            value: parseInt(window.join(""), 10),
            counted: false,
          };

          range(windowStart, currentColumn).forEach((colIndex) => {
            const key = `${rowIndex}:${colIndex}`;
            numberKeyLinks[key] = startKey;
          });
        }

        windowStart = undefined;
        window = [];
      }
    });
  });

  return { numbers, numberKeyLinks, symbols };
};

const part1 = (rawInput: string) => {
  const { symbols, numberKeyLinks, numbers } = parseInput(rawInput);

  const sum = symbols
    .map((symbol) => {
      const surroundingKeys = range(symbol.row - 1, symbol.row + 2)
        .map((rowIndex) =>
          range(symbol.col - 1, symbol.col + 2).map(
            (colIndex) => `${rowIndex}:${colIndex}`,
          ),
        )
        .flat();

      return surroundingKeys;
    })
    .flat()
    .reduce((partNumbers, key) => {
      const startKey = numberKeyLinks[key];
      if (!startKey) {
        return partNumbers;
      }

      const number = numbers[startKey];
      if (number && !number.counted) {
        numbers[numberKeyLinks[key]].counted = true;
        return [...partNumbers, number.value];
      }
      return partNumbers;
    }, [] as number[])
    .reduce(toSum, 0);

  return sum;
};

const part2 = (rawInput: string) => {
  const { symbols, numberKeyLinks, numbers } = parseInput(rawInput);

  const gearSymbols = symbols.filter((symbol) => symbol.value === "*");

  return gearSymbols
    .map((symbol) => {
      const surroundingKeys = range(symbol.row - 1, symbol.row + 2)
        .map((rowIndex) =>
          range(symbol.col - 1, symbol.col + 2).map(
            (colIndex) => `${rowIndex}:${colIndex}`,
          ),
        )
        .flat();

      return surroundingKeys;
    })
    .map((symbolKeys) =>
      symbolKeys.reduce((partNumbers, key) => {
        const startKey = numberKeyLinks[key];
        if (!startKey) {
          return partNumbers;
        }

        const number = numbers[startKey];
        if (number && !number.counted) {
          numbers[numberKeyLinks[key]].counted = true;
          return [...partNumbers, number.value];
        }
        return partNumbers;
      }, [] as number[]),
    )
    .filter((adjacentParts) => adjacentParts.length >= 2)
    .map((adjacentParts) => adjacentParts.reduce(toProduct, 1))
    .reduce(toSum, 0);
};

const isDigit = (str: string) => str.match(/[0-9]/) !== null;
const isSymbol = (str: string) => str.match(/[^0-9\.]/) !== null;

run({
  part1: {
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..
        `,
        expected: 4361,
      },
      {
        input: `
        .......
        764*294
        .......
        `,
        expected: 1058,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..
        `,
        expected: 467835,
      },
      {
        input: `
        .......
        764*294
        .......
        `,
        expected: 224616,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
