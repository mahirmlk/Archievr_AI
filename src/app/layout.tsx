import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { NavBar } from "@/components/landing/nav-bar";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Archievr AI",
  description: "Track and customize your Artificial Intelligence and Machine Learning roadmap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative min-h-screen bg-neutral-950 font-sans text-zinc-100 antialiased",
          geist.variable,
          geistMono.variable
        )}
      >
        <Providers>
          <NavBar />
          <div className="relative z-10 pt-20">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
