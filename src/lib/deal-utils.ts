import { type GameDeal } from "../types";

export type RarityLevel = 'Mythic' | 'Legendary' | 'Epic' | 'Rare' | 'Uncommon' | 'Common';

export function getDealRarity(deal: GameDeal) {
  const originalPrice = deal.worth === "N/A" ? "$0.00" : deal.worth;
  const price = parseFloat(originalPrice.replace(/[^0-9.]/g, '')) || 0;
  const users = deal.users || 0;
  
  // Mythic: rainbow glow
  if (users > 100000 || price >= 50) return { 
    label: 'Mythic', 
    color: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 font-extrabold', 
    bg: 'bg-white/5', 
    border: 'border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
  };
  
  // Legendary: gold animated glow
  if (users > 50000 || price >= 30) return { 
    label: 'Legendary', 
    color: 'text-amber-400 font-bold', 
    bg: 'bg-amber-400/20', 
    border: 'border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.5)]' 
  };
  
  // Epic: purple glow
  if (users > 20000 || price >= 15) return { 
    label: 'Epic', 
    color: 'text-[#7C3AED] font-bold', 
    bg: 'bg-[#7C3AED]/20', 
    border: 'border-[#7C3AED]/50 shadow-[0_0_15px_rgba(124,58,237,0.5)]' 
  };
  
  // Rare: blue glow
  if (users > 10000 || price >= 10) return { 
    label: 'Rare', 
    color: 'text-blue-400 font-bold', 
    bg: 'bg-blue-400/20', 
    border: 'border-blue-400/50 shadow-[0_0_10px_rgba(96,165,250,0.4)]' 
  };
  
  // Uncommon: green glow
  if (users > 5000 || price >= 5) return { 
    label: 'Uncommon', 
    color: 'text-green-400', 
    bg: 'bg-green-400/10', 
    border: 'border-green-400/30' 
  };
  
  return { label: 'Common', color: 'text-white/60', bg: 'bg-white/5', border: 'border-white/10' };
}

const TRUSTED_PLATFORMS = [
  'steam', 'epic games store', 'epic games', 'gog', 
  'xbox', 'xbox one', 'xbox series x|s', 'xbox 360',
  'playstation', 'ps4', 'ps5', 
  'ubisoft', 'origin', 'battle.net', 'ea'
];

export function isTrustedStore(deal: GameDeal) {
  const platforms = deal.platforms.split(',').map(p => p.trim().toLowerCase());
  return platforms.some(p => TRUSTED_PLATFORMS.includes(p) || p.includes('epic') || p.includes('steam') || p.includes('playstation') || p.includes('xbox'));
}
