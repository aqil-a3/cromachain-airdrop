import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { userTable } from "./utils/supabase/client";
import { getUserByEmail } from "./utils/supabase/userTable";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      async profile(profile) {
        const { email } = profile;

        const user = await getUserByEmail(email);

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      const { profile } = params;
      if (profile) {
        const { email } = profile;

        const user = await getUserByEmail(String(email));
        if (user) {
          return true;
        }
      }
      return false;
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
