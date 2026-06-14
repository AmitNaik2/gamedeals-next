import { NextResponse } from 'next/server';
import { filterActiveDeals, sortDealsByExpiryAsc } from '../../../lib/deal-expiry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://www.gamerpower.com/api/giveaways?type=loot&sort-by=date', { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? sortDealsByExpiryAsc(filterActiveDeals(data)) : []);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}
