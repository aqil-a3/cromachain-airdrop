import { createNewResetToken } from "@/utils/supabase/passwordResetTokenTable";
import { getUserByEmail } from "@/utils/supabase/userTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const user = await getUserByEmail(email);
  if (!user)
    return NextResponse.json({ message: "Not account found" }, { status: 404 });

  const { message, status } = await createNewResetToken(user);

  return NextResponse.json({ message }, { status });
}
