import { cachedJson } from '../../../lib/api-cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';
  try {
    const url = title 
      ? `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&exact=0&storeID=1,25&sortBy=Deal%20Rating&_t=2` 
      : `https://www.cheapshark.com/api/1.0/deals?storeID=1,25&sortBy=Deal%20Rating&_t=2`;
      
    // Cache the response for 5 minutes to avoid CheapShark 429 rate limits.
    const res = await fetch(url, { 
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'GamesDealsHub/1.0 (gamedealshub1@gmail.com)'
      }
    });
    if (!res.ok) {
       throw new Error(`CheapShark API error: ${res.status}`);
    }
    const data = await res.json();
    return cachedJson(data);
  } catch (err) {
    return cachedJson([], { status: 500 });
  }
}
