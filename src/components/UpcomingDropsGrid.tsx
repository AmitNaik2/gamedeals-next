"use client";
import { motion } from "motion/react";
import { type GameDeal } from "../types";
import { Clock, Key, ArrowRight, Activity, CalendarClock, Target, Zap } from "lucide-react";
import { Countdown } from "./Countdown";
import Image from "next/image";

// Helper to format date consistently on server & client (UTC) to prevent hydration mismatches
const formatDateStr = (dateVal: string) => {
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "Soon";
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
};

export function UpcomingDropsGrid({ deals }: { deals: GameDeal[] }) {
  if (!deals || deals.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
             <CalendarClock className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="text-sm font-orbitron font-bold uppercase tracking-widest text-[#F9FAFB] glow-text">Upcoming Free Games</h3>
            <p className="text-[10px] font-poppins text-[#9CA3AF] uppercase tracking-widest mt-0.5">Prediction Engine & Leak Tracking</p>
          </div>
        </div>
        <div className="hidden sm:flex px-3 py-1.5 rounded-lg bg-[#EC4899]/10 border border-[#EC4899]/30 text-[#EC4899] text-[10px] font-bold uppercase tracking-widest items-center gap-1.5 mt-4 sm:mt-0">
          <Activity className="w-3 h-3" /> Live Forecasting active
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {deals.map((item, i) => {
          const dateStr = item.start_date ? formatDateStr(item.start_date) : "Soon";
          
          let confidence = "High";
          let confidenceColor = "text-[#22C55E]";
          let expectedValue = "$19.99";
          
          if (item.platforms.toLowerCase().includes('epic')) {
            confidence = "Verified";
            confidenceColor = "text-[#06B6D4]";
            expectedValue = "Unknown (Mystery Game)";
          } else if (item.title.toLowerCase().includes('leak') || item.title.toLowerCase().includes('rumor')) {
            confidence = "Speculative";
            confidenceColor = "text-[#F59E0B]";
            expectedValue = "TBD";
          }

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 hover:border-[#8B5CF6]/50 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 relative flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/0 via-transparent to-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
              
              <div className="relative h-40 overflow-hidden w-full bg-[#050816]">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out z-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent z-10 block" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                   <div className="max-w-fit px-2 py-1 rounded-md bg-[#8B5CF6] text-white text-[9px] font-bold font-orbitron uppercase tracking-widest shadow-[0_0_10px_rgba(139,92,246,0.5)] flex items-center gap-1">
                     <Target className="w-3 h-3" /> UPCOMING
                   </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 relative z-20 -mt-6">
                <h4 className="text-sm font-poppins font-bold text-white group-hover:text-[#8B5CF6] transition-colors line-clamp-2 mb-2 leading-relaxed">
                  {item.title}
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                        <p className="text-[9px] text-[#9CA3AF] uppercase tracking-widest mb-1">Expected Value</p>
                        <p className="text-xs font-orbitron font-bold text-white">{expectedValue}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                        <p className="text-[9px] text-[#9CA3AF] uppercase tracking-widest mb-1">Leak Confidence</p>
                        <p className={`text-xs font-orbitron font-bold ${confidenceColor}`}>{confidence}</p>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Reveal Date</span>
                    <span className="text-[10px] text-white font-mono font-bold flex flex-col items-end gap-1">
                        {dateStr}
                        {item.start_date && (
                           <span className="text-[9px] text-[#8B5CF6]"><Countdown endDate={item.start_date} /></span>
                        )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Platform Tracker</span>
                    <span className="text-[10px] text-[#06B6D4] font-mono font-bold bg-[#06B6D4]/10 px-1.5 py-0.5 rounded uppercase">{item.platforms.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
