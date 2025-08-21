import { BasicHttpResponse } from "@/@types/http";
import { auth } from "@/auth";
import { mapClientUserToDb } from "@/lib/map-data/mapClientUserToDb";
import { createNewEmailVerification } from "@/utils/supabase/emailVerificatonCode";
import { getUserByEmail, getUserById } from "@/utils/supabase/userTable";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  const email = session?.user.email;
  let response: BasicHttpResponse = {} as BasicHttpResponse;

  if (!email) {
    response.success = false;
    response.message = "";
    return NextResponse.json(response, { status: 400 });
  }

  const user = await getUserByEmail(email);

  const { status } = await createNewEmailVerification(user);

  response.success = status === 200 ? true : false;
  response.message = `We have send a verification code to your email (${user.email})`;
  return NextResponse.json(response, { status });
}
