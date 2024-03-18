import type { sheets_v4 } from "googleapis";
import type { AchievementData } from "./types";
import { createGameSheetFromPool } from "./createGameSheetFromPool";

export async function createAchievementPoolSheets(
	authenticatedSession: sheets_v4.Sheets,
	sheetId: string,
	achievementList: AchievementData[],
	achievementPool: AchievementData[],
): Promise<void> {
	const gameTitlesSet = new Set<string>();
	for (const achievement of achievementList) {
		if (!gameTitlesSet.has(achievement.gameTitle)) {
			gameTitlesSet.add(achievement.gameTitle);
		}
	}
	const gameTitlesArray = Array.from(gameTitlesSet);
	for (const gameTitle of gameTitlesArray) {
		await createGameSheetFromPool(
			authenticatedSession,
			sheetId,
			gameTitle,
			achievementPool,
		);
	}
}
