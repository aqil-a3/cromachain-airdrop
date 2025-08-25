import { DiscordTokenResponse, DiscordUser } from "@/@types/discord";
import axios from "axios";

export async function exchangeCodeForToken(code: string) {
  try {
    const body = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    });

    const { data } = await axios.post<DiscordTokenResponse>(
      "https://discord.com/api/oauth2/token",
      body.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  } catch (error: any) {
    console.error("exchangeCodeForToken error:", error.response?.data || error);
    throw error;
  }
}

export async function fetchDiscordUser(accessToken: string) {
  try {
    const { data } = await axios.get<DiscordUser>(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
