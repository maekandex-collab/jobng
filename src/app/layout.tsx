import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = "https://www.justjobng.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JustJobNG – Find Your Next Job",
    template: "%s | JustJobNG",
  },
  description:
    "Nigeria's No. 1 job aggregator platform. Browse live listings, apply to top Jobs, and grow your career. Subscribe via *7098#.",
  keywords: "jobs Nigeria, careers, employment, job search, JustJobNG, MTN jobs",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "JustJobNG – Find Your Next Job in Nigeria",
    description:
      "Browse live listings, apply to top jobs, and grow your career. Subscribe via *7098#.",
    url: siteUrl,
    siteName: "JustJobNG",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JustJobNG – Nigeria's No. 1 Job Aggregator",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JustJobNG – Find Your Next Job",
    description:
      "Browse live listings, apply to top jobs, and grow your career. Subscribe via *7098#.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${plusJakarta.variable} ${dmSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased min-h-screen flex flex-col bg-(--ink) text-(--surface)">
        <AuthProvider>
          <Navbar />
          <main className="grow pt-(--spacing-nav-height)">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}