import { v4 as uuidv4 } from "uuid";
import { tasksTable } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.json();

  formData.id = uuidv4();

  const { error } = await tasksTable.insert(formData);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something error", error },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "OK" });
}
