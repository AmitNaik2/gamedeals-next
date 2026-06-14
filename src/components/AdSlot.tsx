import { cn } from "@/lib/utils";

interface AdSlotProps {
  id: string;
  className?: string;
}

export function AdSlot({ id, className }: AdSlotProps) {
  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={id}
      className={cn(
        "relative flex min-h-[112px] w-full items-center justify-center rounded-2xl border border-white/10 bg-[#0F172A]/70 px-4 py-6 text-[10px] font-orbitron font-bold uppercase tracking-widest text-white/35",
        className
      )}
    >
      <ins
        className="adsbygoogle block min-h-[90px] w-full"
        data-ad-client="ca-pub-7564716797174887"
        data-ad-slot={id}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <span className="pointer-events-none absolute">Advertisement</span>
    </aside>
  );
}
