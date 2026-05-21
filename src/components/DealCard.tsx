import { motion } from "motion/react";
import { Tag, Monitor, MonitorSmartphone, Smartphone, Gamepad2, Mail, BadgeCheck, ShieldCheck, Star } from "lucide-react";
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
  let trustColor = "text-green-400";
  let trustBg = "bg-green-400/10";
  let trustBorder = "border-green-400/20";
  
  if (deal.users < 1000) {
    trustScore = "Community Verified";
    trustColor = "text-blue-400";
    trustBg = "bg-blue-400/10";
    trustBorder = "border-blue-400/20";
  }

  // Remove simulated Deal Score based on worth and users
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="flex flex-col overflow-hidden transition-all duration-300 border bg-white/5 border-white/10 rounded-xl hover:bg-white/[0.08] group relative"
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(124, 58, 237, 0.1), transparent 40%)"
        }}
      />
      
      {/* Image Section */}
      <div className="relative w-full aspect-video sm:aspect-[2/1] shrink-0 overflow-hidden bg-black/50 border-b border-white/10">
        <Link to={gameUrl} className="block w-full h-full">
          <img
            src={bgImage}
            alt={`Free download of ${deal.title} on ${deal.platforms} - ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date())}`}
            width={600}
            height={337}
            className="block object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
          />
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:opacity-100"></div>
        </Link>
      </div>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": deal.title,
          "image": bgImage,
          "description": deal.description || `Free ${deal.title} game deal.`,
          "offers": {
            "@type": "Offer",
            "url": `https://www.gamesdealshub.me${gameUrl}`,
            "priceCurrency": "USD",
            "price": deal.salePrice || "0.00",
            "priceValidUntil": deal.end_date !== "N/A" ? deal.end_date : undefined,
            "availability": "https://schema.org/InStock"
          }
        })}
      </script>

      {/* Content Section */}
      <div className="flex flex-col p-4 sm:p-5 flex-grow">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
           <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-white/40">
            <span className={cn("px-1.5 py-0.5 rounded border", rarity.bg, rarity.color, rarity.border)}>
              {rarity.label}
            </span>
            <span className={cn("px-1.5 py-0.5 rounded border flex items-center gap-1", trustBg, trustColor, trustBorder)}>
              <ShieldCheck className="w-2.5 h-2.5" />
              {trustScore}
            </span>
            <span aria-hidden="true">/</span>
            {platforms.map((platform, i) => (
              <span key={i} className="flex items-center gap-1 text-[#7C3AED]">
                {renderPlatformIcon(platform)}
                {platform}
                <BadgeCheck className="w-3 h-3 text-blue-400" />
              </span>
            ))}
          </div>
          
          <div className="flex items-end flex-col">
            <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-green-500 mb-1 border border-green-500/30 px-1 rounded bg-green-500/10">
              <BadgeCheck className="w-2.5 h-2.5" /> Official
            </span>
            {originalPrice !== "$0.00" && (
              <span className="text-[10px] sm:text-[11px] font-mono text-white/40 line-through mb-0.5">
                {originalPrice}
              </span>
            )}
            <span className="text-xl sm:text-2xl font-black text-[#7C3AED] uppercase tracking-tighter leading-none">
              {deal.type === 'Game Info' ? "INFO" : (deal.salePrice ? `$${deal.salePrice}` : "FREE")}
            </span>
          </div>
        </div>

        <Link to={gameUrl} className="inline-block group-hover:text-[#7C3AED] transition-colors mb-2">
          <h3 className="text-lg sm:text-2xl font-bold leading-tight text-white font-serif italic line-clamp-2">
            {deal.title}
          </h3>
        </Link>
        
        {deal.description && (
          <p className="text-white/60 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
            <strong className="text-white/80">Editor's Note:</strong> {deal.description.replace(/<[^>]*>?/gm, '')}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-6">
           {deal.steamRatingPercent && (
            <span className="px-2 py-0.5 rounded border border-blue-400/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              STEAM {deal.steamRatingPercent}%
            </span>
           )}
           {gameInfo?.rating > 0 && (
            <span className="px-2 py-0.5 rounded border border-amber-400/30 text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-current" /> {Math.round(gameInfo.rating)}
            </span>
           )}
           <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest">
              {deal.type || "Special Deal"}
           </span>
        </div>

        <div className="mt-auto flex flex-wrap sm:items-center justify-between gap-4 border-t border-white/10 pt-4">
          <Countdown endDate={deal.end_date} />

          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3 w-full sm:w-auto">
            <button
              onClick={() => onShare(deal.title, deal.open_giveaway_url)}
              aria-label={`Email ${deal.title}`}
              className="w-10 h-10 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors group/btn"
              title="Email Deal"
            >
              <Mail className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </button>
            <button 
               type="button"
               className="h-10 px-4 flex items-center justify-center border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-amber-400/10 transition-colors"
               onClick={() => onRemind?.(deal)}
            >
              Remind Me
            </button>
            <Link 
              to={gameUrl}
              className="h-10 px-6 flex items-center justify-center bg-gradient-to-r from-[#7C3AED] to-cyan-500 text-white text-xs font-bold uppercase tracking-widest rounded hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(124,58,237,0.4)]"
             >
              {deal.type === 'Game Info' ? "Get Info" : (deal.salePrice ? "View Deal" : "Claim Free")}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
