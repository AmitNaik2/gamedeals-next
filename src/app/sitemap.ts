// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getActiveGames } from '../lib/gamerpower';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gamesdealshub.me';
  const now = new Date();
  const getLastModified = (date?: string) => {
    if (!date || date === 'N/A') return now;
    const parsed = new Date(date.includes(' ') ? `${date.replace(' ', 'T')}Z` : date);
    return Number.isNaN(parsed.getTime()) ? now : parsed;
  };
  
  // Fetch dynamic game deals for sitemap
  let activeGamesUrls: MetadataRoute.Sitemap = [];
  try {
    const activeGames = await getActiveGames();
    activeGamesUrls = activeGames.map((game) => ({
      url: `${siteUrl}/game/${encodeURIComponent(String(game.id))}`,
      lastModified: getLastModified(game.published_date),
      changeFrequency: 'daily',
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Failed to fetch games for sitemap", err);
  }

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/free-games`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/optimization`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/dmca`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/cookie-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  return [...staticUrls, ...activeGamesUrls];
}
