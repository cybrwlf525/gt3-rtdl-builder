import { extractTARatio } from "./extractTaRatio";
import { fetchSite } from "./fetchSite";
import { JSDOM } from "jsdom";
import type { AchievementData } from "./types";
import { flg_d } from "./flagDefinitionsObject";
import { getFlagTitles } from "./getFlagTitles";

export async function getAchievementPoolFromLinks(
	links: string[],
): Promise<AchievementData[]> {
	const achievementPool: AchievementData[] = [];
	for (const link of links) {
		const response = await fetchSite(link);

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
				// console.log(titleElement.innerHTML);
				const achievementTitle = titleElement.innerHTML;
				const achievementLink = `https://www.trueachievements.com${titleElement.href}`;
				const paragraphElement = selectedElement.querySelector("p");
				if (!paragraphElement) {
					continue;
				}
				const achievementDescription = paragraphElement.innerText;
				const progressBarElement =
					selectedElement.querySelector(".progress-bar");
				if (!progressBarElement) {
					continue;
				}
				const statsString = progressBarElement.getAttribute("data-af");
				if (!statsString) {
					continue;
				}
				const taRatio = extractTARatio(statsString);
				if (!taRatio) {
					continue;
				}
				let flagTitles: string[] = [];
				const iconElement = selectedElement.querySelector(".info > i");
				if (iconElement) {
					const flagClassName = iconElement.getAttribute("class");
					if (flagClassName) {
						flagTitles = getFlagTitles(flagClassName, flg_d);
						const flagsToOmit = [
							"Unobtainable",
							"Partly Discontinued/Unobtainable",
							"Discontinued",
						];
						if (
							flagsToOmit.some((skippableFlagName) =>
								flagTitles.includes(skippableFlagName),
							)
						) {
							continue;
						}
					}
				}
				// console.log("TA Ratio: ", taRatio);
				const achievementData: AchievementData = {
					description: achievementDescription,
					link: achievementLink,
					name: achievementTitle,
					taRatio: Number(taRatio),
					flagTitles,
				};
				achievementPool.push(achievementData);
			}
		} else {
			console.log(
				`No element found with the specified selector for link ${link}.`,
			);
		}
	}
	return achievementPool.sort((a, b) => a.taRatio - b.taRatio);
}
