import { filterActiveDeals, sortDealsByExpiryAsc } from '../../../lib/deal-expiry';
import { cachedJson } from '../../../lib/api-cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://www.gamerpower.com/api/giveaways?type=loot&sort-by=date', { cache: 'no-store' });
    const data = await res.json();
    return cachedJson(Array.isArray(data) ? sortDealsByExpiryAsc(filterActiveDeals(data)) : []);
  } catch (err) {
    return cachedJson([], { status: 500 });
  }
}
