import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/helpers/redux/providers";
import SubApp from "@/components/SubApp";
import AutoBrowserTranslate from "./Transalate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Azubi",
  description: "Azubi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AutoBrowserTranslate />
          <SubApp />
          {children}
        </Providers>
      </body>
    </html>
  );
}
