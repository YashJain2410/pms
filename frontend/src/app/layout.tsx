import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { AppShell } from "@/components/providers/app-shell";

const dmSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-Native PMS",
  description: "Performance management platform with AI insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${syne.variable} min-h-screen antialiased`}
      >
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
