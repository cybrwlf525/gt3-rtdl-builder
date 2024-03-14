import type { sheets_v4 } from "googleapis";
import { authSheets } from "./authSheets";
import { fetchLinksFromSheet } from "./fetchLinksFromSheet";
import { fetchSite } from "./fetchSite";
import { JSDOM } from "jsdom";
import { extractTARatio } from "./extractTaRatio";
import { getAchievementPoolFromLinks } from "./getAchievementPoolFromLinks";
import { getGamePageLinks } from "./getGamePageLinks";
import { splitPoolIntoTiers } from "./splitArrayIntoTiers";
import { combineRandomItemsFromTiers } from "./combineRandomItemsFromTiers";

const buildNewList = async () => {
	const links = await getGamePageLinks();
	const achievementPool = await getAchievementPoolFromLinks(links);
	const { tier1, tier2, tier3, tier4 } = splitPoolIntoTiers(achievementPool);
	const combinedRandomItems = combineRandomItemsFromTiers(
		tier1,
		tier2,
		tier3,
		tier4,
	);
	combinedRandomItems.sort((a, b) => a.taRatio - b.taRatio);
	for (const item of combinedRandomItems) {
		console.log(item);
	}

	// console.log("achievementPool size: ", achievementPool.length);
	// for (const achievementObj of achievementPool) {
	// 	console.log(achievementObj.taRatio);
	// }
};

buildNewList();
