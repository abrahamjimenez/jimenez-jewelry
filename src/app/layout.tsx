import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Suspense } from "react";
import FooterSkeleton from "@/components/FooterSkeleton";

export const metadata: Metadata = {
  title: "14K Gold Stud Earrings & Sterling Silver | Jimenez Jewelry",
  description:
    "Shop stunning sterling silver & 14K gold CZ stud earrings at Jimenez Jewelry. Elegant designs, perfect for any occasion. Browse our collection today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body>
        <div className={"flex flex-col max-w-screen-xl min-h-screen mx-auto"}>
          <MantineProvider
            withGlobalClasses={false}
            withStaticClasses={false}
            withCssVariables={false}
          >
            <header>
              <Suspense fallback={<HeaderSkeleton />}>
                <Header />
              </Suspense>
            </header>

            <main className={"grow p-4 md:p-3 lg:p-4"}>{children}</main>

            <footer className={""}>
              <Suspense fallback={<FooterSkeleton />}>
                <Footer />
              </Suspense>
            </footer>
          </MantineProvider>
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
