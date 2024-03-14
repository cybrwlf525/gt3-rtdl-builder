import type { sheets_v4 } from "googleapis";
import { authSheets } from "./authSheets";
import { fetchLinksFromSheet } from "./fetchLinksFromSheet";

export async function getGamePageLinks(): Promise<string[]> {
	const sheetId = "14fbxRfYqeaOvvLebl_1iLSiCMSl8opJf9qbMA3657Yw";
	const sheetsObj: sheets_v4.Sheets = await authSheets();
	const links = await fetchLinksFromSheet(sheetsObj, sheetId);
	return links;
}
