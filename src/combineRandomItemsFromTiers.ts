import { getRandomItemsFromArray } from "./getRandomItemsFromArray";
import type { AchievementData } from "./types";

export function combineRandomItemsFromTiers(
	tier1: AchievementData[],
	tier2: AchievementData[],
	tier3: AchievementData[],
	tier4: AchievementData[],
): AchievementData[] {
	const randomFromTier1 = getRandomItemsFromArray(tier1, 10);
	const randomFromTier2 = getRandomItemsFromArray(tier2, 10);
	const randomFromTier3 = getRandomItemsFromArray(tier3, 4);
	const randomFromTier4 = getRandomItemsFromArray(tier4, 1);

	return [
		...randomFromTier1,
		...randomFromTier2,
		...randomFromTier3,
		...randomFromTier4,
	];
}
