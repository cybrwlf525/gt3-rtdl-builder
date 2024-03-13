import { sheets_v4 } from "googleapis";

export async function setBackgroundColorForSpecifiedRowCellC(
  sheetsService: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string,
  rowNum: number
) {
  const sheetId = await getSheetIdByName(
    sheetsService,
    spreadsheetId,
    sheetName
  );
  if (!sheetId) {
    throw new Error(`sheetId not found for sheet ${sheetName}`);
  }
  const request = {
    spreadsheetId: spreadsheetId,
    resource: {
      requests: [
        {
          updateCells: {
            range: {
              sheetId: sheetId,
              startRowIndex: rowNum, // 0-based, inclusive
              endRowIndex: rowNum + 1, // 0-based, exclusive
              startColumnIndex: 2, // 0-based, inclusive
              endColumnIndex: 3, // 0-based, exclusive
            },
            rows: [
              {
                values: [
                  {
                    userEnteredFormat: {
                      backgroundColor: {
                        red: 1.0,
                        green: 1.0,
                        blue: 0.0,
                      },
                    },
                  },
                ],
              },
            ],
            fields: "userEnteredFormat.backgroundColor",
          },
        },
      ],
    },
  };

  const response = await sheetsService.spreadsheets.batchUpdate(request);
  console.log(response.data);
}

async function getSheetIdByName(
  sheetsService: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string
): Promise<number | undefined> {
  const spreadsheet = await sheetsService.spreadsheets.get({ spreadsheetId });
  const sheets = spreadsheet.data.sheets;

  if (!sheets) {
    throw new Error(`No sheets found in spreadsheet with id: ${spreadsheetId}`);
  }

  for (const sheet of sheets) {
    if (sheet.properties?.title === sheetName) {
      return sheet.properties.sheetId ?? undefined;
    }
  }

  // If no matching sheet is found, return null
  return undefined;
}
