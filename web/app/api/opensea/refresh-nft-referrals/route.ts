import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization") || "";
  const secretKey = authHeader.replace("Bearer ", "");
  const envKey = process.env.OPENSEA_CRON_SECRET_KEY;
  console.log("Running");

  if (!secretKey || secretKey !== envKey)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ message: "OK" });
}
    