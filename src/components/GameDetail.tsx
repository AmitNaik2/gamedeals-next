import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { type GameDeal } from "../types";
import { BadgeCheck, ArrowLeft, ExternalLink, Gamepad2, Users, Star } from "lucide-react";
import { generateUniqueSummary, generateTags } from "../lib/text-utils";
import { Countdown } from "./Countdown";
import { getDealRarity } from "../lib/deal-utils";
import { useIgdb } from "../hooks/useIgdb";

export function GameDetail({ deals }: { deals: GameDeal[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<GameDeal | null>(null);

  useEffect(() => {
    if (deals.length > 0) {
      const found = deals.find((d) => String(d.id) === id);
      if (found) setDeal(found);
    }
  }, [id, deals]);

  const gameInfo = useIgdb(deal?.title);

  if (!deal && deals.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold font-serif mb-4">Deal Not Found</h2>
        <button onClick={() => navigate("/")} className="text-[#7C3AED] hover:underline">
          Return to Home
        </button>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-[#7C3AED] rounded-full animate-spin"></div>
      </div>
    );
  }

  const tags = generateTags(deal.title, deal.platforms, deal.type, deal.description);
  const rewrittenSummary = generateUniqueSummary(deal.title, deal.description, deal.type, deal.platforms);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
      <Helmet>
        <title>{deal.title} - Free {deal.platforms} Game | GamesDealsHub</title>
        <meta name="description" content={rewrittenSummary} />
        <meta property="og:title" content={`${deal.title} is currently Free!`} />
        <meta property="og:description" content={rewrittenSummary} />
        <meta property="og:image" content={deal.image || deal.thumbnail} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": deal.title,
            "image": deal.image || deal.thumbnail,
            "description": rewrittenSummary,
            "offers": {
              "@type": "Offer",
              "url": `https://gamesdealshub.me/game/${deal.id}`,
              "priceCurrency": "USD",
              "price": deal.salePrice || "0.00",
              "seller": {
                "@type": "Organization",
                "name": deal.platforms.split(',')[0]
              }
            }
          })}
        </script>
      </Helmet>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 uppercase tracking-widest text-[10px] font-bold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Deals
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-black/40 border border-white/10 rounded-3xl p-6 lg:p-8 backdrop-blur-xl">
        <div className="rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.15)] group">
          <img src={deal.image || deal.thumbnail} alt={deal.title} className="w-full object-cover aspect-video group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg">
            <BadgeCheck className="w-3 h-3" /> Verified Free
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-[#7C3AED]/20 px-2.5 py-1 rounded border border-[#7C3AED]/30 text-[10px] uppercase font-mono tracking-widest text-[#7C3AED]">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl lg:text-5xl font-serif italic font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            {deal.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Original Value</span>
              <span className="text-rose-500 font-mono text-xl line-through">{deal.worth !== "N/A" ? deal.worth : "$0.00"}</span>
            </div>
            <div className="w-px h-8 bg-white/10 opacity-50"></div>
            <div className="flex flex-col">
               <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Current Price</span>
               <span className="text-green-400 font-mono text-2xl font-bold bg-green-400/10 px-2 rounded">FREE</span>
            </div>
          </div>

          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            {rewrittenSummary}
          </p>

          <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl p-4 mb-8">
            <h3 className="text-sm font-bold text-white mb-2 tracking-wide">Why You Should Play {deal.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              If you usually miss out on expensive games, {deal.title} is a fantastic addition to your library right now. By claiming this deal, you are instantly saving {deal.worth !== "N/A" ? deal.worth : "money"} and securing a top-rated title for free. The {deal.type.toLowerCase()} format makes it a great choice to pick up today.
            </p>
          </div>

          <a
            href={deal.open_giveaway_url}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-gray-200 uppercase tracking-widest text-xs font-black rounded-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1"
          >
            Claim on {deal.platforms.split(',')[0]}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12 bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8">
          <div>
            <h2 className="text-xl font-serif italic opacity-90 mb-4 inline-flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#7C3AED]" /> 
              How do I claim the {deal.platforms.split(',')[0]} giveaway?
            </h2>
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap bg-black/40 p-5 rounded-2xl border border-white/5">
              {deal.instructions}
            </p>
          </div>
          <div>
             <h3 className="text-xl font-serif italic opacity-90 mb-4 inline-flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-green-500" /> Offer Details</h3>
             <ul className="space-y-4">
               <li className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Offer Ends</span>
                   {deal.end_date !== "N/A" && <span className="text-sm font-bold text-white/80">Deal ends: {deal.end_date}</span>}
                 </div>
                 {deal.end_date !== "N/A" ? <Countdown endDate={deal.end_date} /> : <span className="text-sm font-mono text-rose-400 font-bold">Unknown (Hurry!)</span>}
               </li>
               <li className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                 <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Rarity Level</span>
                 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                   {getDealRarity(deal).label}
                 </span>
               </li>
               <li className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                 <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Platforms</span>
                 <span className="text-sm text-white/80">{deal.platforms}</span>
               </li>
                <li className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                 <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Community Uses</span>
                 <span className="text-sm text-white/80">{deal.users?.toLocaleString() || 0} Claimed</span>
               </li>
             </ul>
          </div>
      </div>
    </div>
  );
}
