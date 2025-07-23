import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { userTable } from "./utils/supabase/client";
import { mapDbUserToClient } from "./lib/map-data/mapDbUserToClient";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // TODO : Fix this later
  providers: [
    Google({
      async profile(profile) {
        console.log("Profile Google Eksekusi");
        const { email } = profile;
        console.log("Email Pengguna", email);

        const res = await userTable.select("*").eq("email", email);
        console.log(res);
        const { data } = res;

        if (!data || data.length === 0) {
          console.error("User tidak ditemukan di DB");
          throw new Error("Data user tidak ada");
        }

        const rawUser = data[0];
        const user = mapDbUserToClient(rawUser);

        console.log("User final:", user);

        return {
          ...user,
          id: user.userId || rawUser.id || profile.sub,
          name: user.name || profile.name,
          email: user.email || profile.email,
          image: profile.picture || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      const { profile } = params;
      console.log(params);
      console.log("Email sign in diproses");
      const email = profile?.email;

      console.log("Cek data user di db");
      const { data: userDb, error: userError } = await userTable
        .select("*")
        .eq("email", email)
        .maybeSingle();

      console.log("Cek data selesai");

      if (!userDb || userError) {
        console.log("terjadi error");
        console.log(userError);
        console.log(userDb);
        return false;
      }

      console.log("user berhasil login");
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
