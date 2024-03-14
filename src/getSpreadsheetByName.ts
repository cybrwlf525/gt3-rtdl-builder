import type { sheets_v4 } from "googleapis";

export function getSpreadsheetByName(
	spreadsheet: sheets_v4.Schema$Spreadsheet,
	sheetName: string,
) {
	for (const sheet of spreadsheet.sheets || []) {
		if (sheet.properties?.title === sheetName) {
			return sheet;
		}
	}
}
