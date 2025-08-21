import { BasicHttpResponse } from "@/@types/http";
import { isValidToken } from "@/utils/supabase/emailVerificatonCode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code: string = body.code;
  const { message, status } = await isValidToken(code);

  const response: BasicHttpResponse = {
    message,
    success: status === 200,
  };
  return NextResponse.json(response, { status });
}
