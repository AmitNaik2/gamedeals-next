import { NextResponse } from "next/server";

export const API_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export function cachedJson(
  data: unknown,
  init?: ResponseInit
): NextResponse<unknown> {
  const headers = new Headers(init?.headers);
  for (const [key, value] of Object.entries(API_CACHE_HEADERS)) {
    headers.set(key, value);
  }

  return NextResponse.json(data, {
    ...init,
    headers,
  });
}
