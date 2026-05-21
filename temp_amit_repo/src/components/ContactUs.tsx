import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, type FormEvent } from "react";

export function ContactUs() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    };

    try {
      const res = await fetch("/api/contact-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch (err) {
      setFormStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <Helmet>
        <title>Contact Us | GamesDealsHub</title>
        <meta name="description" content="Get in touch with the GamesDealsHub team for support or feedback." />
        <link rel="canonical" href="https://www.gamesdealshub.me/contact" />
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

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Details side */}
          <div className="space-y-8">
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

          {/* Contact Form side */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
            
            {formStatus === "success" ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            ) : formStatus === "error" ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-4">
                <p className="text-sm font-medium">Failed to send message. Please try again later or email us directly.</p>
              </div>
            ) : null}
            
            {formStatus !== "success" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
                    placeholder="How can we help?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {formStatus === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
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
