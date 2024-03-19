import type { sheets_v4 } from "googleapis";
import { getTaRatioFromUrl } from "./getTaRatioFromUrl";

export async function updateListValue(
  authenticatedSession: sheets_v4.Sheets,
  sheetId: string,
  currentListValue: number,
  prevAchUrl: string,
  newAchPointValue: number
) {
  const prevRatio = await getTaRatioFromUrl(prevAchUrl);
  const newListValue = currentListValue - prevRatio * 100 + newAchPointValue;
  const dataToWrite: (string | number)[][] = [];
  dataToWrite.push([newListValue]);
  await authenticatedSession.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `'Current List'!J2`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: dataToWrite,
    },
  });
}
