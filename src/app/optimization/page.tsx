import type { Metadata } from "next";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = "https://www.gamesdealshub.me";

export const metadata: Metadata = {
  title: "PC Gaming Optimization Guide | Boost FPS Without Buying Hardware",
  description:
    "An 800+ word GamesDealsHub PC optimization guide covering Windows settings, GPU drivers, game graphics options, storage, thermals, and FPS stability.",
  keywords: [
    "PC optimization",
    "boost FPS",
    "gaming performance",
    "Windows gaming settings",
    "low end PC gaming",
    "GPU driver settings",
    "GamesDealsHub optimization",
  ],
  alternates: { canonical: `${siteUrl}/optimization` },
  openGraph: {
    title: "PC Gaming Optimization Guide | GamesDealsHub",
    description: "Boost FPS, reduce stutter, and make free PC games run better without buying new hardware.",
    url: `${siteUrl}/optimization`,
    siteName: "GamesDealsHub",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "PC Gaming Optimization Guide" }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PC Gaming Optimization Guide | GamesDealsHub",
    description: "Practical performance tuning for smoother PC gaming.",
    images: ["/og-image.jpg"],
  },
};

const sections = [
  {
    heading: "Start With a Clean Baseline",
    body: "Optimization begins before you touch a graphics slider. A slow PC is often not limited by raw hardware; it is limited by background software, thermal throttling, old drivers, full storage, or conflicting overlays. Before changing game settings, restart the machine, close browsers with dozens of tabs, pause cloud sync during gameplay, and open Task Manager to see what is actually using CPU, memory, disk, and GPU resources. If a launcher, RGB utility, recording app, or browser helper is consuming resources while you play, disable it for the session. This baseline matters because you cannot judge a graphics tweak accurately while another process is causing stutter in the background.",
  },
  {
    heading: "Tune Windows for Stable Gaming",
    body: "Windows settings can help or hurt frame pacing. Set Power Mode to Best Performance on desktops and plugged-in laptops. Review startup apps and disable anything you do not need immediately after boot. Turn off background recording if you do not use it, because constant capture can create micro-stutter on weaker CPUs or slower drives. Game Mode is worth leaving on for most users because it helps prioritize game processes, but it is not magic. Also check Windows Update before a long gaming session; pending updates can trigger background work at the worst possible time. The goal is not to strip Windows down until it breaks. The goal is to remove avoidable interruptions.",
  },
  {
    heading: "Update GPU Drivers Carefully",
    body: "GPU drivers are one of the simplest performance wins, especially for new releases. NVIDIA, AMD, and Intel frequently ship game-ready updates that fix crashes, shader compilation issues, and poor performance in specific titles. Update from the official driver software or website rather than random driver bundles. If a new driver causes problems, roll back to the previous stable version instead of stacking fixes on top of fixes. In NVIDIA Control Panel, Prefer Maximum Performance can help avoid downclocking in demanding games, though it may increase power draw. In AMD Software, Anti-Lag can reduce input latency in GPU-bound games. Do not copy every setting from a random optimization video; change one thing at a time and test.",
  },
  {
    heading: "Use the Right In-Game Settings",
    body: "The fastest way to gain FPS is knowing which visual settings are expensive. Volumetric fog, ray tracing, ultra shadows, screen-space reflections, high crowd density, and heavy anti-aliasing can destroy performance while adding relatively small visual improvements during actual play. Texture quality is different: if you have enough VRAM, high textures often look better without a large FPS cost. Start with a balanced preset, then lower the expensive settings first. Keep resolution at your monitor's native value when possible, and use DLSS, FSR, or XeSS Quality mode if the game supports it. Upscaling in Quality mode often provides a major performance boost while preserving image clarity better than dropping native resolution.",
  },
  {
    heading: "Fix Stutter, Not Just Average FPS",
    body: "Average FPS is only part of the experience. A game can report 90 FPS and still feel bad if frame times spike. Stutter can come from shader compilation, slow storage, insufficient RAM, thermal throttling, overlays, or unstable CPU boosts. Install large open-world games on an SSD when possible. Leave enough free space on the drive so Windows and the game can manage temporary files. If your system has 8 GB of RAM, close everything unnecessary before launching modern titles. If temperatures are high, clean dust filters, improve airflow, and check that laptop vents are not blocked. Stable frame pacing often feels better than chasing a higher but inconsistent maximum FPS.",
  },
  {
    heading: "Set Practical FPS Targets",
    body: "Not every game needs the same target. Competitive shooters benefit from high refresh rates and low latency, so lowering visuals aggressively can make sense. Story games, strategy titles, and slower RPGs may feel excellent at a locked 60 FPS with better image quality. A stable cap can reduce heat, fan noise, and stutter. Use in-game frame limiters when available, or the limiter in your GPU control panel. If your system swings between 70 and 110 FPS, a 72 or 90 FPS cap may feel smoother than an uncapped frame rate. Optimization is not about making every slider low. It is about matching settings to the game, monitor, and hardware you actually have.",
  },
  {
    heading: "Keep Launchers and Libraries Under Control",
    body: "Free game hunters often install multiple launchers, and each one wants to run background services. Steam, Epic, GOG Galaxy, EA App, Ubisoft Connect, Battle.net, and Prime-related tools can all add startup tasks or overlays. You do not need every launcher open all the time. Disable auto-start for launchers you use occasionally, and open them only when claiming, updating, or playing a game from that library. Also review overlay settings. Steam Overlay is useful for screenshots and invites, but stacking it with Discord, GPU overlay, recording overlay, and launcher overlay can create conflicts. Fewer active overlays means fewer chances for capture hooks to affect performance.",
  },
  {
    heading: "Measure Changes Like a Deal Hunter",
    body: "Treat optimization like testing a deal: verify before you trust it. Use a repeatable benchmark area, record average FPS and 1% lows, change one setting, then test again. If a tweak gives no measurable benefit, revert it. Avoid registry hacks and miracle booster apps that promise huge gains without explaining the tradeoff. Many of them disable useful services, break updates, or create security problems. The best optimizations are boring: clean startup, current drivers, sensible graphics settings, SSD storage, healthy temperatures, and stable frame caps. Those steps help free games and premium releases alike, and they cost nothing except a little attention.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GamesDealsHub",
    url: siteUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "GamesDealsHub PC Optimization Guide",
    description: "A free PC gaming optimization guide for boosting FPS and reducing stutter.",
    brand: { "@type": "Brand", name: "GamesDealsHub" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What setting usually improves FPS the most?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lowering ray tracing, volumetric effects, shadows, and reflections often improves FPS more than lowering every setting equally.",
        },
      },
      {
        "@type": "Question",
        name: "Should I use DLSS, FSR, or XeSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use Quality mode first when available. It often improves performance while preserving image quality better than lowering native resolution.",
        },
      },
    ],
  },
];

export default function OptimizationPage() {
  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <main className="min-h-screen px-4 py-24 md:px-8">
        <article className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0F172A]/80 p-6 md:p-10">
          <header className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#06B6D4]">Performance Tuning</span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              PC Gaming Optimization Guide
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#9CA3AF]">
              A practical guide to smoother frame rates, fewer stutters, cleaner launchers, and better settings choices without buying new hardware.
            </p>
          </header>

          <div className="space-y-8 font-poppins text-[15px] leading-8 text-[#D1D5DB]">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-3 border-b border-white/10 pb-3 text-2xl font-bold text-white">
                  {section.heading}
                </h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>

          <AuthorBox />
        </article>
      </main>
    </>
  );
}
