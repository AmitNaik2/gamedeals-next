// C:/Users/Amit/antigravity/gamesdealshub-next/src/types/deal.ts
export type Platform = 'Epic Games' | 'Steam' | 'GOG' | 'Prime Gaming' | 'Ubisoft Connect' | 'Other';

export interface Deal {
  id: number;
  title: string;
  worth: string;
  thumbnail: string;
  image: string;
  description: string;
  instructions: string;
  open_giveaway_url: string;
  published_date: string;
  type: string;
  platforms: string;
  end_date: string;
  users: number;
  status: string;
  gamerpower_url: string;
  open_giveaway: string;
}

export type SortOption = 'Expiring soon' | 'Newest' | 'Best rated' | 'Alphabetical';
