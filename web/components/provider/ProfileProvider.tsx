import { TaskUser } from "@/@types/task-user";
import { Task } from "@/@types/tasks";
import { UserProfile } from "@/@types/user";
import React, { createContext, useContext } from "react";

interface ProfileContextType {
  tasks: Task[];
  userTasks: TaskUser[];
  userPoints: number;
  user: UserProfile;
  userReferralCount: number;
  userNFTReferalCount: number;
}

const ProfileContext = createContext<ProfileContextType>(
  {} as ProfileContextType
);

interface ProfileProviderProps {
  tasks: Task[];
  userTasks: TaskUser[];
  userPoints: number;
  user: UserProfile;
  userReferralCount: number;
  children: React.ReactNode;
  userNFTReferalCount: number;
}

export default function ProfileProvider({
  children,
  tasks,
  user,
  userPoints,
  userReferralCount,
  userTasks,
  userNFTReferalCount,
}: ProfileProviderProps) {
  const value: ProfileContextType = {
    tasks,
    user,
    userPoints,
    userReferralCount,
    userTasks,
    userNFTReferalCount,
  };
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export const useProfileData = () => useContext(ProfileContext);
