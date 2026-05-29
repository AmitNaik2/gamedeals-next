import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';
  
  try {
    const targetUrl = title 
      ? `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&exact=0&storeID=1,25&sortBy=Deal%20Rating` 
      : `https://www.cheapshark.com/api/1.0/deals?storeID=1,25&sortBy=Deal%20Rating`;
      
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      
    // Cache the response for 1 hour (3600 seconds) to avoid any further rate limit issues
    const res = await fetch(proxyUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
       throw new Error(`CheapShark API error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}
