import type { AchievementData } from "./types";

export function getListValue(achievementList: AchievementData[]): number {
	const listValue = achievementList.reduce((prevValue, curr) => {
		return prevValue + curr.pointValue;
	}, 0);
	return listValue;
}
