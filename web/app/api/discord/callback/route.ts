// const debug_url =
//   "https://discord.com/oauth2/authorize?client_id=1401376092840923246&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds.join";

import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, fetchDiscordUser } from "@/utils/discord/oauth";
import { addUserToGuild } from "@/utils/discord/guild";
import { completeJoinDiscordTask } from "@/utils/discord/task";

const cromaartAmbassadorLink = "http://localhost:3000/api/referral/discord";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const stateKey = state?.split(":")[0];
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const user = await fetchDiscordUser(accessToken);
    const guildRes = await addUserToGuild(user.id, accessToken);

    if (guildRes.status === 201 || guildRes.status === 204) {
      if (stateKey === "cromaart-referral") {
        const referralCode = state?.split(":")[1];
        return NextResponse.redirect(
          new URL(
            `${cromaartAmbassadorLink}?discord-id=${user.id}&username=${user.username}&referral-code=${referralCode}`
          )
        );
      }

      const { success, message } = await completeJoinDiscordTask(user.username);

      if (!success)
        return NextResponse.redirect(
          new URL(
            `/profile?discord-task-success=false&discord-task-message=${message}`,
            req.url
          )
        );

      return NextResponse.redirect(
        new URL(
          `/profile?discord-task-success=true&discord-task-message=${message}`,
          req.url
        )
      );
    } else {
      const error = await guildRes.json();
      console.error("Failed to join guild:", error);
      return NextResponse.redirect(
        new URL("/error?reason=join_failed", req.url)
      );
    }
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
