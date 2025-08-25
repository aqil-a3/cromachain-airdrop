import { BasicHttpResponse } from "@/@types/http";
import { getUserByDiscordUsername } from "@/utils/supabase/userTable";
import {
  getUserTasksByUserId,
  updateStatusUserTask,
} from "@/utils/supabase/userTaskTable";

export async function completeJoinDiscordTask(
  discordUsername: string
): Promise<BasicHttpResponse> {
  const cromaUser = await getUserByDiscordUsername(discordUsername);

  if (!cromaUser) {
    return {
      success: false,
      message: `Task Failed! Your discord name "${discordUsername}" doesn't exist in our system!`,
    };
  }

  const userTasks = await getUserTasksByUserId(cromaUser.userId as string);
  const joinDiscordTask = userTasks.find(
    (task) => task.task?.title === "Join Discord Community"
  );

  if (joinDiscordTask) {
    await updateStatusUserTask({
      ...joinDiscordTask,
      status: "completed",
    });

    return {
      success: true,
      message: `Task "Join Discord Community" completed successfully for ${discordUsername}.`,
    };
  }

  return {
    success: false,
    message: `Task "Join Discord Community" not found for ${discordUsername}.`,
  };
}
