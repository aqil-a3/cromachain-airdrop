import { BasicHttpResponse } from "@/@types/http";
import { isValidToken } from "@/utils/supabase/emailVerificatonCode";
import { NextRequest, NextResponse } from "next/server";

type PostResponse = Promise<NextResponse<BasicHttpResponse>>;
export async function POST(req: NextRequest): PostResponse {
  const body = await req.json();
  const code: string = body.code;
  const { message, status } = await isValidToken(code);

  return NextResponse.json(
    {
      message,
      success: true,
    },
    { status }
  );
}
