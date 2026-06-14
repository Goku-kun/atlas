import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UiStoreProvider } from "@/providers/ui-store-provider";
import { ThemeEffect } from "@/components/theme-effect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas — multi-persona AI chat",
  description:
    "Create AI assistants, each with its own voice, and hold persistent conversations you can share.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `dark` is the shipped default and matches the UI store's initial theme, so the
    // server and first client paint agree (no flash). ThemeEffect toggles it live.
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UiStoreProvider>
          <ThemeEffect />
          {children}
        </UiStoreProvider>
      </body>
    </html>
  );
}
