"use client";
import { motion } from "motion/react";
import { type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { type GameDeal } from "../types";
import { Countdown } from "./Countdown";
import { ExternalLink, BadgeCheck } from "lucide-react";
import { useIgdb } from "../hooks/useIgdb";
import { generateUniqueSummary, generateTags } from "../lib/text-utils";
import { formatUtcExpiry, isExpiringWithin24h } from "../lib/deal-expiry";

export function FeaturedDeal({ deal }: { deal: GameDeal }) {
  const gameInfo = useIgdb(deal?.title);
  if (!deal) return null;

  const bgImage = gameInfo?.background_image || deal.image || deal.thumbnail;
  const rewrittenSummary = generateUniqueSummary(deal.title, deal.description, deal.type, deal.platforms);
  const tags = generateTags(deal.title, deal.platforms, deal.type, deal.description);
  const expiryDate = formatUtcExpiry(deal.end_date);
  const isUrgent = isExpiringWithin24h(deal);

  const gameUrl = `/game/${deal.id}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group overflow-hidden rounded-3xl h-[400px] sm:h-[450px] border border-white/10 mb-12 shadow-[0_0_40px_rgba(139,92,246,0.15)] bg-[#050816]"
    >
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage} 
          alt={deal.title} 
          fill
          sizes="100vw"
          loading="eager"
          className="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-70 transition-all duration-1000 ease-out" 
          priority={true}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/60 to-transparent z-10"></div>
      
      <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-[10px] font-orbitron font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2">
        Featured Drop
        {gameInfo?.rating && <span className="ml-2 pl-2 border-l border-white/30 text-white flex items-center gap-1">★ {Math.round(gameInfo.rating)}</span>}
      </div>

      <div className="absolute bottom-8 left-6 sm:left-10 z-20 max-w-full sm:max-w-[75%] pr-6 font-poppins">
        <div className="flex flex-wrap items-center gap-2 mb-4 text-[10px] uppercase font-bold tracking-widest text-[#06B6D4]">
          {tags.map((tag, idx) => (
             <span key={idx} className="bg-[#06B6D4]/10 px-2 py-1 rounded-md border border-[#06B6D4]/30 backdrop-blur-md">
               {tag}
             </span>
          ))}
        </div>
        <Link href={gameUrl} className="block w-fit group/title">
          <h2 className="text-4xl sm:text-6xl font-orbitron font-black mb-4 text-[#F9FAFB] leading-tight group-hover/title:text-[#8B5CF6] group-hover/title:glow-text transition-all duration-300">
            {deal.title}
          </h2>
        </Link>
        <p className="text-sm sm:text-base text-[#9CA3AF] mb-8 line-clamp-2 max-w-2xl font-light">
          {rewrittenSummary}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-2">
            <Link
              href={gameUrl}
              className="px-8 py-4 bg-white text-black text-[12px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#06B6D4] hover:text-white transition-all duration-300 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105"
            >
              Claim Drop
            </Link>
            {expiryDate && (
              <span className={`text-[10px] font-orbitron font-bold uppercase tracking-widest ${isUrgent ? "text-[#EF4444]" : "text-[#F59E0B]"}`}>
                Expires: {expiryDate}
              </span>
            )}
          </div>
          <Countdown endDate={deal.end_date} />
        </div>
      </div>
      
      {/* Decorative Overlays */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/20 blur-[100px] pointer-events-none z-10 mix-blend-screen"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#06B6D4]/20 blur-[100px] pointer-events-none z-10 mix-blend-screen"></div>
    </motion.div>
  );
}
