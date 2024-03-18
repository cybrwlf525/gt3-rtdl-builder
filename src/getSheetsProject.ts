import type { sheets_v4 } from "googleapis";
import { authSheets } from "./authSheets";

export async function getSheetsProject(
	authenticatedSession: sheets_v4.Sheets,
	sheetId: string,
): Promise<sheets_v4.Schema$Spreadsheet> {
	// return await authSheets();
	const response = await authenticatedSession.spreadsheets.get({
		spreadsheetId: sheetId,
		includeGridData: true,
	});
	console.log("Specific spreadsheet retrieved");
	const spreadsheet = response.data;
	return spreadsheet;
}
