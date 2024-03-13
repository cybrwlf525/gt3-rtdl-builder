/**
 *
 * @param {object} knownActuals
 * @returns {number} The mathematical calculation of all possible combinations, disregarding validity constraints
 */
export function getTotalCombinations(knownActuals: {
  [itemNum: number]: number[];
}): number {
  var totalCombinations = 1;
  for (var key in knownActuals) {
    totalCombinations *= knownActuals[key].length;
  }
  return totalCombinations;
}
