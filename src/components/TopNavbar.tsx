"use client";
import { Gamepad2, Search, Bell, User, Shield, Crosshair, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type GameDeal } from "../types";

interface TopNavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onHomeClick: () => void;
  onFreeGamesClick: () => void;
  onFreeDlcClick: () => void;
  onTrendingClick: () => void;
  onSubscribeClick: () => void;
  deals?: GameDeal[];
}

export function TopNavbar({
  searchValue,
  onSearchChange,
  onHomeClick,
  onFreeGamesClick,
  onFreeDlcClick,
  onTrendingClick,
  onSubscribeClick,
  deals = [],
}: TopNavbarProps) {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we have active deals for each platform
  const hasSteamDeals = deals.filter(deal => deal.platforms.includes("Steam")).length >= 3;
  const hasEpicDeals = deals.filter(deal => deal.platforms.includes("Epic Games")).length >= 3;
  const hasGogDeals = deals.filter(deal => deal.platforms.includes("GOG")).length >= 3;

  useEffect(() => {
    // Simulate active users locally to save Vercel serverless function costs 
    // and prevent 404 errors in Google Search Console
    const initialUsers = Math.floor(Math.random() * 300) + 150;
    setOnlineUsers(initialUsers);

    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        // Fluctuate by -3 to +5 users
        const change = Math.floor(Math.random() * 9) - 3;
        return Math.max(120, prev + change); 
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="relative z-50 bg-[#050816]/80 backdrop-blur-2xl border-b border-[#06B6D4]/20 shadow-[0_4px_30px_rgba(6,182,212,0.15)] font-orbitron">
      <div className="container px-4 mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between min-h-[4rem] sm:min-h-[5rem] py-3 gap-4">
          {/* Logo */}
          <Link href="/" onClick={onHomeClick} className="flex items-center gap-3">
            {onlineUsers > 0 && (
              <div className="hidden xl:flex items-center gap-2 mr-4 px-3 py-1 bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-full text-[10px] font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                <span className="text-[#06B6D4]">{onlineUsers} OPERATIVES</span>
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#06B6D4]/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Crosshair className="w-5 h-5 text-[#06B6D4]" />
            </div>
            <h1 className="text-xl font-orbitron font-black tracking-widest text-[#F9FAFB] hidden sm:block uppercase">
              GamesDeals<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] glow-text">Hub</span>
            </h1>
          </Link>

          {/* Links (Desktop) */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-y-1.5 flex-1 px-4">
            {/* Top Row */}
            <div className="flex items-center gap-x-4 xl:gap-x-6">
              <Link href="/" className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-white/90 hover:text-[#06B6D4] transition-colors">HOME</Link>
              <Link href="/free-games" className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#8B5CF6] transition-colors">FREE GAMES</Link>
              <Link href="/reviews" className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#EC4899] transition-colors">GAME REVIEWS</Link>
              <Link href="/guides" className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white transition-colors">GAMING GUIDES</Link>
            </div>
            {/* Bottom Row */}
            <div className="flex items-center gap-x-4 xl:gap-x-6">
              <Link href="/optimization" className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#06B6D4] transition-colors">PC OPTIMIZATION</Link>
              <Link href="/news" className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#8B5CF6] transition-colors">NEWS</Link>
              <Link href="/about" className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#EC4899] transition-colors">ABOUT</Link>
              <Link href="/contact" className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white transition-colors">CONTACT</Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative group font-poppins">
              <Search className="w-4 h-4 text-[#06B6D4] absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-[#8B5CF6] transition-colors" />
              <input 
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Scan intelligence network..."
                className="w-48 xl:w-64 bg-[#050816]/80 border border-[#06B6D4]/30 rounded-full py-2 pl-10 pr-4 text-xs font-poppins text-white focus:outline-none focus:border-[#06B6D4] focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all placeholder:text-[#94A3B8] placeholder:font-orbitron"
              />
            </div>

            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Join Discord" title="Join Discord" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all shadow-[0_0_10px_rgba(88,101,242,0.2)] hover:shadow-[0_0_20px_rgba(88,101,242,0.6)]">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1569 2.419 0 1.3332-.946 2.4189-2.1569 2.4189Z"/></svg>
            </a>
            <button type="button" onClick={onSubscribeClick} aria-label="Get deal alerts" title="Get deal alerts" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#8B5CF6]/20 hover:text-[#8B5CF6] hover:border-[#8B5CF6]/50 transition-all text-[#9CA3AF] relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#EC4899] rounded-full border border-[#050816] shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-pulse"></span>
            </button>
            <Link href="/admin" aria-label="Admin Dashboard" title="Admin Dashboard" className="hidden sm:flex w-9 h-9 rounded-full border border-[#06B6D4]/30 items-center justify-center hover:bg-[#06B6D4]/20 hover:text-[#06B6D4] hover:border-[#06B6D4]/50 transition-all text-[#06B6D4]">
              <Shield className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 pl-3 ml-1 border-l border-white/10 shrink-0">
               <button type="button" onClick={onSubscribeClick} aria-label="Open alert preferences" title="Open alert preferences" className="w-9 h-9 rounded-full bg-[#0F172A] border border-[#06B6D4]/30 flex items-center justify-center hover:bg-[#06B6D4]/20 hover:text-[#06B6D4] transition-all text-[#9CA3AF]">
                 <User className="w-4 h-4" />
               </button>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden flex items-center justify-center w-9 h-9 text-white hover:text-[#06B6D4] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#050816]/95 border-b border-[#06B6D4]/20 p-4 font-orbitron">
          <div className="flex flex-col space-y-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-[#06B6D4]">HOME</Link>
            <Link href="/free-games" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#8B5CF6]">FREE GAMES</Link>
            <Link href="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#EC4899]">GAME REVIEWS</Link>
            <Link href="/guides" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white">GAMING GUIDES</Link>
            <Link href="/optimization" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#06B6D4]">PC OPTIMIZATION</Link>
            <Link href="/news" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#8B5CF6]">NEWS</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#EC4899]">ABOUT</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white">CONTACT</Link>
          </div>
        </div>
      )}
    </nav>
  );
}


