import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY!);

const serverEndpoint = "http://localhost:3000";
const channelUsername = "@test2514group"; // Ganti dengan nama channel kamu

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
      // ✅ User sudah join, lanjutkan verifikasi
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
        "✅ Kamu berhasil join ke channel. Tugas kamu sudah diverifikasi otomatis."
      );
    } else {
      // ❌ User tidak join, kirim tombol join
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
    // Biasanya error ini muncul jika user memang belum join sama sekali
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

// 🔁 Tangani klik tombol "Saya sudah join"
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

bot.launch();
