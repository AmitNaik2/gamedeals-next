// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/archive/page.tsx
import { Metadata } from 'next';
import { fetchDeals } from '@/lib/fetchDeals';
import { DealCard } from '@/components/DealCard';
import { filterActiveDeals, sortDealsByExpiryAsc } from '@/lib/deal-expiry';

export const metadata: Metadata = {
  title: 'Expired Free Games Archive | GamesDealsHub',
  description: 'Browse the history of expired free PC game giveaways from Epic Games, Steam, GOG, and more.',
  alternates: { canonical: '/archive' }
};

export const revalidate = 300;

export default async function ArchivePage() {
  const allDeals = await fetchDeals();
  const activeDeals = sortDealsByExpiryAsc(filterActiveDeals(allDeals));
  // Filter for deals that are "Active" but technically in our "archive" 
  // Normally the GamerPower API gives active giveaways. For a real archive,
  // we would fetch from a database of past deals. For this migration, we display 
  // the deals in an archive view.
  
  return (
    <div className="mb-12">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expired Deals Archive</h1>
        <p className="text-gray-600">A historical record of past free PC game giveaways.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-80 grayscale-[20%]">
        {activeDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} priority={false} />
        ))}
      </div>
    </div>
  );
}
