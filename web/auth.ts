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
          .maybeSingle();

        const user = mapDbUserToClient(data);

        return { ...user };
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email;

      const { data: userDb } = await userTable
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (!userDb) return false;

      return true;
    },
    jwt(params) {
      const { token, user } = params;
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.telegramUsername = user.telegramUsername;
        token.discordUsername = user.discordUsername;
        token.ethAddress = user.ethAddress;
        token.twitterUsername = user.twitterUsername;
        token.userId = user.userId;
        token.role = user.role;
      }

      return token;
    },
    // @ts-ignore
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...token,
        },
      };
    },
  },
  pages: {
    error: "/?reason=not-found",
  },
});
