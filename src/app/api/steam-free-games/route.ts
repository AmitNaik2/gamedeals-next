import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GameDeal } from '../../../types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = 'https://store.steampowered.com/search/results?maxprice=free&specials=1';
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch Steam search results: ${res.status}`);
    }
    
    const html = await res.text();
    const $ = cheerio.load(html);
    const results: GameDeal[] = [];
    
    $('#search_resultsRows a').each((i, el) => {
      const title = $(el).find('.title').text().trim();
      const dealUrl = $(el).attr('href') || '';
      const originalPrice = $(el).find('.discount_original_price').text().trim() || 'N/A';
      
      // Extract AppID from URL
      let appId = '';
      const appIdMatch = dealUrl.match(/\/app\/(\d+)/);
      if (appIdMatch && appIdMatch[1]) {
        appId = appIdMatch[1];
      }

      // We can use a higher resolution thumbnail if we have the appID
      let thumb = $(el).find('img').attr('src') || '';
      if (appId) {
        thumb = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
      }

      if (title && dealUrl) {
        results.push({
          id: `steam_free_${appId || i}`,
          title: title,
          worth: originalPrice,
          thumbnail: thumb,
          image: thumb,
          description: `Get ${title} for free! 100% off promotion directly on Steam.`,
          instructions: `Click to claim directly on the Steam store.`,
          open_giveaway_url: dealUrl,
          published_date: "N/A",
          type: "Free Game",
          platforms: "Steam",
          end_date: "N/A",
          users: 0,
          status: "Active",
          gamerpower_url: "",
          open_giveaway: dealUrl,
          salePrice: "0.00",
          normalPrice: originalPrice.replace(/[^\d.-]/g, ''),
          steamAppID: appId,
        });
      }
    });
    
    return NextResponse.json(results);
  } catch (err) {
    console.error("Steam Free Games Scrape Error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
