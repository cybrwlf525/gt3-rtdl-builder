// // import { authSheets } from "./authSheets";
// import { authSheets } from "../authSheets";
// import { getSpreadsheetByName } from "../getSpreadsheetByName";
// import { calculateProbabilities } from "./calculateProbabilities";
// // import { getSpreadsheetByName } from "./getSpreadsheetByName";
// import { getTotalCombinations } from "./getTotalCombinations";
// import { recordPotentialProbabilities } from "./recordPotentialProbabilities";

// export async function generateKnownActuals(): Promise<void> {
//   const spreadsheetId = "1O_3jJugR913grgVA4ME7D1CeIvG_M4KbB3DEUXh0EAw"; // Replace with your Spreadsheet ID
//   console.log("Calling authSheets function");
//   const sheets = await authSheets();
//   console.log("authSheets function finished");
//   console.log("Getting the specific spreadsheet");
//   const response = await sheets.spreadsheets.get({
//     spreadsheetId,
//     includeGridData: false,
//   });
//   console.log("Specific spreadsheet retrieved");
//   const spreadsheet = response.data;

//   var knownActuals: { [itemNum: number]: number[] } = {};
//   console.log("Checking if 'Scavenger Tool' sheet exists");
//   const mainSheet = getSpreadsheetByName(spreadsheet, "Scavenger Tool");
//   if (!mainSheet) {
//     throw new Error("No sheet named 'Scavenger Tool' was found.");
//   }
//   console.log("Verified - 'Scavenger Tool' sheet exists");
//   // fetchData();

// //   Read data from Main sheet
//   var data = mainSheet.getRange(2, 4, 25, 4).getValues();

//   console.log("Getting main sheet data");
//   const mainSheetRangeResponse = await sheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: "Scavenger Tool!D2:J26",
//   });
//   console.log("Done - Retrieved main sheet data");

//   const mainSheetData = mainSheetRangeResponse.data.values as [
//     string,
//     number,
//     number,
//     number
//   ][];

//   if (!mainSheetData) {
//     throw new Error("No data found in the 'Scavenger tool' sheet range D2:J26");
//   }

//   for (var i = 0; i < mainSheetData.length; i++) {
//     var row = mainSheetData[i];
//     if (i === 24) {
//       console.log(`row: ${JSON.stringify(row)}`);
//     }

//     var minRatio = row[1]; // Column E
//     var maxRatio = row[2]; // Column F
//     var numberUnwon = row[3]; // Column G
//     var gameName = row[0]; // Column D

//     if (numberUnwon == 1) {
//       // Multiply minRatio by 100 and add it to knownActuals
//       knownActuals[i + 1] = [Math.round(minRatio * 100)];
//     } else {
//       // Fetch data from the game sheet
//       // var gameSheet = ss.getSheetByName(gameName);
//       const gameSheet = getSpreadsheetByName(spreadsheet, gameName);

//       if (!gameSheet) {
//         throw new Error(
//           `No matching game sheet found for "${gameName}". Please run the "fetch data" script.`
//         );
//       }

//       // Get data from game sheet
//       const gameDataResponse = await sheets.spreadsheets.values.get({
//         spreadsheetId,
//         range: `${gameName}!A1:F`,
//       });

//       var gameData = gameDataResponse.data.values;

//       if (!gameData) {
//         throw new Error(
//           `No game data fround for game ${gameName}. Please make sure you run the fetch data script first`
//         );
//       }

//       var potentials: number[] = [];

//       let columnOffset = 0;

//       console.log(`gameData[0][2]: ${gameData[0][2]}`);

//       if (gameData[0][2] === "Probability") {
//         columnOffset = 1;
//       }

//       console.log(`columnOffset: ${columnOffset}`);

//       for (var j = 1; j < gameData.length; j++) {
//         // Skip header row
//         var gameRow: string[] = gameData[j];
//         // if (i === 24) {
//         //   console.log(gameRow);
//         //   console.log(
//         //     `achievementStatus check: ${
//         //       gameRow[4] === "not won" ? "pass" : "fail"
//         //     }`
//         //   );
//         //   console.log(`taRatio check: ${gameRow[1]}`);
//         // }
//         // console.log(`gameRow: ${gameRow}`);

//         var achievementStatus = gameRow[4 + columnOffset]; // Column E in game sheet
//         // console.log(`achievementStatus: ${achievementStatus}`);
//         var taRatio = parseFloat(gameRow[1]); // Column B in game sheet

//         // Check if the status is "not won" and the ratio is within the range
//         if (
//           achievementStatus === "not won" &&
//           taRatio >= minRatio &&
//           taRatio <= maxRatio
//         ) {
//           const pointValue = Math.round(taRatio * 100);
//           if (!potentials.find((potential) => potential === pointValue))
//             potentials.push(pointValue);
//         }
//       }
//       if (potentials.length === 0) {
//         throw new Error(`No potentials found for game ${gameName}`);
//       }
//       knownActuals[i + 1] = potentials;
//     }
//   }

//   console.log(`knownActuals: ${JSON.stringify(knownActuals)}`);

//   //probabilitiesObj consists of { probabilities, validCounts }
//   // const totalListValue = mainSheet.getRange(27, 8).getValue();
//   const totalListValueResponse = await sheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: "Scavenger Tool!H27",
//   });

//   const totalListValue = totalListValueResponse.data.values
//     ? parseInt(totalListValueResponse.data.values[0][0])
//     : undefined;

//   console.log(`totalListValue: ${totalListValue}`);
//   // Browser.msgBox(`totalListValue: ${totalListValue}`);
//   if (!totalListValue) {
//     throw new Error(
//       "No valid value found for totalListValue in 'Scavenger Tool' sheet H27"
//     );
//   }
//   const totalCombinations = getTotalCombinations(knownActuals);
//   console.log(`Total combinations: ${totalCombinations}`);
//   console.log("Calculating probabilities...");
//   const probabilitiesObj = calculateProbabilities(
//     knownActuals,
//     totalListValue,
//     totalCombinations
//   );
//   console.log(`probabilities: ${JSON.stringify(probabilitiesObj, null, 2)}`);
//   if (!probabilitiesObj) {
//     throw new Error("No valid combinations found");
//   }
//   console.log("Probabilities calculated");
//   recordPotentialProbabilities(
//     probabilitiesObj,
//     knownActuals,
//     sheets,
//     spreadsheet,
//     spreadsheetId,
//     mainSheetData
//   );
//   console.log("Script finished running");
//   // return knownActuals;
// }
