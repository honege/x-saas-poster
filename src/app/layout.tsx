import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import GlobalHeaderWrapper from "@/components/layout/GlobalHeaderWrapper";

export const metadata: Metadata = {
  title: "X Auto Poster SaaS",
  description: "X収益化を完全自動化する最強の自動運転システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NextAuthProvider>
          <GlobalHeaderWrapper />
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
