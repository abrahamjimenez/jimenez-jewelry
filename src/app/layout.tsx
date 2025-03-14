import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";

export const metadata: Metadata = {
  title: "Capstone",
  description: "Capstone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body className={"flex flex-col"}>
      <div className={"max-w-screen-xl mx-auto"}>
        <MantineProvider>
          <header>
            <Header />
          </header>
          <main>{children}</main>
          <footer>
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
