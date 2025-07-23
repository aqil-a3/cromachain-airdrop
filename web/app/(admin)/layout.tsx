import { auth } from "@/auth";
import AdminHeader from "@/components/features/admin/header";
import AdminProvider from "@/components/features/admin/provider";
import { AdminSidebar } from "@/components/layouts/sidebar-admin";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Cromachain Airdrop",
    default: "Cromachain Airdrop",
  },
  description: "Created with v0",
  generator: "v0.dev",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return notFound();

  const { user } = session;
  if (user.role !== "admin") return notFound();

  return (
    <AdminProvider user={session.user}>
      <SidebarProvider>
        <AdminSidebar />
        <main className="w-full">
          <AdminHeader />
          {children}
        </main>
      </SidebarProvider>
    </AdminProvider>
  );
}
