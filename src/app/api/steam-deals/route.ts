import * as cheerio from 'cheerio';
import { GameDeal } from '../../../types';
import { cachedJson } from '../../../lib/api-cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';
  
  try {
    // If there is a title, search for that specific term with specials=1
    // Otherwise, fetch top selling specials
    let url = 'https://store.steampowered.com/search/results?specials=1&filter=topsellers';
    if (title) {
        url = `https://store.steampowered.com/search/results?term=${encodeURIComponent(title)}&specials=1`;
    }
    
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch Steam search results: ${res.status}`);
    }
    
    const html = await res.text();
    const $ = cheerio.load(html);
    const results: GameDeal[] = [];
    
    $('#search_resultsRows a').each((i, el) => {
      const gameTitle = $(el).find('.title').text().trim();
      const dealUrl = $(el).attr('href') || '';
      const originalPriceText = $(el).find('.discount_original_price').text().trim();
      const salePriceText = $(el).find('.discount_final_price').text().trim();
      
      // Calculate percentage discount
      const pctText = $(el).find('.discount_pct').text().trim(); // e.g. "-50%"
      let steamRatingPercent = 0;
      if (pctText && pctText.startsWith('-')) {
         steamRatingPercent = parseInt(pctText.replace('-', '').replace('%', ''));
      }
      
      // Extract AppID from URL
      let appId = '';
      const appIdMatch = dealUrl.match(/\/app\/(\d+)/);
      if (appIdMatch && appIdMatch[1]) {
        appId = appIdMatch[1];
      }

      let thumb = $(el).find('img').attr('src') || '';
      if (appId) {
        thumb = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
      }

      const originalPrice = originalPriceText.replace(/[^\d.-]/g, '') || "N/A";
      const salePrice = salePriceText.replace(/[^\d.-]/g, '') || "N/A";
      
      if (gameTitle && dealUrl) {
        results.push({
          id: `steam_deal_${appId || i}`,
          title: gameTitle,
          worth: originalPrice === "N/A" ? "N/A" : `$${originalPrice}`,
          thumbnail: thumb,
          image: thumb,
          description: `Get it now for $${salePrice} (was $${originalPrice}).`,
          instructions: `Available directly on Steam.`,
          open_giveaway_url: dealUrl,
          published_date: "N/A",
          type: "Discount",
          platforms: "Steam",
          end_date: "N/A",
          users: 0,
          status: "Active",
          gamerpower_url: "",
          open_giveaway: dealUrl,
          salePrice: salePrice === "N/A" ? undefined : salePrice,
          normalPrice: originalPrice === "N/A" ? undefined : originalPrice,
          steamRatingPercent: steamRatingPercent ? steamRatingPercent.toString() : undefined,
          steamAppID: appId,
        });
      }
    });
    
    return cachedJson(results);
  } catch (err) {
    console.error("Steam Deals Scrape Error:", err);
    return cachedJson([], { status: 500 });
  }
}
