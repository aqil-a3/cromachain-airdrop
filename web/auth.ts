import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credential from "next-auth/providers/credentials";
import { getUserByEmail } from "./utils/supabase/userTable";
import bcrypt from "bcryptjs";
import { mapDbUserToClient } from "./lib/map-data/mapDbUserToClient";
import { CredentialsSignin } from "next-auth";

class InvalidLoginError extends CredentialsSignin {
  code = "invalid_credentials";
}

class NoPasswordError extends CredentialsSignin {
  code = "no_password";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      async profile(profile) {
        const { email } = profile;

        const userDb = await getUserByEmail(email);
        const user = mapDbUserToClient(userDb);
        user.password = undefined;

        return user;
      },
    }),
    Credential({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const user = await getUserByEmail(email as string);

          if (!user) throw new Error("User not found");
          if (!user.password) throw new NoPasswordError();

          const isPasswordCorrect = await bcrypt.compare(
            password as string,
            user.password as string
          );

          if (!isPasswordCorrect) throw new InvalidLoginError();
          user.password = undefined;

          return mapDbUserToClient(user);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      const { profile, user } = params;
      if (user) return true;

      if (profile) {
        const { email } = profile;

        const dbUser = await getUserByEmail(String(email));
        if (dbUser) return true;
      }

      console.warn("signIn denied: user not found", profile?.email);
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
    signIn: "/",
  },
});
