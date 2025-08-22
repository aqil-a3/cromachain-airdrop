import { BasicHttpResponse } from "@/@types/http";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type PostResponse = Promise<NextResponse<BasicHttpResponse>>;

export async function POST(req: NextRequest): PostResponse {
  try {
    const { token } = await req.json();
    if (!token)
      return NextResponse.json(
        { message: "No token provided", success: false },
        { status: 400 }
      );

    const secretKey = `${process.env.CAPTCHA_SECRET_KEY}`;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    const { data } = await axios.post<CaptchaResponse>(
      verifyUrl,
      new URLSearchParams({
        secret: secretKey,
        response: token,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (!data.success) {
      return NextResponse.json(
        { message: "Captcha verification failed", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Verification success!",
      success: data.success,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Verification failed", success: false },
      { status: 400 }
    );
  }
}

