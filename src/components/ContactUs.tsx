import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <Helmet>
        <title>Contact Us | GamesDealsHub</title>
        <meta name="description" content="Get in touch with GamesDealsHub for support, inquiries, or to report a deal." />
      </Helmet>

      <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white mb-8 uppercase tracking-widest text-[10px] font-bold transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-black/40 border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-xl max-w-none">
        <h1 className="text-4xl font-serif italic mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Contact Us
        </h1>

        <p className="text-white/80 leading-relaxed mb-8">
          We would love to hear from you. Whether you have a question, spotted a deal we missed, or want to report an issue with the website, drop us a line!
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#7C3AED]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
            <p className="text-white/60 mb-4 text-sm">For general inquiries, partnerships, or support.</p>
            <a href="mailto:gamedealshub1@gmail.com" className="text-[#7C3AED] hover:text-white font-medium transition-colors">
              gamedealshub1@gmail.com
            </a>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#5865F2]/20 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-[#5865F2]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Join Discord</h3>
            <p className="text-white/60 mb-4 text-sm">Chat with the community and get real-time deal alerts.</p>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:text-white font-medium transition-colors">
              GamesDealsHub Discord
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Important Links</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-white/70 hover:text-white hover:underline transition-all">About Us</Link>
            </li>
            <li>
              <Link to="/terms" className="text-white/70 hover:text-white hover:underline transition-all">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy" className="text-white/70 hover:text-white hover:underline transition-all">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
