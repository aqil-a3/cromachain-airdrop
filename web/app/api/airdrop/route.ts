import { createNewAirdrop } from "@/utils/supabase/airdropTable";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  console.log(data)

  await createNewAirdrop(data);

  return NextResponse.json({ message: "Success" }, { status: 200 });
}
