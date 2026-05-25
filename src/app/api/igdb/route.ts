import { NextResponse } from 'next/server';

let twitchAccessToken = "";
let tokenExpiration = 0;

async function getTwitchToken(): Promise<string | null> {
  if (twitchAccessToken && Date.now() < tokenExpiration) return twitchAccessToken;
  
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) return null;
  
  try {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
      method: "POST"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch token");
    twitchAccessToken = data.access_token;
    tokenExpiration = Date.now() + (data.expires_in * 1000) - 60000;
    return twitchAccessToken;
  } catch (error) {
    console.error("Twitch Token Error:", error);
    return null;
  }
}

async function fetchIgdbData(title: string) {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const token = await getTwitchToken();

  if (!clientId || !token) {
     return { not_found: true, reason: "twitch_keys_missing" };
  }

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

  // Skip IGDB fetch for internal apps or completely unrelated generic terms that cause bad matches
  if (cleanTitle.toLowerCase().includes('gamerpower')) {
    return { not_found: true, reason: "internal_app" };
  }

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: `search "${cleanTitle}"; fields name,rating,summary,cover.url,genres.name,platforms.name,url,involved_companies.company.name,first_release_date,screenshots.url,videos.video_id; limit 1;`,
    next: { revalidate: 604800 } // Cache for 7 days on Vercel
  });
  
  if (!response.ok) throw new Error("Failed to fetch from IGDB");
  const data = await response.json();
  
  if (data && data.length > 0) {
    if (data[0].cover && data[0].cover.url) {
      data[0].background_image = 'https:' + data[0].cover.url.replace('t_thumb', 't_1080p');
    }
    
    // Process gallery
    const gallery: any[] = [];
    if (data[0].videos) {
      data[0].videos.forEach((v: any) => {
        gallery.push({ type: 'youtube', url: v.video_id, thumbnail: `https://img.youtube.com/vi/${v.video_id}/0.jpg` });
      });
    }
    if (data[0].screenshots) {
      data[0].screenshots.forEach((s: any) => {
        const url = 'https:' + s.url.replace('t_thumb', 't_1080p');
        const thumb = 'https:' + s.url;
        gallery.push({ type: 'image', url, thumbnail: thumb });
      });
    }
    data[0].gallery = gallery;

    // Format involved companies
    if (data[0].involved_companies) {
       data[0].developers = data[0].involved_companies.map((ic: any) => ({ name: ic.company?.name }));
       data[0].publishers = data[0].involved_companies.map((ic: any) => ({ name: ic.company?.name }));
    }
    if (data[0].first_release_date) {
       const date = new Date(data[0].first_release_date * 1000);
       data[0].release_date = date.toISOString().split('T')[0];
    }
    return data[0];
  } else {
    return { not_found: true };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Missing title query parameter' }, { status: 400 });
  }

  try {
    const data = await fetchIgdbData(title);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching IGDB info:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch from IGDB" }, { status: 500 });
  }
}
