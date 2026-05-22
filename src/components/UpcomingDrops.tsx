import { motion } from "motion/react";
import { Clock, ArrowRight, CalendarDays, Key } from "lucide-react";
import { type GameDeal } from "../types";
import { openExternalUrl } from "../lib/utils";

export function UpcomingDrops({ deals, onViewAll }: { deals: GameDeal[], onViewAll?: () => void }) {
  if (!deals || deals.length === 0) return null;

  return (
    <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#8B5CF6]/30 rounded-3xl p-5 overflow-hidden mt-6 relative group shadow-neon w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 blur-[50px] mix-blend-screen pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#8B5CF6]" />
          <h3 className="text-[11px] font-orbitron font-bold uppercase tracking-[0.2em] text-[#F9FAFB] drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]">Upcoming Drops Detected</h3>
        </div>
      </div>
      
      <div className="space-y-4 relative z-10">
        {deals.map((item, i) => {
          const dateStr = item.start_date ? new Date(item.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}) : "Soon";
          // Mock "EPIC_MYSTERY_VAULT_SIGNAL" or "UPCOMING_DROP_DETECTED"
          const label = item.platforms.toLowerCase().includes('epic') 
            ? "EPIC_MYSTERY_VAULT_SIGNAL"
            : "UPCOMING_FREE_ASSET";

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => openExternalUrl(item.open_giveaway_url)}
              className="flex gap-3 items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0 hover:bg-[#8B5CF6]/5 p-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer hover:px-2 group/item"
            >
              <div>
                <p className="text-xs font-poppins font-bold mb-1 line-clamp-1 text-white flex items-center gap-1 group-hover/item:text-purple-400 transition-colors">
                  {item.title}
                </p>
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] font-orbitron font-bold uppercase tracking-widest text-[#06B6D4] flex items-center gap-1">
                     <CalendarDays className="w-2.5 h-2.5" /> EST. {dateStr}
                  </p>
                  <p className="text-[8px] font-orbitron text-[#8B5CF6] uppercase tracking-widest flex items-center gap-1">
                    <Key className="w-2 h-2" /> {label}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono font-bold text-[#8B5CF6] block whitespace-nowrap bg-[#8B5CF6]/10 px-2 py-1 rounded border border-[#8B5CF6]/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">FORECAST</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {onViewAll && (
        <button onClick={onViewAll} type="button" className="w-full mt-4 py-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/50 rounded-xl text-[10px] font-orbitron font-bold uppercase tracking-widest text-purple-300 hover:text-[#050816] hover:bg-[#8B5CF6] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          Explore All Intel <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
