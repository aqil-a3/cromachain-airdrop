import { NextRequest, NextResponse } from "next/server";
import {
  updateStatusUserTask,
  getUserTasksByUserId,
} from "@/utils/supabase/userTaskTable";
import {
  getTokenDataByToken,
  updateTokenToUsed,
} from "@/utils/supabase/telegramVericationToken";
import { getUserById } from "@/utils/supabase/userTable";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await getTokenDataByToken(body.token as string);
  const cromaUser = await getUserById(user?.user_id as string);

  try {
    await updateTokenToUsed(body.token);

    if (cromaUser) {
      const userTasks = await getUserTasksByUserId(cromaUser.userId as string);
      const joinTelegramTask = userTasks.find(
        (task) => task.task?.title === "Join Telegram Channel"
      );

      if (joinTelegramTask) {
        await updateStatusUserTask({
          ...joinTelegramTask,
          status: "completed",
        });
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return NextResponse.json({ success: true });
}
