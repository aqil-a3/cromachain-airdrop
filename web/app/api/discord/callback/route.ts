import { getUserByDiscordUsername } from "@/utils/supabase/userTable";
import {
  getUserTasksByUserId,
  updateStatusUserTask,
} from "@/utils/supabase/userTaskTable";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      console.error("Access token error:", tokenData);
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 400 }
      );
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user = await userRes.json();
    const cromaUser = await getUserByDiscordUsername(user.username as string);

    const guildRes = await fetch(
      `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${user.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
        }),
      }
    );

    if (guildRes.status === 201 || guildRes.status === 204) {
      if (cromaUser) {
        const userTasks = await getUserTasksByUserId(
          cromaUser.userId as string
        );
        const joinDiscordTask = userTasks.find(
          (task) => task.task?.title === "Join Discord Community"
        );

        if (joinDiscordTask) {
          await updateStatusUserTask({
            ...joinDiscordTask,
            status: "completed",
          });
        }
      }

      return NextResponse.redirect(
        new URL("/profile?reason=join_discord_success", req.url)
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
