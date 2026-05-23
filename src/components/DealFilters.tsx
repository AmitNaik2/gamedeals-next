"use client";
// C:/Users/Amit/antigravity/gamesdealshub-next/src/components/DealFilters.tsx
'use client';

// Fix 13: Platform filtering and sort controls
export function DealFilters({ 
  selectedPlatform, 
  onPlatformChange,
  sortBy,
  onSortChange
}: { 
  selectedPlatform: string;
  onPlatformChange: (p: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
}) {
  const platforms = ["All", "Epic Games", "Steam", "GOG", "Prime Gaming", "Ubisoft Connect"];
  const sortOptions = ["Expiring soon", "Newest", "Best rated", "Alphabetical"];

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold text-gray-500 mr-2">Platform:</span>
        {platforms.map(p => (
          <button
            key={p}
            onClick={() => onPlatformChange(p)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedPlatform === p 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-semibold text-gray-500">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2 cursor-pointer"
        >
          {sortOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

