import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";

export const metadata: Metadata = {
  title: "WDD499 Capstone",
  description: "WDD499 Capstone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body>
        <MantineProvider>
          <header>
            <Header />
          </header>
          <main>{children}</main>
          <footer>
            <Footer />
          </footer>
        </MantineProvider>
      </body>
    </html>
  );
}
