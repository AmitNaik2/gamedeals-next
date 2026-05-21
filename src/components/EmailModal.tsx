import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealTitle?: string;
  dealUrl?: string;
  trackDeal?: { title: string; id: string } | null;
}

export function EmailModal({ isOpen, onClose, dealTitle, dealUrl, trackDeal }: EmailModalProps) {
  const [email, setEmail] = useState("");
  const [action, setAction] = useState<"subscribe" | "unsubscribe">("subscribe");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isShareMode = !!dealTitle && !!dealUrl;
  const isTrackMode = !!trackDeal && !isShareMode;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      let endpoint = "/api/subscribe";
      if (isShareMode) endpoint = "/api/share";
      else if (action === "unsubscribe") endpoint = "/api/unsubscribe";

      const payload = isShareMode 
        ? { email, dealTitle, dealUrl }
        : isTrackMode
          ? { email, action: "track", game: trackDeal?.title, id: trackDeal?.id }
          : { email };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Invalid response from server"); }

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message);
      
      // Reset after 3 seconds and close
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
        onClose();
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      const errorMessage = err.message === 'Failed to fetch' ? 'Network error: Server might be restarting. Please try again.' : err.message;
      setMessage(errorMessage || "Failed to send email. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-[#0F172A]/90 border border-[#8B5CF6]/30 shadow-[0_0_40px_rgba(139,92,246,0.3)] rounded-3xl pointer-events-auto overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent"></div>
              <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-[#06B6D4]/10 blur-[50px] pointer-events-none rounded-full"></div>

              <div className="flex items-center justify-between p-6 border-b border-[#8B5CF6]/20">
                <h2 className="text-xl font-orbitron font-bold text-[#F9FAFB] glow-text leading-tight">
                   {isShareMode ? "Share Link" : isTrackMode ? "Initiate Price Tracking" : "Never miss a drop."}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  title="Close"
                  className="p-2 text-[#9CA3AF] transition-colors rounded-full hover:text-[#EF4444] hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {isShareMode && (
                  <div className="p-4 mb-6 border rounded-2xl bg-black/40 border-white/5 shadow-inner">
                    <p className="text-[10px] uppercase font-orbitron tracking-widest text-[#06B6D4] mb-2 font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">Transmitting Data</p>
                    <p className="font-poppins font-bold text-[#F9FAFB] line-clamp-2 text-sm">{dealTitle}</p>
                  </div>
                )}
                
                {isTrackMode && (
                  <div className="p-4 mb-6 border rounded-2xl bg-[#0F172A]/80 border-[#F59E0B]/30 shadow-inner">
                    <p className="text-[10px] uppercase font-orbitron tracking-widest text-[#F59E0B] mb-2 font-bold drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">Target Locked</p>
                    <p className="font-poppins font-bold text-[#F9FAFB] line-clamp-2 text-sm">{trackDeal?.title}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-2">Enter your comms address below to be notified when this asset reaches a historic low or goes free.</p>
                  </div>
                )}

                {status === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 space-y-4 text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-[#22C55E] shrink-0 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                    <p className="text-lg font-orbitron font-bold text-[#F9FAFB] glow-text">{message}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isShareMode && !isTrackMode && (
                      <div className="flex items-center gap-6 mb-2 bg-black/20 p-2 rounded-xl">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="modalAction" 
                            value="subscribe" 
                            checked={action === "subscribe"} 
                            onChange={() => setAction("subscribe")}
                            className="accent-[#06B6D4] w-4 h-4 cursor-pointer"
                          />
                          <span className="text-xs font-orbitron uppercase tracking-wider text-[#9CA3AF] font-bold">Subscribe</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="modalAction" 
                            value="unsubscribe" 
                            checked={action === "unsubscribe"} 
                            onChange={() => setAction("unsubscribe")}
                            className="accent-[#EF4444] w-4 h-4 cursor-pointer"
                          />
                          <span className="text-xs font-orbitron uppercase tracking-wider text-[#9CA3AF] font-bold">Unsubscribe</span>
                        </label>
                      </div>
                    )}
                    <div className="space-y-2">
                       <label htmlFor="emailModalInput" className="text-[10px] uppercase font-orbitron tracking-[0.2em] font-bold text-[#9CA3AF] pl-1">
                        Comms Address
                      </label>
                      <input
                        id="emailModalInput"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@system.net"
                        required
                        disabled={status === "loading"}
                        className="w-full px-5 py-4 transition-all border rounded-xl bg-[#050816] border-white/10 focus:outline-none focus:border-[#06B6D4] focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-[#F9FAFB] text-sm placeholder:text-[#9CA3AF]"
                      />
                    </div>
                    
                    {status === "error" && (
                      <p className="text-xs font-poppins font-medium text-[#EF4444] drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] pl-1">{message}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading" || !email}
                      className={cn(
                        "w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-xs font-orbitron font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] mt-4 shadow-lg",
                        status === "loading"
                          ? "bg-white/5 text-[#9CA3AF] cursor-not-allowed border border-white/10"
                          : (!isShareMode && action === "unsubscribe")
                            ? "bg-[#EF4444] text-[#F9FAFB] hover:bg-white hover:text-[#050816] shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            : "bg-[#06B6D4] text-[#050816] hover:bg-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      )}
                    >
                      {status === "loading" ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {isShareMode ? "Transmit" : isTrackMode ? "Set Tracking Alert" : action === "subscribe" ? "Connect" : "Disconnect"}
                        </>
                      )}
                    </button>
                    {!isShareMode && !isTrackMode && (
                      <p className="text-[10px] text-center text-[#9CA3AF] font-poppins tracking-wide opacity-80 pt-2">
                        System will ping when premium loot is discounted to 0 credits.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
