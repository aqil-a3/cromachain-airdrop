import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Suspense } from "react";
import Footer from "@/components/layouts/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Cromachain Airdrop",
    default: "Cromachain Airdrop",
  },
  description: "Created with v0",
  generator: "v0.dev",
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
