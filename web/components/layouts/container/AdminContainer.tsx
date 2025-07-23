import { cn } from "@/lib/utils";
import React from "react";

interface AdminContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function AdminContainer({
  children,
  className,
}: AdminContainerProps) {
  return (
    <div className={cn("bg-slate-800 min-h-screen py-8 px-4", className)}>{children}</div>
  );
}
