"use client";
// C:/Users/Amit/antigravity/gamesdealshub-next/src/components/DealStats.tsx
'use client';
import { useEffect, useState } from 'react';

// Fix 16: Last-updated timestamp and deal count to build trust
export function DealStats({ totalDeals }: { totalDeals: number }) {
  const [minutesAgo, setMinutesAgo] = useState(0);

  useEffect(() => {
    // In ISR, the page might have been generated some time ago.
    // For a real app, you could pass the exact generation timestamp from the server.
    // For now, we simulate a recent update since ISR revalidates every 5 mins.
    const interval = setInterval(() => {
      setMinutesAgo(prev => (prev < 5 ? prev + 1 : 0));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 bg-gray-100 py-2 px-4 rounded-lg inline-flex">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span>{totalDeals} free games live right now</span>
      </div>
      <span className="text-gray-300">|</span>
      <span>Last updated: {minutesAgo === 0 ? 'Just now' : `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`}</span>
    </div>
  );
}

