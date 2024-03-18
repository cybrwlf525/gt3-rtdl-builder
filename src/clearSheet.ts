import type { sheets_v4 } from "googleapis";

export async function clearSheet(
	authenticatedSession: sheets_v4.Sheets,
	sheetId: string,
	sheetTitle: string,
) {
	await authenticatedSession.spreadsheets.values.clear({
		spreadsheetId: sheetId,
		range: `'${sheetTitle}'!A:Z`,
	});
}
