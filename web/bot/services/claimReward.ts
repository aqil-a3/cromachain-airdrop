import { Context } from "telegraf";
import { verifyUserMember } from "./verifyUser";
import { verifyUserWeb } from "./verifyUserWeb";
import axios, { isAxiosError } from "axios";
import { serverEndpoint } from "../telegram";

export async function claimReward(ctx: Context) {
  const telegramUsername = ctx.from?.username;
  const [isJoinedChannel, isRegistered] = await Promise.all([
    verifyUserMember(ctx),
    verifyUserWeb(ctx),
  ]);

  if (!isJoinedChannel || !isRegistered) {
    await ctx.reply("You have to register and join a channel to claim reward!");
    return;
  }

  try {
    const { data } = await axios.put(
      `${serverEndpoint}/api/telegram/claim-reward`,
      { telegramUsername }
    );

    await ctx.reply(data.message);
    return;
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;

      await ctx.reply(data.message ?? "There something wrong");
      return;
    }
  }
}
