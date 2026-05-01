import type { Metadata } from "next";
import { Manrope, Noto_Sans_Bengali } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getBaseUrl, siteConfig } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bangla",
  subsets: ["bengali", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: siteConfig.title,
  description: siteConfig.metaDescription,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.metaDescription,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    url: getBaseUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.metaDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${manrope.variable} ${notoSansBengali.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_60%)]" />
          <Navbar />
          <main className="relative flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
