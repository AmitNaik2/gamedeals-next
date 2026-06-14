import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Inter, Orbitron } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});



const siteUrl = "https://www.gamesdealshub.me";
const defaultOgImage = "/og?title=GamesDealsHub&platform=Free%20PC%20Games&expiry=Updated%20Daily";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GamesDealsHub | Free PC Games & Deals — Updated Daily",
  description:
    "Track and claim free PC games before they expire. Updated daily with the latest Epic Games, Steam, and GOG freebies.",
  keywords: ["free PC games", "Epic Games freebies", "Steam deals", "100% discount", "free games download", "PC gaming deals", "game giveaways"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "GamesDealsHub | Free PC Games & Deals",
    description: "Track and claim free PC games before they expire.",
    url: `${siteUrl}/`,
    siteName: "GamesDealsHub",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: "GamesDealsHub" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GamesDealsHub | Free PC Games & Deals",
    description: "Track and claim free PC games before they expire.",
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GamesDealsHub",
    url: siteUrl,
    description: "Track free PC games and giveaways updated daily",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#faq", "h1", "h2", ".text-xl"]
    }
  };

  return (
    <html lang="en" className={`h-full antialiased dark ${inter.variable} ${orbitron.variable}`}>
      <head>
        {/* WebSite structured data for Google Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#050505] text-white">

        {/* Google Funding Choices (AdSense consent) */}
        <Script
          id="google-fc-script"
          src="https://fundingchoicesmessages.google.com/i/pub-7564716797174887?ers=1"
          strategy="beforeInteractive"
        />
        <Script id="google-fc-present" strategy="beforeInteractive">
          {`
            (function() {
              function signalGooglefcPresent() {
                try {
                  if (!window.frames['googlefcPresent']) {
                    if (document.body) {
                      const iframe = document.createElement('iframe');
                      iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                      iframe.style.display = 'none';
                      iframe.name = 'googlefcPresent';
                      document.body.appendChild(iframe);
                    } else {
                      setTimeout(signalGooglefcPresent, 0);
                    }
                  }
                } catch(e) {}
              }
              signalGooglefcPresent();
            })();
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KJMQXBNW');
          `}
        </Script>

        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KJMQXBNW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
