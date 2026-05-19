import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <Helmet>
        <title>About Us | GamesDealsHub</title>
        <meta name="description" content="Learn more about GamesDealsHub, the trusted source for the best free PC games and gaming deals." />
      </Helmet>

      <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white mb-8 uppercase tracking-widest text-[10px] font-bold transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-black/40 border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-xl prose prose-invert max-w-none">
        <h1 className="text-4xl font-serif italic mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          About Us
        </h1>
        
        <p className="text-white/70 mb-10">Last Updated: May 19, 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            Welcome to GamesDealsHub! We are a community of passionate gamers dedicated to finding the best deals, free games, and giveaways across major platforms like Steam, Epic Games, and GOG.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            Founded by Amit, our platform was built out of frustration with how difficult it is to keep track of limited-time free game offers. Our mission is to ensure no gamer misses out on a great title just because they didn't see the deal in time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Why Trust Us?</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            We prioritize Experience, Expertise, Authoritativeness, and Trust (E-E-A-T) in everything we do:
          </p>
          <ul className="list-disc list-inside text-white/80 leading-relaxed space-y-2 mb-4">
            <li><strong>Verified Deals:</strong> Every deal we post is manually verified. We do not aggregate sketchy key resellers.</li>
            <li><strong>Clear Deadlines:</strong> If a deal ends on a specific date, we make it absolutely clear.</li>
            <li><strong>No Hidden Costs:</strong> We highlight "Free to Keep" vs "Free Weekend" to avoid any confusion.</li>
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
