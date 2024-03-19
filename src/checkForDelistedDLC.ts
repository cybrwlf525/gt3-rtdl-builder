import { run_v1 } from "googleapis";
import { authSheets } from "./authSheets";
import { getSheetsProject } from "./getSheetsProject";
import { createInterface, type Interface } from "node:readline";
import { fetchSite } from "./fetchSite";
import { JSDOM } from "jsdom";
import { decryptURL } from "./decryptUrl";
import { getEncryptionKey } from "./getEncryptionKey";
import { replaceAchievement } from "./replaceAchievement";
import { getUrlFromSheetsRow } from "./getUrlFromSheetsRow";
import { getTaRatioFromUrl } from "./getTaRatioFromUrl";

// type validationFn = (input: string) => boolean

// function askQuestion(readlineInterface: Interface, question: string, validator: validationFn){
//     readlineInterface.question(question, (input) => {
//         if(validator(input)){

//         }
//     })
// }

// Wrap the readline.question in a function that returns a Promise
function questionAsync(
	questionText: string,
	readlineInterface: Interface,
): Promise<string> {
	return new Promise((resolve) => {
		readlineInterface.question(questionText, (answer) => {
			resolve(answer);
		});
	});
}

async function getValidInput(readlineInterface: Interface): Promise<number> {
	let selectedNum = 0;
	while (selectedNum === 0) {
		const answer = await questionAsync(
			"Which achievement would you like to check? ",
			readlineInterface,
		);
		const answerNum = Number(answer);
		if (Number.isNaN(answerNum) || answerNum < 1 || answerNum > 25) {
			console.log("Please provide a number input between 1 and 25, inclusive.");
		} else {
			selectedNum = Math.floor(answerNum);
		}
	}
	// readlineInterface.close();
	return selectedNum;
}

async function getValidYesNo(readlineInterface: Interface): Promise<boolean> {
	let decisionToProceed: boolean | undefined = undefined;
	while (typeof decisionToProceed === "undefined") {
		const answer = await questionAsync(
			"Would you like to replace the achievement from the list? (Y/N)\n",
			readlineInterface,
		);
		if (answer.toUpperCase() === "Y") {
			decisionToProceed = true;
		} else if (answer.toUpperCase() === "N") {
			decisionToProceed = false;
		} else {
			console.log("Please input 'Y' or 'N' to proceed");
		}
	}
	readlineInterface.close();
	return decisionToProceed;
}

async function getValidUrl(readlineInterface: Interface) {
	let url: string | undefined = undefined;
	while (typeof url === "undefined") {
		const answer = await questionAsync(
			"Please provide the URL for the delisted DLC game page on TA\n",
			readlineInterface,
		);
		if (answer.trim() === "") {
			console.log("Input was empty. Please try again.");
		} else if (!answer.includes("trueachievements.com")) {
			console.log(
				"Url provided does not include trueachivements.com. Please try again.",
			);
		} else if (!answer.includes("?gamerid=")) {
			console.log(
				"No gamerid query param provided. Please provide that query parameter",
			);
		} else {
			url = answer;
		}
	}
	// readlineInterface.close();
	return url;
}

async function checkForDelistedDLC() {
	const authenticatedSession = await authSheets();
	const sheetId = "14fbxRfYqeaOvvLebl_1iLSiCMSl8opJf9qbMA3657Yw";
	const sheetsProject = await getSheetsProject(authenticatedSession, sheetId);

	const currentListSheet = sheetsProject.sheets?.find(
		(sheet) => sheet.properties?.title === "Current List",
	);

	if (!currentListSheet) {
		throw new Error("No sheet found titled 'Current List'");
	}

	const data = currentListSheet.data;

	if (!data || !data[0]) {
		throw new Error("No data found on 'Current List'");
	}

	const rangeData = data[0];

	const rowData = rangeData.rowData;

	if (!rowData) {
		throw new Error("No rowData found on rangeData");
	}

	const currentListValue = rowData[1].values?.[9].userEnteredValue?.numberValue;

	if (!currentListValue) {
		throw new Error("Error retrieving current list total value from sheet");
	}

	for (const [index, row] of rowData.entries()) {
		if (index > 0 && index < 26) {
			console.log(`${index}. ${row.values?.[0].userEnteredValue?.stringValue}`);
		}
	}

	const r1 = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const selectedNum = await getValidInput(r1);

	console.log("selectedNum: ", selectedNum);

	const selectedRow = rowData[selectedNum].values;

	if (!selectedRow) {
		throw new Error("selectedRow returned undefined");
	}
	const encryptedUrl = selectedRow[1].userEnteredValue?.stringValue;

	const ivValue = selectedRow[2].userEnteredValue?.stringValue;
	if (!encryptedUrl || !ivValue) {
		throw new Error(
			"encryptedUrl or ivValue was not defined for the selected game",
		);
	}
	const key = getEncryptionKey();
	const decryptedURL = decryptURL(encryptedUrl, key, ivValue);
	// console.log("decryptedUrl: ", decryptedURL);

	const url = await getValidUrl(r1);

	const response = await fetchSite(url);

	// console.log("response: ", response);
	const dom = new JSDOM(response);
	const document = dom.window.document;

	const achievementElements = document.querySelectorAll(".ach-panels");

	if (!achievementElements) {
		throw new Error("No achievement html elements found on url given");
	}

	const achievementElementsArray = Array.from(achievementElements);

	const links = achievementElementsArray.map((htmlElement) => {
		const anchorElement = htmlElement.querySelector("a");
		if (!anchorElement) {
			return undefined;
		}
		const href = anchorElement.href;
		return `https://www.trueachievements.com${href}`;
	});

	if (links.includes(decryptedURL)) {
		console.log("The achievement is part of delisted DLC");
		const shouldProceed = await getValidYesNo(r1);
		if (!shouldProceed) {
			return;
		}
		let minRatio = 0;
		let maxRatio = 10;

		if (selectedNum > 1) {
			const achievementBefore = rowData[selectedNum - 1].values;
			if (!achievementBefore) {
				throw new Error("achievementBefore is undefined");
			}
			const achievementBeforeUrl = getUrlFromSheetsRow(achievementBefore);
			minRatio = await getTaRatioFromUrl(achievementBeforeUrl);
		}

		if (selectedNum < 25) {
			const achievementAfter = rowData[selectedNum + 1].values;
			if (!achievementAfter) {
				throw new Error("achievementAfter is undefined");
			}
			const achievementAfterUrl = getUrlFromSheetsRow(achievementAfter);
			maxRatio = await getTaRatioFromUrl(achievementAfterUrl);
		}

		await replaceAchievement(
			selectedNum,
			authenticatedSession,
			sheetId,
			minRatio,
			maxRatio,
			currentListValue,
			decryptedURL,
		);
	} else {
		console.log("The achievement is NOT part of delisted DLC");
	}

	console.log("Script has finished running");
}

checkForDelistedDLC();
