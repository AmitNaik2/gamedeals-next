import { useState, useEffect, type FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, RefreshCw, AlertCircle, RefreshCcw, CheckCircle2, Search, Filter, Info } from "lucide-react";
import { Routes, Route, useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { DealCard } from "./components/DealCard";
import { CompareCard } from "./components/CompareCard";
import { GameDetail } from "./components/GameDetail";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { AboutUs } from "./components/AboutUs";
import { ContactUs } from "./components/ContactUs";
import { ArticleComparison } from "./components/ArticleComparison";
import { Admin } from "./components/Admin";
import { EmailModal } from "./components/EmailModal";
import { type GameDeal } from "./types";
import { getDealRarity, type RarityLevel } from "./lib/deal-utils";
import { cn, openExternalUrl } from "./lib/utils";
import { FeaturedDeal } from "./components/FeaturedDeal";
import { LiveFeed } from "./components/LiveFeed";
import { UpcomingDrops } from "./components/UpcomingDrops";
import { GamingNews } from "./components/GamingNews";
import { TopNavbar } from "./components/TopNavbar";
import { HeroSection } from "./components/HeroSection";
import { SkeletonCard } from "./components/SkeletonCard";

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
    <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left relative overflow-hidden w-full max-w-md mx-auto mt-10">
      <h4 className="text-lg font-serif italic mb-1 text-white">Never miss a drop.</h4>
      <p className="text-[11px] text-white/40 mb-4 tracking-tight">Instant email alerts for amazing deals and limited free games.</p>
      
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-[#0A0A0B]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-10"
          >
              <span className="text-[#7C3AED] mb-2"><CheckCircle2 className="w-8 h-8" /></span>
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
            className="accent-[#7C3AED]"
          />
          <span className="text-xs text-white/70">Subscribe</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="action" 
            value="unsubscribe" 
            checked={action === "unsubscribe"} 
            onChange={() => setAction("unsubscribe")}
            className="accent-rose-500"
          />
          <span className="text-xs text-white/70">Unsubscribe</span>
        </label>
      </div>

      <div className="relative">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com" 
          disabled={status === 'loading'}
          className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-[100px] text-xs focus:outline-none focus:border-[#7C3AED] transition-colors text-white placeholder:text-white/30 disabled:opacity-50" 
        />
        <button 
          type="submit"
          disabled={status === 'loading' || !email}
          className={cn(
            "absolute right-2 top-2 h-8 px-4 transition-colors text-white text-[10px] font-bold uppercase tracking-widest rounded disabled:opacity-50",
            action === "subscribe" 
              ? "bg-[#7C3AED] hover:bg-white hover:text-black" 
              : "bg-rose-500 hover:bg-rose-600"
          )}
        >
          {status === 'loading' ? '...' : (action === "subscribe" ? 'Join' : 'Leave')}
        </button>
      </div>
      {status === 'error' && <p className="text-rose-500 text-[10px] mt-2">{message}</p>}
    </form>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cookieConsent, setCookieConsent] = useState(() => {
    return localStorage.getItem("cookieConsent") === "true";
  });

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setCookieConsent(true);
  };

  const [activeTab, setActiveTab] = useState<"Games" | "DLC" | "Premium">("Games");
  
  const [deals, setDeals] = useState<GameDeal[]>([]); // This will just be Free Games now
  const [dlcDeals, setDlcDeals] = useState<GameDeal[]>([]);
  const [premiumDeals, setPremiumDeals] = useState<GameDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dlcLoading, setDlcLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<RarityLevel | 'All'>('All');
  
  const activeGamesDeals = useMemo(() => {
    return deals.filter(deal => {
      // Force hide deals expiring before May 20, 2026
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
  }, [deals]);

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
    const path = location.pathname.toLowerCase();
    
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
  }, [location.pathname]);

  const seoTitle = useMemo(() => {
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
    const path = location.pathname.toLowerCase();
    
    if (path.includes('/free-steam-games')) return `Active Free Steam Games & Keys – ${monthYear} | GamesDealsHub`;
    if (path.includes('/free-epic-games')) return `Epic Games Giveaways & Freebies Today – ${monthYear} | GamesDealsHub`;
    if (path.includes('/free-gog-games')) return `GOG DRM-Free Giveaways – ${monthYear} | GamesDealsHub`;
    return `GamesDealsHub | Active Free PC Games & Giveaways - ${monthYear}`;
  }, [location.pathname]);

  const seoDescription = useMemo(() => {
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
    const totalDeals = deals.length + dlcDeals.length + premiumDeals.length;
    const dealCountText = totalDeals > 0 ? totalDeals : "100+";
    return `Get access to ${dealCountText} active game deals updated every hour. Track and claim free PC games before they expire. Steam, Epic Games, and GOG giveaways for ${monthYear}.`;
  }, [deals.length, dlcDeals.length, premiumDeals.length]);
  
  const filteredLootDeals = dlcDeals.filter(deal => {
    const search = lootSearch.toLowerCase();
    if (!search) return true;
    const matchPlatform = deal.platforms.toLowerCase().includes(search);
    const matchTitle = deal.title.toLowerCase().includes(search) || deal.instructions.toLowerCase().includes(search);
    return matchPlatform || matchTitle;
  });

  const filteredPremiumDeals = premiumDeals.filter(deal => {
    const search = premiumSearch.toLowerCase();
    // Skip local filtering if the server has provided results for this exact query
    if (search && search === activePremiumSearch.toLowerCase()) return true;
    
    if (!search) return true;
    const isStoreName = ['steam', 'epic games', 'gog', 'humble store'].includes(search);
    if (isStoreName) {
      return deal.platforms.toLowerCase().includes(search);
    }
    return deal.title.toLowerCase().includes(search) || deal.platforms.toLowerCase().includes(search);
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);

  const fetchDeals = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    if (deals.length === 0) setLoading(true);
    setError(null);
    
    try {
      const gamerpowerRes = await fetch("/api/giveaways-feed");
      
      if (!gamerpowerRes.ok) {
         throw new Error("Game deals server is temporarily blocking our requests (Error " + gamerpowerRes.status + "). Please try again later.");
      }
      
      let allDeals: GameDeal[] = [];
      const text = await gamerpowerRes.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from /api/giveaways-feed"); }
      if (data.status !== 0 && Array.isArray(data)) {
        allDeals = data.filter((d: any) => d.type === "Game" || d.type === "Early Access");
      }

      setDeals(allDeals);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message === 'Failed to fetch' ? 'Network error: Server might be restarting. Please try again.' : err.message;
      setError(errorMessage || "Failed to load deals. Please try again.");
    } finally {
      if (showRefreshIndicator) setIsRefreshing(false);
      setLoading(false);
    }
  };

  const fetchDlc = async () => {
    setDlcLoading(true);
    try {
      const dbRes = await fetch("/api/dlc-feed");
      if (!dbRes.ok) {
         throw new Error(`Failed to load Free DLC (HTTP ${dbRes.status})`);
      }
      const text = await dbRes.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from /api/dlc-feed"); }
      setDlcDeals(data);
    } catch (err: any) {
      console.error(err);
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
      const url = searchTitle ? `/api/premium-feed?title=${encodeURIComponent(searchTitle)}` : `/api/premium-feed`;
      const cheapsharkRes = await fetch(url);
      if (!cheapsharkRes.ok) {
         throw new Error(`Failed to load Premium Deals (HTTP ${cheapsharkRes.status})`);
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
      
        const csDeals: GameDeal[] = csData.map((cs: any) => ({
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
        }));
        setPremiumDeals(csDeals.filter((d: any) => d.type === "Discount" || d.type === "Price Comparison" || d.type === "Game Info"));
    } catch (err: any) {
      console.error(err);
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

  const openShareModal = (title: string, url: string) => {
    setShareData({ title, url });
    setIsModalOpen(true);
  };

  const openSubscribeModal = () => {
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

  const handleNavbarSearch = (value: string) => {
    setActiveTab("Games");
    setSelectedRarity("All");
    setPlatformSearch(value);
  };

  // Removed top level loading UI
  
  return (
    <div className="min-h-screen font-sans text-white bg-[#050505] selection:bg-[#7C3AED] selection:text-white relative">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <link rel="canonical" href={`https://www.gamesdealshub.me${location.pathname}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": deals.slice(0, 20).map((deal: any, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": deal.title,
                "url": `https://www.gamesdealshub.me/game/${deal.id}`,
                "image": deal.image || deal.thumbnail,
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.5",
                  "reviewCount": "89"
                },
                "review": {
                  "@type": "Review",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5"
                  },
                  "author": {
                    "@type": "Person",
                    "name": "Amit Naik"
                  }
                },
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "USD",
                  "price": "0.00",
                  "availability": "https://schema.org/InStock",
                  "itemCondition": "https://schema.org/NewCondition"
                }
              }
            }))
          })}
        </script>
      </Helmet>
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
        <Routes>
          {["/", "/free-steam-games", "/free-epic-games", "/free-gog-games"].map(path => (
            // @ts-expect-error key is allowed in React
            <Route key={path} path={path} element={
              <>
                <HeroSection 
                  onExploreClick={goFreeGames}
                  onTrendingClick={goTrending}
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
            <div id="deals-tabs" className="flex items-center space-x-2 mb-6 border-b border-white/10 pb-0 overflow-x-auto hide-scrollbar flex-nowrap">
               <button onClick={() => setActiveTab("Games")} className={cn("whitespace-nowrap px-6 py-3 text-[11px] md:text-xs font-bold uppercase tracking-widest transition-colors border-b-2", activeTab === "Games" ? "text-white border-[#7C3AED] bg-white/5" : "text-white/40 border-transparent hover:text-white/80 hover:bg-white/5")}>Free Games</button>
               <button onClick={() => setActiveTab("DLC")} className={cn("whitespace-nowrap px-6 py-3 text-[11px] md:text-xs font-bold uppercase tracking-widest transition-colors border-b-2", activeTab === "DLC" ? "text-white border-[#7C3AED] bg-white/5" : "text-white/40 border-transparent hover:text-white/80 hover:bg-white/5")}>Free DLC</button>
               <button onClick={() => setActiveTab("Premium")} className={cn("whitespace-nowrap px-6 py-3 text-[11px] md:text-xs font-bold uppercase tracking-widest transition-colors border-b-2", activeTab === "Premium" ? "text-white border-[#7C3AED] bg-white/5" : "text-white/40 border-transparent hover:text-white/80 hover:bg-white/5")}>Premium Deals</button>
            </div>

            {activeTab === "Games" ? (
              <>
            {/* Floating Top Bar (Filters) */}
            <div className="sticky top-24 z-40 w-full mb-8 bg-black/60 backdrop-blur-2xl border border-[#7C3AED]/30 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col xl:flex-row items-center gap-4 hidden-scrollbar overflow-x-auto">
              <div className="flex items-center gap-1 w-full xl:w-auto shrink-0 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                 <Filter className="w-4 h-4 text-[#7C3AED] mr-2 shrink-0" />
                 <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest hidden md:inline-block mr-2 shrink-0">Filters</span>
                 
                 <button 
                   onClick={() => setSelectedRarity('All')} 
                   className={cn(
                     "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all shrink-0",
                     selectedRarity === 'All'
                       ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg" 
                       : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                   )}
                 >
                   All
                 </button>
                 
                 {(['Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'] as RarityLevel[]).filter(rarity => activeGamesDeals.some(d => getDealRarity(d).label === rarity)).map(rarity => {
                    let colors = "";
                    if (rarity === "Mythic") colors = "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 border-pink-500/50 bg-white/5 shadow-[0_0_15px_rgba(236,72,153,0.3)]";
                    if (rarity === "Legendary") colors = "text-amber-400 border-amber-400/50 bg-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.2)]";
                    if (rarity === "Epic") colors = "text-[#7C3AED] border-[#7C3AED]/50 bg-[#7C3AED]/20 shadow-[0_0_15px_rgba(124,58,237,0.2)]";
                    if (rarity === "Rare") colors = "text-blue-400 border-blue-400/50 bg-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.2)]";
                    if (rarity === "Uncommon") colors = "text-green-400 border-green-400/30 bg-green-400/10";
                    if (rarity === "Common") colors = "text-white/80 border-white/30 bg-white/10";
                    
                    return (
                      <button 
                        key={rarity}
                        onClick={() => setSelectedRarity(rarity)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all shrink-0",
                          selectedRarity === rarity 
                            ? colors
                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
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
                   <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                   <input 
                     type="text"
                     value={platformSearch}
                     onChange={e => setPlatformSearch(e.target.value)}
                     placeholder="Search game or platform..."
                     className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-[11px] focus:outline-none focus:border-[#7C3AED] transition-colors text-white placeholder:text-white/30"
                   />
                 </div>
                 {/* Quick platform toggles */}
                 <div className="flex gap-1 shrink-0">
                   {['Steam', 'Epic Games', 'Xbox', 'PlayStation'].map(plat => (
                       <button
                           key={plat}
                           onClick={() => setPlatformSearch(plat === platformSearch ? '' : plat)}
                           className={cn(
                               "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0",
                               platformSearch.toLowerCase() === plat.toLowerCase()
                                 ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg"
                                 : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                           )}
                       >
                           {plat}
                       </button>
                   ))}
                 </div>
              </div>
            </div>
            {activeGamesDeals.length > 0 && selectedRarity === 'All' && !platformSearch && (
               <FeaturedDeal deal={activeGamesDeals[0]} />
            )}

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
                    const platformLower = deal.platforms.toLowerCase();
                    const titleLower = deal.title.toLowerCase();
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

                  {/* History Section for Expired Deals */}
                  {selectedRarity === 'All' && !platformSearch && (
                    <div className="mt-16 border-t border-white/10 pt-12">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-bold font-serif italic text-white flex items-center gap-2">
                            <span className="text-[#7C3AED]">Past</span> Giveaways
                          </h3>
                          <p className="text-sm text-white/50">Look at what you missed! Don't let it happen again.</p>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock historical deals */}
                        {['Grand Theft Auto V', 'Death Stranding', 'Fallout: New Vegas'].map((title, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/10 rounded flex-shrink-0 flex items-center justify-center">
                              <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest text-center px-1">Expired</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm line-clamp-1">{title}</h4>
                              <p className="text-[10px] uppercase text-[#7C3AED] font-bold tracking-widest mt-1">Epic Games</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            </>
            ) : activeTab === "DLC" ? (
              <>
             {/* Floating Top Bar (Filters) */}
             <div className="sticky top-24 z-40 w-full mb-8 bg-black/60 backdrop-blur-2xl border border-[#7C3AED]/30 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col xl:flex-row items-center gap-4 hidden-scrollbar overflow-x-auto">
               <div className="flex items-center gap-1 w-full xl:w-auto shrink-0 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                  <Filter className="w-4 h-4 text-[#7C3AED] mr-2 shrink-0" />
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest hidden md:inline-block mr-2 shrink-0">DLC & Loot Filters</span>
               </div>
               <div className="hidden xl:block h-6 w-px bg-white/10 shrink-0"></div>
               <div className="flex items-center gap-2 w-full xl:w-auto flex-1 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                  <div className="relative flex-1 md:max-w-[300px] shrink-0 min-w-[120px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                      type="text"
                      value={lootSearch}
                      onChange={e => setLootSearch(e.target.value)}
                      placeholder="Search DLC, loot or platform..."
                      className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-[11px] focus:outline-none focus:border-[#7C3AED] transition-colors text-white placeholder:text-white/30"
                    />
                  </div>
                  {/* Quick platform toggles */}
                  <div className="flex gap-1 shrink-0">
                    {['Steam', 'Epic Games', 'Xbox', 'PlayStation'].map(plat => (
                        <button
                            key={plat}
                            onClick={() => setLootSearch(plat === lootSearch ? '' : plat)}
                            className={cn(
                                "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0",
                                lootSearch.toLowerCase() === plat.toLowerCase()
                                  ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg"
                                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
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
             <div className="sticky top-24 z-40 w-full mb-8 bg-black/60 backdrop-blur-2xl border border-[#7C3AED]/30 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col xl:flex-row items-center gap-4 hidden-scrollbar overflow-x-auto">
               <div className="flex items-center gap-1 w-full xl:w-auto shrink-0 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                  <Filter className="w-4 h-4 text-[#7C3AED] mr-2 shrink-0" />
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest hidden md:inline-block mr-2 shrink-0">Game Price Search</span>
               </div>
               <div className="hidden xl:block h-6 w-px bg-white/10 shrink-0"></div>
               <div className="flex items-center gap-2 w-full xl:w-auto flex-1 px-2 lg:px-0 lg:ml-2 overflow-x-auto hide-scrollbar">
                  <div className="relative flex-1 md:max-w-[300px] shrink-0 min-w-[120px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
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
                      className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-[11px] focus:outline-none focus:border-[#7C3AED] transition-colors text-white placeholder:text-white/30"
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
                                "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0",
                                premiumSearch.toLowerCase() === plat.toLowerCase()
                                  ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg"
                                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
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
            ) : null}
            
            {/* Mobile / Tablet Subscribe Box */}
            <div className="xl:hidden mt-12 pt-8 border-t border-white/10">
              <InlineSubscribe />
            </div>
          </div>
          
          {/* Right Sidebar (Feeds) */}
          <aside className="xl:w-72 shrink-0 xl:sticky xl:top-24 space-y-6 mt-12 xl:mt-0 pt-8 xl:pt-0 border-t xl:border-t-0 border-white/10">
            <LiveFeed deals={activeGamesDeals} />
            <UpcomingDrops deals={activeGamesDeals} onViewAll={goFreeGames} />
            <GamingNews />
            <div className="pt-4 border-t border-white/10 hidden xl:block">
              <InlineSubscribe />
            </div>
          </aside>
        </div>
            </>
          } />
          ))}
          <Route path="/game/:id" element={<GameDetail deals={[...deals, ...dlcDeals, ...premiumDeals]} isLoading={loading || dlcLoading || premiumLoading} />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/article/hp-omen-16-vs-lenovo-loq" element={<ArticleComparison />} />
          <Route path="/admin" element={<Admin deals={[...deals, ...dlcDeals, ...premiumDeals]} />} />
        </Routes>
      </main>

      <footer className="mt-20 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-[10px] uppercase tracking-widest font-bold text-white/50">
            <div className="flex flex-col gap-4">
               <span className="text-[#7C3AED] mb-2 font-black tracking-[0.2em]">Platform</span>
               <button type="button" onClick={goHome} className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">Home</button>
               <button type="button" onClick={goFreeGames} className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">All Free Games</button>
               <button type="button" onClick={() => {navigate('/free-steam-games')}} className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">Free Steam Games</button>
               <button type="button" onClick={() => {navigate('/free-epic-games')}} className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">Epic Games Giveaways</button>
            </div>
             <div className="flex flex-col gap-4">
               <span className="text-[#7C3AED] mb-2 font-black tracking-[0.2em]">Legal</span>
               <Link to="/terms" className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">Terms of Service</Link>
               <Link to="/privacy" className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">Privacy Policy</Link>
               <Link to="/privacy" className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">Cookie Policy</Link>
            </div>
             <div className="flex flex-col gap-4">
               <span className="text-[#7C3AED] mb-2 font-black tracking-[0.2em]">Connect</span>
               <button type="button" onClick={() => openExternalUrl("https://discord.com")} className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">Discord</button>
               <button type="button" onClick={() => openExternalUrl("https://github.com")} className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">GitHub</button>
               <Link to="/contact" className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">Contact Us</Link>
               <Link to="/about" className="text-left py-1 hover:text-white hover:translate-x-1 transition-all">About Us</Link>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-[#7C3AED] mb-2 font-black tracking-[0.2em]">System</span>
               <div className="flex items-center gap-2 py-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse glow-green"></span>
                  <span className="text-green-500">API Status: Normal</span>
               </div>
               <div className="py-1">Active Deals: <span className="text-white">{deals.length + dlcDeals.length + premiumDeals.length}</span></div>
               <div className="mt-8 pt-4 border-t border-white/10 opacity-40">© 2026 GamesDealsHub</div>
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
      />

      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 w-full z-[100] p-4 bg-black/90 border-t border-[#7C3AED]/30 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Info className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
              <p className="text-sm text-white/70">
                We use cookies to ensure you get the best experience on our website, personalize content, and analyze our traffic. By continuing to use our site, you accept our use of cookies.
                <Link to="/privacy" className="text-[#7C3AED] hover:text-white underline ml-1">Learn more</Link>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={acceptCookies} 
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-colors uppercase"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
