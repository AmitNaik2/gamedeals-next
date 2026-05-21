import { Gamepad2, Search, Bell, User, MessageSquare, Shield } from "lucide-react";
import { Link } from "react-router-dom";
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

  // Check if we have active deals for each platform
  const hasSteamDeals = deals.filter(deal => deal.platforms.includes("Steam")).length >= 3;
  const hasEpicDeals = deals.filter(deal => deal.platforms.includes("Epic Games")).length >= 3;
  const hasGogDeals = deals.filter(deal => deal.platforms.includes("GOG")).length >= 3;

  useEffect(() => {
    // Generate or retrieve a persistent visitorId
    let visitorId = localStorage.getItem("gg_visitor_id");
    if (!visitorId) {
      visitorId = "vis_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("gg_visitor_id", visitorId);
    }

    // Ping to track activity and get online user count
    const pingActivity = async () => {
      try {
        const res = await fetch('/api/activity-check', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.activeUsers !== undefined) {
             setOnlineUsers(data.activeUsers);
          }
        }
      } catch (err) {
        // Silently fail on network/adblocker errors
      }
    };
    
    pingActivity();
    const interval = setInterval(pingActivity, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-2xl border-b border-white/10">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" onClick={onHomeClick} className="flex items-center gap-3">
            {onlineUsers > 0 && (
              <div className="hidden xl:flex items-center gap-2 mr-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse glow-green"></span>
                <span className="text-white/70">{onlineUsers} Online</span>
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 hidden sm:block delay-100">
              GameDeals<span className="text-[#7C3AED]">Hub</span>
            </h1>
          </Link>

          {/* Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" onClick={onHomeClick} className="text-sm font-bold text-white hover:text-[#7C3AED] transition-colors">Home</Link>
            {hasSteamDeals && <Link to="/free-steam-games" onClick={onFreeGamesClick} className="text-sm font-bold text-white/60 hover:text-white transition-colors">Free Steam Games</Link>}
            {hasEpicDeals && <Link to="/free-epic-games" onClick={onFreeGamesClick} className="text-sm font-bold text-white/60 hover:text-white transition-colors">Free Epic Games</Link>}
            {hasGogDeals && <Link to="/free-gog-games" onClick={onFreeGamesClick} className="text-sm font-bold text-white/60 hover:text-white transition-colors">GOG Giveaways</Link>}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative group">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-[#7C3AED] transition-colors" />
              <input 
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search games..."
                className="w-48 xl:w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all placeholder:text-white/30"
              />
            </div>

            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Join Discord" title="Join Discord" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1569 2.419 0 1.3332-.946 2.4189-2.1569 2.4189Z"/></svg>
            </a>
            <a href="https://reddit.com/r/gamedeals" target="_blank" rel="noopener noreferrer" aria-label="Reddit Community" title="Reddit Community" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-[#FF4500]/20 text-[#FF4500] hover:bg-[#FF4500] hover:text-white transition-all">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
            </a>
            <button type="button" onClick={onSubscribeClick} aria-label="Get deal alerts" title="Get deal alerts" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white/70 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse"></span>
            </button>
            <Link to="/admin" aria-label="Admin Dashboard" title="Admin Dashboard" className="hidden sm:flex w-9 h-9 rounded-full border border-white/10 items-center justify-center hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] transition-all text-white/70">
              <Shield className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 pl-3 ml-1 border-l border-white/10 shrink-0">
               <button type="button" onClick={onSubscribeClick} aria-label="Open alert preferences" title="Open alert preferences" className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white/70">
                 <User className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
