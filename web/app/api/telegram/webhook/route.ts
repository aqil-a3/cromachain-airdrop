import { bot } from "@/bot/telegram";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await bot.handleUpdate(body);
  } catch (err) {
    console.error("Failed to handle Telegram update:", err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
