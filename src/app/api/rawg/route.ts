import { NextResponse } from 'next/server';

const RAWG_MONTHLY_LIMIT = 20000;
let rawgUsageCount = 0; // Simple in-memory mock for Next.js serverless

async function fetchRawgData(title: string) {
  const rawgKey = process.env.RAWG_API_KEY || process.env.VITE_RAWG_API_KEY;
  if (!rawgKey) return { not_found: true, reason: "rawg_not_configured" };

  if (rawgUsageCount >= RAWG_MONTHLY_LIMIT) return { error: "Limit reached", not_found: true };

  let cleanTitle = String(title)
    .replace(/\(.*?\)/g, '')
    .replace(/\b(Giveaway|Free Weekend|Playtest|DLC|Skin|Bundle|Edition|Pack|Content)\b/gi, '')
    .trim();

  // If there's a colon or a dash, often the first part is the main game name
  if (cleanTitle.includes(':')) {
    cleanTitle = cleanTitle.split(':')[0].trim();
  } else if (cleanTitle.includes(' - ')) {
    cleanTitle = cleanTitle.split(' - ')[0].trim();
  }

  cleanTitle = cleanTitle.replace(/"/g, '').trim();

  const encodedTitle = encodeURIComponent(cleanTitle);
  const response = await fetch(`https://api.rawg.io/api/games?search=${encodedTitle}&key=${rawgKey}&page_size=1`, {
    headers: { "User-Agent": "FreeGameTracker/1.0" },
    next: { revalidate: 604800 } // Cache for 7 days on Vercel Edge network to save 20k API limit
  });
  
  rawgUsageCount++;
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Failed to fetch from RAWG: Invalid API Key");
    }
    throw new Error(`Failed to fetch from RAWG: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  let data; try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from RAWG"); }
  
  if (data.results && data.results.length > 0) {
    const baseData = data.results[0];
    
    // Process gallery
    const gallery: any[] = [];
    if (baseData.short_screenshots) {
      baseData.short_screenshots.forEach((s: any) => {
        gallery.push({ type: 'image', url: s.image, thumbnail: s.image });
      });
    }

    const gameId = baseData.id;
    const detailRes = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${rawgKey}`, {
      headers: { "User-Agent": "FreeGameTracker/1.0" },
      next: { revalidate: 604800 } // Cache for 7 days
    });
    rawgUsageCount++;
    if (detailRes.ok) {
       try {
          const detailData = await detailRes.json();
          detailData.release_date = detailData.released;
          if (detailData.clip && detailData.clip.clip) {
             gallery.unshift({ type: 'video', url: detailData.clip.clip, thumbnail: detailData.clip.preview });
          }
          detailData.gallery = gallery;
          return detailData;
       } catch(e) {}
    }
    
    baseData.release_date = baseData.released;
    baseData.gallery = gallery;
    return baseData;
  }
  
  return { not_found: true };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Missing title query parameter' }, { status: 400 });
  }

  try {
    const data = await fetchRawgData(title);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("RAWG API Error:", e);
    return NextResponse.json({ not_found: true }, { status: 500 });
  }
}
