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
import { getListValue } from "./getListValue";
import { getRandomList } from "./getRandomList";
import { getSheetsProject } from "./getSheetsProject";
import { addSheet } from "./addSheet";
import { createScavengerList } from "./createScavengerList";
import { createAchievementPoolSheets } from "./createAchievementPoolSheets";
import { encryptURL } from "./encryptUrl";
import { decryptURL } from "./decryptUrl";
// import { getSheetsProject } from "./getSheetsProject";

const buildNewList = async () => {
	// const key = "12345678901234567890123456789012";
	// const url =
	// 	"https://www.trueachievements.com/a178637/finish-him-achievement#257340";
	// const encryptedURL = encryptURL(url, key);
	// const decryptedUrl = decryptURL(encryptedURL.encrypted, key, encryptedURL.iv);
	// console.log("encryptedURL: ", encryptedURL.encrypted);
	// console.log("decryptedURL: ", decryptedUrl);
	const authenticatedSession = await authSheets();
	const sheetId = "14fbxRfYqeaOvvLebl_1iLSiCMSl8opJf9qbMA3657Yw";
	const sheetsProject = await getSheetsProject(authenticatedSession, sheetId);
	const links = await getGamePageLinks(sheetsProject);
	const achievementPool = await getAchievementPoolFromLinks(links);
	const tieredPool = splitPoolIntoTiers(achievementPool);
	const achievementList = getRandomList(tieredPool);
	const listValue = getListValue(achievementList);

	console.log("listValue: ", listValue);

	achievementList.sort((a, b) => a.taRatio - b.taRatio);
	for (const item of achievementList) {
		console.log(item);
	}

	console.log("listValue: ", listValue);

	await createScavengerList(authenticatedSession, sheetId, achievementList);

	await createAchievementPoolSheets(
		authenticatedSession,
		sheetId,
		achievementList,
		achievementPool,
	);

	// console.log("achievementPool size: ", achievementPool.length);
	// for (const achievementObj of achievementPool) {
	// 	console.log(achievementObj.taRatio);
	// }
};

buildNewList();
