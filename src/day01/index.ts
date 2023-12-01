import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input
    .map((line) => line.trim().replace(/[^0-9]/g, ""))
    .map((nums) => {
      const first = nums.at(0);
      const second = nums.at(-1);
      const res = parseInt(`${first}${second}`, 10);
      return res;
    })
    .reduce((sum, curr) => curr + sum, 0)
    .toString();
};

const part2 = (rawInput: string) => {
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
  const input = parseInput(rawInput);
  return input
    .map((line) => line.trim())
    .map((line) => {
      let str = line;
      Object.keys(DIGITS).forEach(
        (digit) =>
          (str = str.replaceAll(digit, DIGITS[digit as keyof typeof DIGITS])),
      );
      return str.replace(/[^0-9]/g, "");
    })
    .map((nums) => {
      const first = nums.at(0);
      const second = nums.at(-1);
      const res = parseInt(`${first}${second}`, 10);
      return res;
    })
    .reduce((sum, curr) => curr + sum, 0)
    .toString();
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
