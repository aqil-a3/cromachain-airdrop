import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { userTable } from "./utils/supabase/client";
import { mapDbUserToClient } from "./lib/map-data/mapDbUserToClient";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      async profile(profile) {
        const { email } = profile;

        const { data } = await userTable
          .select("*")
          .eq("email", email)
          .single();

        const user = mapDbUserToClient(data);

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email;

      const { data: userDb } = await userTable
        .select("*")
        .eq("email", email)
        .single();

      if (!userDb) return false;

      return true;
    },
  },
  pages: {
    error: "/?reason=not-found",
  },
});
