import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY!);

const serverEndpoint =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://airdrop.cromachain.com";
const channelUsername = "@test2514group";

bot.start(async (ctx) => {
  const token = ctx.payload;
  const telegramId = ctx.from.id;
  const telegramUsername = ctx.from.username;

  try {
    const memberInfo = await ctx.telegram.getChatMember(
      channelUsername,
      telegramId
    );

    if (
      memberInfo.status === "member" ||
      memberInfo.status === "administrator" ||
      memberInfo.status === "creator"
    ) {
      await fetch(`${serverEndpoint}/api/telegram/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          telegramId,
          telegramUsername,
        }),
      });

      ctx.reply(
        "✅ Kamu berhasil joinijoijijijoi ke channel. Tugas kamu sudah diverifikasi otomatis."
      );
    } else {
      ctx.reply(
        "❌ Kamu belum join ke channel. Silakan join dulu lalu klik tombol 'Saya sudah join'.",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Join Channel",
                  url: `https://t.me/${channelUsername.replace("@", "")}`,
                },
              ],
              [{ text: "✅ Saya sudah join", callback_data: "verify_join" }],
            ],
          },
        }
      );
    }
  } catch (err) {
    console.error("Gagal cek keanggotaan channel:", err);
    ctx.reply(
      "Untuk menyelesaikan tugas ini, kamu harus join channel terlebih dahulu.",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Join Channel",
                url: `https://t.me/${channelUsername.replace("@", "")}`,
              },
            ],
            [{ text: "✅ Saya sudah join", callback_data: "verify_join" }],
          ],
        },
      }
    );
  }
});

bot.action("verify_join", async (ctx) => {
  const telegramId = ctx.from.id;
  const telegramUsername = ctx.from.username;
  const token = ctx.chat?.type === "private" ? ctx.chat.id.toString() : null;

  try {
    const memberInfo = await ctx.telegram.getChatMember(
      channelUsername,
      telegramId
    );

    if (
      memberInfo.status === "member" ||
      memberInfo.status === "administrator" ||
      memberInfo.status === "creator"
    ) {
      // Verifikasi ke server
      await fetch(`${serverEndpoint}/api/telegram/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          telegramId,
          telegramUsername,
        }),
      });

      await ctx.answerCbQuery();
      ctx.editMessageText(
        "✅ Verifikasi berhasil! Kamu sudah join channel dan tugas diselesaikan."
      );
    } else {
      await ctx.answerCbQuery();
      ctx.reply(
        "❌ Kamu belum join channel. Silakan klik tombol Join Channel dan ulangi."
      );
    }
  } catch (err) {
    console.error("Error saat memverifikasi ulang:", err);
    await ctx.answerCbQuery();
    ctx.reply(
      "🚨 Terjadi kesalahan saat mencoba memverifikasi ulang. Silakan coba lagi."
    );
  }
});

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
