import { extractTARatio } from "./extractTaRatio";
import { fetchSite } from "./fetchSite";
import { JSDOM } from "jsdom";

export async function getTaRatioFromUrl(url: string): Promise<number> {
	const response = await fetchSite(url);
	const dom = new JSDOM(response);
	const document = dom.window.document;

	const achievementPanel = document.querySelector(".ach-panel");

	if (!achievementPanel) {
		throw new Error("No achievementPanel found for given url");
	}
	const progressBarElement = achievementPanel.querySelector(".progress-bar");
	if (!progressBarElement) {
		throw new Error("progress-bar element not found");
	}
	const statsString = progressBarElement.getAttribute("data-af");
	if (!statsString) {
		throw new Error("'data-af' attribute not found on progress bar element");
	}
	const taRatio = extractTARatio(statsString);
	if (!taRatio) {
		throw new Error(
			"Error encountered when extracting ta ratio from stats string",
		);
	}
	const taRatioNum = Number(taRatio);

	if (Number.isNaN(taRatioNum)) {
		throw new Error(
			"TA ratio value extracted from stats string is not a number",
		);
	}

	return taRatioNum;
}
