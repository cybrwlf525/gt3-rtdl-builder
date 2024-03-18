import type { sheets_v4 } from "googleapis";
import { authSheets } from "./authSheets";
import { fetchLinksFromSheet } from "./fetchLinksFromSheet";

export async function getGamePageLinks(
	sheetsObj: sheets_v4.Schema$Spreadsheet,
): Promise<string[]> {
	const links = await fetchLinksFromSheet(sheetsObj);
	return links;
}
