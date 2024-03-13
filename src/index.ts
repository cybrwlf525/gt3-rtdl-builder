import { convertToPercentages } from "./convertToPercentages";
import { generateKnownActuals } from "./generateKnownActuals";

function isValid(
  index: number,
  value: number,
  currentValues: { [index: number]: number }
) {
  if (index > 1 && value < currentValues[index - 1]) {
    return false;
  }
  return true;
}

export function findCombinations(
  index: number,
  currentValues: { [index: number]: number },
  currentSum: number,
  frequencies: { [key: number]: { [value: number]: number } },
  knownActuals: { [itemNum: number]: number[] },
  totalListValue: number,
  totalCombinations: number,
  combinationCounter: { iterationCount: number; validComboCount: number }
) {
  // Log the current combination count to the console:
  if (combinationCounter.iterationCount % 1000000000 === 0) {
    console.log(
      `Percentage complete: ${(
        (combinationCounter.iterationCount / totalCombinations) *
        100
      ).toFixed(3)}%`
    );
    // console.log(
    //   `Num of valid combinations: ${combinationCounter.validComboCount}`
    // );

    const percentages = convertToPercentages(
      frequencies,
      combinationCounter.validComboCount
    );
    console.log(`Percentages so far: ${JSON.stringify(percentages, null, 2)}`);
  }

  // Increment the combination count for the next function call:
  combinationCounter.iterationCount++;

  if (index === 26) {
    if (currentSum === totalListValue) {
      combinationCounter.validComboCount++;
      // Update frequencies for this combination:
      for (const [index, value] of Object.entries(currentValues)) {
        const key = parseInt(index);
        // total += value;
        if (!frequencies[key]) {
          frequencies[key] = {};
        }
        if (!frequencies[key][value]) {
          frequencies[key][value] = 0;
        }
        frequencies[key][value]++;
      }
    }
    return;
  }

  if (knownActuals[index] && knownActuals[index].length === 1) {
    currentValues[index] = knownActuals[index][0];
    findCombinations(
      index + 1,
      currentValues,
      currentSum + knownActuals[index][0],
      frequencies,
      knownActuals,
      totalListValue,
      totalCombinations,
      combinationCounter
    );
  } else if (knownActuals[index]) {
    for (const potential of knownActuals[index]) {
      if (isValid(index, potential, currentValues)) {
        currentValues[index] = potential;
        findCombinations(
          index + 1,
          currentValues,
          currentSum + potential,
          frequencies,
          knownActuals,
          totalListValue,
          totalCombinations,
          combinationCounter
        );
      } else {
        /**
         * compensate iterationCounter for number of other combinations
         * that are represented by the invalid combinations not processed
         * */
        // Calculate the number of combinations we are skipping.
        let numCombinationsSkipped = 1;
        for (let i = index + 1; i < 26; i++) {
          numCombinationsSkipped *= knownActuals[i].length;
        }

        // Increment the combinationCounter by combinationsToSkip.
        combinationCounter.iterationCount += numCombinationsSkipped;
      }
    }
  }
}

export function getProbabilitiesAndCounts(
  frequencies: { [key: number]: { [value: number]: number } },
  combinationCounter: { iterationCount: number; validComboCount: number }
): ProbabilitiesAndCounts {
  const probabilities: { [key: number]: { [value: number]: number } } = {};

  for (const [index, values] of Object.entries(frequencies)) {
    const key = parseInt(index);

    if (!probabilities[key]) {
      probabilities[key] = {};
    }

    for (const [value, frequency] of Object.entries(values)) {
      probabilities[key][parseInt(value)] = Number(
        (frequency / combinationCounter.validComboCount) * 100
      );
    }
  }

  const validCounts = {
    totalValidCombinations: combinationCounter.validComboCount,
    ratioCounts: frequencies,
  };

  return { probabilities, validCounts };
}

export type ProbabilitiesAndCounts = {
  probabilities: { [key: number]: { [value: number]: number } };
  validCounts: {
    totalValidCombinations: number;
    ratioCounts: { [key: number]: { [value: number]: number } };
  };
};

generateKnownActuals();
