import { motion, AnimatePresence } from "motion/react";
import { type GameDeal } from "../types";
import { formatDistanceToNow } from "date-fns";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function LiveFeed({ deals }: { deals: GameDeal[] }) {
  if (!deals || deals.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-4 h-4 text-[#7C3AED]" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-white">Live Activity</h3>
      </div>
      
      <div className="space-y-4">
        {deals.slice(0, 5).map((deal, i) => (
          <Link to={`/game/${deal.id}`} key={`${deal.id}-feed`}>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-start border-b border-white/5 pb-4 last:border-0 last:pb-0 hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded shrink-0 overflow-hidden bg-black/50 border border-white/10">
                 <img src={deal.thumbnail} alt={deal.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white mb-1 line-clamp-1">{deal.title}</p>
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-tighter text-[#7C3AED]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    New Deal Discovered
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
