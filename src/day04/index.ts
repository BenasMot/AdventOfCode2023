import run from "aocrunner";
import { toTrimmedLines } from "../utils/toTrimmedLines.js";
import { toConsole } from "../utils/toConsole.js";
import { toSum } from "../utils/toSum.js";

const parseInput = (rawInput: string) =>
  toTrimmedLines(rawInput).map((line) => {
    const [cardName, myNums, winningNums] = line.split(/: | \| /g);
    const myNumbers = parseNumLine(myNums);
    const winningNumbers = parseNumLine(winningNums);
    const matching = winningNumbers.filter((num) => myNumbers.includes(num));

    return {
      cardNumber: parseInt(cardName.replace("Card ", ""), 10),
      myNumbers,
      winningNumbers,
      matching,
    };
  });

type Card = ReturnType<typeof parseInput>[number];

const part1 = (rawInput: string) => {
  return parseInput(rawInput)
    .map(({ matching }) => (matching.length ? 2 ** (matching.length - 1) : 0))
    .filter((winnings) => winnings >= 1)
    .reduce(toSum, 0);
};

const part2 = (rawInput: string) => {
  const cards = parseInput(rawInput);

  let accumulator: Card[] = [];

  const handleCards = (cards: Card[]) => {
    const [currentCard, ...restOfCards] = cards;
    if (!currentCard) {
      return;
    }

    accumulator = [...accumulator, currentCard];
    const currentCardCopyCount = accumulator.filter(
      (c) => c.cardNumber === currentCard?.cardNumber,
    ).length;
    const winCount = currentCard?.matching.length;
    const copies = cards.slice(1, winCount + 1);

    accumulator = [
      ...accumulator,
      ...Array(currentCardCopyCount).fill(copies).flat(),
    ];

    handleCards(restOfCards);
  };

  handleCards(cards);

  return accumulator.length;
};

const parseNumLine = (nums: string) =>
  nums
    .trim()
    .split(/ /)
    .filter(Boolean)
    .map((num) => parseInt(num, 10));
run({
  part1: {
    tests: [
      {
        input: `
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
      {
        input: `
        Card 122: 55 43 37 61  6 59 92 17 78  7 | 46 31 72 23 54 56 26  2 95 30 35 97 84 45 48 98 29 68 14 90 67 64 74 47 57
        `,
        expected: 0,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
