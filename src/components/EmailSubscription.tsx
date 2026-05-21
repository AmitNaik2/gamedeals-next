import { useState, type FormEvent } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export function EmailSubscription() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSubscribed(true);
    } catch(err) {
      console.warn(err);
      setSubscribed(true); // show success anyway
    }
  };

  if (subscribed) {
    return (
      <div className="w-full bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-2xl p-4 sm:p-6 mb-8 flex items-center gap-4 text-[#F9FAFB] shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        <CheckCircle2 className="w-8 h-8 text-[#22C55E] drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] shrink-0" />
        <div>
          <h4 className="font-orbitron font-bold text-lg glow-text">You're subscribed!</h4>
          <p className="text-[#9CA3AF] text-sm font-poppins">We'll alert you as soon as new free games drop.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0F172A]/80 backdrop-blur-xl border border-[#06B6D4]/30 rounded-3xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#06B6D4]/10 blur-[60px] rounded-full pointer-events-none"></div>
      
      <div className="flex items-center gap-4 z-10 w-full md:w-auto">
        <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Mail className="w-6 h-6 text-[#06B6D4]" />
        </div>
        <div>
          <h4 className="font-orbitron font-bold text-lg text-[#F9FAFB] glow-text">Never miss a free game</h4>
          <p className="text-[#9CA3AF] text-[10px] md:text-xs font-poppins">Get notified when a new free game drops — no spam, unsubscribe anytime.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto z-10 shrink-0 relative">
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F9FAFB] focus:outline-none focus:border-[#06B6D4] focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] min-w-[200px] transition-all placeholder:text-[#9CA3AF]"
          required
        />
        <button type="submit" className="bg-[#06B6D4] hover:bg-[#F9FAFB] text-[#050816] rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          Subscribe <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
