import { auth } from "@/auth";
import { createNewTelegramToken } from "@/utils/supabase/telegramVericationToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user) return NextResponse.redirect(new URL("/"));

  const token = await createNewTelegramToken(
    user.userId as string,
    user.telegramUsername
  );
  const telegramLink = `https://t.me/test_aqil_bot?start=${token}`;

  return NextResponse.redirect(new URL(telegramLink));
}
