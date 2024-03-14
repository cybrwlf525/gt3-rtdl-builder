import type { AchievementData } from "./types";

export function splitPoolIntoTiers(pool: AchievementData[]): {
	tier1: AchievementData[];
	tier2: AchievementData[];
	tier3: AchievementData[];
	tier4: AchievementData[];
} {
	// Calculate tier cutoff indices
	const tier1End = Math.floor(pool.length * 0.4);
	const tier2End = Math.floor(pool.length * 0.7);
	const tier3End = Math.floor(pool.length * 0.8);

	// Create the tiers by slicing the array
	const tier1 = pool.slice(0, tier1End);
	const tier2 = pool.slice(tier1End, tier2End);
	const tier3 = pool.slice(tier2End, tier3End);
	const tier4 = pool.slice(tier3End);

	return { tier1, tier2, tier3, tier4 };
}
