import type { CustomContext } from "../telegramType";
import axios from "axios";
import { serverEndpoint } from "../telegram";

export async function joinWithReferral(ctx: CustomContext) {
  ctx.session ??= {};
  ctx.session.awaitingReferral = true;

  await ctx.reply(
    "💬 Please send your referral code (e.g. `CROMA-ABC123`).",
    { parse_mode: "Markdown" }
  );
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
    const res = await axios.get(`${serverEndpoint}/api/telegram/referral`, {
      params: {
        telegram_id: ctx.from?.id,
        username: ctx.from?.username || ctx.from?.first_name,
        referral_code: referralCode,
      },
    });

    if (res.data.success) {
      await ctx.reply(
        `✅ Referral verified successfully!\n\nWelcome to *CromaChain*, ${ctx.from?.first_name}!`,
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply(
        `❌ Invalid referral code. Please double-check and try again.`,
        { parse_mode: "Markdown" }
      );
    }
  } catch (err) {
    console.error("Referral check error:", err);
    await ctx.reply(
      "⚠️ A server error occurred. Please try again in a few moments."
    );
  }

  ctx.session.awaitingReferral = false;
}
