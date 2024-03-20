import type { sheets_v4 } from "googleapis";

export type GamePageData = {
  gameTitle: string;
  gameUrl: string;
};

export async function getGamePoolData(
  authenticatedSession: sheets_v4.Sheets,
  sheetId: string
) {
  const forContestsResponse =
    await authenticatedSession.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "'Games for Contest'!A:B",
    });

  const rangeData = forContestsResponse.data.values;

  if (!rangeData) {
    throw new Error("rangeData is returning undefined");
  }

  const gamePageDataArray: GamePageData[] = [];

  for (const rowData of rangeData) {
    const gameTitle = rowData[0] as string | undefined;
    const gameUrl = rowData[1] as string | undefined;
    if (gameTitle && gameTitle.trim() !== "" && gameUrl && gameUrl !== "") {
      gamePageDataArray.push({ gameTitle, gameUrl });
    }
  }

  return gamePageDataArray;
}
