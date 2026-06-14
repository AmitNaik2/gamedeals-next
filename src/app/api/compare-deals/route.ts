import { GameDeal } from '../../../types';
import { cachedJson } from '../../../lib/api-cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';
  
  try {
    // storeID 1 = Steam, storeID 25 = Epic Games
    // CheapShark automatically groups by gameID and returns the single best (cheapest) deal 
    // across the requested stores.
    const url = title 
      ? `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&exact=0&storeID=1,25&sortBy=Deal%20Rating` 
      : `https://www.cheapshark.com/api/1.0/deals?storeID=1,25&sortBy=Deal%20Rating`;
      
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch deals: ${res.status}`);
    }
    
    const csData = await res.json();
    
    if (!Array.isArray(csData)) {
        return cachedJson([]);
    }

    const STORE_NAMES: Record<string, string> = {
      "1": "Steam",
      "25": "Epic Games",
    };
    
    const deals: GameDeal[] = csData.map((cs: any) => {
      // Determine platforms based on which store won the price comparison
      const winningStore = STORE_NAMES[cs.storeID] || "PC";
      
      return {
        id: `cs_compare_${cs.dealID}`,
        title: cs.title,
        worth: cs.normalPrice === "N/A" ? "N/A" : `$${cs.normalPrice}`,
        thumbnail: cs.steamAppID ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${cs.steamAppID}/header.jpg` : cs.thumb,
        image: cs.steamAppID ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${cs.steamAppID}/header.jpg` : cs.thumb,
        description: `Winner: ${winningStore}. Get it now for $${cs.salePrice} (was $${cs.normalPrice}).`,
        instructions: `Cheapest price found on ${winningStore}.`,
        open_giveaway_url: cs.rawg_url ? cs.rawg_url : `https://www.cheapshark.com/redirect?dealID=${cs.dealID}`,
        published_date: "N/A",
        type: cs.salePrice === "0.00" ? "Free Game" : "Discount",
        platforms: winningStore,
        end_date: "N/A",
        users: parseInt(cs.steamRatingCount) || 0,
        status: "Active",
        gamerpower_url: "",
        open_giveaway: `https://www.cheapshark.com/redirect?dealID=${cs.dealID}`,
        salePrice: cs.salePrice === "N/A" ? undefined : cs.salePrice,
        normalPrice: cs.normalPrice === "N/A" ? undefined : cs.normalPrice,
        steamRatingPercent: cs.steamRatingPercent ? cs.steamRatingPercent.toString() : undefined,
        steamAppID: cs.steamAppID,
      };
    });
    
    return cachedJson(deals);
  } catch (err) {
    console.error("Compare Deals API Error:", err);
    return cachedJson({ error: String(err) }, { status: 500 });
  }
}
