"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: `/admin`,
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "User",
      href: `/admin/user`,
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Task",
      href: `/admin/task`,
      icon: <ClipboardCheck className="w-4 h-4" />,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup title="Navigasi">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm text-slate-700 hover:bg-slate-100 transition-colors",
                  pathname === item.href && "bg-slate-200 font-semibold"
                )}
              >
                {item.icon}
                {item.label}
              </div>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="text-xs text-slate-500 px-4">v1.0</p>
      </SidebarFooter>
    </Sidebar>
  );
}
