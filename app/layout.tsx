import type { Metadata } from "next";
import "./globals.css";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { SITE_TITLE } from "@/lib/config";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description:
    "Build tabs, persist to localStorage, and generate a single-file HTML with inline CSS + JS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header />
        <main id="main" className="container" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
