import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Suspense } from "react";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['400','500','600','700']
});

export const metadata: Metadata = {
  title: "Sommaire - AI-Powered PDF to Carousel Generator",
  description: "Transform your PDFs into interactive carousels with AI-powered summaries. Upload, analyze, and share beautiful slide presentations instantly.",
  keywords: ["PDF summarizer", "AI carousel", "document analysis", "presentation maker", "PDF to slides"],
  authors: [{ name: "Sommaire Team" }],
  openGraph: {
    title: "Sommaire - AI-Powered PDF to Carousel Generator",
    description: "Transform your PDFs into interactive carousels with AI-powered summaries",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
