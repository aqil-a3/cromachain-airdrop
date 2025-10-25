import { Telegraf } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/types";
import dotenv from "dotenv";
import { verifyUserMember } from "./services/verifyUser";
import { verifyUserWeb } from "./services/verifyUserWeb";
import { claimReward } from "./services/claimReward";
import { session } from "telegraf";
import { joinWithReferral, referralCheck } from "./services/joinWithReferral";
import { CustomContext } from "./telegramType";
dotenv.config();

const bot = new Telegraf<CustomContext>(process.env.TELEGRAM_BOT_API_KEY!);

bot.use(session());

export const serverEndpoint =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://airdrop.cromachain.com";
// export const serverEndpoint = "http://localhost:3000";
export const channelUsername = "@Cromaartofficial";

export const reply_markup: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: "🚀 Join Channel",
        url: `https://t.me/${channelUsername.replace("@", "")}`,
      },
      { text: "🌟 Join With Referral", callback_data: "join_with_referral" },
    ],
    [
      // { text: "🚀 Register!", url: `https://airdrop.cromachain.com` },
      { text: "🚀 Presale!", url: `https://presale.cromachain.com` },
    ],
  ],
};

bot.start(async (ctx) => {
  await ctx.reply("👋 Welcome to Cromachain Bot!", { reply_markup });
});

bot.action("join_with_referral", async (ctx) => joinWithReferral(ctx));

bot.on("text", async (ctx) => referralCheck(ctx));

export { bot };
