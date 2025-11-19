import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creditplan.it';
const siteName = 'Creditplan';
const defaultTitle = 'Cessione del Quinto in 48 Ore | Prestito fino a 75.000€ | Creditplan';
const defaultDescription = 'Ottieni fino a 75.000€ con la cessione del quinto in sole 48 ore. Processo rapido, sicuro e completamente digitale. Istruttoria gratuita, approvazione in 24h, erogazione in 48h. Richiedi ora senza impegno!';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "cessione del quinto",
    "prestito cessione quinto",
    "finanziamento cessione quinto",
    "cessione quinto pensione",
    "cessione quinto dipendenti",
    "prestito dipendenti pubblici",
    "prestito dipendenti privati",
    "prestito pensionati",
    "prestito fino a 75000 euro",
    "prestito rapido 48 ore",
    "prestito senza garante",
    "prestito trattenuta busta paga",
    "creditplan",
    "prestito personale",
    "finanziamento personale",
    "prestito online",
    "prestito veloce",
    "prestito sicuro",
    "prestito trasparente",
    "prestito senza costi nascosti",
    "prestito istruttoria gratuita",
    "prestito approvazione rapida",
    "prestito erogazione veloce",
    "delegazione di pagamento",
    "prestito INPS",
    "prestito ente pensionistico",
  ],
  authors: [{ name: "Creditplan Italia Network di Mediazione Credizia" }],
  creator: "Creditplan",
  publisher: "Creditplan",
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Creditplan - Cessione del Quinto in 48 Ore",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@creditplan",
    site: "@creditplan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  category: "Finanza e Prestiti",
  classification: "Financial Services",
  other: {
    'format-detection': 'telephone=yes',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://creditplan.it" />
        <link rel="preconnect" href="https://www.organismo-am.it" />
        <link rel="dns-prefetch" href="https://creditplan.it" />
        <link rel="dns-prefetch" href="https://www.organismo-am.it" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="IT" />
        <meta name="geo.placename" content="Italia" />
        <meta name="language" content="Italian" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17086810445"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17086810445');
          `}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u8gs2pf8t0");
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
