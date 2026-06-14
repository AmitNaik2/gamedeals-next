"use client";
// C:/Users/Amit/antigravity/gamesdealshub-next/src/components/DealGrid.tsx
'use client';

import { useState } from 'react';
import { Deal } from '@/types/deal';
import { DealCard } from './DealCard';
import { DealFilters } from './DealFilters';
import { EmailSignup } from './EmailSignup';
import { filterActiveDeals, sortDealsByExpiryAsc } from '@/lib/deal-expiry';

export function DealGrid({ initialDeals }: { initialDeals: Deal[] }) {
  const [platform, setPlatform] = useState('All');
  const [sort, setSort] = useState('Expiring soon');

  // Filter logic
  let filteredDeals = filterActiveDeals(initialDeals);
  if (platform !== 'All') {
    filteredDeals = filteredDeals.filter(d => 
      d.platforms.toLowerCase().includes(platform.toLowerCase())
    );
  }

  // Sort logic
  filteredDeals.sort((a, b) => {
    if (sort === 'Expiring soon') {
      return 0;
    }
    if (sort === 'Newest') {
      return new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
    }
    if (sort === 'Best rated') {
      return b.users - a.users; // Use 'users' claiming it as a proxy for rating/popularity
    }
    if (sort === 'Alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  if (sort === 'Expiring soon') {
    filteredDeals = sortDealsByExpiryAsc(filteredDeals);
  }

  return (
    <div>
      <DealFilters 
        selectedPlatform={platform} 
        onPlatformChange={setPlatform}
        sortBy={sort}
        onSortChange={setSort}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDeals.map((deal, index) => (
          <div key={deal.id}>
            <DealCard deal={deal} priority={index < 4} />
            {/* Insert Email Signup after the 4th card */}
            {index === 3 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mt-6">
                <EmailSignup />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 mt-6">
          <p className="text-gray-500 text-lg">No free games found for the selected platform.</p>
        </div>
      )}
      
      {/* Fallback Email Signup if there are less than 4 deals */}
      {filteredDeals.length > 0 && filteredDeals.length < 4 && (
        <EmailSignup />
      )}
    </div>
  );
}

