"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useAdminData } from "./provider";
import { cn } from "@/lib/utils";

export default function AdminHeader() {
  const { user } = useAdminData();
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-gradient-to-r from-yellow-700 to-slate-700 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="p-2 rounded-md hover:bg-slate-700 text-white transition-colors duration-200" />
        <h1 className="hidden md:block text-xl font-semibold text-white tracking-wide">
          Cromachain Airdrop Admin
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer",
                "transition-all duration-200 hover:bg-slate-600 hover:shadow-md"
              )}
            >
              <span className="text-sm text-white font-medium">
                {user.name.split(" ")[0]}
              </span>
              <Avatar className="w-9 h-9 ring-2 ring-slate-300 transition-transform duration-200 hover:scale-105">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback className="bg-slate-500 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-40 p-2 animate-in fade-in zoom-in bg-white border border-slate-200 shadow-lg rounded-md"
          >
            <div className="flex flex-col gap-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-slate-100"
                >
                  Home
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-rose-600 hover:bg-rose-50"
                onClick={() => signOut({ redirectTo: "/" })}
              >
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
