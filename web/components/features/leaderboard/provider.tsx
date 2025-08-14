import { LeaderboardUser } from "@/@types/user";
import React, { createContext, useContext } from "react";

interface ContextState {
  leaderboardData: LeaderboardUser[];
  totalParticipants: number;
}

const Context = createContext<ContextState>({} as ContextState);

interface Props {
  leaderboardData: LeaderboardUser[];
  totalParticipants: number;
  children: React.ReactNode;
}

export default function LeaderboardProvider({
  children,
  leaderboardData,
  totalParticipants,
}: Props) {
  const value: ContextState = {
    leaderboardData,
    totalParticipants,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useLeaderboardData = () => useContext(Context);
