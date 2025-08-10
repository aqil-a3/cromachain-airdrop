import { UserProfile } from "@/@types/user";
import { UserPoints } from "@/@types/user-points";
import { UserReferrals } from "@/@types/user_referrals";
import React, { createContext, useContext } from "react";

interface UserDataContextState {
  users: UserProfile[];
  userReferrals: UserReferrals[];
  userPoints: UserPoints[];
}

const UserDataContext = createContext<UserDataContextState>(
  {} as UserDataContextState
);

interface UserDataProviderProps {
  children: React.ReactNode;
  users: UserProfile[];
  userReferrals: UserReferrals[];
  userPoints: UserPoints[];
}

export default function UserDataProvider({
  children,
  userReferrals,
  users,
  userPoints,
}: UserDataProviderProps) {
  const value: UserDataContextState = {
    userReferrals,
    users,
    userPoints,
  };
  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useAdminUserData = () => useContext(UserDataContext);
