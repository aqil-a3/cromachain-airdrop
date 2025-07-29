import { changeUserPassword } from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { message, status } = await changeUserPassword(body);

  return NextResponse.json({ message }, { status });
}


