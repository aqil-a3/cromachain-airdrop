import { UserProfile } from "@/@types/user";
import { UserReferrals } from "@/@types/user_referrals";
import React, { createContext, useContext } from "react";

interface UserDataContextState {
  users: UserProfile[];
  userReferrals: UserReferrals[];
}

const UserDataContext = createContext<UserDataContextState>(
  {} as UserDataContextState
);

interface UserDataProviderProps {
  children: React.ReactNode;
  users: UserProfile[];
  userReferrals: UserReferrals[];
}

export default function UserDataProvider({
  children,
  userReferrals,
  users,
}: UserDataProviderProps) {
  const value: UserDataContextState = {
    userReferrals,
    users,
  };
  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useAdminUserData = () => useContext(UserDataContext);
