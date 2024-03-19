import type { sheets_v4 } from "googleapis";
import { getAchievementPoolFromLinks } from "./getAchievementPoolFromLinks";
import { getSheetsProject } from "./getSheetsProject";
import { getGamePageLinks } from "./getGamePageLinks";
import { getRandomItemsFromArray } from "./getRandomItemsFromArray";
import { writeToSheet } from "./writeToSheet";
import { getEncryptionKey } from "./getEncryptionKey";
import { encryptURL } from "./encryptUrl";
import { updateListValue } from "./updateListValue";
import { createGameSheetFromPool } from "./createGameSheetFromPool";

export async function replaceAchievement(
  selectedNum: number,
  authenticatedSession: sheets_v4.Sheets,
  sheetId: string,
  minRatio: number,
  maxRatio: number,
  currentListValue: number,
  prevAchievementUrl: string
) {
  const sheetsProject = await getSheetsProject(authenticatedSession, sheetId);
  const links = await getGamePageLinks(sheetsProject);
  const achievementPool = await getAchievementPoolFromLinks(links);

  const minIndex = achievementPool.findIndex(
    (achievementObj) => achievementObj.taRatio >= minRatio
  );
  const maxIndex =
    achievementPool.findIndex(
      (achievmentObj) => achievmentObj.taRatio >= maxRatio
    ) - 1;

  const achievementsInRange = achievementPool.slice(minIndex, maxIndex);

  const newAchievementArray = getRandomItemsFromArray(achievementsInRange, 1);

  const newAchievement = newAchievementArray[0];

  if (!newAchievement) {
    throw new Error("newAchievement was undefined");
  }

  //Clear achievement from existing 'Current List' sheet
  await authenticatedSession.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range: `'Current List'!A${selectedNum + 1}:F${selectedNum + 1}`,
  });

  const key = getEncryptionKey();
  const encryptedURL = encryptURL(newAchievement.link, key);
  const dataToWrite: (string | number)[][] = [];
  dataToWrite.push([
    newAchievement.gameTitle,
    encryptedURL.encrypted,
    encryptedURL.iv,
  ]);

  await writeToSheet(
    authenticatedSession,
    sheetId,
    `'Current List'!A${selectedNum + 1}:F${selectedNum + 1}`,
    dataToWrite
  );

  console.log("New achievement written to sheet");

  await updateListValue(
    authenticatedSession,
    sheetId,
    currentListValue,
    prevAchievementUrl,
    newAchievement.pointValue
  );

  console.log("List total value cell updated");

  console.log("Creating game sheet for new achievement");

  await createGameSheetFromPool(
    authenticatedSession,
    sheetId,
    newAchievement.gameTitle,
    achievementPool
  );

  console.log("New game sheet created");
}
