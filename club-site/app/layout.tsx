import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import CursorGlow from "@/components/ui/CursorGlow";
import LoadingScreen from "@/components/ui/LoadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Place XP — VIT Chennai's Placement-Focused Technical Club",
  description:
    "Place XP is VIT Chennai's premier placement-focused technical club. We equip students with industry-relevant skills, real-world experience, and career opportunities through workshops, hackathons, and mentorship.",
  keywords: [
    "Place XP",
    "VIT Chennai",
    "placement club",
    "technical club",
    "hackathons",
    "workshops",
    "career development",
    "student community",
  ],
  openGraph: {
    title: "Place XP — Equip. Engage. Execute.",
    description:
      "VIT Chennai's official placement-focused technical club. Building industry-ready professionals.",
    type: "website",
    locale: "en_IN",
    siteName: "Place XP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Place XP — Equip. Engage. Execute.",
    description:
      "VIT Chennai's official placement-focused technical club. Building industry-ready professionals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <LoadingScreen />
        <LenisProvider>
          {/* Noise Texture Overlay */}
          <div className="noise-overlay" />

          {/* Cursor Glow */}
          <CursorGlow />

          {/* Main Content */}
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
