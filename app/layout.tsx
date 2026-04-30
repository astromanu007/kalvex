import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/ui/Chatbot";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "KALVEX | Engineering Excellence & Institutional Innovation",
  description: "India's premier ecosystem for high-stakes engineering research, academic prototypes, and strategic industrial solutions.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-blue-600/10 selection:text-blue-600`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false} 
          forcedTheme="light"
        >
          <Providers>
            <Navbar />
            <main className="flex-grow flex flex-col relative z-0">
              {children}
            </main>
            <Footer />
            <Chatbot />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
