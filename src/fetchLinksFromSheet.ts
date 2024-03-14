import type { sheets_v4 } from "googleapis";
import { sheets } from "googleapis/build/src/apis/sheets";
import { getSpreadsheetByName } from "./getSpreadsheetByName";

export async function fetchLinksFromSheet(
	sheetsObj: sheets_v4.Sheets,
	sheetId: string,
): Promise<string[]> {
	const links: string[] = [];
	const response = await sheetsObj.spreadsheets.get({
		spreadsheetId: sheetId,
		includeGridData: true,
	});
	console.log("Specific spreadsheet retrieved");
	const spreadsheet = response.data;
	const mainSheet = getSpreadsheetByName(spreadsheet, "Games for Contest");
	if (!mainSheet) {
		throw new Error("No sheet named 'Games for Contest' was found.");
	}
	console.log("Verified - 'Games for Contest' sheet exists");

	// console.log('mainSheet: ', mainSheet);

	const data = mainSheet.data;

	if (!data) {
		throw new Error("No data was found for the main sheet.");
	}
	if (data.length !== 1) {
		console.warn("data length does not equal 1");
	}

	for (const rangeData of data) {
		const rowData = rangeData.rowData;
		if (!rowData) {
			continue;
		}
		for (const rowObj of rowData) {
			const values = rowObj.values;
			if (!values) {
				continue;
			}
			const linkCellData = values[1].userEnteredValue?.stringValue;
			if (!linkCellData || linkCellData.trim() === "") {
				continue;
			}
			links.push(linkCellData);
		}
	}

	return links;
}
