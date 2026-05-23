import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { type GameDeal } from "../types";
import { ArrowLeft, Gamepad2, Info, LayoutTemplate, Monitor, Image as ImageIcon, Video, Heart, Share2, Check, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { generateUniqueSummary, generateTags } from "../lib/text-utils";
import { Countdown } from "./Countdown";
import { useIgdb } from "../hooks/useIgdb";

import { cn } from "../lib/utils";

export function GameDetail({ deals, isLoading }: { deals: GameDeal[], isLoading?: boolean }) {
  const { id } = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<GameDeal | null>(null);
  const [activeReqTab, setActiveReqTab] = useState<"min" | "rec">("min");

  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (deals.length > 0) {
      const found = deals.find((d) => String(d.id) === id || decodeURIComponent(String(d.id)) === id);
      if (found) setDeal(found);
    }
  }, [id, deals]);

  useEffect(() => {
    setSelectedMediaIndex(0);
    setIsPlaying(false);
  }, [deal]);

  const gameInfo = useIgdb(deal?.title || "");

  // Construct the gallery items
  const mediaItems: Array<{ type: 'image' | 'video' | 'youtube'; url: string; thumbnail: string }> = [];

  if (deal) {
    // 1. Add video trailers first to put them in the spotlight if available!
    if (gameInfo && gameInfo.gallery && Array.isArray(gameInfo.gallery)) {
      // Add videos/youtube items first
      gameInfo.gallery.forEach((item: any) => {
        if (item.type === 'video' || item.type === 'youtube') {
          mediaItems.push({
            type: item.type,
            url: item.url,
            thumbnail: item.thumbnail || deal.thumbnail || deal.image
          });
        }
      });
    }

    // 2. Add main image/thumbnail if available
    if (deal.image || deal.thumbnail) {
      const mainImgUrl = deal.image || deal.thumbnail;
      const mainThumbUrl = deal.thumbnail || deal.image;
      // Deduplicate
      if (!mediaItems.some(item => item.url === mainImgUrl)) {
        mediaItems.push({
          type: 'image',
          url: mainImgUrl,
          thumbnail: mainThumbUrl
        });
      }
    }

    // 3. Add other screenshot images from gameInfo.gallery
    if (gameInfo && gameInfo.gallery && Array.isArray(gameInfo.gallery)) {
      gameInfo.gallery.forEach((item: any) => {
        if (item.type === 'image') {
          if (!mediaItems.some(existing => existing.url === item.url)) {
            mediaItems.push({
              type: 'image',
              url: item.url,
              thumbnail: item.thumbnail
            });
          }
        }
      });
    }

    // If we still have nothing, add a placeholder
    if (mediaItems.length === 0) {
      mediaItems.push({
        type: 'image',
        url: deal.thumbnail,
        thumbnail: deal.thumbnail
      });
    }
  }

  const selectedMediaItem = mediaItems[selectedMediaIndex] || mediaItems[0];

  const handlePrevLightbox = () => {
    setLightboxIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNextLightbox = () => {
    setLightboxIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrevLightbox();
      if (e.key === "ArrowRight") handleNextLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, mediaItems.length]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    
    if (tabId === "gameplay") {
      // Find the first video or youtube item in mediaItems
      const firstVideoIdx = mediaItems.findIndex(item => item.type === 'video' || item.type === 'youtube');
      if (firstVideoIdx !== -1) {
        setSelectedMediaIndex(firstVideoIdx);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      const element = document.getElementById("screens");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (tabId === "screens") {
      // If screenshots clicked, make sure we show first image if we were playing video
      const firstImgIdx = mediaItems.findIndex(item => item.type === 'image');
      if (firstImgIdx !== -1) {
        setSelectedMediaIndex(firstImgIdx);
      }
      setIsPlaying(false);
      const element = document.getElementById("screens");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  if (!deal && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Deal Not Found</h2>
        <button onClick={() => router.push("/")} className="text-[#8B5CF6] hover:underline">
          Return to Home
        </button>
      </div>
    );
  }

  if (isLoading || !deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-[#8B5CF6] rounded-full animate-spin"></div>
      </div>
    );
  }

  const tags = generateTags(deal.title, deal.platforms, deal.type, deal.description);
  const rewrittenSummary = generateUniqueSummary(deal.title, deal.description, deal.type, deal.platforms);
  
  // Custom styled countdown component for the header
  const renderCountdown = () => {
     if (deal.end_date === "N/A") return <div className="text-sm font-bold text-slate-300">Unknown</div>;
     
     // Very simple static fallback for UI structure. We use the existing Countdown class for logic.
     return (
       <div className="flex gap-2">
          <Countdown endDate={deal.end_date} className="" styleType="boxes" />
       </div>
     );
  }

  const isSteam = deal.platforms.toLowerCase().includes("steam");

  let developerName = "Unknown Studio";
  let publisherName = "Unknown Studio";

  if (gameInfo && !gameInfo.not_found && !gameInfo.error) {
    if (gameInfo.involved_companies && Array.isArray(gameInfo.involved_companies) && gameInfo.involved_companies.length > 0) {
      const devs = gameInfo.involved_companies.filter((c: any) => c.developer && c.company).map((c: any) => c.company.name);
      if (devs.length > 0) developerName = devs.join(', ');
      
      const pubs = gameInfo.involved_companies.filter((c: any) => c.publisher && c.company).map((c: any) => c.company.name);
      if (pubs.length > 0) publisherName = pubs.join(', ');
    }
    
    // Explicitly check gameInfo.developers if devs/pubs are still unknown because maybe RAWG provided them
    if (developerName === "Unknown Studio" || publisherName === "Unknown Studio") {
      if (gameInfo.developers && Array.isArray(gameInfo.developers)) {
        const devs = gameInfo.developers.map((d: any) => d.name);
        if (devs.length > 0) developerName = devs.join(', ');
      }
      if (gameInfo.publishers && Array.isArray(gameInfo.publishers)) {
         const pubs = gameInfo.publishers.map((p: any) => p.name);
         if (pubs.length > 0) publisherName = pubs.join(', ');
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-white font-sans p-4 lg:p-8 animate-in fade-in duration-500">

      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-6">
          <span>&gt;</span>
          <Link href="/free-steam-games" className="hover:text-white">Free Games</Link>
          <span>&gt;</span>
          <span className="text-white">{deal.title} ({deal.platforms}) Giveaway</span>
        </div>

        {/* Header Section */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-8 mb-6">
          {/* Cover Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-2xl">
            <img src={deal.thumbnail} alt={deal.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-400 to-green-500 text-[#070A11] px-3 py-1 text-xs font-bold rounded shadow-lg shadow-green-500/20 uppercase tracking-wider">
              Free to Keep
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur p-2.5 rounded-xl border border-white/10">
              {isSteam ? (
                 <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12s12-5.372 12-12C24 5.373 18.627 0 12 0zm5.836 17.653c-.347.112-.66.195-.917.25-.97.195-1.57-.09-1.57-.09l-1.956-5.832c-.08-.028-.158-.06-.238-.093l-3.326 4.908c-.76.7-1.782 1.096-2.88 1.053-.946-.032-1.848-.394-2.553-1.018-.707-.626-1.12-1.488-1.168-2.434-.048-.946.294-1.87 1.016-2.584.72-.716 1.745-1.077 2.827-1.012 1.483.088 2.628 1.002 3.123 2.155l3.208-4.73c-.02-.1-.03-.205-.03-.314 0-1.876 1.528-3.4 3.4-3.4 1.875 0 3.4 1.524 3.4 3.4 0 1.875-1.525 3.4-3.4 3.4-.648 0-1.25-.18-1.76-.496l-1.83 5.39c.273.29.624.5.992.61.944.256 1.93.076 2.65-.48l1.043 2.946zM15.4 7.6c-1.106 0-2 .894-2 2s.894 2 2 2 2-.894 2-2-.894-2-2-2zM5.59 13.916c-.463-.03-.902.115-1.22.428-.318.315-.465.738-.445 1.162.02.425.21.815.52 1.093.31.278.718.44 1.137.452.42.012.83-.12 1.14-.383.31-.263.483-.642.483-1.053 0-.007 0-.014-.002-.02L5.808 14.18c-.07-.068-.14-.136-.217-.264z"/>
                 </svg>
              ) : (
                <Gamepad2 className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          
          {/* Info Header */}
          <div className="flex flex-col justify-center">
            <div className="flex gap-2 mb-3">
              <span className="bg-[#4F46E5] text-white px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider">Free Game</span>
              <span className="bg-[#4F46E5]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider">Giveaway</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-6">{deal.title} ({deal.platforms.split(',')[0]}) Giveaway</h1>
            
            {/* Prices */}
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-md">
              <div>
                <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-bold">Original Price</div>
                <div className="text-2xl text-rose-500 line-through font-bold">{deal.worth !== "N/A" ? deal.worth : "$19.99"}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-bold">Current Price</div>
                <div className="text-2xl text-green-400 font-bold">FREE</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-bold">Discount</div>
                <div className="text-2xl text-green-400 font-bold">100% OFF</div>
              </div>
            </div>
            
            {/* Claim Text */}
            <div className="bg-[#111A2D] p-5 rounded-xl border border-white/5 mb-6 text-sm text-slate-300 leading-relaxed font-medium">
              Claim your free copy of {deal.title} on {deal.platforms.split(',')[0]}.<br /><br />
              Giveaway available now. Add it to your library forever and play with your friends online. Perfect for quick, fun sessions!
            </div>
            
            {/* Offer Ends In */}
            <div>
               <div className="text-sm font-bold mb-3 text-slate-300">Offer ends in:</div>
               {renderCountdown()}
            </div>
          </div>
        </div>
        
        {/* Buttons Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-[#111A2D] p-4 lg:p-6 rounded-2xl border border-white/5 mb-8 overflow-hidden relative">
           <div className="absolute top-0 left-0 w-1 h-full bg-[#4F46E5]"></div>
           <div className="px-2 pr-8 mr-auto border-r border-white/10 hidden md:block">
             <div className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Platform</div>
             <div className="font-bold text-lg leading-none">PC, {deal.platforms.split(',')[0]}</div>
           </div>
           <a href={deal.open_giveaway_url} target="_blank" rel="noreferrer" className="flex-1 md:flex-none text-center bg-[#5B21B6] hover:bg-[#4C1D95] font-bold py-4 px-12 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(91,33,182,0.4)] tracking-wide flex items-center justify-center gap-2">
             {isSteam ? (
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12s12-5.372 12-12C24 5.373 18.627 0 12 0zm5.836 17.653c-.347.112-.66.195-.917.25-.97.195-1.57-.09-1.57-.09l-1.956-5.832c-.08-.028-.158-.06-.238-.093l-3.326 4.908c-.76.7-1.782 1.096-2.88 1.053-.946-.032-1.848-.394-2.553-1.018-.707-.626-1.12-1.488-1.168-2.434-.048-.946.294-1.87 1.016-2.584.72-.716 1.745-1.077 2.827-1.012 1.483.088 2.628 1.002 3.123 2.155l3.208-4.73c-.02-.1-.03-.205-.03-.314 0-1.876 1.528-3.4 3.4-3.4 1.875 0 3.4 1.524 3.4 3.4 0 1.875-1.525 3.4-3.4 3.4-.648 0-1.25-.18-1.76-.496l-1.83 5.39c.273.29.624.5.992.61.944.256 1.93.076 2.65-.48l1.043 2.946zM15.4 7.6c-1.106 0-2 .894-2 2s.894 2 2 2 2-.894 2-2-.894-2-2-2zM5.59 13.916c-.463-.03-.902.115-1.22.428-.318.315-.465.738-.445 1.162.02.425.21.815.52 1.093.31.278.718.44 1.137.452.42.012.83-.12 1.14-.383.31-.263.483-.642.483-1.053 0-.007 0-.014-.002-.02L5.808 14.18c-.07-.068-.14-.136-.217-.264z"></path></svg>
             ) : <Gamepad2 className="w-5 h-5" />}
             CLAIM ON {deal.platforms.split(',')[0].toUpperCase()}
           </a>
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1E293B]/50 hover:bg-[#1E293B] border border-white/10 text-slate-300 font-bold py-4 px-8 rounded-xl transition-colors tracking-wide">
             <Heart className="w-5 h-5" /> ADD TO WATCHLIST
           </button>
        </div>
        
        {/* Tabs Bar */}
        <div className="flex gap-4 overflow-x-auto border-b border-white/10 mb-8 pb-px no-scrollbar">
          {[
            { id: "overview", label: "OVERVIEW", icon: LayoutTemplate },
            { id: "sysreq", label: "SYSTEM REQUIREMENTS", icon: Monitor },
            { id: "screens", label: "SCREENSHOTS", icon: ImageIcon },
            { id: "gameplay", label: "GAMEPLAY", icon: Video },
            { id: "info", label: "INFO", icon: Info }
          ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => handleTabClick(tab.id)}
               className={cn(
                 "flex items-center gap-2 pb-4 px-2 text-[11px] font-bold tracking-[0.15em] border-b-2 hover:text-white transition-all whitespace-nowrap",
                 activeTab === tab.id
                   ? "text-[#8B5CF6] border-[#8B5CF6]"
                   : "text-slate-400 border-transparent hover:border-slate-700"
               )}
             >
               <tab.icon className="w-4 h-4" /> {tab.label}
             </button>
          ))}
        </div>
        
        {/* Grid Content */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
           {/* Left Col */}
           <div className="space-y-6 flex flex-col">
              
              {/* Overview */}
              <div id="overview" className="bg-[#111A2D] p-6 lg:p-8 rounded-2xl border border-white/5 flex-grow scroll-mt-28">
                 <h2 className="flex items-center gap-2 font-bold mb-6 text-xl"><Gamepad2 className="w-5 h-5 text-[#8B5CF6]" /> Overview</h2>
                 <p className="text-sm text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap">
                    {deal.description}
                 </p>
                 <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-300">
                    <div className="flex items-center gap-2 bg-[#1A2235] px-4 py-2.5 rounded-lg border border-white/5"><span className="text-[#8B5CF6]">✛</span> Online Multiplayer</div>
                    <div className="flex items-center gap-2 bg-[#1A2235] px-4 py-2.5 rounded-lg border border-white/5"><span className="text-[#8B5CF6]">✛</span> Great Physics</div>
                    <div className="flex items-center gap-2 bg-[#1A2235] px-4 py-2.5 rounded-lg border border-white/5"><span className="text-[#8B5CF6]">✛</span> Easy to Play</div>
                    <div className="flex items-center gap-2 bg-[#1A2235] px-4 py-2.5 rounded-lg border border-white/5"><span className="text-[#8B5CF6]">✛</span> Competitive Races</div>
                    <div className="flex items-center gap-2 bg-[#1A2235] px-4 py-2.5 rounded-lg border border-white/5"><span className="text-[#8B5CF6]">✛</span> Free to Play</div>
                 </div>
              </div>
              
              {/* About This Game */}
              <div id="info" className="bg-[#111A2D] p-6 lg:p-8 rounded-2xl border border-white/5 scroll-mt-28">
                 <h2 className="font-bold mb-4 text-xl">About This Game</h2>
                 <p className="text-sm text-slate-300 mb-8">
                   Dive into {deal.title} and experience an amazing adventure. Each round is different, and the fun never ends!
                 </p>
                 <div className="grid grid-cols-[140px_1fr] gap-y-4 text-sm">
                    <div className="text-slate-400 font-medium">DEVELOPER</div><div className="text-slate-200">{developerName}</div>
                    <div className="text-slate-400 font-medium">PUBLISHER</div><div className="text-slate-200">{publisherName}</div>
                    <div className="text-slate-400 font-medium">RELEASE DATE</div><div className="text-slate-200">{gameInfo?.release_date || "Recent"}</div>
                    <div className="text-slate-400 font-medium">GENRE</div><div className="text-slate-200">{tags.length > 0 ? tags.slice(0,4).join(', ') : "Action, Casual, Indie"}</div>
                    <div className="text-slate-400 font-medium">MODE</div><div className="text-slate-200">Multiplayer / Singleplayer</div>
                    <div className="text-slate-400 font-medium">COMPATIBLE WITH</div><div className="text-slate-200">Windows (PC, {deal.platforms.split(',')[0]})</div>
                 </div>
              </div>
              
              {/* System Requirements */}
              <div id="sysreq" className="bg-[#111A2D] p-6 lg:p-8 rounded-2xl border border-white/5 scroll-mt-28">
                <h2 className="flex items-center gap-2 font-bold mb-6 text-xl"><Monitor className="w-5 h-5 text-[#8B5CF6]" /> System Requirements</h2>
                <div className="flex gap-2 mb-6 border-b border-white/10">
                  <button onClick={() => setActiveReqTab("min")} className={cn("px-5 py-2 text-sm font-bold transition-colors", activeReqTab === "min" ? "bg-[#1E293B] rounded-t-lg text-white border-b-2 border-[#8B5CF6]" : "text-slate-400 hover:text-white")}>Minimum</button>
                  <button onClick={() => setActiveReqTab("rec")} className={cn("px-5 py-2 text-sm font-bold transition-colors", activeReqTab === "rec" ? "bg-[#1E293B] rounded-t-lg text-white border-b-2 border-[#8B5CF6]" : "text-slate-400 hover:text-white")}>Recommended</button>
                </div>
                {activeReqTab === "min" ? (
                <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm text-slate-300 mb-6 font-medium">
                   <div className="text-slate-400">OS</div><div>Windows 7/8/10/11 (64-bit)</div>
                   <div className="text-slate-400">Processor</div><div>Intel Core i3 / AMD Ryzen 3</div>
                   <div className="text-slate-400">Memory</div><div>4 GB RAM</div>
                   <div className="text-slate-400">Graphics</div><div>Intel HD Graphics or Dedicated GPU</div>
                   <div className="text-slate-400">Storage</div><div>4 GB available space</div>
                   <div className="text-slate-400">DirectX</div><div>Version 11</div>
                </div>
                ) : (
                <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm text-slate-300 mb-6 font-medium">
                   <div className="text-slate-400">OS</div><div>Windows 10/11 (64-bit)</div>
                   <div className="text-slate-400">Processor</div><div>Intel Core i5 / AMD Ryzen 5</div>
                   <div className="text-slate-400">Memory</div><div>8 GB RAM or more</div>
                   <div className="text-slate-400">Graphics</div><div>NVIDIA GeForce GTX 1060 / AMD Radeon RX 580</div>
                   <div className="text-slate-400">Storage</div><div>4 GB available space (SSD Recommended)</div>
                   <div className="text-slate-400">DirectX</div><div>Version 11 or newer</div>
                </div>
                )}
                <div className="text-center p-3 bg-white/5 rounded text-xs text-slate-400">
                  {deal.title} is optimized for low-end PCs and laptops.
                </div>
              </div>
              
              {/* How to Claim */}
              <div className="bg-[#111A2D] p-6 lg:p-8 rounded-2xl border border-white/5 mt-auto">
                <h2 className="font-bold mb-6 text-xl">How to Claim</h2>
                <div className="space-y-4 text-sm text-slate-200 font-medium">
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl"><div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0 font-bold">1</div>Click on "Claim on {deal.platforms.split(',')[0]}" button above</div>
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl"><div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0 font-bold">2</div>You will be redirected to Store</div>
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl"><div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0 font-bold">3</div>Click "Add to Account"</div>
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl"><div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0 font-bold">4</div>The game is now in your Library - Forever!</div>
                </div>
                {deal.end_date !== "N/A" && (
                  <div className="mt-6 p-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2">
                    Hurry up! Offer ends soon. 🎁
                  </div>
                )}
              </div>
              
           </div>
           
           {/* Right Col */}
           <div className="space-y-6 flex flex-col">
              
              {/* Screenshots & Trailers */}
              <div id="screens" className="bg-[#111A2D] p-6 lg:p-8 rounded-2xl border border-white/5 scroll-mt-28">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="flex items-center gap-2 font-bold text-xl"><ImageIcon className="w-5 h-5 text-[#8B5CF6]" /> Media Gallery</h2>
                  {mediaItems.length > 0 && (
                    <button
                      onClick={() => {
                        setLightboxIndex(selectedMediaIndex);
                        setIsLightboxOpen(true);
                      }}
                      className="text-sm text-slate-400 hover:text-white font-medium group flex items-center gap-1 transition-colors"
                    >
                      View all <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">&gt;</span>
                    </button>
                  )}
                </div>
                
                {/* Main Media Viewer */}
                <div className="aspect-video bg-slate-950 rounded-xl mb-4 relative overflow-hidden group border border-white/5 shadow-inner">
                  {isPlaying && selectedMediaItem && (selectedMediaItem.type === 'video' || selectedMediaItem.type === 'youtube') ? (
                    <div className="w-full h-full">
                      {selectedMediaItem.type === 'video' ? (
                        <video
                          src={selectedMediaItem.url}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <iframe
                          src={`https://www.youtube.com/embed/${selectedMediaItem.url}?autoplay=1&rel=0`}
                          className="w-full h-full border-0"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      )}
                    </div>
                  ) : (
                    selectedMediaItem && (
                      <div
                        className="w-full h-full relative cursor-pointer group"
                        onClick={() => {
                          if (selectedMediaItem.type === 'video' || selectedMediaItem.type === 'youtube') {
                            setIsPlaying(true);
                          } else {
                            setLightboxIndex(selectedMediaIndex);
                            setIsLightboxOpen(true);
                          }
                        }}
                      >
                        <img
                          src={selectedMediaItem.url || selectedMediaItem.thumbnail}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          alt={deal.title}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
                        
                        {/* Video play overlay */}
                        {(selectedMediaItem.type === 'video' || selectedMediaItem.type === 'youtube') ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-[3px] border-white flex items-center justify-center bg-black/60 backdrop-blur-sm group-hover:bg-[#8B5CF6] group-hover:scale-110 transition-all duration-300 shadow-2xl">
                              <Play className="w-6 h-6 text-white fill-current ml-1" />
                            </div>
                            <span className="absolute bottom-4 right-4 bg-black/85 text-xs font-bold text-white px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                              <Video className="w-3.5 h-3.5" /> Watch Trailer
                            </span>
                          </div>
                        ) : (
                          /* Zoom overlay for image */
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:scale-115 transition-transform duration-200">
                              <span className="text-white text-base">🔍</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
                
                {/* Thumbnails Swiper Row */}
                <div className="relative">
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth">
                    {mediaItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedMediaIndex(idx);
                          setIsPlaying(false);
                        }}
                        className={cn(
                          "relative aspect-video w-24 shrink-0 rounded-lg overflow-hidden border transition-all duration-300",
                          selectedMediaIndex === idx
                            ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/40 opacity-100 scale-95"
                            : "border-white/5 opacity-60 hover:opacity-100 hover:border-white/20 hover:scale-[1.02]"
                        )}
                      >
                        <img src={item.thumbnail} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                        {(item.type === 'video' || item.type === 'youtube') && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[0.5px]">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                              <Play className="w-2.5 h-2.5 text-white fill-current ml-0.5" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

             {/* Why Play */}
             <div className="bg-[#111A2D] p-6 lg:p-8 rounded-2xl border border-white/5 relative overflow-hidden flex-grow flex flex-col justify-center">
               <h2 className="font-bold mb-6 relative z-10 text-xl">Why Play {deal.title}?</h2>
               <div className="space-y-5 text-sm text-slate-300 w-3/4 relative z-10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-[#8B5CF6] text-xl shrink-0">🚀</div>
                   <div><strong className="text-white">Lightweight game</strong> &ndash; Runs on low-end PCs</div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-[#8B5CF6] text-xl shrink-0">⚡</div>
                   <div><strong className="text-white">Fast matches</strong> &ndash; Perfect for short gaming sessions</div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-[#8B5CF6] text-xl shrink-0">😂</div>
                   <div><strong className="text-white">Hilarious moments</strong> &ndash; Fun with friends</div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-[#8B5CF6] text-xl shrink-0">🔁</div>
                   <div><strong className="text-white">Regular updates</strong> &amp; new levels</div>
                 </div>
                 <div className="flex items-center gap-3 bg-[#1A2235] p-2 rounded-lg -ml-2">
                   <div className="w-8 h-8 flex items-center justify-center text-blue-400 text-xl shrink-0">🎁</div>
                   <div><strong className="text-white">Free to keep forever</strong> on {deal.platforms}</div>
                 </div>
               </div>
               
               {/* Decorative Graphic Right Side - a large gamepad icon replacing the bunny */}
               <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 z-0">
                 <Gamepad2 className="w-full h-full text-white" />
               </div>
             </div>
             
             {/* Key Features */}
             <div className="bg-[#111A2D] p-6 lg:p-8 rounded-2xl border border-white/5">
               <h2 className="flex items-center gap-2 font-bold mb-6 text-xl"><Monitor className="w-5 h-5 text-[#8B5CF6]" /> Key Features</h2>
               <ul className="space-y-4 text-sm text-slate-300 font-medium">
                 <li className="flex items-center gap-3"><div className="bg-[#8B5CF6]/20 p-1 rounded-full"><Check className="w-4 h-4 text-[#8B5CF6]" /></div> Physics-based multiplayer platformer</li>
                 <li className="flex items-center gap-3"><div className="bg-[#8B5CF6]/20 p-1 rounded-full"><Check className="w-4 h-4 text-[#8B5CF6]" /></div> Many challenging levels &amp; maps</li>
                 <li className="flex items-center gap-3"><div className="bg-[#8B5CF6]/20 p-1 rounded-full"><Check className="w-4 h-4 text-[#8B5CF6]" /></div> Cross-platform matchmaking</li>
                 <li className="flex items-center gap-3"><div className="bg-[#8B5CF6]/20 p-1 rounded-full"><Check className="w-4 h-4 text-[#8B5CF6]" /></div> Customize your character</li>
                 <li className="flex items-center gap-3"><div className="bg-[#8B5CF6]/20 p-1 rounded-full"><Check className="w-4 h-4 text-[#8B5CF6]" /></div> Leaderboards &amp; achievements</li>
               </ul>
             </div>
             
             {/* Game Info & Rating Block */}
             <div className="grid md:grid-cols-2 gap-6 mt-auto">
               
               {/* Game Info */}
               <div className="bg-[#111A2D] p-6 rounded-2xl border border-white/5">
                 <h2 className="flex items-center gap-2 font-bold mb-5 text-[15px]"><Info className="w-4 h-4 text-[#8B5CF6]" /> Game Info</h2>
                 <div className="grid grid-cols-[90px_1fr] gap-y-3 text-[13px] text-slate-300">
                   <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-0.5">TITLE</div><div className="font-medium truncate">{deal.title}</div>
                   <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-0.5">PLATFORM</div><div className="font-medium">{deal.platforms.split(',')[0]}</div>
                   <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-0.5">STATUS</div><div className="text-green-400 font-bold">Giveaway</div>
                   <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-0.5">OFFER TYPE</div><div className="font-medium">Free To Keep</div>
                   <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-0.5">LAST UPDATE</div><div className="font-medium">Today</div>
                 </div>
               </div>
               
               {/* Rating */}
               <div className="bg-[#111A2D] p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                 <h2 className="font-bold mb-4 text-[15px] text-center md:text-left">Community Rating</h2>
                 <div className="px-2">
                   <div className="flex items-baseline gap-1 mb-1 justify-center md:justify-start">
                     <span className="text-4xl font-bold">{deal.steamRatingPercent || 87}</span>
                     <span className="text-slate-400 text-lg">/100</span>
                   </div>
                   <div className="flex text-amber-400 gap-1 mb-3 text-lg justify-center md:justify-start">
                     <span>★</span><span>★</span><span>★</span><span>★</span><span className="opacity-40">★</span>
                   </div>
                   <div className="text-xs text-slate-400 mb-5 text-center md:text-left">Based on {(deal.users || 1250).toLocaleString()}+ Reviews</div>
                   <button className="w-full bg-[#1E293B] hover:bg-[#334155] border border-white/10 font-bold py-2.5 rounded-lg text-xs tracking-widest transition-colors uppercase">
                     Read Reviews
                   </button>
                 </div>
               </div>
               
             </div>
             
           </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4 select-none">
          {/* Close Button */}
          <button 
            onClick={() => setIsLightboxOpen(false)} 
            className="absolute top-6 right-6 text-slate-400 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200 z-50 animate-in fade-in"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Content Area */}
          <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
            {/* Prev Button */}
            <button 
              onClick={handlePrevLightbox} 
              className="absolute left-4 z-10 p-4 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/5 hover:scale-110 active:scale-95 transition-all"
              aria-label="Previous Media"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            {/* Media Container */}
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/5">
              {mediaItems[lightboxIndex]?.type === 'image' && (
                <img 
                  src={mediaItems[lightboxIndex].url} 
                  className="max-h-full max-w-full object-contain animate-in zoom-in-95 duration-200" 
                  alt="Game Screenshot" 
                />
              )}
              {mediaItems[lightboxIndex]?.type === 'video' && (
                <video 
                  src={mediaItems[lightboxIndex].url} 
                  controls 
                  autoPlay 
                  className="max-h-full max-w-full object-contain" 
                />
              )}
              {mediaItems[lightboxIndex]?.type === 'youtube' && (
                <iframe 
                  src={`https://www.youtube.com/embed/${mediaItems[lightboxIndex].url}?autoplay=1&rel=0`} 
                  className="w-full h-full border-0" 
                  allowFullScreen 
                  allow="autoplay; encrypted-media" 
                />
              )}
            </div>

            {/* Next Button */}
            <button 
              onClick={handleNextLightbox} 
              className="absolute right-4 z-10 p-4 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/5 hover:scale-110 active:scale-95 transition-all"
              aria-label="Next Media"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption & Counter */}
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm font-semibold tracking-wider text-slate-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
              Media {lightboxIndex + 1} of {mediaItems.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
