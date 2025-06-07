import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "../../components/ui/toaster";
import { Inter, Caveat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-caveat' });
import type { ReactNode } from 'react'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Dindr - Restaurant Matching App",
  description: "Find restaurants that match your preferences",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <body>{children}
      <Analytics/>
      </body>
      <Toaster />
    </html>
  )
}
