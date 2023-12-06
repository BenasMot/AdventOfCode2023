import run from "aocrunner";
import { toTrimmedLines } from "../utils/toTrimmedLines.js";
import { range } from "../utils/range.js";
import { toConsole } from "../utils/toConsole.js";

type Range = { from: number; to: number };
type Mapping = {
  input: Range;
  output: Range;
  convert: (pos: number) => number;
};

const parseInput = (rawInput: string) => {
  const [seeds, ...maps] = rawInput.split("\n\n");

  const adjustedMaps = maps.map(toTrimmedLines).map((map) => {
    const [_name, ...ranges] = map;
    const mappers = ranges.map<Mapping>((range) => {
      const [output, input, length] = range
        .split(" ")
        .map((num) => parseInt(num, 10));

      return {
        input: { from: input, to: input + length },
        output: { from: input, to: output + length },
        convert: (position: number) => output + Math.abs(position - input),
      };
    });

    const missingMappers = mappers.reduce<Mapping[]>(
      (gaps, existingMapper): Mapping[] => {
        const gapThatContains = gaps.find((gap) => {
          const isAfterRange = existingMapper.output.from > gap.input.to;
          const isBeforeRange = existingMapper.output.to < gap.input.from;
          return !isAfterRange && !isBeforeRange;
        });

        if (gapThatContains === undefined) {
          return gaps;
        }

        return [
          {
            input: {
              from: gapThatContains.input.from,
              to: existingMapper.input.from,
            },
            output: {
              from: gapThatContains.input.from,
              to: existingMapper.input.from,
            },
            convert: gapThatContains.convert,
          },
          {
            input: {
              from: existingMapper.input.to,
              to: gapThatContains.input.to,
            },
            output: {
              from: existingMapper.input.to,
              to: gapThatContains.input.to,
            },
            convert: gapThatContains.convert,
          },
        ];
      },
      [
        {
          input: { from: 0, to: 1e11 },
          output: { from: 0, to: 1e11 },
          convert: (num) => num,
        },
      ],
    );

    console.log("###", missingMappers);

    return mappers;
  });

  return {
    seeds,
    maps: adjustedMaps,
  };
};

const part1 = (rawInput: string) => {
  const { seeds, maps } = parseInput(rawInput);

  const locationNumbers = seeds
    .split(": ")
    .at(1)!
    .split(" ")
    .map((num) => parseInt(num, 10))
    .map((seedNumber) => {
      const locationNumber = maps.reduce((number, mappers) => {
        const fittingMapper = mappers.find(
          ({ input }) => number >= input.from && number < input.to,
        );

        return fittingMapper ? fittingMapper.convert(number) : number;
      }, seedNumber);
      return locationNumber;
    });

  return Math.min(...locationNumbers);
};

const part2 = (rawInput: string) => {
  const { seeds: seedRanges, maps } = parseInput(rawInput);

  const [
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  ] = maps;

  temperatureToHumidity.map((map) => {
    const fittingInputs = humidityToLocation.filter(({ input }) => {
      const isAfterRange = map.output.from > input.to;
      const isBeforeRange = map.output.to < input.from;
      return !isAfterRange && !isBeforeRange;
    });

    const splitMaps = fittingInputs
      .sort((a, b) => a.input.from - b.input.to)
      .map<Mapping>(({ input, output, convert }) => {
        const inputFrom =
          input.from > map.input.from ? input.from : map.input.from;
        const inputTo = input.to < map.input.to ? input.to : map.input.to;

        return {
          input: {
            from: inputFrom,
            to: inputTo,
          },
          output: {
            from: output.from + Math.abs(input.from - inputFrom),
            to: output.to + Math.abs(input.to - inputTo),
          },
          convert: (num) => convert(map.convert(num)),
        };
      })
      .flat();
  });
  return;
};

const parseSeedRanges = (
  seedRanges: string,
): { from: number; to: number }[] => {
  return seedRanges
    .split(": ")
    .at(1)!
    .split(" ")
    .map((num) => parseInt(num, 10))
    .reduce((ranges, num, index) => {
      if (index % 2 === 0) {
      }
      return ranges;
    }, [] as { from: number; to: number }[]);
};

run({
  part1: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4
        `,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4
        `,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
