import { getUserByTelegramUsername } from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const telegramUsername = req.nextUrl.searchParams.get("telegramUsername");

  if (!telegramUsername) throw new Error("No telegram username");

  const user = await getUserByTelegramUsername(telegramUsername);

  if (user) return NextResponse.json({ isJoined: true });

  return NextResponse.json({ isJoined: false });
}
