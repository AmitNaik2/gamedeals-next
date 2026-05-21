import { motion } from "motion/react";

export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group relative bg-[#111827]/80 backdrop-blur-md rounded-[24px] sm:rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col h-full animate-pulse"
    >
      <div className="relative aspect-[16/9] bg-white/5 border-b border-white/5" />
      <div className="flex flex-col flex-grow p-4 sm:p-5 relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-12 bg-white/10 rounded-sm" />
          <div className="h-4 w-16 bg-[#8B5CF6]/20 rounded-sm" />
        </div>
        <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
        <div className="h-5 w-1/2 bg-white/10 rounded mb-4" />
        <div className="space-y-2 mt-auto">
          <div className="h-3 w-full bg-white/5 rounded" />
          <div className="h-3 w-5/6 bg-white/5 rounded" />
        </div>
        <div className="flex items-end justify-between mt-6">
          <div>
            <div className="h-3 w-10 bg-[#06B6D4]/20 rounded mb-1.5" />
            <div className="h-5 w-16 bg-[#22C55E]/20 rounded" />
          </div>
          <div className="h-10 w-28 bg-[#8B5CF6]/10 rounded-xl" />
        </div>
      </div>
    </motion.div>
  );
}
