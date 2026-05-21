import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <Helmet>
        <title>Privacy Policy | GamesDealsHub</title>
        <meta name="description" content="Read our privacy policy to understand how GamesDealsHub handles your data." />
        <link rel="canonical" href="https://www.gamesdealshub.me/privacy" />
      </Helmet>

      <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white mb-8 uppercase tracking-widest text-[10px] font-bold transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-black/40 border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-xl prose prose-invert max-w-none">
        <h1 className="text-4xl font-serif italic mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Privacy Policy
        </h1>
        
        <p className="text-white/70 mb-10">Last Updated: May 18, 2026</p>

        <p className="text-white/80 leading-relaxed mb-8">
          Welcome to GamesDealsHub. This Privacy Policy explains how information is collected, used, and protected when visitors use the website.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Information Collected</h2>
          <p className="text-white/80 leading-relaxed mb-2">GamesDealsHub may collect the following types of information:</p>
          
          <h3 className="text-lg font-bold mt-4 mb-2 text-white">a) Personal Information</h3>
          <p className="text-white/80 leading-relaxed mb-2">Information voluntarily provided by users, such as:</p>
          <ul className="list-disc pl-6 text-white/80 space-y-1 mb-4">
            <li>Email address</li>
            <li>Contact information</li>
            <li>Messages sent through contact forms</li>
          </ul>

          <h3 className="text-lg font-bold mt-4 mb-2 text-white">b) Non-Personal Information</h3>
          <p className="text-white/80 leading-relaxed mb-2">Automatically collected information including:</p>
          <ul className="list-disc pl-6 text-white/80 space-y-1">
            <li>Browser type and version</li>
            <li>Operating system and device platform (e.g., Windows, Mac, Mobile) used for real-time analytics in the admin panel</li>
            <li>Real-time active connection status collected via our activity tracking API</li>
            <li>IP address</li>
            <li>Pages visited</li>
            <li>Time spent on the website</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">2. How Information Is Used</h2>
          <p className="text-white/80 leading-relaxed mb-2">Collected information may be used to:</p>
          <ul className="list-disc pl-6 text-white/80 space-y-1">
            <li>Improve website performance and user experience</li>
            <li>Provide gaming deals, news, and updates</li>
            <li>Respond to inquiries or support requests</li>
            <li>Analyze traffic and website usage</li>
            <li>Prevent spam, abuse, or fraudulent activity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">3. Cookies</h2>
          <p className="text-white/80 leading-relaxed mb-2">GamesDealsHub may use cookies and similar tracking technologies to:</p>
          <ul className="list-disc pl-6 text-white/80 space-y-1 mb-4">
            <li>Remember user preferences</li>
            <li>Analyze website traffic</li>
            <li>Improve functionality</li>
          </ul>
          <p className="text-white/80 leading-relaxed">
            Users can disable cookies through browser settings if preferred.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">4. Third-Party Services</h2>
          <p className="text-white/80 leading-relaxed mb-2">The website may use third-party services such as:</p>
          <ul className="list-disc pl-6 text-white/80 space-y-1 mb-4">
            <li>Google Analytics</li>
            <li>RAWG Video Games Database API</li>
            <li>Advertising or affiliate platforms</li>
          </ul>
          <p className="text-white/80 leading-relaxed">
            These services may collect information according to their own privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">5. Google AdSense, Advertising and Cookies</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            We use Google AdSense to serve ads on GamesDealsHub. Third-party vendors, including Google, use cookies (such as the DoubleClick cookie) to serve ads based on a user's prior visits to our website or other websites.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            Google's use of advertising cookies enables it and its partners to serve Personalized Advertising to users based on their visit to our site and/or other sites on the Internet.
          </p>
          <p className="text-white/80 leading-relaxed">
            You may opt out of personalized advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] hover:underline font-bold">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting the Network Advertising Initiative opt-out page at <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] hover:underline font-bold">www.aboutads.info</a> or <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] hover:underline font-bold">optout.networkadvertising.org</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">6. Affiliate Links & Promotions</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            Some links on GamesDealsHub may be affiliate links. If users purchase products through these links, the website may earn a commission at no extra cost to the user.
          </p>
          <p className="text-white/80 leading-relaxed">
            Promo codes and deals displayed on the website may come from third-party platforms and are subject to availability and expiration.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">7. Data Security</h2>
          <p className="text-white/80 leading-relaxed">
            Reasonable security measures are used to protect collected information. However, no online platform can guarantee complete security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">8. External Links</h2>
          <p className="text-white/80 leading-relaxed">
            GamesDealsHub may contain links to external websites. The website is not responsible for the privacy practices or content of third-party sites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">9. Children's Privacy</h2>
          <p className="text-white/80 leading-relaxed">
            GamesDealsHub is not intended for children under 13 years of age. Personal information from children is not knowingly collected.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">10. Changes to This Privacy Policy</h2>
          <p className="text-white/80 leading-relaxed">
            This Privacy Policy may be updated at any time. Changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">11. Contact</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            For questions regarding this Privacy Policy, users can contact:
          </p>
          <ul className="list-disc pl-6 text-white/80 space-y-1">
            <li>Email: gamedealshub1@gmail.com</li>
            <li>Website: <a href="https://www.gamesdealshub.me" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] hover:underline">https://www.gamesdealshub.me</a></li>
          </ul>
        </section>

      </div>
    </div>
  );
}
