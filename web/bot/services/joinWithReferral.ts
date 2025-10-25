import { Message } from "telegraf/types";
import { CustomContext } from "../telegramType";

export async function joinWithReferral(ctx: CustomContext) {
  ctx.session ??= {};
  ctx.session.awaitingReferral = true;
  await ctx.reply("Insert your referral");
}

export async function referralCheck(ctx: CustomContext) {
  if (!ctx.session?.awaitingReferral) return;

  const referralCode = (ctx.message as Message.TextMessage)?.text
    ?.trim()
    .toUpperCase();
  if (!referralCode) return ctx.reply("⚠️ Please a valid referral.");

  await ctx.reply(`Referral received: ${referralCode}`);
  ctx.session.awaitingReferral = false;
}
