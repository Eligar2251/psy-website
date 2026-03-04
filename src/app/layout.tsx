import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import AppShell from "@/components/AppShell";
import { siteConfig } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "cyrillic"],
  variable: "--font-lora",
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e7a5a",
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["психолог", "психотерапевт", "консультация психолога", "онлайн психолог"],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: BASE_URL,
    siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}