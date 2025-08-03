import { Context } from "telegraf";
import { channelUsername } from "../telegram";

const ALLOWED_STATUSES = ["member", "administrator", "creator"];

export async function isUserMember(
  ctx: Context,
): Promise<boolean> {
  try {
    const userId = ctx.from?.id;
    if (!userId) return false;

    const memberInfo = await ctx.telegram.getChatMember(
      channelUsername,
      userId
    );
    return ALLOWED_STATUSES.includes(memberInfo.status);
  } catch (err) {
    console.error("Failed to check member:", err);
    return false;
  }
}
