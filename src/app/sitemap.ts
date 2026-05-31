// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getActiveGames } from '../lib/gamerpower';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gamesdealshub.me';
  
  // Fetch dynamic game deals for sitemap
  let activeGamesUrls: MetadataRoute.Sitemap = [];
  try {
    const activeGames = await getActiveGames();
    activeGamesUrls = activeGames.map((game) => ({
      url: `${siteUrl}/game/${encodeURIComponent(game.id)}`,
      lastModified: game.published_date && game.published_date !== 'N/A' 
        ? new Date(game.published_date.replace(' ', 'T') + 'Z') 
        : new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    // Attempt to grab Epic Upcoming games directly from their API
    try {
      const epicUrl = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US";
      const epicRes = await fetch(epicUrl, { cache: 'no-store' });
      if (epicRes.ok) {
        const data = await epicRes.json();
        const elements = data?.data?.Catalog?.searchStore?.elements || [];
        const upcoming = elements.filter((el: any) => el.promotions && el.promotions.upcomingPromotionalOffers && el.promotions.upcomingPromotionalOffers.length > 0);
        upcoming.forEach((item: any) => {
          if (item.id) {
             activeGamesUrls.push({
               url: `${siteUrl}/game/${encodeURIComponent(item.id)}`,
               lastModified: new Date(),
               changeFrequency: 'daily',
               priority: 0.8,
             });
          }
        });
      }
    } catch (e) {}

    // Add Premium Deals from CheapShark (top 20)
    try {
      const csRes = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1,25&sortBy=Deal%20Rating', { cache: 'no-store' });
      if (csRes.ok) {
        const csData = await csRes.json();
        if (Array.isArray(csData)) {
           csData.slice(0, 20).forEach((cs: any) => {
              activeGamesUrls.push({
                 url: `${siteUrl}/game/cs_${cs.dealID}`,
                 lastModified: new Date(cs.lastChange ? cs.lastChange * 1000 : Date.now()),
                 changeFrequency: 'daily',
                 priority: 0.7,
              });
           });
        }
      }
    } catch (e) {}

  } catch (err) {
    console.error("Failed to fetch games for sitemap", err);
  }

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${siteUrl}/free-games`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/free-steam-games`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/free-epic-games`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/free-gog-games`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${siteUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/optimization`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/write-for-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/dmca`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  return [...staticUrls, ...activeGamesUrls];
}
