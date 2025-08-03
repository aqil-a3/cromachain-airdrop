import { Context } from "telegraf";
import { isUserMember } from "../utils/checkMembership";

export async function verifyUserMember(ctx: Context): Promise<boolean> {
  const isJoined = await isUserMember(ctx);

  if (isJoined) {
    ctx.reply("You have joined the channel✅");
    return true;
  }

  ctx.reply("You haven't joined the channel❌");
  return false;
}
