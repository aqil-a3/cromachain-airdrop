import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import Footer from "@/components/layouts/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Cromachain Airdrop",
    default: "Cromachain Airdrop",
  },
  description:
    "Join the official Cromachain airdrop and earn free CROMA tokens by completing simple social tasks. Don’t miss your chance to be part of the Web3 revolution with Cromachain!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <SessionProvider>
            {children}
            <Footer />

            <Toaster />
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
