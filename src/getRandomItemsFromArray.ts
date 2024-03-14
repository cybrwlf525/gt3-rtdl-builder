import type { AchievementData } from "./types";

export function getRandomItemsFromArray(
	array: AchievementData[],
	numberOfItems: number,
): AchievementData[] {
	const items: AchievementData[] = [];
	const arrayCopy = [...array]; // Create a copy to avoid mutating the original array

	for (let i = 0; i < Math.min(numberOfItems, array.length); i++) {
		const randomIndex = Math.floor(Math.random() * arrayCopy.length);
		items.push(arrayCopy[randomIndex]);
		arrayCopy.splice(randomIndex, 1); // Remove the selected item to avoid repeats
	}

	return items;
}
