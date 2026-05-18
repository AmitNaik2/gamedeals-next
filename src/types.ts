export interface GameDeal {
  id: number | string;
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
  gamerpower_url?: string;
  open_giveaway?: string;
  
  // Custom fields for Cheapshark / RAWG enhancements
  salePrice?: string;
  normalPrice?: string;
  steamRatingPercent?: string;
  metacriticScore?: string;
  background_image?: string;
  rawg_rating?: number;
}
