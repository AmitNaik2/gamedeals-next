import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gamedeals-next.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GamesDealsHub | Free PC Games & Deals — Updated Daily",
  description: "Track and claim free PC games before they expire. Updated daily with the latest Epic Games, Steam, and GOG freebies.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GamesDealsHub | Free PC Games & Deals",
    description: "Track and claim free PC games before they expire.",
    url: `${siteUrl}/`,
    siteName: "GamesDealsHub",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "GamesDealsHub" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GamesDealsHub | Free PC Games & Deals",
    description: "Track and claim free PC games before they expire.",
    images: ["/og-image.jpg"],
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#050505] text-white">
        {/* Google Funding Choices */}
        <Script id="google-fc-script" src="https://fundingchoicesmessages.google.com/i/pub-7564716797174887?ers=1" strategy="beforeInteractive" />
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
        
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KJMQXBNW');
          `}
        </Script>
        
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KJMQXBNW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {children}
      </body>
    </html>
  );
}
