import { BasicHttpResponse } from "@/@types/http";
import { auth } from "@/auth";
import { mapClientUserToDb } from "@/lib/map-data/mapClientUserToDb";
import { createNewEmailVerification } from "@/utils/supabase/emailVerificatonCode";
import { getUserByEmail, getUserById } from "@/utils/supabase/userTable";
import { NextResponse } from "next/server";

type PostResponse = Promise<NextResponse<BasicHttpResponse>>;
export async function POST(): PostResponse {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      {
        message:
          "You're not logged in. Log in to continue, or use the link in your email to complete verification.",
        success: false,
      },
      { status: 400 }
    );
  }
  const email = session.user.email;

  const user = await getUserByEmail(email);

  const { status, message } = await createNewEmailVerification(user);

  if (status !== 200) {
    return NextResponse.json({ success: false, message }, { status });
  }

  return NextResponse.json(
    {
      success: true,
      message: `We have send a verification code to your email (${user.email})`,
    },
    { status }
  );
}
