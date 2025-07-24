import { NextRequest, NextResponse } from "next/server";
import { TaskDB } from "@/@types/tasks";
import { addNewTask, editTask } from "@/utils/supabase/taskTable";

export async function POST(req: NextRequest) {
  const formData = await req.json();

  await addNewTask(formData);

  return NextResponse.json({ message: "OK" });
}

export async function PUT(req: NextRequest) {
  const formData: TaskDB = await req.json();

  await editTask(formData);

  return NextResponse.json({ message: "ok" });
}
