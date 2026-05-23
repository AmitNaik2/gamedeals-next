"use client";
import { useState, useEffect, type FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, RefreshCw, AlertCircle, RefreshCcw, CheckCircle2, Search, Filter, Info } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { DealCard } from "../components/DealCard";
import { CompareCard } from "../components/CompareCard";
import { GameDetail } from "../components/GameDetail";
import { PrivacyPolicy } from "../components/PrivacyPolicy";
import { TermsOfService } from "../components/TermsOfService";
import { AboutUs } from "../components/AboutUs";
import { ContactUs } from "../components/ContactUs";
import { ArticleComparison } from "../components/ArticleComparison";
import { Admin } from "../components/Admin";
import { Archive } from "../components/Archive";
import { EmailModal } from "../components/EmailModal";
import { type GameDeal } from "../types";
import { getDealRarity, type RarityLevel } from "../lib/deal-utils";
import { cn, openExternalUrl } from "../lib/utils";
import { HistoricalPrices } from "../components/HistoricalPrices";
import { UpcomingDropsGrid } from "../components/UpcomingDropsGrid";
import { FeaturedDeal } from "../components/FeaturedDeal";
import { LiveFeed } from "../components/LiveFeed";
import { UpcomingDrops } from "../components/UpcomingDrops";
import { GamingNews } from "../components/GamingNews";
import { TopNavbar } from "../components/TopNavbar";
import { HeroSection } from "../components/HeroSection";
import { SkeletonCard } from "../components/SkeletonCard";
import { EmailSubscription } from "../components/EmailSubscription";

function InlineSubscribe() {
  const [email, setEmail] = useState("");
  const [action, setAction] = useState<"subscribe" | "unsubscribe">("subscribe");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const endpoint = action === "subscribe" ? "/api/subscribe" : "/api/unsubscribe";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setMessage(data.message);
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
      }, 4000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to submit.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#EC4899]/30 rounded-3xl p-6 text-left relative overflow-hidden w-full max-w-md mx-auto mt-10 shadow-[0_0_20px_rgba(236,72,153,0.1)] group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4899]/10 blur-[50px] mix-blend-screen pointer-events-none"></div>
      
      <h4 className="text-lg font-orbitron font-bold italic mb-1 text-[#F9FAFB] glow-text">Never miss a drop.</h4>
      <p className="text-[11px] font-poppins text-[#9CA3AF] mb-4 tracking-tight">Instant email alerts for amazing deals and limited free games.</p>
      
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-[#0A0A0B]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-10"
          >
              <span className="text-[#22C55E] mb-2"><CheckCircle2 className="w-8 h-8 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" /></span>
              <p className="text-xs text-white font-medium">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="action" 
            value="subscribe" 
            checked={action === "subscribe"} 
            onChange={() => setAction("subscribe")}
            className="accent-[#EC4899]"
          />
          <span className="text-xs font-poppins text-[#9CA3AF] group-hover:text-white transition-colors">Subscribe</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="action" 
            value="unsubscribe" 
            checked={action === "unsubscribe"} 
            onChange={() => setAction("unsubscribe")}
            className="accent-[#EF4444]"
          />
          <span className="text-xs font-poppins text-[#9CA3AF] group-hover:text-white transition-colors">Unsubscribe</span>
        </label>
      </div>

      <div className="relative">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com" 
          disabled={status === 'loading'}
          className="w-full bg-[#050816] border border-white/10 rounded-xl py-3 pl-4 pr-[100px] text-xs focus:outline-none focus:border-[#EC4899] focus:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all text-white placeholder:text-[#9CA3AF] disabled:opacity-50" 
        />
        <button 
          type="submit"
          disabled={status === 'loading' || !email}
          className={cn(
            "absolute right-2 top-2 h-8 px-4 transition-all text-[#050816] text-[10px] font-bold uppercase tracking-widest rounded-lg disabled:opacity-50",
            action === "subscribe" 
              ? "bg-[#EC4899] hover:bg-white shadow-[0_0_10px_rgba(236,72,153,0.5)]" 
              : "bg-[#EF4444] hover:bg-white text-white hover:text-[#050816]"
          )}
        >
          {status === 'loading' ? '...' : (action === "subscribe" ? 'Join' : 'Leave')}
        </button>
      </div>
      {status === 'error' && <p className="text-[#EF4444] text-[10px] mt-2 font-poppins">{message}</p>}
    </form>
  );
}

interface ClientHomeProps {
  initialActiveGames?: GameDeal[];
  initialUpcomingGames?: any[];
}

export default function App({ initialActiveGames = [], initialUpcomingGames = [] }: ClientHomeProps) {
  const pathname = usePathname() || "";
  const router = useRouter();

  const [cookieConsent, setCookieConsent] = useState(false);
  useEffect(() => { setCookieConsent(localStorage.getItem("cookieConsent") === "true"); }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setCookieConsent(true);
  };

  const [activeTab, setActiveTab] = useState<"Games" | "DLC" | "Premium" | "Upcoming">("Games");
  
  const [deals, setDeals] = useState<GameDeal[]>(initialActiveGames);
  const [upcomingDeals, setUpcomingDeals] = useState<any[]>(initialUpcomingGames);
  const [dlcDeals, setDlcDeals] = useState<GameDeal[]>([]);
  const [premiumDeals, setPremiumDeals] = useState<GameDeal[]>([]);
  const [loading, setLoading] = useState(initialActiveGames.length === 0);
  const [dlcLoading, setDlcLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<RarityLevel | 'All'>('All');
  const [sortOption, setSortOption] = useState<string>('Newest');

  const fetchDeals = async (refresh = false) => {
    try {
      if (!refresh && deals.length === 0) setLoading(true);
      else setIsRefreshing(true);
      setError(null);

      const [resGames, resUpcoming] = await Promise.all([
        fetch("/api/giveaways-feed?type=game"),
        fetch("/api/upcoming-free-games")
      ]);

      if (!resGames.ok) throw new Error("Failed to load active games");
      if (!resUpcoming.ok) throw new Error("Failed to load upcoming games");

      const gamesText = await resGames.text();
      const upcomingText = await resUpcoming.text();

      let gamesData, upcomingData;
      try { gamesData = JSON.parse(gamesText); } catch { throw new Error("Invalid games JSON"); }
      try { upcomingData = JSON.parse(upcomingText); } catch { throw new Error("Invalid upcoming JSON"); }

      // Map gamesData exactly as before
      const formattedDeals: GameDeal[] = gamesData.map((deal: any) => ({
        id: `gp_${deal.id}`,
        title: deal.title,
        description: deal.description,
        thumbnail: deal.thumbnail || deal.image,
        open_giveaway_url: deal.open_giveaway_url,
        gamerpower_url: deal.gamerpower_url,
        published_date: deal.published_date,
        type: deal.type,
        platforms: deal.platforms,
        users: deal.users,
        status: deal.status,
        worth: deal.worth,
        end_date: deal.end_date,
        instructions: deal.instructions
      }));

      setDeals(formattedDeals);
      setUpcomingDeals(upcomingData || []);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setError(err.message === 'Failed to fetch' ? 'Connection lost' : err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const sortedGamesDeals = useMemo(() => {
    let result = deals.filter(deal => {
      if (deal.end_date && deal.end_date !== 'N/A') {
         const endStr = deal.end_date.includes(' ') && !deal.end_date.includes('Z') && !deal.end_date.includes('GMT') 
           ? deal.end_date.replace(' ', 'T') + 'Z' 
           : deal.end_date;
         const endTime = new Date(endStr).getTime();
         if (!isNaN(endTime) && endTime < new Date("2026-05-20").getTime()) {
           return false;
         }
      }
      return true;
    });

    if (sortOption === 'Alphabetical') {
       result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'Expiring soon') {
       result.sort((a, b) => {
         if (a.end_date === 'N/A') return 1;
         if (b.end_date === 'N/A') return -1;
         return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
       });
    }

    return result;
  }, [deals, sortOption]);
  const activeGamesDeals = sortedGamesDeals;

  // URL-driven state sync
  const [platformSearch, setPlatformSearch] = useState("");
  const [lootSearch, setLootSearch] = useState("");
  const [premiumSearch, setPremiumSearch] = useState("");
  const [activePremiumSearch, setActivePremiumSearch] = useState("");

  // Debounce search effect for premiumSearch
  useEffect(() => {
    if (activeTab !== "Premium") return;
    
    const search = premiumSearch.trim();
    const isStore = ['steam', 'epic games', 'gog', 'humble store'].includes(search.toLowerCase());
    
    // We only want to trigger server search if it's NOT a store name and it changed
    if (!isStore && search !== activePremiumSearch) {
      const handler = setTimeout(() => {
        fetchPremium(search);
      }, 600); // 600ms debounce
      return () => clearTimeout(handler);
    }
  }, [premiumSearch, activeTab, activePremiumSearch]);

  useEffect(() => {
    const path = pathname.toLowerCase();
    
    // Auto-fetch anything if we navigated directly to a Game deal
    if (path.startsWith('/game/cs_') || path.startsWith('/game/rawg_')) {
      fetchPremium("");
    }
    
    if (path.includes('/free-steam-games')) {
      setPlatformSearch("Steam");
    } else if (path.includes('/free-epic-games')) {
      setActiveTab("Games");
      setPlatformSearch("Epic Games");
    } else if (path.includes('/free-gog-games')) {
      setActiveTab("Games");
      setPlatformSearch("GOG");
    }
  }, [pathname]);

  

  
  
  const filteredLootDeals = dlcDeals.filter(deal => {
    const search = lootSearch.toLowerCase();
    if (!search) return true;
    const matchPlatform = deal.platforms ? deal.platforms.toLowerCase().includes(search) : false;
    const matchTitle = (deal.title ? deal.title.toLowerCase().includes(search) : false) || 
                       (deal.instructions ? deal.instructions.toLowerCase().includes(search) : false);
    return matchPlatform || matchTitle;
  });

  const filteredPremiumDeals = premiumDeals.filter(deal => {
    const search = premiumSearch.toLowerCase();
    // Skip local filtering if the server has provided results for this exact query
    if (search && search === activePremiumSearch.toLowerCase()) return true;
    
    if (!search) return true;
    const isStoreName = ['steam', 'epic games', 'gog', 'humble store'].includes(search);
    if (isStoreName) {
      return deal.platforms ? deal.platforms.toLowerCase().includes(search) : false;
    }
    return (deal.title ? deal.title.toLowerCase().includes(search) : false) || 
           (deal.platforms ? deal.platforms.toLowerCase().includes(search) : false);
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);

  const fetchDlc = async () => {
    setDlcLoading(true);
    try {
      const dbRes = await fetch("/api/dlc-feed");
      if (!dbRes.ok) {
         throw new Error("Failed to load Free DLC (HTTP " + dbRes.status + ")");
      }
      const text = await dbRes.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from /api/dlc-feed"); }
      setDlcDeals(data);
    } catch (err: any) {
      const errorMessage = err.message === 'Failed to fetch' ? 'Network error: Server might be restarting. Please try again.' : err.message;
      setError(errorMessage || "Failed to load Free DLC. Please try again.");
    } finally {
      setDlcLoading(false);
    }
  };

  const fetchPremium = async (searchTitle: string = "") => {
    setPremiumLoading(true);
    setActivePremiumSearch(searchTitle);
    try {
      const url = searchTitle ? "/api/premium-feed?title=" + encodeURIComponent(searchTitle) : "/api/premium-feed";
      const cheapsharkRes = await fetch(url);
      if (!cheapsharkRes.ok) {
         throw new Error("Failed to load Premium Deals (HTTP " + cheapsharkRes.status + ")");
      }
      const text = await cheapsharkRes.text();
      let csData;
      try { csData = JSON.parse(text); } catch { throw new Error("Invalid JSON from /api/premium-feed"); }
      
      if (!Array.isArray(csData)) {
          console.warn("Cheapshark returned non-array:", csData);
          setPremiumDeals([]);
          return;
      }

      const STORE_NAMES: Record<string, string> = {
        "1": "Steam", "2": "GamersGate", "3": "GreenManGaming", "4": "Amazon",
        "5": "GameStop", "6": "Direct2Drive", "7": "GOG", "8": "Origin",
        "9": "Get Games", "10": "Shiny Loot", "11": "Humble Store", "12": "Desura",
        "13": "Uplay", "14": "IndieGameStand", "15": "Fanatical", "16": "Gamesrocket",
        "17": "Games Republic", "18": "SilaGames", "19": "Playfield", "20": "ImperialGames",
        "21": "WinGameStore", "22": "FunStockDigital", "23": "GameBillet", "24": "Voidu",
        "25": "Epic Games", "26": "Razer Game Store", "27": "Gamesplanet", "28": "Gamesload",
        "29": "2Game", "30": "IndieGala", "31": "Blizzard Shop", "32": "AllYouPlay",
        "33": "DLGamer", "34": "Noctre", "35": "DreamGame"
      };
      
        const csDeals: GameDeal[] = csData.map((cs: any) => {
          return {
            id: `cs_${cs.dealID}`,
            title: cs.title,
            worth: cs.normalPrice === "N/A" ? "N/A" : `$${cs.normalPrice}`,
            thumbnail: cs.steamAppID ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${cs.steamAppID}/header.jpg` : cs.thumb,
            image: cs.steamAppID ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${cs.steamAppID}/header.jpg` : cs.thumb,
            description: cs.type === 'Game Info' ? `Overview for ${cs.title}.` : `Get it now for $${cs.salePrice} (was $${cs.normalPrice}). Steam Rating: ${cs.steamRatingText || 'N/A'} (${cs.steamRatingPercent || 0}%)`,
            instructions: cs.type === 'Game Info' ? `Explore deals for ${cs.title}.` : "Available via digital storefronts.",
            open_giveaway_url: cs.rawg_url ? cs.rawg_url : `https://www.cheapshark.com/redirect?dealID=${cs.dealID}`,
            published_date: "N/A",
            type: cs.type ? cs.type : (cs.salePrice === "0.00" ? "Free Game" : "Discount"),
            platforms: cs.rawg_platforms || STORE_NAMES[cs.storeID] || "PC",
            end_date: "N/A",
            users: parseInt(cs.steamRatingCount) || 0,
            status: "Active",
            gamerpower_url: "",
            open_giveaway: "",
            salePrice: cs.salePrice === "N/A" ? undefined : cs.salePrice,
            normalPrice: cs.normalPrice === "N/A" ? undefined : cs.normalPrice,
            steamRatingPercent: cs.steamRatingPercent,
            steamAppID: cs.steamAppID,
          };
        });
        setPremiumDeals(csDeals.filter((d: any) => d.type === "Discount" || d.type === "Price Comparison" || d.type === "Game Info"));
    } catch (err: any) {
      const errorMessage = err.message === 'Failed to fetch' ? 'Network error: Server might be restarting. Please try again.' : err.message;
      setError(errorMessage || "Failed to load Premium Deals. Please try again.");
    } finally {
      setPremiumLoading(false);
    }
  };

  // Initial fetch and setup polling
  useEffect(() => {
    fetchDeals();

    // Auto update every 1 minute (60000 ms)
    const intervalId = setInterval(() => {
      fetchDeals(true);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (activeTab === "Premium" && premiumDeals.length === 0) {
      fetchPremium();
    } else if (activeTab === "DLC" && dlcDeals.length === 0) {
      fetchDlc();
    }
  }, [activeTab]);

  const [trackData, setTrackData] = useState<{title: string, id: string} | null>(null);

  const openShareModal = (title: string, url: string) => {
    setShareData({ title, url });
    setTrackData(null);
    setIsModalOpen(true);
  };

  const openSubscribeModal = (dealOrEvent?: any) => {
    if (dealOrEvent && dealOrEvent.title) {
       setTrackData({ title: dealOrEvent.title, id: dealOrEvent.dealID || dealOrEvent.id });
    } else {
       setTrackData(null);
    }
    setShareData(null);
    setIsModalOpen(true);
  };

  

  const scrollToDeals = () => {
    requestAnimationFrame(() => {
      document.getElementById('deals-tabs')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const goHome = () => {
    setActiveTab("Games");
    setSelectedRarity("All");
    setPlatformSearch("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goFreeGames = () => {
    setActiveTab("Games");
    setSelectedRarity("All");
    setPlatformSearch("");
    scrollToDeals();
  };

  const goFreeDlc = () => {
    setActiveTab("DLC");
    setLootSearch("");
    scrollToDeals();
  };

  const goTrending = () => {
    setActiveTab("Premium");
    setPremiumSearch("");
    scrollToDeals();
  };

  const goUpcoming = () => {
    setActiveTab("Upcoming");
    scrollToDeals();
  };

  const handleNavbarSearch = (value: string) => {
    setActiveTab("Games");
    setSelectedRarity("All");
    setPlatformSearch(value);
  };

  // Removed top level loading UI
  
  return (
    <div className="min-h-screen font-sans text-white bg-[#050505] selection:bg-[#7C3AED] selection:text-white relative">
      
      <TopNavbar
        searchValue={platformSearch}
        onSearchChange={handleNavbarSearch}
        onHomeClick={goHome}
        onFreeGamesClick={goFreeGames}
        onFreeDlcClick={goFreeDlc}
        onTrendingClick={goTrending}
        onSubscribeClick={openSubscribeModal}
        deals={activeGamesDeals}
      />

      <main className="container px-4 py-8 mx-auto max-w-7xl">
                <HeroSection 
                  onExploreClick={goFreeGames}
                  onTrendingClick={goUpcoming}
                />

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-12 mb-8 border border-rose-900/50 bg-rose-950/20 rounded-3xl">
                  <AlertCircle className="w-12 h-12 mb-4 text-rose-500" />
                  <h3 className="mb-2 text-lg font-semibold text-rose-400">Failed to load deals</h3>
                  <p className="mb-6 text-rose-500/80">{error}</p>
                  <button 
                    onClick={() => fetchDeals(true)}
                    className="flex items-center gap-2 px-4 py-2 font-medium transition-colors rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                  >
                    <RefreshCcw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              )}

              <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Tabs */}
            <div id="deals-tabs" className="flex items-center justify-between mb-8 pb-0 overflow-x-auto hide-scrollbar flex-nowrap border-b border-white/5">
              <div className="flex items-center space-x-6">
                 <button onClick={() => setActiveTab("Games")} className={cn("whitespace-nowrap pb-4 text-[11px] md:text-sm font-orbitron font-bold uppercase tracking-widest transition-all border-b-2", activeTab === "Games" ? "text-white border-[#06B6D4] text-shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "text-[#9CA3AF] border-transparent hover:text-white")}>Tactical Intel</button>
                 <button onClick={() => setActiveTab("DLC")} className={cn("whitespace-nowrap pb-4 text-[11px] md:text-sm font-orbitron font-bold uppercase tracking-widest transition-all border-b-2", activeTab === "DLC" ? "text-white border-[#06B6D4] text-shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "text-[#9CA3AF] border-transparent hover:text-white")}>Free DLC Intelligence</button>
                 <button onClick={() => setActiveTab("Premium")} className={cn("whitespace-nowrap pb-4 text-[11px] md:text-sm font-orbitron font-bold uppercase tracking-widest transition-all border-b-2", activeTab === "Premium" ? "text-white border-[#06B6D4] text-shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "text-[#9CA3AF] border-transparent hover:text-white")}>Trending Market Intel</button>
                 <button onClick={() => setActiveTab("Upcoming")} className={cn("whitespace-nowrap pb-4 text-[11px] md:text-sm font-orbitron font-bold uppercase tracking-widest transition-all border-b-2", activeTab === "Upcoming" ? "text-white border-[#06B6D4] text-shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "text-[#9CA3AF] border-transparent hover:text-white")}>Upcoming Drops</button>
              </div>
              <div className="hidden md:flex items-center gap-4 text-xs font-mono text-[#9CA3AF] px-2 tracking-widest uppercase shrink-0 pb-4">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> {deals.length + dlcDeals.length} Tracked</span>
                 <span suppressHydrationWarning><RefreshCcw className="w-3 h-3 inline pb-0.5 text-[#8B5CF6]" /> Updated {Math.floor((Date.now() - lastRefreshed.getTime()) / 60000)} mins ago</span>
              </div>
            </div>

            {activeTab === "Games" ? (
              <>
            {/* Floating Top Bar (Filters) */}
            <div className="sticky top-24 z-40 w-full mb-8 bg-[#0F172A]/90 backdrop-blur-2xl border border-white/5 rounded-2xl p-2 md:p-3 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col xl:flex-row items-center gap-4 hidden-scrollbar overflow-x-auto">
              <div className="flex items-center gap-1 w-full xl:w-auto shrink-0 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                 <Filter className="w-4 h-4 text-[#06B6D4] mr-2 shrink-0" />
                 <span className="text-[10px] font-orbitron uppercase font-bold text-[#F9FAFB] tracking-widest hidden md:inline-block mr-2 shrink-0">Filters</span>
                 
                 <button 
                   onClick={() => setSelectedRarity('All')} 
                   className={cn(
                     "px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all shrink-0",
                     selectedRarity === 'All'
                       ? "bg-[#06B6D4] border-[#06B6D4] text-[#050816] shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                       : "bg-white/5 border-white/10 text-[#9CA3AF] hover:text-white"
                   )}
                 >
                   All
                 </button>
                 
                 {(['Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'] as RarityLevel[]).filter(rarity => activeGamesDeals.some(d => getDealRarity(d).label === rarity)).map(rarity => {
                    let colors = "";
                    if (rarity === "Mythic") colors = "text-[#EC4899] border-[#EC4899]/50 bg-[#EC4899]/10 shadow-[0_0_15px_rgba(236,72,153,0.3)]";
                    if (rarity === "Legendary") colors = "text-[#F59E0B] border-[#F59E0B]/50 bg-[#F59E0B]/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
                    if (rarity === "Epic") colors = "text-[#8B5CF6] border-[#8B5CF6]/50 bg-[#8B5CF6]/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]";
                    if (rarity === "Rare") colors = "text-[#06B6D4] border-[#06B6D4]/50 bg-[#06B6D4]/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]";
                    if (rarity === "Uncommon") colors = "text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10";
                    if (rarity === "Common") colors = "text-[#9CA3AF] border-white/30 bg-white/10";
                    
                    return (
                      <button 
                        key={rarity}
                        onClick={() => setSelectedRarity(rarity)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all shrink-0",
                          selectedRarity === rarity 
                            ? colors
                            : "bg-white/5 border-white/10 text-[#9CA3AF] hover:text-white"
                        )}
                      >
                        {rarity}
                      </button>
                    );
                 })}
              </div>
              
              <div className="hidden xl:block h-6 w-px bg-white/10 shrink-0"></div>

              <div className="flex items-center gap-2 w-full xl:w-auto flex-1 px-2 lg:px-0 overflow-x-auto hide-scrollbar">
                 <div className="relative flex-1 md:max-w-[200px] shrink-0 min-w-[120px]">
                   <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                   <input 
                     type="text"
                     value={platformSearch}
                     onChange={e => setPlatformSearch(e.target.value)}
                     placeholder="Search game or platform..."
                     className="w-full bg-[#050816] border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-[11px] focus:outline-none focus:border-[#8B5CF6] transition-colors text-white placeholder:text-[#9CA3AF]"
                   />
                 </div>
                 {/* Quick platform toggles */}
                 <div className="flex gap-1 shrink-0">
                   {['All', 'Epic Games', 'Steam', 'GOG', 'Prime Gaming', 'Ubisoft Connect'].map(plat => (
                       <button
                           key={plat}
                           onClick={() => setPlatformSearch(plat === 'All' ? '' : plat)}
                           className={cn(
                               "px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0",
                               (plat === 'All' && !platformSearch) || (plat !== 'All' && platformSearch.toLowerCase() === plat.toLowerCase())
                                 ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                 : "bg-white/5 border-white/10 text-[#9CA3AF] hover:text-white"
                           )}
                       >
                           {plat}
                       </button>
                   ))}
                 </div>
                 
                 <div className="hidden xl:block h-6 w-px bg-white/10 shrink-0 mx-2"></div>
                 
                 <select 
                    value={sortOption} 
                    onChange={e => setSortOption(e.target.value)}
                    className="bg-[#050816] border border-white/10 text-[#F9FAFB] text-[10px] font-bold uppercase tracking-widest rounded-xl px-2 py-1.5 focus:outline-none focus:border-[#8B5CF6] shrink-0"
                 >
                    <option value="Newest">Newest</option>
                    <option value="Expiring soon">Expiring soon</option>
                    <option value="Alphabetical">Alphabetical</option>
                 </select>
              </div>
            </div>
            {activeGamesDeals.length > 0 && selectedRarity === 'All' && !platformSearch && (
               <FeaturedDeal deal={activeGamesDeals[0]} />
            )}
            
            <EmailSubscription />

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (() => {
              const filteredDeals = activeGamesDeals.filter((deal, idx) => {
                    // Hide the first item if it's already shown in FeaturedDeal
                    if (selectedRarity === 'All' && !platformSearch && idx === 0) return false;
                    
                    const search = platformSearch.toLowerCase();
                    const platformLower = deal.platforms ? deal.platforms.toLowerCase() : "";
                    const titleLower = deal.title ? deal.title.toLowerCase() : "";
                    const matchRarity = selectedRarity === 'All' || getDealRarity(deal).label === selectedRarity;
                    let matchPlatform = !search;
                    if (search) {
                       if (search === 'playstation') {
                          matchPlatform = platformLower.includes('playstation') || platformLower.includes('ps4') || platformLower.includes('ps5');
                       } else if (search === 'epic games') {
                          matchPlatform = platformLower.includes('epic') || platformLower.includes('epic games');
                       } else {
                          matchPlatform = platformLower.includes(search) || titleLower.includes(search);
                       }
                    }
                    return matchRarity && matchPlatform;
                  });

              if (filteredDeals.length === 0 && !error) {
                return (
                  <div className="py-16 text-center text-white/50 flex flex-col items-center">
                    <p className="mb-2 text-lg text-white">No {selectedRarity !== 'All' ? selectedRarity : 'active'} deals found right now.</p>
                    <p className="text-sm">Check back in an hour or try clearing your filters!</p>
                    {(selectedRarity !== 'All' || platformSearch !== '') && (
                      <button 
                        onClick={() => { setSelectedRarity('All'); setPlatformSearch(''); }}
                        className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors uppercase tracking-widest text-[10px] font-bold rounded"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 mb-12">
                    <AnimatePresence mode="popLayout">
                      {filteredDeals.map((deal, index) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          index={index}
                          priority={index < 4}
                          onShare={openShareModal}
                          onRemind={openSubscribeModal}
                        />
                      ))}
                    </AnimatePresence>
                  </div>


                </div>
              );
            })()}
            </>
            ) : activeTab === "DLC" ? (
              <>
             {/* Floating Top Bar (Filters) */}
             <div className="sticky top-24 z-40 w-full mb-8 bg-[#0F172A]/90 backdrop-blur-2xl border border-white/5 rounded-2xl p-2 md:p-3 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col xl:flex-row items-center gap-4 hidden-scrollbar overflow-x-auto">
               <div className="flex items-center gap-1 w-full xl:w-auto shrink-0 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                  <Filter className="w-4 h-4 text-[#06B6D4] mr-2 shrink-0" />
                  <span className="text-[10px] uppercase font-orbitron font-bold text-[#F9FAFB] tracking-widest hidden md:inline-block mr-2 shrink-0">DLC & Loot Filters</span>
               </div>
               <div className="hidden xl:block h-6 w-px bg-white/10 shrink-0"></div>
               <div className="flex items-center gap-2 w-full xl:w-auto flex-1 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                  <div className="relative flex-1 md:max-w-[300px] shrink-0 min-w-[120px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input 
                      type="text"
                      value={lootSearch}
                      onChange={e => setLootSearch(e.target.value)}
                      placeholder="Search DLC, loot or platform..."
                      className="w-full bg-[#050816] border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-[11px] focus:outline-none focus:border-[#06B6D4] transition-colors text-white placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  {/* Quick platform toggles */}
                  <div className="flex gap-1 shrink-0">
                    {['Steam', 'Epic Games', 'Xbox', 'PlayStation'].map(plat => (
                        <button
                            key={plat}
                            onClick={() => setLootSearch(plat === lootSearch ? '' : plat)}
                            className={cn(
                                "px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0",
                                lootSearch.toLowerCase() === plat.toLowerCase()
                                  ? "bg-[#06B6D4] border-[#06B6D4] text-[#050816] shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                  : "bg-white/5 border-white/10 text-[#9CA3AF] hover:text-white"
                            )}
                        >
                            {plat}
                        </button>
                    ))}
                  </div>
               </div>
             </div>
                {dlcLoading ? (
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {[...Array(6)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : filteredLootDeals.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {filteredLootDeals.map((deal, index) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          index={index}
                          priority={index < 2}
                          onShare={openShareModal}
                          onRemind={openSubscribeModal}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                   <div className="py-20 text-center text-white/50">
                     {lootSearch ? "No free DLC deals found matching your search." : "No free DLC deals found right now. Check back later!"}
                   </div>
                )}
              </>
            ) : activeTab === "Premium" ? (
              <>
             {/* Floating Top Bar (Filters) */}
             <div className="sticky top-24 z-40 w-full mb-8 bg-[#0F172A]/90 backdrop-blur-2xl border border-white/5 rounded-2xl p-2 md:p-3 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col xl:flex-row items-center gap-4 hidden-scrollbar overflow-x-auto">
               <div className="flex items-center gap-1 w-full xl:w-auto shrink-0 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                  <Filter className="w-4 h-4 text-[#06B6D4] mr-2 shrink-0" />
                  <span className="text-[10px] uppercase font-orbitron font-bold text-[#F9FAFB] tracking-widest hidden md:inline-block mr-2 shrink-0">Game Price Search</span>
               </div>
               <div className="hidden xl:block h-6 w-px bg-white/10 shrink-0"></div>
               <div className="flex items-center gap-2 w-full xl:w-auto flex-1 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                  <div className="relative flex-1 md:max-w-[300px] shrink-0 min-w-[120px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input 
                      type="text"
                      value={premiumSearch}
                      onChange={e => setPremiumSearch(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const isStore = ['steam', 'epic games', 'gog', 'humble store'].includes(premiumSearch.toLowerCase());
                          fetchPremium(isStore ? "" : premiumSearch);
                        }
                      }}
                      placeholder="Search game (Press Enter)..."
                      className="w-full bg-[#050816] border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-[11px] focus:outline-none focus:border-[#8B5CF6] transition-colors text-white placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  {/* Quick platform toggles */}
                  <div className="flex gap-1 shrink-0">
                    {['Steam', 'Epic Games', 'GOG', 'Humble Store'].map(plat => (
                        <button
                            key={plat}
                            onClick={() => {
                              const newPlat = plat === premiumSearch ? '' : plat;
                              setPremiumSearch(newPlat);
                              fetchPremium("");
                            }}
                            className={cn(
                                "px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0",
                                premiumSearch.toLowerCase() === plat.toLowerCase()
                                  ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                  : "bg-white/5 border-white/10 text-[#9CA3AF] hover:text-white"
                            )}
                        >
                            {plat}
                        </button>
                    ))}
                  </div>
               </div>
             </div>
                {premiumLoading ? (
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {[...Array(6)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : filteredPremiumDeals.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {Array.from(
                         filteredPremiumDeals.reduce((acc, deal) => {
                            const key = deal.title.toLowerCase().trim();
                            if (!acc.has(key)) acc.set(key, deal);
                            // Keep normal deal over Game Info if possible
                            else if (deal.type !== 'Game Info' && acc.get(key)!.type === 'Game Info') {
                                acc.set(key, deal);
                            }
                            return acc;
                         }, new Map<string, GameDeal>()).values()
                      ).map((deal: GameDeal, index: number) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          index={index}
                          priority={index < 2}
                          onShare={openShareModal}
                          onRemind={openSubscribeModal}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                   <div className="py-20 text-center text-white/50">
                     No premium deals found matching your search.
                   </div>
                )}
              </>
            ) : activeTab === "Upcoming" ? (
              <>
                <div className="space-y-6">
                  <UpcomingDropsGrid deals={upcomingDeals} />
                </div>
              </>
            ) : null}
            
            <div className="mt-12 pt-8 border-t border-white/10 space-y-12">
              <HistoricalPrices />
            </div>
            
            {/* Mobile / Tablet Subscribe Box */}
            <div className="xl:hidden mt-12 pt-8 border-t border-white/10">
              <InlineSubscribe />
            </div>
          </div>
          
          {/* Right Sidebar (Feeds) */}
          <aside className="xl:w-72 shrink-0 xl:sticky xl:top-24 space-y-6 mt-12 xl:mt-0 pt-8 xl:pt-0 border-t xl:border-t-0 border-white/10">
            <div id="free-games">
              <LiveFeed deals={activeGamesDeals} />
            </div>
            <UpcomingDrops deals={upcomingDeals} onViewAll={goUpcoming} />
            <div id="news">
              <GamingNews />
            </div>
            
            {/* Placeholders for header links */}
            <div id="reviews" className="hidden"></div>
            <div id="guides" className="hidden"></div>
            <div id="optimization" className="hidden"></div>
            
            <div className="pt-4 border-t border-white/10 hidden xl:block">
              <InlineSubscribe />
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 border-t border-[#06B6D4]/30 bg-[#050816]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-12 lg:py-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-[10px] uppercase font-orbitron tracking-widest font-bold text-[#9CA3AF]">
            <div className="flex flex-col gap-4">
               <span className="text-[#06B6D4] mb-2 font-black tracking-[0.2em] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">Company</span>
               <Link href="/about" className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">About Us</Link>
               <Link href="/contact" className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Contact</Link>
               <Link href="/write-for-us" className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Write For Us</Link>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-[#06B6D4] mb-2 font-black tracking-[0.2em] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">Legal Protocols</span>
               <Link href="/privacy" className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Privacy Policy</Link>
               <Link href="/terms" className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Terms & Conditions</Link>
               <Link href="/disclaimer" className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Disclaimer</Link>
               <Link href="/dmca" className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">DMCA</Link>
               <Link href="/cookie-policy" className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Cookie Policy</Link>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-[#06B6D4] mb-2 font-black tracking-[0.2em] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">Intelligence Network</span>
               <button type="button" onClick={goHome} className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Command Dashboard</button>
               <button type="button" onClick={goFreeGames} className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">All Captured Assets</button>
               <button type="button" onClick={() => {router.push('/free-steam-games')}} className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Steam Asset Map</button>
               <button type="button" onClick={() => {router.push('/free-epic-games')}} className="text-left py-1 hover:text-[#06B6D4] hover:scale-105 origin-left transition-all">Epic Games Asset Map</button>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-[#06B6D4] mb-2 font-black tracking-[0.2em] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">System Log</span>
               <div className="flex items-center gap-2 py-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  <span className="text-[#22C55E] drop-shadow-[0_0_5px_rgba(34,197,94,0.4)]">API Status: OPERATIONAL</span>
               </div>
               <div className="py-1">Extracted Nodes: <span className="text-[#F9FAFB] font-mono">{deals.length + dlcDeals.length + premiumDeals.length}</span></div>
               <div className="mt-8 pt-4 border-t border-white/10 opacity-40 font-mono tracking-tighter">© 2026 GamesDealsHub. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EmailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dealTitle={shareData?.title}
        dealUrl={shareData?.url}
        trackDeal={trackData}
      />

      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 w-full z-[100] p-4 bg-[#0F172A]/90 border-t border-[#8B5CF6]/30 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Info className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]" />
              <p className="text-sm font-poppins text-[#9CA3AF]">
                System utilizes trace files (cookies) to secure operations, analyze bandwidth, and maintain user preferences. Continued link implies protocol acceptance.
                <Link href="/privacy" className="text-[#06B6D4] hover:text-[#F9FAFB] hover:underline hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] ml-1 transition-all">Review Protocol</Link>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={acceptCookies} 
                className="bg-[#06B6D4] hover:bg-[#F9FAFB] text-[#050816] px-6 py-2.5 rounded-xl text-xs font-orbitron font-bold tracking-widest transition-all uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              >
                Accept Line
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







