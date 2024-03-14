import type { sheets_v4 } from "googleapis";
import { authSheets } from "./authSheets";
import { fetchLinksFromSheet } from "./fetchLinksFromSheet";
import { fetchSite } from "./fetchSite";
import { JSDOM } from "jsdom";
import { extractTARatio } from "./extractTaRatio";

const buildNewList = async () => {
	// 	const sheetId = "14fbxRfYqeaOvvLebl_1iLSiCMSl8opJf9qbMA3657Yw";
	// 	const sheetsObj: sheets_v4.Sheets = await authSheets();
	// 	const links = await fetchLinksFromSheet(sheetsObj, sheetId);
	// 	console.log("links: ", links);
	const response = await fetchSite(
		"https://www.trueachievements.com/game/Flashback/achievements?gamerid=257340",
	);

	// console.log("response: ", response);
	const dom = new JSDOM(response);
	const document = dom.window.document;
	const selectedElements = document.querySelectorAll(".ach-panels .nw");

	if (selectedElements) {
		for (const selectedElement of selectedElements) {
			const titleElement = selectedElement.querySelector("a");
			if (!titleElement) {
				continue;
			}
			console.log(titleElement.innerHTML);
			const achievementTitle = titleElement.innerHTML;
			const achievementLink = `https://www.trueachievements.com${titleElement.href}`;
			const progressBarElement = selectedElement.querySelector(".progress-bar");
			if (!progressBarElement) {
				continue;
			}
			const statsString = progressBarElement.getAttribute("data-af");
			if (!statsString) {
				continue;
			}
			const taRatio = extractTARatio(statsString);
			console.log("TA Ratio: ", taRatio);
		}
	} else {
		console.log("No element found with the specified selector.");
	}
};

buildNewList();
