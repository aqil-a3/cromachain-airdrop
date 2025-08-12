import { TaskUser } from "@/@types/task-user";
import { TaskStatus } from "@/@types/tasks";
import { updateStatusUserTasksBulks } from "@/utils/supabase/userTaskTable";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const body: TaskUser[] = await req.json();

  await updateStatusUserTasksBulks(body, body[0].status as TaskStatus);

  return NextResponse.json({ message: "Update success" });
}
