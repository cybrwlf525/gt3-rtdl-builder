import { fetchSite } from "./fetchSite";
import type { MysteryItemData } from "./types";
import { JSDOM } from "jsdom";

export async function checkIfAchievementUnlocked(
  mysteryItem: MysteryItemData
): Promise<boolean> {
  const link = mysteryItem.gameUrl;

  //get relevant TA game page
  const response = await fetchSite(link);
  const dom = new JSDOM(response);
  const document = dom.window.document;

  //get all achievement panel elements
  const selectedElements = document.querySelectorAll(".ach-panels > li");
  if (!selectedElements) {
    throw new Error(
      `Error finding achievement panels for game ${mysteryItem.gameTitle}`
    );
  }

  console.log("selectedElements.length: ", selectedElements.length);

  //iterate through all achievement panels. If achievement url matches, test to see if the achievement is won or not
  for (const selectedElement of selectedElements) {
    const titleElement = selectedElement.querySelector("a");
    if (!titleElement) {
      continue;
    }
    const achievementLink = `https://www.trueachievements.com${titleElement.href}`;
    // console.log("achievementLink: ", achievementLink);
    if (achievementLink === mysteryItem.achievementUrl) {
      console.log(
        "selectedElement.classList: ",
        Array.from(selectedElement.classList)
      );
      //   console.log("foo");
      //test to see if achievement is won or not
      if (selectedElement.classList.contains("nw")) {
        return false;
      }
      return true;
    }
  }

  throw new Error(
    `Unable to find a matching achievement url for game ${mysteryItem.gameTitle}`
  );
}
