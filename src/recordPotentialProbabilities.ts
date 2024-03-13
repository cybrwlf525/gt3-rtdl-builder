import { sheets_v4 } from "googleapis";
import { ProbabilitiesAndCounts } from ".";
import { getSpreadsheetByName } from "./getSpreadsheetByName";
import { getTotalCombinations } from "./getTotalCombinations";
import { setBackgroundColorForSpecifiedRowCellC } from "./setBackgroundColorForSpecifiedRowCellC";

export async function recordPotentialProbabilities(
  { probabilities, validCounts }: ProbabilitiesAndCounts,
  knownActuals: { [itemNum: number]: number[] },
  sheets: sheets_v4.Sheets,
  spreadsheet: sheets_v4.Schema$Spreadsheet,
  spreadsheetId: string,
  mainSheetData: [string, number, number, number][]
) {
  const totalCombinations = getTotalCombinations(knownActuals);

  const batchUpdateRequests: sheets_v4.Schema$Request[] = [];

  // Iterate over each game index in probabilities
  for (var i = 0; i < mainSheetData.length; i++) {
    var gameName = mainSheetData[i][0]; // Column D

    // Get the game sheet
    const gameSheet = getSpreadsheetByName(spreadsheet, gameName);

    // If no game sheet found or the game has only one unwon achievement, skip
    if (!gameSheet || knownActuals[i + 1].length <= 1) continue;

    const {
      data: { values: probabilityHeaderCell },
    } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${gameName}!C1`,
    });

    if (!probabilityHeaderCell) {
      throw new Error(
        `There was an error retrieving cell C1 for game ${gameName}`
      );
    }

    // var probabilityHeaderCell = gameSheet.getRange("C1");
    if (probabilityHeaderCell[0][0] !== "Probability") {
      // gameSheet.insertColumnAfter(2);
      // gameSheet.getRange("C1").setValue("Probability");
      // Request to insert new column
      const request: sheets_v4.Schema$Request = {
        insertDimension: {
          range: {
            sheetId: gameSheet.properties?.sheetId,
            dimension: "COLUMNS",
            startIndex: 2,
            endIndex: 3,
          },
          inheritFromBefore: false,
        },
      };

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [request],
        },
      });

      // Set the value of the new column header to 'Probability'
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${gameName}!C1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["Probability"]],
        },
      });
    }

    // Get all the achievements in the sheet
    // var achievements = gameSheet
    //   .getRange(2, 1, gameSheet.getLastRow() - 1, gameSheet.getLastColumn())
    //   .getValues();

    const {
      data: { values: achievements },
    } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${gameName}!A2:G`,
    });

    if (!achievements) {
      throw new Error(
        `No data found for columns A thru G on game sheet for ${gameName}`
      );
    }

    /**
     * Calculate ratio count for each ratio in this game for 'not won' achievements
     * We need to do this because we need to determine if there are multiple achievements in a range with the same ratio.
     * In this case we will split the probability percentage by the number of achievements with same ratio and highlight these yellow
     */
    var ratioCounts: { [taRatio: number]: number } = {};
    for (var j = 0; j < achievements.length; j++) {
      // console.log(`achievements[${j}]: ${JSON.stringify(achievements[j])}`);
      var taRatio = Math.round(achievements[j][1] * 100); // Column B in game sheet
      var achievementStatus = achievements[j][5]; // Column F in game sheet
      // console.log(
      //   `taRatio: ${taRatio}, achievementStatus: ${achievementStatus}`
      // );
      if (achievementStatus === "not won") {
        if (!ratioCounts[taRatio]) {
          ratioCounts[taRatio] = 0;
        }
        ratioCounts[taRatio]++;
        // console.log(`ratioCounts: ${JSON.stringify(ratioCounts)}`);
      }
    }

    // Iterate over each achievement
    for (var j = 0; j < achievements.length; j++) {
      const achievementStatus = achievements[j][5]; // Column E in game sheet
      const taRatio = Math.round(achievements[j][1] * 100); // Column B in game sheet
      const validForItemsString: string = achievements[j][6].toString(); // Column F in game sheet
      var validForItemsNums: number[] | number;
      if (validForItemsString.includes(",")) {
        const tempStringArray: string[] = validForItemsString.split(",");
        validForItemsNums = tempStringArray.map((itemNumString) =>
          parseInt(itemNumString)
        );
      } else {
        validForItemsNums = parseInt(validForItemsString);
      }

      if (achievementStatus === "won") {
        achievements[j][2] = 0; // Column C in game sheet
      } else {
        // Find the correct item for the ratio

        let probability: undefined | string = undefined;
        let adjustedProbability: string | undefined = "";

        const multipleSameRatiosExist = ratioCounts[taRatio] > 1;

        let validCombForRatioNote = "";

        /**
         * We need to be able to handle when an achievement is valid for multiple items.
         * If our achievement was valid for items 14 and 16,
         * in this case we would want our probabilities to be listed as:
         * 14: [some percentage]%, 16: [some other percentage]
         */
        if (Array.isArray(validForItemsNums)) {
          console.log(
            `validForItemsNums: ${JSON.stringify(validForItemsNums, null, 2)}`
          );
          let index = 0;
          for (const itemNum of validForItemsNums) {
            probability = probabilities[itemNum][taRatio]?.toPrecision(4);
            if (multipleSameRatiosExist) {
              adjustedProbability += `${itemNum}: ${
                Number(probability) / ratioCounts[taRatio]
              }%`;
            } else {
              adjustedProbability += `${itemNum}: ${probability}%`;
            }
            validCombForRatioNote += `Number of valid combinations for ratio ${taRatio}: ${validCounts.ratioCounts[itemNum][taRatio]}\n`;
            if (index < validForItemsNums.length - 1) {
              adjustedProbability += ", ";
              index++;
            }
          }
        } else {
          if (probabilities[validForItemsNums]) {
            probability =
              probabilities[validForItemsNums][taRatio]?.toPrecision(4);
            console.log(`probability: `, probability);
            if (!probability) {
              adjustedProbability = "N/A";
            } else if (multipleSameRatiosExist) {
              adjustedProbability = (
                Number(probability) / ratioCounts[taRatio]
              ).toPrecision(4);
            } else {
              adjustedProbability = probability.toString();
            }
            validCombForRatioNote = `Number of valid combinations for this particular ratio: ${validCounts.ratioCounts[validForItemsNums][taRatio]}\n`;
          } else {
            adjustedProbability = "N/A";
          }
        }
        // // Write note to cell
        var totalValidCombinations = validCounts.totalValidCombinations;
        var note =
          validCombForRatioNote +
          `Number of valid combinations total: ${totalValidCombinations}\n` +
          `Number of total combinations (including invalid combinations): ${totalCombinations}`;

        // Add requests to the batch instead of making them immediately
        const updateRequest: sheets_v4.Schema$Request = {
          updateCells: {
            range: {
              sheetId: gameSheet.properties?.sheetId,
              startRowIndex: j + 1,
              endRowIndex: j + 2,
              startColumnIndex: 2,
              endColumnIndex: 3,
            },
            rows: [
              {
                values: [
                  {
                    userEnteredValue: Array.isArray(validForItemsNums)
                      ? { stringValue: adjustedProbability }
                      : { numberValue: Number(adjustedProbability) },
                    note: note,
                  },
                ],
              },
            ],
            fields: "userEnteredValue,note",
          },
        };

        // If ratioCounts[taRatio] > 1, highlight cell
        if (multipleSameRatiosExist && updateRequest) {
          // setBackgroundColorForSpecifiedRowCellC(
          //   sheets,
          //   spreadsheetId,
          //   gameName,
          //   j
          // );
          if (
            updateRequest.updateCells &&
            updateRequest.updateCells.rows &&
            updateRequest.updateCells.rows[0] &&
            updateRequest.updateCells.rows[0].values
          ) {
            updateRequest.updateCells.rows[0].values[0].userEnteredFormat = {
              backgroundColor: {
                red: 1.0,
                green: 1.0,
                blue: 0.0,
              },
            };
            updateRequest.updateCells.fields +=
              ",userEnteredFormat.backgroundColor";
          }
        }

        batchUpdateRequests.push(updateRequest);

        batchUpdateRequests.push({
          autoResizeDimensions: {
            dimensions: {
              sheetId: gameSheet.properties?.sheetId,
              dimension: "COLUMNS",
              startIndex: 2,
              endIndex: 3,
            },
          },
        });
        // cell.setBackground("yellow"); // j+2 because range is 0-indexed and headers are not included
      }

      // cell.setNote(note);
    }
  }
  // Make a single batchUpdate request with all the accumulated requests
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: batchUpdateRequests,
    },
  });

  // // Write back the achievements with updated probabilities
  // gameSheet
  //   .getRange(2, 1, achievements.length, achievements[0].length)
  //   .setValues(achievements);
}
