import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { PageTransition } from "@/components/motion/page-transition";
import { GlobalBackground } from "@/components/layout/global-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AdFlow Pro",
    template: "%s • AdFlow Pro",
  },
  description:
    "A moderated sponsored listing marketplace with packages, scheduling, payment verification, analytics, and external media normalization.",
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <GlobalBackground />
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
