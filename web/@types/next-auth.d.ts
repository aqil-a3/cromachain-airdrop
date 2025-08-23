import { DefaultSession } from "next-auth";
import { UserProfile } from "./user";

declare module "next-auth" {
  interface Session {
    user: UserProfile;
  }

  interface User extends UserProfile {}z
}
