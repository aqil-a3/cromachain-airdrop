"use client";

import { UserProfile } from "@/@types/user";
import React, { createContext, useContext } from "react";

interface AdminContextState {
  user: UserProfile;
}

const AdminContext = createContext<AdminContextState>({} as AdminContextState);

interface AdminProviderProps {
  user: UserProfile;
  children: React.ReactNode;
}

export default function AdminProvider({ children, user }: AdminProviderProps) {
  const value: AdminContextState = {
    user,
  };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export const useAdminData = () => useContext(AdminContext);
