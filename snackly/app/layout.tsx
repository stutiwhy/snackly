import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/ui/Navbar";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "snackly",
  description: "order snacks right from your movie seat!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", jetbrainsMono.variable)}> 
      <body className={cn(
        geistSans.variable, 
        geistMono.variable, 
        "antialiased bg-background text-foreground font-mono"
      )}>
        <Navbar /> {/* This stays on every page */}
        {children}
      </body>
    </html>
  );
}