import { licensing } from "googleapis/build/src/apis/licensing";
import { combineRandomItemsFromTiers } from "./combineRandomItemsFromTiers";
import { getListValue } from "./getListValue";
import type { AchievementData } from "./types";

export function getRandomList({
	tier1,
	tier2,
	tier3,
	tier4,
}: {
	tier1: AchievementData[];
	tier2: AchievementData[];
	tier3: AchievementData[];
	tier4: AchievementData[];
}): AchievementData[] {
	const achievementList = combineRandomItemsFromTiers(
		tier1,
		tier2,
		tier3,
		tier4,
	);
	const listValue = getListValue(achievementList);
	if (listValue > 7200) {
		console.log("listValue was greater than 7200, fetching new list");
		return getRandomList({ tier1, tier2, tier3, tier4 });
	}
	return achievementList;
}
