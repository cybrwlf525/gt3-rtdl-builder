import type { sheets_v4 } from "googleapis";
import type { AchievementData } from "./types";
import { addSheet } from "./addSheet";
import { writeToSheet } from "./writeToSheet";
import { getSpreadsheetByName } from "./getSpreadsheetByName";
import { clearSheet } from "./clearSheet";

export async function createGameSheetFromPool(
	authenticatedSession: sheets_v4.Sheets,
	sheetId: string,
	gameTitle: string,
	achievementPool: AchievementData[],
) {
	const relevantAchievements = achievementPool.filter(
		(achievementObj) => achievementObj.gameTitle === gameTitle,
	);

	const sheetTitle = gameTitle;

	const response = await authenticatedSession.spreadsheets.get({
		spreadsheetId: sheetId,
	});
	const spreadsheets = response.data;
	if (!getSpreadsheetByName(spreadsheets, sheetTitle)) {
		await addSheet(authenticatedSession, sheetId, sheetTitle);
	} else {
		await clearSheet(authenticatedSession, sheetId, sheetTitle);
	}

	// await addSheet(authenticatedSession, sheetId, sheetTitle);

	const dataToWrite: (string | number)[][] = [];

	const headers = ["Achivement Name", "TA Ratio", "Description"];

	dataToWrite.push(headers);

	for (const achievement of relevantAchievements) {
		dataToWrite.push([
			achievement.name,
			achievement.taRatio,
			achievement.description,
		]);
	}

	await writeToSheet(
		authenticatedSession,
		sheetId,
		`'${sheetTitle}'!A1:C`,
		dataToWrite,
	);
}
