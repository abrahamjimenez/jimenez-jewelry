import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";

export const metadata: Metadata = {
  title: "Jimenez Jewelry",
  description:
    "Shop at Jimenez Jewelry for an exquisite collection of 14k gold and silver earrings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body>
        <div className={"flex flex-col min-h-screen max-w-screen-xl mx-auto"}>
          <MantineProvider>
            <header>
              <Header />
            </header>

            <main className={"grow px-4 md:px-3 lg:px-4"}>{children}</main>

            <footer className={""}>
              <Footer />
            </footer>
          </MantineProvider>
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
