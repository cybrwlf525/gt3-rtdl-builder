import type { sheets_v4 } from "googleapis";

export async function writeToSheet(
	authenticatedSession: sheets_v4.Sheets,
	sheetId: string,
	range: string,
	values: (string | number)[][],
) {
	try {
		const response = await authenticatedSession.spreadsheets.values.update({
			spreadsheetId: sheetId,
			range,
			valueInputOption: "USER_ENTERED",
			requestBody: {
				values,
			},
		});
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("An unknown error occured in writeToSheet function");
	}
}
