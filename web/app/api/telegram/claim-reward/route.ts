import { getUserByTelegramUsername } from "@/utils/supabase/userTable";
import {
  getUserTasksByUserId,
  updateStatusUserTask,
} from "@/utils/supabase/userTaskTable";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { telegramUsername } = await req.json();
  if (!telegramUsername) throw new Error("Telegram username is nothing");

  const user = (await getUserByTelegramUsername(telegramUsername)) as User;
  const userTasks = await getUserTasksByUserId(user.id as string);

  const selectedTasks = userTasks.find(
    (task) => task.task?.title === "Join Telegram Channel"
  );

  if (!selectedTasks) throw new Error("Task is nothing! Anyone rename it?");
  const isClaimed = selectedTasks.status === "completed";

  if (isClaimed) {
    return NextResponse.json(
      { message: "❌You have claimed a reward!" },
      { status: 400 }
    );
  }

  await updateStatusUserTask({ ...selectedTasks, status: "completed" });
  return NextResponse.json(
    { message: "✅Success! You gained 75 CRM" },
    { status: 200 }
  );
}
