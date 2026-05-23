import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // ✅ FIX: Locked to actual domains — wildcard allowed ANY site's images
    remotePatterns: [
      { protocol: "https", hostname: "www.gamerpower.com" },
      { protocol: "https", hostname: "cdn.gamerpower.com" },
      { protocol: "https", hostname: "store-cdn.epicgames.com" },
      { protocol: "https", hostname: "cdn1.epicgames.com" },
      { protocol: "https", hostname: "cdn2.epicgames.com" },
      { protocol: "https", hostname: "shared.cloudflare.steamstatic.com" },
      { protocol: "https", hostname: "cdn.akamai.steamstatic.com" },
    ],
  },

  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline'
        https://www.googletagmanager.com
        https://pagead2.googlesyndication.com
        https://fundingchoicesmessages.google.com
        https://googleads.g.doubleclick.net
        https://cdn.ampproject.org
        https://va.vercel-scripts.com
        https://vitals.vercel-insights.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src * data: blob:;
      font-src 'self' https://fonts.gstatic.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      frame-src 'self'
        https://www.googletagmanager.com
        https://googleads.g.doubleclick.net
        https://fundingchoicesmessages.google.com;
      connect-src 'self'
        https://www.google-analytics.com
        https://pagead2.googlesyndication.com
        https://googleads.g.doubleclick.net
        https://vitals.vercel-insights.com
        https://va.vercel-scripts.com
        https://www.gamerpower.com
        https://store-site-backend-static.ak.epicgames.com;
    `.replace(/\s{2,}/g, " ").trim();

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Vary", value: "Accept-Encoding" },
        ],
      },
    ];
  },

  async rewrites() {
    // ✅ FIX: Pass platform as query param so each URL serves distinct filtered content
    // Previously all rewrites went to "/" with no differentiation — duplicate content for Google
    return [
      { source: "/free_steam_games", destination: "/?platform=steam" },
      { source: "/free-steam-games", destination: "/?platform=steam" },
      { source: "/free_epic_games", destination: "/?platform=epic-games-store" },
      { source: "/free-epic-games", destination: "/?platform=epic-games-store" },
      { source: "/free_gog_games", destination: "/?platform=gog" },
      { source: "/free-gog-games", destination: "/?platform=gog" },
    ];
  },
};

export default nextConfig;
