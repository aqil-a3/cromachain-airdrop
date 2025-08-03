import { Telegraf } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/types";
import dotenv from "dotenv";
import { verifyUserMember } from "./services/verifyUser";
import { verifyUserWeb } from "./services/verifyUserWeb";
import { claimReward } from "./services/claimReward";
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY!);

export const serverEndpoint =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://airdrop.cromachain.com";
// export const serverEndpoint = "http://localhost:3000";
export const channelUsername = "@test2514group";

export const reply_markup: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: "🚀 Join Channel",
        url: `https://t.me/${channelUsername.replace("@", "")}`,
      },
      {
        text: "🚀 Register!",
        url: `https://airdrop.cromachain.com`,
      },
    ],
    [
      {
        text: "Have I joined the channel?",
        callback_data: "verify_join_telegram",
      },
    ],
    [
      {
        text: "Have I registered to web?",
        callback_data: "verify_join_web",
      },
    ],
    [
      {
        text: "Claim reward",
        callback_data: "claim_reward",
      },
    ],
  ],
};

bot.start(async (ctx) => {
  await ctx.reply("👋 Welcome to Cromachain Bot!", { reply_markup });
});

bot.action("verify_join_telegram", async (ctx) => verifyUserMember(ctx));
bot.action("verify_join_web", async (ctx) => verifyUserWeb(ctx));
bot.action("claim_reward", async (ctx) => claimReward(ctx));

export { bot };
