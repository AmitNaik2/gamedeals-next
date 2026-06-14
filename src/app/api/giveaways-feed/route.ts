import { NextResponse } from 'next/server';
import { filterActiveDeals, sortDealsByExpiryAsc } from '../../../lib/deal-expiry';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const url = type 
    ? `https://www.gamerpower.com/api/giveaways?type=${type}&sort-by=date` 
    : `https://www.gamerpower.com/api/giveaways?sort-by=date`;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? sortDealsByExpiryAsc(filterActiveDeals(data)) : []);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}
