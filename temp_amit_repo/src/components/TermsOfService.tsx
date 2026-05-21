import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <Helmet>
        <title>Terms of Service | GamesDealsHub</title>
        <meta name="description" content="GamesDealsHub terms of service: acceptable use, third-party store links, affiliate disclosure, and warranty disclaimers." />
        <link rel="canonical" href="https://www.gamesdealshub.me/terms" />
        <meta property="og:url" content="https://www.gamesdealshub.me/terms" />
        <meta property="og:description" content="GamesDealsHub terms of service: acceptable use, third-party store links, affiliate disclosure, and warranty disclaimers." />
        <meta property="og:image" content="https://www.gamesdealshub.me/og-image.jpg" />
        <meta name="twitter:url" content="https://www.gamesdealshub.me/terms" />
        <meta name="twitter:description" content="GamesDealsHub terms of service: acceptable use, third-party store links, affiliate disclosure, and warranty disclaimers." />
        <meta name="twitter:image" content="https://www.gamesdealshub.me/og-image.jpg" />
      </Helmet>

      <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white mb-8 uppercase tracking-widest text-[10px] font-bold transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-black/40 border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-xl prose prose-invert max-w-none">
        <h1 className="text-4xl font-serif italic mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Terms of Service
        </h1>
        
        <p className="text-white/70 mb-10">Last Updated: May 18, 2026</p>

        <p className="text-white/80 leading-relaxed mb-8">
          Welcome to GamesDealsHub! By using our website, you agree to comply with and be bound by the following terms and conditions of use.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
          <p className="text-white/80 leading-relaxed mb-2">
            By accessing and using GamesDealsHub (the "Site"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">2. Use of Site</h2>
          <p className="text-white/80 leading-relaxed mb-2">
            You agree to use the Site only for lawful purposes. You agree not to take any action that might compromise the security of the Site, render the Site inaccessible to others, or otherwise cause damage to the Site or the Content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">3. Third-Party Links & Affiliates</h2>
          <p className="text-white/80 leading-relaxed mb-2">
            GamesDealsHub aggregates deals from various third parties (e.g., Steam, Epic Games, GOG). Links to these third-party web sites are provided for convenience only. GamesDealsHub has no control over these third-party sites and is not responsible for their content.
          </p>
          <p className="text-white/80 leading-relaxed">
            We may use affiliate links for some store pages. If you make a purchase through these links, we may earn a small commission at no additional cost to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">4. Modifications to Terms</h2>
          <p className="text-white/80 leading-relaxed mb-2">
            GamesDealsHub reserves the right to change these Terms of Service at any time without prior notice. Your continued use of the Site after such changes constitutes your acceptance of the new Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">5. Disclaimer of Warranties</h2>
          <p className="text-white/80 leading-relaxed mb-2">
            The information, software, products, and services included in or available through the Site may include inaccuracies or typographical errors. GamesDealsHub aims to keep the data as accurate as possible but makes no warranties regarding the complete accuracy, reliability, or availability of the deals presented.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">6. Contact Information</h2>
          <p className="text-white/80 leading-relaxed">
            If you have any questions or concerns about these Terms, please <Link to="/contact" className="text-[#7C3AED] hover:underline">Contact Us</Link>.
          </p>
        </section>

      </div>
    </div>
  );
}
