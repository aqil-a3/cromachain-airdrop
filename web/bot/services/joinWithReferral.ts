import type { CustomContext } from "../telegramType";
import axios from "axios";

const ambassadorBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://ranking.cromaart.io";

export async function joinWithReferral(ctx: CustomContext) {
  ctx.session ??= {};
  ctx.session.awaitingReferral = true;

  await ctx.reply("💬 Please send your referral code (e.g. `CROMA-ABC123`).", {
    parse_mode: "Markdown",
  });
}

export async function referralCheck(ctx: CustomContext) {
  if (!ctx.session?.awaitingReferral) return;

  const msg = ctx.message;
  if (!msg || !("text" in msg)) {
    await ctx.reply("⚠️ Please send the referral code as plain text.");
    return;
  }

  const referralCode = msg.text.trim().toUpperCase();
  if (!referralCode.startsWith("CROMA-")) {
    await ctx.reply("⚠️ Invalid referral format. Example: `CROMA-ABC123`.", {
      parse_mode: "Markdown",
    });
    return;
  }

  try {
    // ✅ Send as POST JSON body
    const res = await axios.post(`${ambassadorBaseUrl}/api/referral/telegram`, {
      telegram_id: ctx.from?.id,
      username: ctx.from?.username || ctx.from?.first_name,
      referral_code: referralCode,
    });

    if (res.data.success) {
      await ctx.reply(
        `✅ *Referral verified successfully!*\n\nWelcome to *CromaChain*, ${ctx.from?.first_name}! 🎉\n\n👉 Join our community here:\n[Click to Join CromaArt Official](https://t.me/Cromaartofficial)`,
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply(
        `❌ ${res.data.message || "Invalid referral code. Please double-check and try again."}`,
        { parse_mode: "Markdown" }
      );
    }
  } catch (err: any) {
    console.error("Referral check error:", err.response?.data || err.message);
    await ctx.reply(
      `⚠️ A server error occurred.\n\n${
        err.response?.data?.message || "Please try again later."
      }`
    );
  }

  ctx.session.awaitingReferral = false;
}
