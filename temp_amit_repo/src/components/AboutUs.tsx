import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <Helmet>
        <title>About Us | GamesDealsHub</title>
        <meta name="description" content="Learn about GamesDealsHub and our mission to help gamers find free PC games and deals." />
        <link rel="canonical" href="https://www.gamesdealshub.me/about" />
      </Helmet>

      <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white mb-8 uppercase tracking-widest text-[10px] font-bold transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-black/40 border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-xl prose prose-invert max-w-none">
        <h1 className="text-4xl font-serif italic mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          About Us
        </h1>
        
        <p className="text-white/70 mb-10">Last Updated: May 20, 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            Welcome to GamesDealsHub! We are a community of passionate gamers dedicated to finding the best deals, free games, and giveaways across major platforms like Steam, Epic Games, GOG, and Humble Bundle. GamesDealsHub is a platform dedicated to tracking and verifying the best gaming deals across the web to help the community save money.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
             Our mission is simple: to ensure no gamer misses out on a great title just because they didn't see the deal in time. We provide an hourly-updated, real-time feed that removes the noise, giving you instant access to 100% free claimable games.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Who Are We?</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            Founded by Amit Naik, GamesDealsHub is dedicated to helping gamers find premium titles for free. We manually verify every deal to ensure our community never misses a high-value giveaway.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            Our team consists of gaming enthusiasts who actively curate and monitor digital storefront APIs. We combine automated tracking with manual curation to make sure every link on our site points to a legitimate, safe digital storefront.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Why Trust Us?</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            We prioritize Experience, Expertise, Authoritativeness, and Trust (E-E-A-T) in everything we do:
          </p>
          <ul className="list-disc list-inside text-white/80 leading-relaxed space-y-2 mb-4">
            <li><strong>Verified Deals Only:</strong> Every deal we post is manually cross-checked or sourced directly from verified storefront APIs (Steam, Epic, GOG). We strictly prohibit sketchy key resellers and unauthorized third-party marketplaces.</li>
            <li><strong>Clear Deadlines:</strong> Time is of the essence. Our active countdown timers let you know exactly when a deal expires. We actively purge expired deals to maintain a high-quality user experience.</li>
            <li><strong>No Hidden Costs:</strong> We clearly distinguish between "Free to Keep" (100% discount) and "Free Weekend" (temporary access) to avoid any confusion or bait-and-switch.</li>
            <li><strong>Ad-Free Tracking:</strong> We use safe, non-intrusive AdSense placements to keep the servers running without ruining your browsing experience.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Join the Community</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            Our Discord is rapidly growing, and it's the best place to get instant alerts on the latest free drops. We believe that a strong community makes everyone's gaming library better.
          </p>
          <p className="text-white/80 leading-relaxed">
            Have a deal to share or a question? Feel free to <Link to="/contact" className="text-[#7C3AED] hover:underline">Contact Us</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
