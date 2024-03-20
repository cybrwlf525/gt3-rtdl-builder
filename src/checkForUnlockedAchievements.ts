import { authSheets } from "./authSheets";
import { checkIfAchievementUnlocked } from "./checkIfAchievementUnlocked";
import { decryptURL } from "./decryptUrl";
import { getEncryptionKey } from "./getEncryptionKey";
import { getGamePoolData } from "./getGamePoolData";
import type { MysteryItemData } from "./types";

async function checkForUnlockedAchievements() {
  const authenticatedSession = await authSheets();
  const sheetId = "14fbxRfYqeaOvvLebl_1iLSiCMSl8opJf9qbMA3657Yw";

  const gamePoolDataArray = await getGamePoolData(
    authenticatedSession,
    sheetId
  );

  const currentListResponse =
    await authenticatedSession.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "'Current List'!A2:C26",
    });

  const currentListRangeData = currentListResponse.data.values;
  if (!currentListRangeData) {
    throw new Error("currentListRangeData is undefined");
  }

  const mysteryItemsArray: MysteryItemData[] = [];

  const key = getEncryptionKey();

  for (const rowData of currentListRangeData) {
    const gameTitle = rowData[0];
    const encryptedURL = rowData[1];
    const ivValue = rowData[2];
    const gameUrl = gamePoolDataArray
      .find((gameDataObj) => gameDataObj.gameTitle === gameTitle)
      ?.gameUrl.trim();
    if (!gameUrl) {
      throw new Error(
        "Could not find matching game title for game on in 'Games for Contest' sheet"
      );
    }
    // console.log("gameUrl: ", gameUrl);
    const achievementUrl = decryptURL(encryptedURL, key, ivValue);
    mysteryItemsArray.push({ achievementUrl, gameTitle, gameUrl });
  }

  for (const mysteryItem of mysteryItemsArray) {
    const isUnlocked = await checkIfAchievementUnlocked(mysteryItem);
    if (isUnlocked) {
      console.log("");
      console.log("**************");
      console.log(`Achievement for ${mysteryItem.gameTitle} has been unlocked`);
      console.log(`Achievement url is ${mysteryItem.achievementUrl}`);
      console.log("**************");
      console.log("");
    } else {
      console.log(`Achievement for ${mysteryItem.gameTitle} is still locked`);
    }
  }
}

checkForUnlockedAchievements();
