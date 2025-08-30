import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headers = req.headers;
  const secretKey = headers.get("Authorization");
  const envKey = `${process.env.OPENSEA_CRON_SECRET_KEY}`;
  console.log("Running")

  if (!secretKey || secretKey !== envKey)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });


  return NextResponse.json({message:"OK"});
}
