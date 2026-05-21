import { motion } from "motion/react";
import { Monitor, MonitorSmartphone, Smartphone, Gamepad2, Share2, BadgeCheck, ShieldCheck, Star } from "lucide-react";
import { type Key, useRef, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { type GameDeal } from "../types";
import { cn } from "../lib/utils";
import { getDealRarity } from "../lib/deal-utils";
import { Countdown } from "./Countdown";
import { useIgdb } from "../hooks/useIgdb";

interface DealCardProps {
  key?: Key;
  deal: GameDeal;
  index: number;
  onShare: (title: string, url: string) => void;
  onRemind?: (deal: GameDeal) => void;
  priority?: boolean;
}

export function DealCard({ deal, index, onShare, onRemind, priority = false }: DealCardProps) {
  const originalPrice = deal.worth === "N/A" ? "$0.00" : deal.worth;
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Try to enrich deals
  const gameInfo = useIgdb(index < 12 ? deal.title : "");
  const bgImage = gameInfo?.background_image || deal.image || deal.thumbnail;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const gameUrl = `/game/${deal.id}`;

  const renderPlatformIcon = (platformStr: string) => {
    const pl = platformStr.toLowerCase();
    if (pl.includes("pc")) return <Monitor className="w-3.5 h-3.5" />;
    if (pl.includes("android") || pl.includes("ios")) return <Smartphone className="w-3.5 h-3.5" />;
    if (pl.includes("ps") || pl.includes("xbox") || pl.includes("switch")) return <Gamepad2 className="w-3.5 h-3.5" />;
    return <MonitorSmartphone className="w-3.5 h-3.5" />;
  };

  const platforms = deal.platforms.split(',').map(p => p.trim());
  const rarity = getDealRarity(deal);
  
  // Trust Score Simulation
  let trustScore = "Official Store";
  let trustColor = "text-[#22C55E]";
  let trustBg = "bg-[#22C55E]/10";
  let trustBorder = "border-[#22C55E]/30";
  
  if (deal.users < 1000) {
    trustScore = "Community Verified";
    trustColor = "text-[#06B6D4]";
    trustBg = "bg-[#06B6D4]/10";
    trustBorder = "border-[#06B6D4]/30";
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="flex flex-col overflow-hidden transition-all duration-500 bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-2xl group relative shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:border-[#8B5CF6]/50"
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(139, 92, 246, 0.15), transparent 40%)"
        }}
      />
      
      {/* Image Section */}
      <div className="relative w-full aspect-video sm:aspect-[16/9] shrink-0 overflow-hidden bg-black border-b border-white/5">
        <Link to={gameUrl} className="block w-full h-full">
          <img
            src={bgImage}
            alt={`Free download of ${deal.title} on ${deal.platforms}`}
            width={600}
            height={337}
            className="block object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
          />
          <div className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-[#070B14] via-transparent to-transparent opacity-80 group-hover:opacity-60"></div>
          
          <div className="absolute top-3 right-3 flex gap-2">
            <span className={cn("px-2 py-1 rounded bg-black/60 backdrop-blur-md border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1", trustBorder, trustColor)}>
              <ShieldCheck className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-5 flex-grow relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
           <div className="flex flex-wrap items-center gap-2 text-[10px] font-poppins uppercase tracking-widest text-[#9CA3AF]">
            {platforms.map((platform, i) => (
              <span key={i} className="flex items-center gap-1 text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/20 px-2 py-1 rounded">
                {renderPlatformIcon(platform)}
                {platform}
                <BadgeCheck className="w-3 h-3 text-[#22C55E]" />
              </span>
            ))}
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              {originalPrice !== "$0.00" && (
                <span className="text-xs font-mono text-[#9CA3AF] line-through">
                  {originalPrice}
                </span>
              )}
              <span className="text-2xl font-orbitron font-black text-[#8B5CF6] uppercase tracking-wider glow-text">
                {deal.type === 'Game Info' ? "INFO" : (deal.salePrice ? `$${deal.salePrice}` : "FREE")}
              </span>
            </div>
            {(originalPrice !== "$0.00" && !deal.salePrice && deal.type !== 'Game Info') && (
              <span className="text-[10px] font-bold text-[#EC4899] uppercase tracking-widest mt-1 px-1.5 py-0.5 bg-[#EC4899]/10 rounded border border-[#EC4899]/30">
                100% OFF
              </span>
            )}
          </div>
        </div>

        <Link to={gameUrl} className="inline-block group-hover:text-[#8B5CF6] transition-colors mb-3">
          <h3 className="text-xl sm:text-2xl font-bold leading-tight text-white font-orbitron line-clamp-2">
            {deal.title}
          </h3>
        </Link>
        
        {deal.description && (
          <p className="text-[#9CA3AF] text-sm line-clamp-2 mb-5 leading-relaxed font-poppins font-light">
            {deal.description.replace(/<[^>]*>?/gm, '')}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-6 font-poppins">
           {deal.steamRatingPercent && (
            <span className="px-2 py-1 rounded bg-[#111827] border border-[#06B6D4]/30 text-[#06B6D4] text-[10px] font-bold uppercase tracking-widest">
              STEAM {deal.steamRatingPercent}%
            </span>
           )}
           {gameInfo?.rating > 0 && (
            <span className="px-2 py-1 rounded bg-[#111827] border border-[#F59E0B]/30 text-[#F59E0B] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> {Math.round(gameInfo.rating)}
            </span>
           )}
           <span className="px-2 py-1 rounded bg-[#111827] border border-white/10 text-[#9CA3AF] text-[10px] font-bold uppercase tracking-widest">
              {deal.type || "Special Deal"}
           </span>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-5">
          <Countdown endDate={deal.end_date} />

          <div className="flex items-center justify-start sm:justify-end gap-3 w-full sm:w-auto">
            <button
              onClick={() => onShare(deal.title, deal.open_giveaway_url)}
              className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-[#9CA3AF] bg-[#111827] hover:text-white hover:border-[#8B5CF6] transition-all group/btn"
              title="Share Deal"
            >
              <Share2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            </button>
            <button 
               type="button"
               className="h-10 px-4 flex items-center justify-center border border-[#F59E0B]/50 text-[#F59E0B] bg-[#F59E0B]/10 text-xs font-poppins font-bold uppercase tracking-widest rounded-xl hover:bg-[#F59E0B]/20 transition-colors"
               onClick={() => onRemind?.(deal)}
            >
              Wishlist
            </button>
            <Link 
              to={gameUrl}
              className="h-10 px-6 flex items-center justify-center bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-xs font-poppins font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.3)]"
             >
              Claim Deal
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
