import { Metadata } from 'next';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gaming News & Free Game Alerts | GamesDealsHub',
  description: 'Get the latest PC gaming news, hardware updates, and deal announcements.',
  openGraph: {
    title: 'Gaming News & Free Game Alerts | GamesDealsHub',
    description: 'Get the latest PC gaming news, hardware updates, and deal announcements.',
    url: 'https://www.gamesdealshub.me/news'
  },
  alternates: { canonical: 'https://www.gamesdealshub.me/news' }
};

export default function Page() { 
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <span className="text-[#06B6D4] font-orbitron font-bold uppercase tracking-widest text-xs">Gaming Intelligence</span>
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-white uppercase mt-2 mb-4">Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6]">News</span></h1>
        </div>

        <div className="space-y-6">
          <article className="p-6 rounded-2xl bg-[#0F172A]/80 border border-white/5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-orbitron text-[#06B6D4] uppercase tracking-widest mb-3">
              <Newspaper className="w-4 h-4" /> PC Gaming
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Epic Games Mega Sale Starts Next Week</h2>
            <p className="text-[#9CA3AF] mb-4">The annual Epic Games Mega Sale is right around the corner, bringing massive discounts on AAA titles and rumors of several high-profile mystery free games. Stay tuned to our tracker as we monitor the drops live.</p>
          </article>
          
          <article className="p-6 rounded-2xl bg-[#0F172A]/80 border border-white/5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-orbitron text-[#8B5CF6] uppercase tracking-widest mb-3">
              <Newspaper className="w-4 h-4" /> Hardware
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">NVIDIA's New Driver Boosts FPS in Cyberpunk 2077</h2>
            <p className="text-[#9CA3AF] mb-4">A surprise driver update has resulted in up to 15% better performance in path-traced titles for 40-series cards. Make sure your drivers are updated before jumping into your weekend gaming sessions.</p>
          </article>

          <article className="p-6 rounded-2xl bg-[#0F172A]/80 border border-white/5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-orbitron text-[#22C55E] uppercase tracking-widest mb-3">
              <Newspaper className="w-4 h-4" /> Freebies
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Amazon Prime Gaming Lineup for Next Month Revealed</h2>
            <p className="text-[#9CA3AF] mb-4">Prime subscribers are getting a massive haul next month, including several classic RPGs and a major Ubisoft title. Make sure your Amazon account is linked to GOG and Epic Games to claim these.</p>
          </article>
        </div>
      </div>
    </div>
  );
}
