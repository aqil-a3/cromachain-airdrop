import axios from "axios";
import { Context } from "telegraf";
import { serverEndpoint } from "../telegram";

export async function verifyUserWeb(ctx: Context) {
  const telegramUsername = ctx.from?.username;
  try {
    const { data } = await axios.get(
      `${serverEndpoint}/api/telegram/check-user`,
      {
        params: {
          telegramUsername,
        },
      }
    );

    const { isJoined } = data;

    if (isJoined) {
      await ctx.reply(
        `Your telegram username "${telegramUsername}" have been registered!✅`
      );
      return true;
    }

    await ctx.reply(
      `Your telegram username "${telegramUsername}" haven't registered!❌`
    );
    return false;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
