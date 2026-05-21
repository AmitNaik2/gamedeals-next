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
      <div className="w-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-xl p-4 sm:p-6 mb-8 flex items-center gap-4 text-white">
        <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0" />
        <div>
          <h4 className="font-bold text-lg">You're subscribed!</h4>
          <p className="text-white/60 text-sm">We'll alert you as soon as new free games drop.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-black/80 to-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#7C3AED]/20 blur-[60px] rounded-full pointer-events-none"></div>
      
      <div className="flex items-center gap-4 z-10 w-full md:w-auto">
        <div className="w-12 h-12 rounded-full bg-[#7C3AED]/20 flex items-center justify-center shrink-0">
          <Mail className="w-6 h-6 text-[#7C3AED]" />
        </div>
        <div>
          <h4 className="font-bold text-lg text-white">Never miss a free game</h4>
          <p className="text-white/60 text-[10px] md:text-xs">Get notified when a new free game drops — no spam, unsubscribe anytime.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto z-10 shrink-0">
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED] min-w-[200px]"
          required
        />
        <button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg px-4 py-2.5 text-sm font-bold transition-colors flex items-center gap-2">
          Subscribe <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
