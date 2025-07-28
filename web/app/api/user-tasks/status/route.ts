import { TaskUser } from "@/@types/task-user";
import { updateStatusUserTask } from "@/utils/supabase/userTaskTable";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const data: TaskUser = await req.json();

  await updateStatusUserTask(data);
  return NextResponse.json(
    { message: "You just have started a task" },
    { status: 200 }
  );
}
