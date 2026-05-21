import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealTitle?: string;
  dealUrl?: string;
}

export function EmailModal({ isOpen, onClose, dealTitle, dealUrl }: EmailModalProps) {
  const [email, setEmail] = useState("");
  const [action, setAction] = useState<"subscribe" | "unsubscribe">("subscribe");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isShareMode = !!dealTitle && !!dealUrl;

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
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-[#0A0A0B] border border-white/10 shadow-2xl rounded-2xl pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-serif italic text-white">
                  {isShareMode ? "Share Deal" : "Never miss a drop."}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  title="Close"
                  className="p-2 text-white/40 transition-colors rounded-full hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {isShareMode && (
                  <div className="p-3 mb-6 border rounded-lg bg-white/5 border-white/10">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-1">Sharing</p>
                    <p className="font-bold text-white line-clamp-1 text-sm">{dealTitle}</p>
                  </div>
                )}

                {status === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-8 space-y-4 text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-[#7C3AED] shrink-0" />
                    <p className="text-lg font-medium text-white">{message}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isShareMode && (
                      <div className="flex items-center gap-4 mb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="modalAction" 
                            value="subscribe" 
                            checked={action === "subscribe"} 
                            onChange={() => setAction("subscribe")}
                            className="accent-[#7C3AED]"
                          />
                          <span className="text-xs text-white/70">Subscribe</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="modalAction" 
                            value="unsubscribe" 
                            checked={action === "unsubscribe"} 
                            onChange={() => setAction("unsubscribe")}
                            className="accent-rose-500"
                          />
                          <span className="text-xs text-white/70">Unsubscribe</span>
                        </label>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/50">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={status === "loading"}
                        className="w-full px-4 py-3 transition-colors border rounded-lg bg-black/40 border-white/10 focus:outline-none focus:border-[#7C3AED] text-white text-xs placeholder:text-white/40"
                      />
                    </div>
                    
                    {status === "error" && (
                      <p className="text-sm text-rose-500">{message}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading" || !email}
                      className={cn(
                        "w-full py-3 px-4 rounded flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-[0.98] mt-2",
                        status === "loading"
                          ? "bg-white/10 text-white/40 cursor-not-allowed"
                          : (!isShareMode && action === "unsubscribe")
                            ? "bg-rose-500 text-white hover:bg-rose-600"
                            : "bg-[#7C3AED] text-white hover:bg-[#8A4AF3]"
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
                          {isShareMode ? "Send Deal" : action === "subscribe" ? "Subscribe" : "Unsubscribe"}
                        </>
                      )}
                    </button>
                    {!isShareMode && (
                      <p className="text-[11px] text-center text-white/40 tracking-tight">
                        We will notify you the moment a premium game becomes 100% free. No spam.
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
