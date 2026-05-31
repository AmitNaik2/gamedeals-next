import { Metadata } from 'next';
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Gaming Guides | GamesDealsHub',
  description: 'Tips, tricks, and walkthroughs for the best PC games.',
  openGraph: {
    title: 'Gaming Guides | GamesDealsHub',
    description: 'Tips, tricks, and walkthroughs for the best PC games.',
    url: 'https://www.gamesdealshub.me/guides'
  },
  alternates: { canonical: '/guides' }
};

export default function Page() { 
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <span className="text-[#06B6D4] font-orbitron font-bold tracking-widest text-sm uppercase mb-2 block">Gaming Guides</span>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6 uppercase tracking-tight">How to Build a Massive PC Game Library for Free</h1>
          <p className="text-[#9CA3AF] text-lg font-poppins">A comprehensive guide to legally acquiring hundreds of premium PC games from Epic Games, Steam, GOG, and Prime Gaming without spending a single dollar.</p>
        </div>
        
        <div className="bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.05)] text-[#D1D5DB] font-poppins space-y-8 leading-relaxed">
           
           <p className="text-lg">
             Gone are the days when PC gaming required a massive budget to buy the latest titles. Digital storefronts are currently engaged in a massive war for user acquisition, and they are using free premium games as their primary weapon. If you know where to look, you can build a massive, high-quality library legally and safely. Here is how you do it.
           </p>

           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">1. The Epic Games Store Weekly Ritual</h2>
           <p>
             The undisputed king of the free game giveaway is Epic Games. In their quest to compete with Steam, they have given away thousands of dollars worth of games, including masterpieces like GTA V, Death Stranding, and Marvel's Midnight Suns.
           </p>
           <ul className="list-disc pl-6 space-y-2 mt-4 text-[#9CA3AF]">
             <li><strong>The Schedule:</strong> Epic rotates their free games every Thursday at 11:00 AM Eastern Time. </li>
             <li><strong>The Mystery Vault:</strong> Twice a year (during the Mega Sale in May/June and the Holiday Sale in December), Epic runs the "Mystery Vault" promotion. Instead of announcing the games beforehand, they give away a surprise AAA title every day or week.</li>
             <li><strong>How to Claim:</strong> You don't need to download the launcher to claim them! Simply log into the Epic Games website on your phone or browser, go to the Free Games section, click "Get," and checkout for $0.00. The game is tied to your account permanently.</li>
           </ul>

           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">2. Steam's Hidden 100% Off Promotions</h2>
           <p>
             Steam rarely advertises its 100% off giveaways. Unlike Epic, which has a dedicated banner, Steam developers occasionally make their paid games free to keep forever for a very limited time (usually 24 to 48 hours) to boost player counts or promote a sequel.
           </p>
           <p className="mt-4">
             Because these aren't advertised, you have to use a tracker like <strong>GamesDealsHub</strong>. We constantly scan the Steam API for `discount_pct = 100`. When a developer flips that switch, it instantly appears on our homepage. 
           </p>
           <p className="mt-4 text-[#06B6D4] italic">
             Note: Do not confuse "Free to Play" games with "100% Off Promotions." Free to Play games usually have heavy microtransactions. A 100% Off Promotion is a premium, paid game that is being given away for free. Once claimed, it stays in your library forever, even after the price goes back up!
           </p>

           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">3. GOG (Good Old Games) Giveaways</h2>
           <p>
             CD Projekt's storefront, GOG, is famous for its DRM-free games. They run massive sales four times a year (Spring, Summer, Autumn, Winter) and almost always give away 2-4 classic or indie games during these sales.
           </p>
           <div className="bg-[#050816] border border-white/5 p-6 rounded-lg my-6">
             <ol className="list-decimal pl-4 space-y-3">
               <li>Log into GOG.com during a seasonal sale.</li>
               <li>Scroll down the homepage until you see the banner.</li>
               <li>Click "Yes, and claim the game."</li>
               <li>The game is now yours, completely DRM-free. You can download the offline installer and keep it on a hard drive forever.</li>
             </ol>
           </div>

           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">4. Amazon Prime Gaming (The Hidden Gem)</h2>
           <p>
             If you or your family has an Amazon Prime subscription, you are likely missing out on 6-10 free PC games every single month. Amazon Prime Gaming gives away a mix of indie darlings and massive AAA titles (like Fallout 76, Cyberpunk, and Tomb Raider).
           </p>
           <ul className="list-disc pl-6 space-y-4 mt-4">
             <li><strong className="text-white">GOG / Epic Keys:</strong> Often, Amazon will just give you a product key that you can redeem directly on GOG or Epic Games.</li>
             <li><strong className="text-white">Amazon Games App:</strong> For other titles, they are injected directly into the Amazon Games launcher.</li>
             <li><strong className="text-white">In-Game Loot:</strong> Even if you don't care about the games, they give away millions of dollars in virtual currency, skins, and boosters for games like League of Legends, Valorant, and GTA Online.</li>
           </ul>

           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">5. Never Miss a Drop Again</h2>
           <p>
             Checking 5 different storefronts every day is exhausting. That is literally why GamesDealsHub exists. We aggregate every single 100% off promotion across Steam, Epic, GOG, and Prime Gaming into one feed. Bookmark our homepage and check it twice a week—you will never miss a free game again.
           </p>

           <div className="mt-16 pt-8 border-t border-white/10 text-center">
             <p className="text-sm text-[#9CA3AF] mb-4">Start building your library today by checking what is currently free right now.</p>
             <a href="/" className="inline-block px-6 py-3 bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 border border-[#06B6D4]/50 text-[#06B6D4] font-bold font-orbitron uppercase tracking-widest rounded-lg transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
               View Active Free Games
             </a>
           </div>

        </div>
      </div>
    </div>
  );
}
