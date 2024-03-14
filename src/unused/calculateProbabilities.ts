// import { findCombinations, getProbabilitiesAndCounts } from "..";

// // export function calculateProbabilities(
// //   knownActuals: { [itemNum: number]: number[] },
// //   totalListValue: number,
// //   totalCombinations: number
// // ) {
// //   console.log("calculateProbabilities started");
// //   console.log(`totalListValue type: ${typeof totalListValue}`);
// //   let frequencies: { [key: number]: { [value: number]: number } } = {};
// //   const solution = {};

// //   findCombinations(
// //     1,
// //     solution,
// //     0,
// //     frequencies,
// //     knownActuals,
// //     totalListValue,
// //     totalCombinations
// //   );

// //   if (validCombinations.length > 0) {
// //     const probabilitiesAndCounts = getProbabilitiesAndCounts(validCombinations);
// //     return probabilitiesAndCounts;
// //   } else {
// //     throw new Error("No valid combinations found");
// //     // Browser.msgBox("No valid combinations found");
// //     return null;
// //   }
// // }

// export function calculateProbabilities(
//   knownActuals: { [itemNum: number]: number[] },
//   totalListValue: number,
//   totalCombinations: number
// ) {
//   console.log("calculateProbabilities started");
//   console.log(`totalListValue type: ${typeof totalListValue}`);
//   let frequencies: { [key: number]: { [value: number]: number } } = {};
//   let currentValues: { [index: number]: number } = {};
//   let combinationCounter = { iterationCount: 0, validComboCount: 0 };

//   findCombinations(
//     1,
//     currentValues,
//     0,
//     frequencies,
//     knownActuals,
//     totalListValue,
//     totalCombinations,
//     combinationCounter
//   );

//   console.log(`${(JSON.stringify(combinationCounter), null, 2)}`);
//   console.log(
//     `Final iteration count to total combos percentage: ${
//       combinationCounter.iterationCount / totalCombinations
//     }`
//   );

//   if (combinationCounter.validComboCount > 0) {
//     const probabilitiesAndCounts = getProbabilitiesAndCounts(
//       frequencies,
//       combinationCounter
//     );
//     return probabilitiesAndCounts;
//   } else {
//     throw new Error("No valid combinations found");
//     // Browser.msgBox("No valid combinations found");
//     return null;
//   }
// }
