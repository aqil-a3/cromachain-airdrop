import { isValidToken } from "@/utils/supabase/passwordResetTokenTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const { email, isSuccess, message, status, userId } = await isValidToken(token);

  return NextResponse.json({ isSuccess, email, message, userId }, { status });
}
