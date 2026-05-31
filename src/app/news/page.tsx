import { Metadata } from 'next';
import { Newspaper, Target, Globe, Zap } from 'lucide-react';
import { StructuredData } from "@/components/StructuredData";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Gaming News & About GamesDealsHub",
  description: "Learn how GamesDealsHub tracks free PC games, monitors Steam and Epic Games, and provides instant alerts for 100% off gaming deals.",
  alternates: {
    canonical: "https://www.gamesdealshub.me/news",
  },
  openGraph: {
    title: "Gaming News & About GamesDealsHub",
    description: "Learn how GamesDealsHub tracks free PC games, monitors Steam and Epic Games, and provides instant alerts for 100% off gaming deals.",
    url: "https://www.gamesdealshub.me/news",
  },
};

export default function Page() { 
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How GamesDealsHub Tracks Free PC Games",
    "description": "An inside look at our tracking technology, the storefronts we monitor, and how we deliver real-time alerts for 100% off gaming promotions.",
    "author": { "@type": "Organization", "name": "GamesDealsHub" },
    "publisher": { "@type": "Organization", "name": "GamesDealsHub", "logo": { "@type": "ImageObject", "url": "https://www.gamesdealshub.me/og-image.jpg" } }
  };

  return (
    <>
    <StructuredData type="Article" data={articleSchema} />
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <span className="text-[#06B6D4] font-orbitron font-bold uppercase tracking-widest text-xs">Behind The Scenes</span>
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-white uppercase mt-2 mb-4">How We Track <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6]">Free Games</span></h1>
        </div>

        <div className="bg-[#0F172A]/80 border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.05)] rounded-2xl p-8 md:p-12 text-[#D1D5DB] font-poppins leading-relaxed">
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-8">Welcome to GamesDealsHub! We built this platform with a singular, laser-focused mission: to ensure that gamers never miss a 100% off promotion again. The PC gaming ecosystem is highly fragmented. Developers and publishers run giveaways across dozens of different storefronts, making it incredibly tedious to track down every free title manually. Our automated system does the heavy lifting for you.</p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-[#050816] p-6 rounded-xl border border-white/5">
                <Target className="w-8 h-8 text-[#06B6D4] mb-4" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">The Mission</h3>
                <p className="text-sm text-[#9CA3AF]">To democratize PC gaming by aggregating every legitimate free game giveaway into one beautiful, easy-to-use, lightning-fast dashboard.</p>
              </div>
              <div className="bg-[#050816] p-6 rounded-xl border border-white/5">
                <Globe className="w-8 h-8 text-[#8B5CF6] mb-4" />
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">The Coverage</h3>
                <p className="text-sm text-[#9CA3AF]">We cover Epic Games Store, Steam, GOG, Prime Gaming, Ubisoft Connect, Electronic Arts (EA App), and various indie developer promotions.</p>
              </div>
            </div>

            <h2 className="text-2xl font-orbitron font-bold text-white mb-4 border-b border-white/10 pb-2">How Our Tracking Technology Works</h2>
            <p className="mb-6">Our backend architecture is designed for speed and accuracy. We utilize a combination of direct API integrations and custom web scrapers that monitor the major digital storefronts 24 hours a day, 7 days a week.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><Zap className="w-5 h-5 text-[#F59E0B]" /></div>
                <div>
                  <strong className="text-white block mb-1">Steam API Polling:</strong>
                  <span className="text-[#9CA3AF]">We continuously poll the Steam storefront API, specifically searching for anomalies where the discount percentage hits exactly 100%. Because Steam giveaways are rarely announced in advance, this rapid polling ensures we catch flash giveaways the moment they begin.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><Zap className="w-5 h-5 text-[#F59E0B]" /></div>
                <div>
                  <strong className="text-white block mb-1">Epic Games Promotion Feeds:</strong>
                  <span className="text-[#9CA3AF]">Epic Games is incredibly consistent with their Thursday drops. We hook directly into Epic's promotion backend to fetch not just the current week's free games, but also the metadata for the upcoming week's drops, allowing us to display an accurate countdown.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><Zap className="w-5 h-5 text-[#F59E0B]" /></div>
                <div>
                  <strong className="text-white block mb-1">GamerPower Aggregation:</strong>
                  <span className="text-[#9CA3AF]">To ensure we don't miss indie titles, DLCs, and third-party key giveaways (like Humble Bundle or Fanatical), we cross-reference our data with trusted third-party APIs like GamerPower. This dual-verification system ensures comprehensive coverage.</span>
                </div>
              </li>
            </ul>

            <h2 className="text-2xl font-orbitron font-bold text-white mb-4 border-b border-white/10 pb-2">The 100% Off Guarantee</h2>
            <p className="mb-6">One of the biggest frustrations in deal hunting is clicking on a "free" game only to realize it's a Free-to-Play game loaded with microtransactions, or a demo. Our platform strictly filters out standard F2P games. If a game appears on our active feed, it is a premium, paid game that is currently experiencing a 100% price drop. We guarantee that if you claim it within the active window, it is yours to keep forever.</p>

            <h2 className="text-2xl font-orbitron font-bold text-white mb-4 border-b border-white/10 pb-2">Looking Forward: The Roadmap</h2>
            <p className="mb-6">We are constantly evolving GamesDealsHub to serve you better. In the coming months, we will be rolling out several highly requested features, including:</p>
            <ul className="list-disc pl-6 space-y-2 mb-8 text-[#9CA3AF]">
              <li><strong className="text-white">Custom Deal Alerts:</strong> The ability to create an account and set a wish list, so you get emailed the moment a specific game goes free.</li>
              <li><strong className="text-white">Historical Data Tracking:</strong> See how often a game goes on sale or goes free, helping you decide whether to buy now or wait.</li>
              <li><strong className="text-white">Community Reviews:</strong> Integrated Trust Scores based on community feedback to help you identify which free drops are actually worth your time to download.</li>
            </ul>

            <div className="bg-[#050816] p-6 rounded-xl border border-white/10 text-center mt-12">
              <h3 className="text-xl font-orbitron font-bold text-white mb-3">Join The Community</h3>
              <p className="text-[#9CA3AF] mb-6">The best way to stay updated on our progress and catch every free game is to join our Discord server. It's the fastest way to get notified when a drop happens.</p>
              <Link href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/gamesdealshub"} className="inline-block bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                Join Discord
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  );
}
