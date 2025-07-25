import { NextRequest, NextResponse } from "next/server";
import { TaskDB } from "@/@types/tasks";
import { addNewTask, deleteTask, editTask } from "@/utils/supabase/taskTable";

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (!id) throw new Error("No Id");

  await deleteTask(id);

  return NextResponse.json({ message: "ok" });
}

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