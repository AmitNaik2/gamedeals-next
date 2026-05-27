import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const epicUrl = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US";
    const response = await fetch(epicUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error("Failed to fetch epic games");
    }
    const data = await response.json();
    const elements = data?.data?.Catalog?.searchStore?.elements || [];
    
    const upcoming = elements.filter((el: any) => 
      el.promotions && 
      el.promotions.upcomingPromotionalOffers && 
      el.promotions.upcomingPromotionalOffers.length > 0
    );

    const formatted = upcoming.map((item: any) => {
      const promo = item.promotions.upcomingPromotionalOffers[0].promotionalOffers[0];
      const imageObj = item.keyImages.find((img: any) => img.type === "OfferImageWide") || 
                       item.keyImages.find((img: any) => img.type === "Thumbnail") || 
                       item.keyImages[0];
      const imageUrl = imageObj ? imageObj.url : "";

      return {
        id: item.id || String(Math.random()),
        title: item.title,
        description: item.description,
        thumbnail: imageUrl,
        image: imageUrl,
        platforms: "Epic Games Stores",
        type: "Upcoming Free Game",
        worth: "N/A",
        status: "upcoming",
        start_date: promo.startDate,
        end_date: promo.endDate,
        open_giveaway_url: `https://store.epicgames.com/p/${item.productSlug || item.urlSlug || item.title.toLowerCase().replace(/\s+/g, '-')}`,
        users: 0,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching upcoming free games:", error);
    return NextResponse.json([]);
  }
}
