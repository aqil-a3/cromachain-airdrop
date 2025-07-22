import { DefaultSession } from "next-auth";
import { UserProfile } from "./user";

declare module "next-auth" {
  interface Session {
    user: UserProfile & DefaultSession["user"];
  }

  interface User extends UserProfile {}
}
