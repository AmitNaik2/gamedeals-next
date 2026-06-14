// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getActiveGames } from '../lib/gamerpower';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gamesdealshub.me';
  const now = new Date();
  
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
  } catch (err) {
    console.error("Failed to fetch games for sitemap", err);
  }

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: now, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${siteUrl}/free-games`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/free-steam-games`, lastModified: now, changeFrequency: 'hourly', priority: 0.85 },
    { url: `${siteUrl}/free-epic-games`, lastModified: now, changeFrequency: 'hourly', priority: 0.85 },
    { url: `${siteUrl}/free-gog-games`, lastModified: now, changeFrequency: 'hourly', priority: 0.85 },
    { url: `${siteUrl}/archive`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteUrl}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/optimization`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/write-for-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/dmca`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${siteUrl}/cookie-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
  ];

  return [...staticUrls, ...activeGamesUrls];
}
