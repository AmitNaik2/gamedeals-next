import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, RefreshCw, AlertCircle, RefreshCcw, CheckCircle2, Search, Filter } from "lucide-react";
import { DealCard } from "./components/DealCard";
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
  const [platformSearch, setPlatformSearch] = useState("");
  const [lootSearch, setLootSearch] = useState("");
  const [premiumSearch, setPremiumSearch] = useState("");
  
  const filteredLootDeals = dlcDeals.filter(deal => 
    deal.title.toLowerCase().includes(lootSearch.toLowerCase()) || 
    deal.instructions.toLowerCase().includes(lootSearch.toLowerCase())
  );

  const filteredPremiumDeals = premiumDeals.filter(deal => 
    deal.title.toLowerCase().includes(premiumSearch.toLowerCase())
  );
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);

  const fetchDeals = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    
    try {
      const gamerpowerRes = await fetch("/api/deals");
      
      if (!gamerpowerRes.ok) {
         throw new Error("Game deals server is temporarily blocking our requests (Error " + gamerpowerRes.status + "). Please try again later.");
      }
      
      let allDeals: GameDeal[] = [];
      const text = await gamerpowerRes.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from /api/deals"); }
      if (data.status !== 0 && Array.isArray(data)) {
        allDeals = data.filter((d: any) => d.type === "Game" || d.type === "Early Access");
      }

      setDeals(allDeals);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load deals. Please try again.");
    } finally {
      if (showRefreshIndicator) setIsRefreshing(false);
      setLoading(false);
    }
  };

  const fetchDlc = async () => {
    setDlcLoading(true);
    try {
      const dbRes = await fetch("/api/loot");
      if (!dbRes.ok) {
         throw new Error(`Failed to load Free DLC (HTTP ${dbRes.status})`);
      }
      const text = await dbRes.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from /api/loot"); }
      setDlcDeals(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load Free DLC. Please try again.");
    } finally {
      setDlcLoading(false);
    }
  };

  const fetchPremium = async () => {
    setPremiumLoading(true);
    try {
      const cheapsharkRes = await fetch("/api/cheapshark-deals");
      if (!cheapsharkRes.ok) {
         throw new Error(`Failed to load Premium Deals (HTTP ${cheapsharkRes.status})`);
      }
      const text = await cheapsharkRes.text();
      let csData;
      try { csData = JSON.parse(text); } catch { throw new Error("Invalid JSON from /api/cheapshark-deals"); }
        const csDeals: GameDeal[] = csData.map((cs: any) => ({
          id: `cs_${cs.dealID}`,
          title: cs.title,
          worth: `$${cs.normalPrice}`,
          thumbnail: cs.steamAppID ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${cs.steamAppID}/header.jpg` : cs.thumb,
          image: cs.steamAppID ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${cs.steamAppID}/header.jpg` : cs.thumb,
          description: `Get it now for $${cs.salePrice} (was $${cs.normalPrice}). Steam Rating: ${cs.steamRatingText} (${cs.steamRatingPercent}%)`,
          instructions: "Available via CheapShark deal.",
          open_giveaway_url: `https://www.cheapshark.com/redirect?dealID=${cs.dealID}`,
          published_date: "N/A",
          type: cs.salePrice === "0.00" ? "Free Game" : "Discount",
          platforms: "PC",
          end_date: "N/A",
          users: parseInt(cs.steamRatingCount) || 0,
          status: "Active",
          gamerpower_url: "",
          open_giveaway: "",
          salePrice: cs.salePrice,
          normalPrice: cs.normalPrice,
          steamRatingPercent: cs.steamRatingPercent,
          steamAppID: cs.steamAppID,
        }));
        setPremiumDeals(csDeals.filter((d: any) => d.type === "Discount"));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load Premium Deals. Please try again.");
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

  // UI for loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0B] text-[#7C3AED]">
        <motion.div
           animate={{ rotate: 360, scale: [1, 1.1, 1] }}
           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gamepad2 className="w-16 h-16 mb-4" />
        </motion.div>
        <h2 className="text-xl font-bold font-sans tracking-tight text-[#E0E0E0]">Finding the best deals...</h2>
      </div>
    );
  }

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
      />

      <main className="container px-4 py-8 mx-auto max-w-7xl">
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
                 
                 {(['Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'] as RarityLevel[]).map(rarity => {
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
            {deals.length > 0 && selectedRarity === 'All' && !platformSearch && (
               <FeaturedDeal deal={deals[0]} />
            )}

            <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {deals
                  .filter((deal, idx) => {
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
                  })
                  .map((deal, index) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    index={index}
                    onShare={openShareModal}
                    onRemind={openSubscribeModal}
                  />
                ))}
              </AnimatePresence>
            </div>

            {deals.length === 0 && !loading && !error && (
              <div className="py-20 text-center text-white/50">
                No active deals found right now. Check back later!
              </div>
            )}
            </>
            ) : activeTab === "DLC" ? (
              <>
                <div className="sticky top-24 z-40 w-full mb-8 bg-black/60 backdrop-blur-2xl border border-[#7C3AED]/30 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-4">
                  <div className="text-sm text-[#7C3AED] uppercase font-bold tracking-widest pl-2 whitespace-nowrap hidden md:block">
                    Free DLC
                  </div>
                  <div className="relative flex-1 w-full">
                     <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7C3AED]" />
                     <input 
                       type="text"
                       value={lootSearch}
                       onChange={e => setLootSearch(e.target.value)}
                       placeholder="Search free DLC and loot..."
                       className="w-full bg-white/5 border border-[#7C3AED]/30 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-colors text-white placeholder:text-white/30"
                     />
                   </div>
                </div>
                {dlcLoading ? (
                   <div className="flex flex-col items-center justify-center py-20 text-[#7C3AED]">
                      <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest text-white/50">Loading Free DLCs...</p>
                   </div>
                ) : filteredLootDeals.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {filteredLootDeals.map((deal, index) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          index={index}
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
                 <div className="sticky top-24 z-40 w-full mb-8 bg-black/60 backdrop-blur-2xl border border-[#7C3AED]/30 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-4">
                  <div className="text-sm text-[#7C3AED] uppercase font-bold tracking-widest pl-2 whitespace-nowrap hidden md:block">
                    Top Deals
                  </div>
                  <div className="relative flex-1 w-full">
                     <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7C3AED]" />
                     <input 
                       type="text"
                       value={premiumSearch}
                       onChange={e => setPremiumSearch(e.target.value)}
                       placeholder="Search premium deals..."
                       className="w-full bg-white/5 border border-[#7C3AED]/30 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-colors text-white placeholder:text-white/30"
                     />
                  </div>
                 </div>
                {premiumLoading ? (
                   <div className="flex flex-col items-center justify-center py-20 text-[#7C3AED]">
                      <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest text-white/50">Loading Premium Deals...</p>
                   </div>
                ) : filteredPremiumDeals.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-1 xl:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {filteredPremiumDeals.map((deal, index) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          index={index}
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
          <aside className="hidden xl:block w-72 shrink-0 xl:sticky xl:top-24 space-y-6">
            <LiveFeed deals={deals} />
            <UpcomingDrops deals={deals} onViewAll={goFreeGames} />
            <GamingNews />
            <div className="pt-4 border-t border-white/10">
              <InlineSubscribe />
            </div>
          </aside>
        </div>
      </main>

      <footer className="h-[60px] px-4 md:px-10 border-t border-white/10 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-bold text-white/30 max-w-7xl mx-auto w-full mt-10">
          <div className="flex gap-6">
              <button type="button" onClick={openSubscribeModal} className="hover:text-white transition-colors">Discord</button>
              <button type="button" onClick={() => openExternalUrl("https://x.com/search?q=free%20game%20deals")} className="hover:text-white transition-colors">Twitter / X</button>
              <button type="button" onClick={() => openExternalUrl("/api/deals")} className="hover:text-white transition-colors">API Access</button>
          </div>
          <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse"></span>
              <span>System Stable // Live</span>
          </div>
      </footer>

      {/* Modals */}
      <EmailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dealTitle={shareData?.title}
        dealUrl={shareData?.url}
      />
    </div>
  );
}
