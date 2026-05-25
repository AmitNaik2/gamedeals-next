"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertTriangle } from "lucide-react";

export function ContactForm() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Transmitting...");

    const formData = new FormData(event.currentTarget);
    const dataObj = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
      });

      const data = await response.json();
      if (response.ok) {
        setResult("Success! Secure connection established and message transmitted.");
        (event.target as HTMLFormElement).reset();
      } else {
        setResult(data.error || data.message || "Error transmitting message");
      }
    } catch (error) {
      setResult("Connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div>
        <label htmlFor="name" className="block text-xs font-orbitron font-bold text-[#8B5CF6] uppercase tracking-widest mb-2">Identifier (Name)</label>
        <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-[#0F172A]/80 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] placeholder-[#475569] transition-all outline-none" placeholder="Enter your name" />
      </div>
      <div>
        <label htmlFor="email" className="block text-xs font-orbitron font-bold text-[#8B5CF6] uppercase tracking-widest mb-2">Comms Link (Email)</label>
        <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-[#0F172A]/80 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] placeholder-[#475569] transition-all outline-none" placeholder="Enter your email address" />
      </div>
      <div>
        <label htmlFor="message" className="block text-xs font-orbitron font-bold text-[#8B5CF6] uppercase tracking-widest mb-2">Transmission (Message)</label>
        <textarea id="message" name="message" required rows={5} className="w-full px-4 py-3 bg-[#0F172A]/80 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] placeholder-[#475569] transition-all outline-none resize-y" placeholder="Enter your message..."></textarea>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6] border border-[#8B5CF6]/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-orbitron font-bold tracking-widest uppercase py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]"
        >
          {isSubmitting ? "Transmitting..." : "Send Message"}
          <Send className="w-4 h-4" />
        </button>
        {result && (
          <div className={`flex items-center gap-2 font-medium text-sm px-4 py-3 rounded-lg border ${result.includes("Success") ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]" : result.includes("Transmitting") ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]" : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"}`}>
            {result.includes("Success") ? <CheckCircle className="w-4 h-4" /> : result.includes("Transmitting") ? <Send className="w-4 h-4 animate-pulse" /> : <AlertTriangle className="w-4 h-4" />}
            {result}
          </div>
        )}
      </div>
    </form>
  );
}
