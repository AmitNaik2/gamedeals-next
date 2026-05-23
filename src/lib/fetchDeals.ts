// C:/Users/Amit/antigravity/gamesdealshub-next/src/lib/fetchDeals.ts
import { Deal } from '@/types/deal';

// Fetches live deals from the GamerPower API.
// Used in Server Components for SSR/ISR.
export async function fetchDeals(): Promise<Deal[]> {
  try {
    const res = await fetch('https://www.gamerpower.com/api/giveaways', {
      // Revalidate every 5 minutes (300 seconds) - Incremental Static Regeneration
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error('Failed to fetch deals from GamerPower', res.status);
      return [];
    }

    const data: Deal[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
}
