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
const defaultTitle = 'Diventa Consulente del Credito | Collabora con Creditplan | Agenti Immobiliari';
const defaultDescription = 'Sei un agente immobiliare? Diventa consulente del credito con Creditplan. Aggiungi mutui e finanziamenti ai tuoi servizi. Formazione dedicata, supporto continuo, provvigioni competitive. Collaborazione attiva dal 2022. Richiedi una call senza impegno.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "consulente del credito",
    "diventare consulente del credito",
    "agente immobiliare consulente credito",
    "collaborazione agenti immobiliari",
    "mutui agenti immobiliari",
    "finanziamenti agenti immobiliari",
    "consulente creditizio",
    "mediazione creditizia agenti",
    "formazione consulente credito",
    "accreditamento OAM",
    "prova OAM",
    "consulente del credito formazione",
    "collaborazione creditplan",
    "provvigioni mutui",
    "provvigioni finanziamenti",
    "agente immobiliare mutui",
    "servizi integrati immobiliare credito",
    "backoffice mutui",
    "convenzioni bancarie agenti",
    "creditplan agenti immobiliari",
    "consulenza creditizia",
    "mediazione creditizia",
    "agente immobiliare plus",
    "servizio completo casa mutuo",
    "partnership agenti immobiliari",
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
        alt: "Creditplan - Diventa Consulente del Credito per Agenti Immobiliari",
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
  category: "Formazione e Consulenza",
  classification: "Professional Services",
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
