export type AchievementData = {
  name: string;
  link: string;
  gameTitle: string;
  description: string;
  taRatio: number;
  pointValue: number;
  flagTitles: string[];
  // won: boolean;
  // baseOrDlcInfo: {
  // 	isDLC: boolean;
  // 	title: string;
  // };
};

export type MysteryItemData = {
  gameTitle: string;
  gameUrl: string;
  achievementUrl: string;
};
