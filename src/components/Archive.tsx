import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Archive as ArchiveIcon, Clock } from 'lucide-react';
import { type GameDeal } from '../types';

export function Archive() {
  const [deals, setDeals] = useState<GameDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch all deals and filter to expired ones
    const fetchArchive = async () => {
      try {
        const res = await fetch("/api/giveaways-feed");
        if (!res.ok) throw new Error("Failed");
        const text = await res.text();
        const data = JSON.parse(text);
        
        if (Array.isArray(data)) {
          const expiredDeals = data.filter((deal: GameDeal) => {
             if (deal.end_date && deal.end_date !== 'N/A') {
               const endStr = deal.end_date.includes(' ') && !deal.end_date.includes('Z') && !deal.end_date.includes('GMT') 
                 ? deal.end_date.replace(' ', 'T') + 'Z' 
                 : deal.end_date;
               const endTime = new Date(endStr).getTime();
               if (!isNaN(endTime) && endTime < new Date().getTime()) {
                 return true;
               }
             }
             return false;
          });
          setDeals(expiredDeals.slice(0, 100)); // Limit to most recent 100
        }
      } catch (err: any) {
        if (err.message === 'Failed to fetch') {
           // Ignored as it might be network disconnect
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in text-white">
      <Helmet>
        <title>Expired Game Giveaways Archive | GamesDealsHub</title>
        <meta name="description" content="View the history of expired free PC game giveaways on Steam, Epic Games, and GOG. See what games were given away for free." />
      </Helmet>
      
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="text-3xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-cyan-500 uppercase tracking-tighter mb-4 flex items-center gap-3">
          <ArchiveIcon className="w-8 h-8 md:w-10 md:h-10 text-[#7C3AED]" /> Giveaway Archive
        </h1>
        <p className="text-white/60 max-w-2xl text-sm leading-relaxed">
          A historical record of expired PC game giveaways from major stores like the Epic Games Store, Steam, and GOG. These games were previously free to keep but have now expired.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
           <span className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : deals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map(deal => (
            <div key={deal.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
               <div className="aspect-video relative">
                 <img src={deal.thumbnail} alt={deal.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                   <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 font-bold uppercase tracking-widest text-[10px] rounded backdrop-blur">
                     Expired
                   </span>
                 </div>
               </div>
               <div className="p-4">
                 <h3 className="font-bold text-lg mb-1">{deal.title}</h3>
                 <p className="text-xs text-white/50 mb-3">{deal.platforms}</p>
                 <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                    <Clock className="w-3 h-3" /> Ended: {deal.end_date !== 'N/A' ? deal.end_date : 'Unknown'}
                 </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-white/40">
           <p>No expired deals found in the current API window.</p>
        </div>
      )}
    </div>
  );
}
