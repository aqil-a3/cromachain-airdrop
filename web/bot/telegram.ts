import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { session } from "telegraf";
import {
  joinWithReferral,
  referralCheck,
  referralPayloadCheck,
} from "./services/joinWithReferral";
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

bot.start(async (ctx) => {
  const { payload } = ctx;
  const isFromAmbassador = payload.startsWith("AMB_CROMA");
  if (isFromAmbassador) {
    await referralPayloadCheck(payload, ctx);
    return;
  }
  await ctx.reply("👋 Welcome to Cromachain Bot!");
});

bot.action("join_with_referral", async (ctx) => joinWithReferral(ctx));

bot.on("text", async (ctx) => referralCheck(ctx));

export { bot };
