import type { sheets_v4 } from "googleapis";
import { addSheet } from "./addSheet";
import { writeToSheet } from "./writeToSheet";
import type { AchievementData } from "./types";
import { getListValue } from "./getListValue";
import { encryptURL } from "./encryptUrl";
import { decryptURL } from "./decryptUrl";
import { getSpreadsheetByName } from "./getSpreadsheetByName";
import { clearSheet } from "./clearSheet";

export async function createScavengerList(
	authenticatedSession: sheets_v4.Sheets,
	sheetId: string,
	achievementList: AchievementData[],
) {
	const response = await authenticatedSession.spreadsheets.get({
		spreadsheetId: sheetId,
	});
	const spreadsheets = response.data;
	if (!getSpreadsheetByName(spreadsheets, "Current List")) {
		await addSheet(authenticatedSession, sheetId, "Current List");
	} else {
		await clearSheet(authenticatedSession, sheetId, "Current List");
	}
	const dataToWrite: (string | number)[][] = [];
	const headers = ["Working List", "Encrypted URL", "IV", "Min", "Max", "#"];
	dataToWrite.push(headers);
	const key = "12345678901234567890123456789012";
	for (const achievement of achievementList) {
		const encryptedURL = encryptURL(achievement.link, key);
		dataToWrite.push([
			achievement.gameTitle,
			encryptedURL.encrypted,
			encryptedURL.iv,
		]);
	}
	await writeToSheet(
		authenticatedSession,
		sheetId,
		"Current List!A1",
		dataToWrite,
	);

	const listValue = getListValue(achievementList);

	await writeToSheet(authenticatedSession, sheetId, "Current List!H2", [
		["List Total Value", listValue],
	]);
}
