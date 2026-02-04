import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation, MobileNavigation } from "@/components/Navigation";
import { ChatBot } from "@/components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FairRoute AI | Fairness-by-Design Dispatch System",
  description:
    "A fairness-aware delivery dispatch system that balances human effort, not just distance or time, and explains decisions transparently.",
  keywords: ["dispatch", "fairness", "AI", "delivery", "workload", "transparency"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FairRoute AI" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        
        {/* Service Worker Registration */}
        <script src="/register-sw.js" defer></script>
        
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        {/* Subtle background pattern */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-[100px]" />
        </div>
        
        <Navigation />
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 pb-24 md:pb-8">{children}</main>
        <ChatBot />
        <MobileNavigation />
      </body>
    </html>
  );
}
