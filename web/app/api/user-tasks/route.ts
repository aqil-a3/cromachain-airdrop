import { TaskUser } from "@/@types/task-user";
import {
  createNewUserTasks,
  getAllUserTasks,
  getUserTasksByTaskId,
} from "@/utils/supabase/userTaskTable";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) throw new Error("No ID");

  const data =
    id === "all" ? await getAllUserTasks() : await getUserTasksByTaskId(id);

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const data: TaskUser = await req.json();

  await createNewUserTasks(data);

  return NextResponse.json(
    { message: "You just have started a task" },
    { status: 200 }
  );
}

