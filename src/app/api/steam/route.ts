import { NextResponse } from 'next/server';

async function fetchSteamData(title: string) {
  // 1. Clean the title exactly like we do for RAWG and IGDB
  let cleanTitle = String(title)
    .replace(/\(.*?\)/g, '')
    .replace(/\b(Giveaway|Free Weekend|Playtest|DLC|Skin|Bundle|Edition|Pack|Content)\b/gi, '')
    .trim();

  if (cleanTitle.includes(':')) {
    cleanTitle = cleanTitle.split(':')[0].trim();
  } else if (cleanTitle.includes(' - ')) {
    cleanTitle = cleanTitle.split(' - ')[0].trim();
  }
  cleanTitle = cleanTitle.replace(/"/g, '').trim();

  // 2. Search Steam for the game to get the AppID
  const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(cleanTitle)}&l=english&cc=US`;
  const searchRes = await fetch(searchUrl, { next: { revalidate: 604800 } });
  
  if (!searchRes.ok) throw new Error("Steam search failed");
  const searchData = await searchRes.json();

  if (!searchData.items || searchData.items.length === 0) {
    return { not_found: true, reason: "steam_search_no_results" };
  }

  const appId = searchData.items[0].id;

  // 3. Fetch full app details using the AppID
  const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
  const detailsRes = await fetch(detailsUrl, { next: { revalidate: 604800 } });
  
  if (!detailsRes.ok) throw new Error("Steam details failed");
  const detailsData = await detailsRes.json();

  const gameDetails = detailsData[appId]?.data;
  if (!gameDetails) return { not_found: true, reason: "steam_details_missing" };

  // 4. Format to match IGDB/RAWG expected structure
  const gallery: any[] = [];
  if (gameDetails.movies && gameDetails.movies.length > 0) {
    gameDetails.movies.forEach((m: any) => {
      if (m.mp4?.max || m.webm?.max) {
        gallery.push({ type: 'video', url: m.mp4?.max || m.webm?.max, thumbnail: m.thumbnail });
      }
    });
  }
  if (gameDetails.screenshots && gameDetails.screenshots.length > 0) {
    gameDetails.screenshots.forEach((s: any) => {
      gallery.push({ type: 'image', url: s.path_full, thumbnail: s.path_thumbnail });
    });
  }

  return {
    id: appId,
    name: gameDetails.name,
    background_image: gameDetails.header_image,
    developers: gameDetails.developers?.map((d: string) => ({ name: d })) || [],
    publishers: gameDetails.publishers?.map((p: string) => ({ name: p })) || [],
    release_date: gameDetails.release_date?.date || undefined,
    platforms: Object.entries(gameDetails.platforms || {})
      .filter(([_, supported]) => supported)
      .map(([platform]) => ({ platform: { name: platform } })),
    genres: gameDetails.genres?.map((g: any) => ({ name: g.description })) || [],
    description_raw: gameDetails.short_description,
    gallery
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Missing title query parameter' }, { status: 400 });
  }

  try {
    const data = await fetchSteamData(title);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching Steam info:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch from Steam" }, { status: 500 });
  }
}
