import { Metadata } from 'next';
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Game Reviews | GamesDealsHub',
  description: 'In-depth reviews and recommendations for PC games.',
  keywords: ["PC game reviews", "game recommendations", "Helldivers 2 review", "gaming reviews", "GamesDealsHub reviews"],
  openGraph: {
    title: 'Game Reviews | GamesDealsHub',
    description: 'In-depth reviews and recommendations for PC games.',
    url: 'https://www.gamesdealshub.me/reviews',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Reviews | GamesDealsHub',
    description: 'In-depth reviews and recommendations for PC games.'
  },
  alternates: { canonical: 'https://www.gamesdealshub.me/reviews' }
};

import { StructuredData } from "@/components/StructuredData";

export default function Page() { 
  const articleSchema = {
    "headline": "Helldivers 2: The Co-Op Masterpiece We Didn't Know We Needed",
    "description": "A chaotic, hilarious, and brilliantly designed multiplayer shooter that proves Live Service games aren't dead.",
    "author": { "@type": "Organization", "name": "GamesDealsHub" },
    "publisher": { "@type": "Organization", "name": "GamesDealsHub", "logo": { "@type": "ImageObject", "url": "https://www.gamesdealshub.me/og-image.jpg" } },
    "datePublished": "2026-05-31",
    "dateModified": "2026-05-31"
  };

  return (
    <>
    <StructuredData type="Article" data={articleSchema} />
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <span className="text-[#06B6D4] font-orbitron font-bold tracking-widest text-sm uppercase mb-2 block">Game Reviews</span>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6 uppercase tracking-tight">Helldivers 2: The Co-Op Masterpiece We Didn't Know We Needed</h1>
          <p className="text-[#9CA3AF] text-lg font-poppins">A chaotic, hilarious, and brilliantly designed multiplayer shooter that proves Live Service games aren't dead—they just needed a sense of humor.</p>
        </div>
        
        <div className="bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.05)] text-[#D1D5DB] font-poppins space-y-8 leading-relaxed">
           
           <p className="text-lg">
             In an era where the industry is dominated by overly serious competitive shooters and bloated open worlds, Arrowhead Game Studios dropped a bomb on the market. <strong>Helldivers 2</strong> is a masterclass in cooperative chaos, blending the satirical fascism of Starship Troopers with grueling, emergent gameplay that guarantees you will accidentally blow up your best friends at least three times per mission.
           </p>

           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">The Gameplay Loop: Managed Democracy</h2>
           <p>
             You play as a Helldiver, an expendable super-soldier dropped behind enemy lines to complete objectives for Super Earth. The core loop is simple: drop onto a hostile planet, complete main and secondary objectives (like launching ICBMs or destroying bug nests), and extract before the timer runs out and your Destroyer leaves orbit.
           </p>
           <p className="mt-4">
             What makes it brilliant is the <strong>Stratagem System</strong>. Instead of just shooting your gun, you use directional inputs (like a fighting game cheat code) to call down orbital strikes, supply drops, and heavy weapons. The catch? Friendly fire is always on, and a poorly thrown 500kg Bomb will instantly vaporize your entire squad.
           </p>
           <ul className="list-disc pl-6 space-y-2 mt-4 text-[#9CA3AF]">
             <li><strong>The Bugs (Terminids):</strong> A relentless swarm that forces you to constantly stay mobile and manage crowd control.</li>
             <li><strong>The Bots (Automatons):</strong> A heavily armored, laser-firing menace that forces you to use cover, flank, and prioritize heavy armor-piercing weaponry.</li>
           </ul>

           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">A Masterclass in Monetization</h2>
           <p>
             Perhaps the most surprising aspect of Helldivers 2 is its monetization model. In a landscape plagued by $20 skins and pay-to-win mechanics, Helldivers 2 is incredibly fair.
           </p>
           <p className="mt-4">
             The premium currency (Super Credits) can literally be found lying around the map during normal gameplay. I was able to unlock the Premium Warbond (Battle Pass) in my first week just by exploring points of interest during missions. Furthermore, the Warbonds never expire. If you buy the game a year from now, you can still unlock day-one content.
           </p>

           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">The Galactic War Engine</h2>
           <p>
             The meta-progression is tied to the Galactic War. Every mission completed by every player around the globe contributes a fraction of a percent to the liberation of a planet. 
           </p>
           <div className="bg-[#050816] border border-white/5 p-6 rounded-lg my-6">
             <p className="italic text-[#06B6D4]">
               "The true genius of the Galactic War is Joel. There is a literal Game Master at Arrowhead who adjusts spawn rates, issues Major Orders, and reacts to the community's success in real time. It feels like a massive, global Dungeons & Dragons campaign."
             </p>
           </div>
           
           <h2 className="text-2xl font-orbitron font-bold text-white uppercase text-[#06B6D4] mt-12 border-b border-white/10 pb-4">Final Verdict: 9.5 / 10</h2>
           <p>
             Helldivers 2 isn't just a great game; it's a cultural moment. The emergent storytelling—like diving out of the way of a Charger, only to get crushed by your teammate's resupply pod—creates memories that scripted campaigns could never achieve. 
           </p>
           <p className="mt-4 text-[#9CA3AF]">
             <strong>Pros:</strong> Incredible emergent gameplay, fair monetization, amazing physics engine, hilarious satirical tone.<br/>
             <strong>Cons:</strong> Matchmaking issues during launch (mostly resolved), some weapons feel under-tuned.
           </p>

           <div className="mt-16 pt-8 border-t border-white/10 text-center">
             <p className="text-sm text-[#9CA3AF] mb-4">Looking for more game recommendations or free PC deals?</p>
             <a href="/" className="inline-block px-6 py-3 bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 border border-[#06B6D4]/50 text-[#06B6D4] font-bold font-orbitron uppercase tracking-widest rounded-lg transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
               Return to Dashboard
             </a>
           </div>

        </div>
      </div>
    </div>
    </>
  );
}
