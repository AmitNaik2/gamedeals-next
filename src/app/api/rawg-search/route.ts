import { NextResponse } from 'next/server';

const RAWG_MONTHLY_LIMIT = 20000;
let rawgUsageCount = 0; // Simple in-memory mock for Next.js serverless

async function fetchRawgSearch(query: string) {
  const rawgKey = process.env.RAWG_API_KEY || process.env.VITE_RAWG_API_KEY;
  if (!rawgKey) return { results: [] };

  if (rawgUsageCount >= RAWG_MONTHLY_LIMIT) return { results: [] };

  const encodedTitle = encodeURIComponent(query);
  const response = await fetch(`https://api.rawg.io/api/games?search=${encodedTitle}&key=${rawgKey}&page_size=10`, {
    headers: { "User-Agent": "FreeGameTracker/1.0" },
    next: { revalidate: 604800 } // Cache for 7 days on Vercel Edge network to save 20k API limit
  });
  rawgUsageCount++;
  
  if (!response.ok) return { results: [] };
  const data = await response.json();
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const data = await fetchRawgSearch(query);
    return NextResponse.json(data.results || []);
  } catch (e: any) {
    console.error("RAWG Search API Error:", e);
    return NextResponse.json([]);
  }
}
